"""
AgriFusion AI — YOLO Multi-Crop, Foliar Disease & Pest Training Pipeline
=========================================================================
Trains an authentic Ultralytics YOLOv8 / YOLOv11 model on botanical imagery
scaled to 10,000 images per crop across all supported agricultural targets.

Features:
- Hardware auto-detection (CUDA / Tensor Cores / MPS / CPU)
- Mixed-precision training (AMP / fp16)
- Botanical loss weighting & augmentation (Mosaic, MixUp, Perspective)
- Quantitative evaluation: mAP50, mAP50-95, Precision, Recall, Confusion Matrix
- Seamless export to PyTorch (.pt) and ONNX (.onnx)
- Automated deployment to backend/app/ml/models/vision/yolov8_crop_pest.pt
"""

import os
import sys
import json
import shutil
import argparse
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("TrainCropYOLO")


def check_environment():
    """Verifies GPU, PyTorch, and Ultralytics availability."""
    try:
        import torch
        import ultralytics
        logger.info(f"PyTorch Version: {torch.__version__}")
        logger.info(f"Ultralytics Version: {ultralytics.__version__}")
        if torch.cuda.is_available():
            device_name = torch.cuda.get_device_name(0)
            device_count = torch.cuda.device_count()
            vram_gb = round(torch.cuda.get_device_properties(0).total_memory / (1024**3), 2)
            logger.info(f"CUDA Acceleration Active: {device_count}x [{device_name}] with {vram_gb} GB VRAM")
            return "0"
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            logger.info("Apple Silicon MPS Acceleration Active.")
            return "mps"
        else:
            logger.warning("No CUDA GPU detected. Falling back to CPU mode (Training will be slower).")
            return "cpu"
    except ImportError as e:
        logger.error(f"Missing required packages: {e}")
        logger.error("Please install dependencies: pip install ultralytics torch torchvision")
        sys.exit(1)


