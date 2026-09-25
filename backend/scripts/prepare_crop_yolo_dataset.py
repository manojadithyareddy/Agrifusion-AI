"""
AgriFusion AI — YOLO Crop, Disease & Pest Dataset Preparation Pipeline
=======================================================================
Prepares, augments, and formats agricultural imagery into standard
Ultralytics YOLO detection format (images/ & labels/ in train/val/test splits).

Targets:
- 10,000 training images per crop category
- Multi-class bounding box annotations for:
  1. Crop leaf/plant organ
  2. Disease lesion patches
  3. Pest & insect instances

Compatible with:
- PlantVillage
- PlantDoc
- IP102 (Insect Pest Dataset)
- PaddyDoctor
- Custom drone and smartphone field images
"""

import os
import sys
import glob
import json
import random
import shutil
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Any

import cv2
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("CropYOLODataPrep")

# Standard Class Mapping (must match agriculture_yolo.yaml)
CLASS_MAPPING = {
    # Crop Organs
    "tomato_leaf": 0,
    "potato_leaf": 1,
    "rice_leaf": 2,
    "wheat_leaf": 3,
    "cotton_leaf": 4,
    "maize_leaf": 5,
    "chilli_leaf": 6,
    "mango_leaf": 7,
    # Disease Lesions
    "early_blight_lesion": 8,
    "late_blight_lesion": 9,
    "leaf_curl_virus_symptom": 10,
    "rice_blast_lesion": 11,
    "yellow_rust_pustule": 12,
    "powdery_mildew_patch": 13,
    "anthracnose_spot": 14,
    "bacterial_blight_lesion": 15,
    # Pests
    "whitefly_adult": 16,
    "aphid_colony": 17,
    "stem_borer_larva": 18,
    "fall_armyworm_larva": 19,
    "chilli_thrips": 20,
    "spider_mite": 21,
    "cotton_bollworm": 22,
}

SUPPORTED_CROPS = [
    "tomato", "potato", "rice", "wheat", "cotton", "maize", "chilli", "mango"
]


