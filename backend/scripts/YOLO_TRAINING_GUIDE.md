# AgriFusion AI — YOLO Training & 10,000 Images/Crop Scaling Guide
**Multimodal Agriculture Intelligence & Decision Agent**
=============================================================================

This guide provides the complete, production-grade Deep Learning pipeline to train an authentic **Ultralytics YOLOv8 / YOLOv11** object detection model across **all supported crops, foliar disease lesions, and agricultural insect pests**, scaled to **10,000 images per crop category**.

---

## 1. Architecture & Class Ontology

The model is trained as a unified multi-task botanical detector (`agriculture_yolo.yaml`) featuring 23 target classes:

| ID | Class Category | Class Name | Description |
|:---|:---|:---|:---|
| `0-7` | **Crop Organs** | `tomato_leaf`, `potato_leaf`, `rice_leaf`, `wheat_leaf`, `cotton_leaf`, `maize_leaf`, `chilli_leaf`, `mango_leaf` | Identifies plant species and foliage bounds |
| `8-15` | **Foliar Pathologies** | `early_blight_lesion`, `late_blight_lesion`, `leaf_curl_virus_symptom`, `rice_blast_lesion`, `yellow_rust_pustule`, `powdery_mildew_patch`, `anthracnose_spot`, `bacterial_blight_lesion` | Localizes concentric rings, pustules, necrotic spots |
| `16-22` | **Pests & Insects** | `whitefly_adult`, `aphid_colony`, `stem_borer_larva`, `fall_armyworm_larva`, `chilli_thrips`, `spider_mite`, `cotton_bollworm` | Pinpoints micro-insects and larval damage |

---

## 2. Dataset Sourcing (Public Benchmarks)

To amass 10,000 images per crop, integrate the following authoritative agricultural vision repositories:

1. **PlantVillage** (54,303 images, 14 crop species, 26 foliar diseases):
   - Kaggle: [https://www.kaggle.com/datasets/emmarex/plantdisease](https://www.kaggle.com/datasets/emmarex/plantdisease)
2. **PlantDoc** (4,257 bounding-box annotated leaf & disease images across 13 species):
   - GitHub: [https://github.com/pratikkayal/PlantDoc-Dataset](https://github.com/pratikkayal/PlantDoc-Dataset)
3. **IP102: A Large-Scale Benchmark Dataset for Insect Pest Recognition** (75,000 images, 102 pest classes):
   - GitHub: [https://github.com/xpwu95/IP102](https://github.com/xpwu95/IP102)
4. **PaddyDoctor** (16,000+ annotated rice images for 10 diseases & pests):
   - Kaggle: [https://www.kaggle.com/c/paddy-disease-classification](https://www.kaggle.com/c/paddy-disease-classification)
5. **Roboflow Universe Agriculture**:
   - Curated YOLOv8 export collections for aphids, whiteflies, thrips, and blights.

Place raw collected images into:
```
backend/data/raw_crops/
  ├── tomato/
  ├── potato/
  ├── rice/
  ├── wheat/
  ├── cotton/
  ├── maize/
  ├── chilli/
  └── mango/
```

---

## 3. Dataset Ingestion & Botanical Augmentation (10,000 Images/Crop)

Run the automated data preparation script. It applies botanical field transformations (sunlight angles, HSV jitter, random perspective, Mosaic, and CutMix) to scale each crop to 10,000 annotated samples:

```bash
# From the backend directory:
python scripts/prepare_crop_yolo_dataset.py \
  --source-dir data/raw_crops \
  --output-dir data/yolo_agriculture \
  --images-per-crop 10000
```

### Resulting Directory Structure:
```
data/yolo_agriculture/
  ├── images/
  │     ├── train/  (70,000 images across 8-10 crops)
  │     ├── val/    (20,000 images)
  │     └── test/   (10,000 images)
  └── labels/
        ├── train/  (YOLO normalized bbox format)
        ├── val/
        └── test/
```

---

## 4. Hardware Sizing & Training Budget

For **80,000–100,000 total images**:

| Hardware | Recommended Model | Batch Size | Est. Training Time (100 Epochs) |
|:---|:---|:---|:---|
| **NVIDIA A100 (40/80 GB)** | `yolov8x.pt` or `yolo11x.pt` | `64` | ~4.5 - 6 hours |
| **NVIDIA RTX 4090 / 3090 (24 GB)** | `yolov8m.pt` or `yolo11m.pt` | `32` | ~8 - 12 hours |
| **Google Colab (Free T4 / 16 GB)** | `yolov8s.pt` or `yolov8n.pt` | `16` | ~18 - 22 hours |
| **CPU Only (Multi-core)** | Not recommended for 100k images | `4` | ~7+ days |

*Disk Space Required:* ~15 GB for 100k images at $640\times 640$ resolution.

---

## 5. Running the Training Pipeline

### Local or Cloud Workstation (GPU):
```bash
python scripts/train_yolo_crops_diseases_pests.py \
  --data app/ml/models/vision/agriculture_yolo.yaml \
  --model yolov8m.pt \
  --epochs 100 \
  --batch 32 \
  --imgsz 640 \
  --dest app/ml/models/vision
```

### Google Colab Notebook One-Liner:
```python
# 1. Install dependencies
!pip install ultralytics opencv-python-headless albumentations torch torchvision

# 2. Clone repository & change directory
%cd /content/Agrifusion-AI/backend

# 3. Generate 10,000 images/crop dataset
!python scripts/prepare_crop_yolo_dataset.py --images-per-crop 10000

# 4. Train with GPU acceleration
!python scripts/train_yolo_crops_diseases_pests.py --model yolov8m.pt --epochs 100 --batch 32 --imgsz 640
```

---

## 6. Quantitative Evaluation

At the conclusion of training, the pipeline evaluates the held-out validation set and outputs:
- **$\text{mAP}@50$**: Mean Average Precision at IoU threshold $0.50$ (target: $> 0.90$).
- **$\text{mAP}@50-95$**: Mean Average Precision across IoU range $[0.50, 0.95]$ (target: $> 0.72$).
- **Mean Precision ($P$) & Mean Recall ($R$)**.
- **Confusion Matrix & Precision-Recall Curves** saved to `runs/detect/agrifusion_all_crops_v1/`.

---

## 7. Automated Hot-Deployment to `/ai-assistant`

When training finishes, `train_yolo_crops_diseases_pests.py` automatically:
1. Copies the best checkpoint to `backend/app/ml/models/vision/yolov8_crop_pest.pt`.
2. Exports the model to `backend/app/ml/models/vision/yolov8_crop_pest.onnx`.
3. Creates `backend/app/ml/models/vision/model_manifest.json`.

The `AssistantVisionEngine` detects this file on startup, switches status to:
$$\textbf{ACTIVE\_YOLO\_WEIGHTS\_LOADED}$$
and serves authentic YOLO inference bounding boxes alongside OpenCV optical preprocessing and verified ICAR/FAO RAG guidance in `/ai-assistant`!