def train_crop_yolo(
    data_yaml: str,
    model_variant: str = "yolov8m.pt",
    epochs: int = 100,
    imgsz: int = 640,
    batch_size: int = 16,
    project_dir: str = "runs/detect",
    experiment_name: str = "agrifusion_all_crops_v1",
    patience: int = 20,
    dest_model_dir: str = "backend/app/ml/models/vision"
):
    """
    Executes the complete YOLO training loop, evaluation, and export.
    """
    from ultralytics import YOLO

    device = check_environment()
    data_path = Path(data_yaml).resolve()

    if not data_path.exists():
        logger.error(f"Dataset configuration not found at: {data_path}")
        sys.exit(1)

    logger.info("=" * 70)
    logger.info("STARTING AGRIFUSION MULTI-CROP YOLO TRAINING")
    logger.info(f"Dataset Config : {data_path}")
    logger.info(f"Model Backbone : {model_variant}")
    logger.info(f"Target Epochs  : {epochs}")
    logger.info(f"Image Size     : {imgsz}x{imgsz}")
    logger.info(f"Batch Size     : {batch_size}")
    logger.info(f"Device         : {device}")
    logger.info("=" * 70)

    # Initialize YOLO model from pre-trained COCO weights for transfer learning
    logger.info(f"Initializing YOLO model: {model_variant}...")
    model = YOLO(model_variant)

    # Execute training
    results = model.train(
        data=str(data_path),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch_size,
        device=device,
        project=project_dir,
        name=experiment_name,
        patience=patience,
        save=True,
        save_period=10,
        cos_lr=True,             # Cosine learning rate scheduler
        lr0=0.01,                # Initial learning rate
        lrf=0.01,                # Final learning rate fraction
        warmup_epochs=3,         # Warmup epochs
        box=7.5,                 # Box loss weight
        cls=0.5,                 # Class loss weight
        dfl=1.5,                 # Distribution Focal Loss weight
        mosaic=1.0,              # Mosaic augmentation for complex foliar views
        mixup=0.15,              # MixUp for multi-lesion overlap
        copy_paste=0.1,          # Copy-paste for small insect pests
        hsv_h=0.015,             # HSV-Hue variation
        hsv_s=0.7,               # HSV-Saturation variation
        hsv_v=0.4,               # HSV-Value (brightness) variation
        degrees=15.0,            # Rotation
        translate=0.1,           # Translation
        scale=0.5,               # Scale gain
        shear=2.0,               # Shear
        perspective=0.0005,      # Perspective transform
        flipud=0.0,              # Flip up-down
        fliplr=0.5,              # Flip left-right
        exist_ok=True,
        verbose=True
    )

    logger.info("Training complete! Running comprehensive quantitative evaluation on validation split...")

    # Quantitative Evaluation on Validation Set
    val_metrics = model.val()
    map50 = float(val_metrics.box.map50)
    map50_95 = float(val_metrics.box.map)
    precision = float(val_metrics.box.mp)
    recall = float(val_metrics.box.mr)

    logger.info("=" * 70)
    logger.info("MODEL EVALUATION RESULTS:")
    logger.info(f"  • mAP@50    : {map50:.4f} ({map50*100:.1f}%)")
    logger.info(f"  • mAP@50-95 : {map50_95:.4f} ({map50_95*100:.1f}%)")
    logger.info(f"  • Precision : {precision:.4f} ({precision*100:.1f}%)")
    logger.info(f"  • Recall    : {recall:.4f} ({recall*100:.1f}%)")
    logger.info("=" * 70)

    # Save metrics manifest
    exp_dir = Path(project_dir) / experiment_name
    best_pt_path = exp_dir / "weights" / "best.pt"

    eval_summary = {
        "model_architecture": model_variant,
        "epochs_trained": epochs,
        "dataset_config": str(data_path),
        "metrics": {
            "mAP50": round(map50, 4),
            "mAP50_95": round(map50_95, 4),
            "mean_precision": round(precision, 4),
            "mean_recall": round(recall, 4),
        },
        "weights_path": str(best_pt_path.resolve()) if best_pt_path.exists() else None
    }

    metrics_file = exp_dir / "evaluation_report.json"
    with open(metrics_file, "w", encoding="utf-8") as f:
        json.dump(eval_summary, f, indent=2)
    logger.info(f"Saved evaluation report to: {metrics_file}")

    # Export to ONNX for accelerated cross-platform inference
    logger.info("Exporting best model to ONNX format with dynamic batching...")
    onnx_path = None
    try:
        exported_onnx = model.export(format="onnx", dynamic=True, simplify=True)
        onnx_path = Path(exported_onnx)
        logger.info(f"ONNX export successful: {onnx_path}")
    except Exception as e:
        logger.warning(f"ONNX export encountered warning/error: {e}")

    # Deploy weights to Assistant Vision Service
    dest_dir = Path(dest_model_dir).resolve()
    dest_dir.mkdir(parents=True, exist_ok=True)

    if best_pt_path.exists():
        deployed_pt = dest_dir / "yolov8_crop_pest.pt"
        shutil.copy2(best_pt_path, deployed_pt)
        logger.info(f"✅ Deployed PyTorch weights to: {deployed_pt}")

    if onnx_path and onnx_path.exists():
        deployed_onnx = dest_dir / "yolov8_crop_pest.onnx"
        shutil.copy2(onnx_path, deployed_onnx)
        logger.info(f"✅ Deployed ONNX weights to: {deployed_onnx}")

    # Write deployment metadata
    deployment_metadata = {
        "status": "ACTIVE_YOLO_WEIGHTS_LOADED",
        "engine": "Ultralytics YOLO Multi-Crop Pathology & Pest Detector",
        "model_file": "yolov8_crop_pest.pt",
        "onnx_file": "yolov8_crop_pest.onnx" if onnx_path and onnx_path.exists() else None,
        "mAP50": round(map50, 4),
        "mAP50_95": round(map50_95, 4),
        "classes_supported": list(model.names.values())
    }
    with open(dest_dir / "model_manifest.json", "w", encoding="utf-8") as f:
        json.dump(deployment_metadata, f, indent=2)

    logger.info("🎉 Model training, evaluation, and live deployment complete!")
    logger.info("The AgriFusion AssistantVisionEngine will now auto-load this model.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train AgriFusion YOLO for all crops, diseases, and pests.")
    parser.add_argument("--data", type=str, default="backend/app/ml/models/vision/agriculture_yolo.yaml", help="Path to data.yaml")
    parser.add_argument("--model", type=str, default="yolov8m.pt", help="YOLO backbone: yolov8n.pt, yolov8s.pt, yolov8m.pt, yolo11n.pt")
    parser.add_argument("--epochs", type=int, default=100, help="Training epochs (default: 100)")
    parser.add_argument("--batch", type=int, default=16, help="Batch size (default: 16)")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution: 640 or 1024")
    parser.add_argument("--dest", type=str, default="backend/app/ml/models/vision", help="Destination directory for deployed weights")
    args = parser.parse_args()

    train_crop_yolo(
        data_yaml=args.data,
        model_variant=args.model,
        epochs=args.epochs,
        batch_size=args.batch,
        imgsz=args.imgsz,
        dest_model_dir=args.dest
    )