class BotanicalAugmentationEngine:
    """
    Augments agricultural images while adjusting bounding box annotations.
    Simulates field conditions: sunlight, shadows, blur, camera angles.
    """

    @staticmethod
    def adjust_hsv(image: np.ndarray, h_gain=0.015, s_gain=0.7, v_gain=0.4) -> np.ndarray:
        r = np.random.uniform(-1, 1, 3) * [h_gain, s_gain, v_gain] + 1
        hue, sat, val = cv2.split(cv2.cvtColor(image, cv2.COLOR_BGR2HSV))
        dtype = image.dtype

        x = np.arange(0, 256, dtype=r.dtype)
        lut_hue = ((x * r[0]) % 180).astype(dtype)
        lut_sat = np.clip(x * r[1], 0, 255).astype(dtype)
        lut_val = np.clip(x * r[2], 0, 255).astype(dtype)

        im_hsv = cv2.merge((cv2.LUT(hue, lut_hue), cv2.LUT(sat, lut_sat), cv2.LUT(val, lut_val)))
        return cv2.cvtColor(im_hsv, cv2.COLOR_HSV2BGR)

    @staticmethod
    def random_perspective(
        image: np.ndarray,
        boxes: List[Tuple[int, float, float, float, float]],
        degrees=10,
        translate=0.1,
        scale=0.1,
        shear=2.0
    ) -> Tuple[np.ndarray, List[Tuple[int, float, float, float, float]]]:
        h, w = image.shape[:2]
        # Rotation and Scale
        c = np.eye(3)
        a = random.uniform(-degrees, degrees)
        s = random.uniform(1 - scale, 1 + scale)
        r = cv2.getRotationMatrix2D(angle=a, center=(w / 2, h / 2), scale=s)
        c[:2] = r

        # Translation
        t = np.eye(3)
        t[0, 2] = random.uniform(-translate, translate) * w
        t[1, 2] = random.uniform(-translate, translate) * h

        m = t @ c
        transformed_img = cv2.warpPerspective(image, m, dsize=(w, h), borderValue=(114, 114, 114))

        new_boxes = []
        for cls_id, xc, yc, bw, bh in boxes:
            # Denormalize
            x1 = (xc - bw / 2) * w
            y1 = (yc - bh / 2) * h
            x2 = (xc + bw / 2) * w
            y2 = (yc + bh / 2) * h

            pts = np.array([[x1, y1, 1], [x2, y1, 1], [x1, y2, 1], [x2, y2, 1]], dtype=np.float32)
            transformed_pts = (m @ pts.T).T
            transformed_pts = transformed_pts[:, :2] / transformed_pts[:, 2:3]

            min_x = np.clip(np.min(transformed_pts[:, 0]), 0, w)
            max_x = np.clip(np.max(transformed_pts[:, 0]), 0, w)
            min_y = np.clip(np.min(transformed_pts[:, 1]), 0, h)
            max_y = np.clip(np.max(transformed_pts[:, 1]), 0, h)

            box_w = max_x - min_x
            box_h = max_y - min_y

            if box_w > 4 and box_h > 4:  # filter tiny artifacts
                n_xc = (min_x + box_w / 2) / w
                n_yc = (min_y + box_h / 2) / h
                n_bw = box_w / w
                n_bh = box_h / h
                new_boxes.append((cls_id, round(n_xc, 6), round(n_yc, 6), round(n_bw, 6), round(n_bh, 6)))

        return transformed_img, new_boxes

    @staticmethod
    def horizontal_flip(
        image: np.ndarray,
        boxes: List[Tuple[int, float, float, float, float]]
    ) -> Tuple[np.ndarray, List[Tuple[int, float, float, float, float]]]:
        flipped_img = cv2.flip(image, 1)
        flipped_boxes = []
        for cls_id, xc, yc, bw, bh in boxes:
            flipped_boxes.append((cls_id, round(1.0 - xc, 6), yc, bw, bh))
        return flipped_img, flipped_boxes


def create_yolo_directory_structure(output_dir: Path):
    """
    Creates standard YOLO layout:
    output_dir/
      ├── images/
      │     ├── train/
      │     ├── val/
      │     └── test/
      └── labels/
            ├── train/
            ├── val/
            └── test/
    """
    for split in ["train", "val", "test"]:
        (output_dir / "images" / split).mkdir(parents=True, exist_ok=True)
        (output_dir / "labels" / split).mkdir(parents=True, exist_ok=True)
    logger.info(f"YOLO directory hierarchy initialized at: {output_dir}")


def save_yolo_sample(
    image: np.ndarray,
    boxes: List[Tuple[int, float, float, float, float]],
    dest_img_path: Path,
    dest_label_path: Path
):
    """Saves image and corresponding YOLO annotation text file."""
    cv2.imwrite(str(dest_img_path), image)
    with open(dest_label_path, "w", encoding="utf-8") as f:
        for cls_id, xc, yc, bw, bh in boxes:
            f.write(f"{cls_id} {xc:.6f} {yc:.6f} {bw:.6f} {bh:.6f}\n")


