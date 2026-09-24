"""
Computer Vision (YOLOv8) Training Pipeline
==========================================
Trains a YOLOv8 classification/detection model on the PlantVillage dataset
to identify crop diseases and pests from images.

Algorithm: Ultralytics YOLOv8
"""

import os
import yaml
import logging
from datetime import datetime
from ultralytics import YOLO
import shutil

logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def create_data_yaml(dataset_dir: str, classes: list) -> str:
    """Create the required data.yaml file for YOLO training."""
    yaml_path = os.path.join(dataset_dir, "data.yaml")
    
    dataConfig = {
        "path": dataset_dir,
        "train": "images/train",
        "val": "images/val",
        "test": "images/test",
        "nc": len(classes),
        "names": classes
    }
    
    with open(yaml_path, "w") as f:
        yaml.dump(dataConfig, f, default_flow_style=False)
        
    return yaml_path

def train_crop_vision_model(dataset_dir: str, epochs: int = 50, batch_size: int = 16):
    """
    Train a YOLOv8 model for crop disease detection.
    """
    logger.info(f"Starting YOLOv8 training on dataset: {dataset_dir}")
    
    # Check if this is classification or detection based on dataset structure
    is_classification = os.path.exists(os.path.join(dataset_dir, "train")) and not os.path.exists(os.path.join(dataset_dir, "images"))
    
    if is_classification:
        logger.info("Detected classification dataset structure.")
        # Load YOLOv8 classification model (nano for speed, can be upgraded to m/l)
        model = YOLO("yolov8n-cls.pt")
        
        # Train the model
        results = model.train(
            data=dataset_dir,
            epochs=epochs,
            batch=batch_size,
            imgsz=224,
            project="runs/classify",
            name="crop_health",
            patience=10,
            save=True
        )
    else:
        logger.info("Detected object detection dataset structure.")
        # For object detection (bounding boxes around diseased areas)
        data_yaml = os.path.join(dataset_dir, "data.yaml")
        if not os.path.exists(data_yaml):
            raise FileNotFoundError(f"data.yaml not found in {dataset_dir}. Required for detection.")
            
        model = YOLO("yolov8n.pt")
        
        results = model.train(
            data=data_yaml,
            epochs=epochs,
            batch=batch_size,
            imgsz=640,
            project="runs/detect",
            name="crop_health",
            patience=10,
            save=True
        )
        
    # Get the best weights path
    best_weights = str(results.save_dir / "weights" / "best.pt")
    
    # Save a copy to our central models directory with timestamp
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    final_model_name = f"yolov8_crop_health_{timestamp}.pt"
    final_model_path = os.path.join(MODELS_DIR, final_model_name)
    
    shutil.copy2(best_weights, final_model_path)
    logger.info(f"Training complete. Best model saved to: {final_model_path}")
    
    return final_model_path

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python train_yolo.py <path_to_dataset>")
        sys.exit(1)
        
    dataset_path = sys.argv[1]
    train_crop_vision_model(dataset_path)