def synthesize_and_balance_dataset(
    raw_source_dir: Path,
    output_dir: Path,
    target_images_per_crop: int = 10000,
    train_ratio: float = 0.70,
    val_ratio: float = 0.20,
    test_ratio: float = 0.10
):
    """
    Ingests source crop images and scales up each crop category to
    the target (e.g. 10,000 images per crop) via botanical field augmentations.
    """
    create_yolo_directory_structure(output_dir)
    aug_engine = BotanicalAugmentationEngine()

    total_generated = 0
    crop_stats = {}

    for crop in SUPPORTED_CROPS:
        crop_leaf_class = CLASS_MAPPING.get(f"{crop}_leaf", 0)
        crop_source_images = list((raw_source_dir / crop).glob("*.jpg")) + \
                             list((raw_source_dir / crop).glob("*.png")) + \
                             list((raw_source_dir / crop).glob("*.jpeg"))

        logger.info(f"Processing Crop: [{crop.upper()}] | Found {len(crop_source_images)} base images.")

        # If no raw images exist for this crop, create representative synthetic botanical samples
        if not crop_source_images:
            logger.warning(f"No source images found in {raw_source_dir / crop}. Generating synthetic botanical templates...")
            dummy_img = np.zeros((640, 640, 3), dtype=np.uint8)
            # Fill with plant-like background
            dummy_img[:, :] = (34, 139, 34)  # Forest Green
            # Draw leaf contour
            cv2.ellipse(dummy_img, (320, 320), (200, 120), 30, 0, 360, (50, 205, 50), -1)
            # Draw lesion
            cv2.circle(dummy_img, (340, 300), 40, (19, 69, 139), -1)  # Brown spot
            base_boxes = [
                (crop_leaf_class, 0.5, 0.5, 0.65, 0.55),
                (CLASS_MAPPING.get("early_blight_lesion", 8), 0.53, 0.47, 0.12, 0.12)
            ]
            crop_source_images = [(dummy_img, base_boxes)]
            is_synthetic_base = True
        else:
            is_synthetic_base = False

        generated_for_crop = 0
        while generated_for_crop < target_images_per_crop:
            # Pick a base image
            if is_synthetic_base:
                base_img, boxes = crop_source_images[0]
                base_img = base_img.copy()
            else:
                img_path = random.choice(crop_source_images)
                base_img = cv2.imread(str(img_path))
                if base_img is None:
                    continue
                # Load existing labels if available, else derive centered leaf box
                label_path = img_path.with_suffix(".txt")
                boxes = []
                if label_path.exists():
                    with open(label_path, "r") as lf:
                        for line in lf:
                            parts = line.strip().split()
                            if len(parts) == 5:
                                boxes.append((int(parts[0]), float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])))
                if not boxes:
                    # Default: whole crop leaf bounding box
                    boxes = [(crop_leaf_class, 0.5, 0.5, 0.85, 0.85)]

            # Apply botanical augmentations
            aug_img = aug_engine.adjust_hsv(base_img)
            if random.random() > 0.5:
                aug_img, boxes = aug_engine.horizontal_flip(aug_img, boxes)
            aug_img, boxes = aug_engine.random_perspective(aug_img, boxes)

            # Determine split (train / val / test)
            rand_val = random.random()
            if rand_val < train_ratio:
                split = "train"
            elif rand_val < (train_ratio + val_ratio):
                split = "val"
            else:
                split = "test"

            sample_id = f"{crop}_{generated_for_crop:06d}"
            img_file = output_dir / "images" / split / f"{sample_id}.jpg"
            lbl_file = output_dir / "labels" / split / f"{sample_id}.txt"

            save_yolo_sample(aug_img, boxes, img_file, lbl_file)
            generated_for_crop += 1

            if generated_for_crop % 2000 == 0:
                logger.info(f"  -> Generated {generated_for_crop}/{target_images_per_crop} for {crop} ({split})")

        crop_stats[crop] = generated_for_crop
        total_generated += generated_for_crop

    logger.info("=" * 60)
    logger.info(f"Dataset preparation complete! Total samples generated: {total_generated}")
    logger.info(f"Crop distribution: {json.dumps(crop_stats, indent=2)}")
    logger.info(f"Ready for YOLOv8/YOLOv11 training using agriculture_yolo.yaml")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare 10,000 images/crop YOLO dataset.")
    parser.add_argument("--source-dir", type=str, default="data/raw_crops", help="Directory of raw source crop images.")
    parser.add_argument("--output-dir", type=str, default="data/yolo_agriculture", help="Destination YOLO dataset directory.")
    parser.add_argument("--images-per-crop", type=int, default=10000, help="Target images per crop class (default: 10,000).")
    args = parser.parse_args()

    synthesize_and_balance_dataset(
        raw_source_dir=Path(args.source_dir),
        output_dir=Path(args.output_dir),
        target_images_per_crop=args.images_per_crop
    )
