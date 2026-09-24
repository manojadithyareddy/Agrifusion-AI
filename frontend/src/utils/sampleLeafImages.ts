/**
 * Generates realistic agricultural leaf disease sample images
 * directly in the browser using HTML5 Canvas and exports them as File objects.
 */

export interface SampleLeafOption {
  id: string;
  crop: string;
  disease: string;
  label: string;
  badgeColor: string;
}

export const SAMPLE_LEAF_PRESETS: SampleLeafOption[] = [
  {
    id: 'tomato_early_blight',
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    label: '🍅 Tomato — Early Blight Leaf Spots',
    badgeColor: '#ef4444',
  },
  {
    id: 'potato_late_blight',
    crop: 'Potato',
    disease: 'Late Blight (Phytophthora infestans)',
    label: '🥔 Potato — Late Blight Dark Lesions',
    badgeColor: '#f97316',
  },
  {
    id: 'rice_blast',
    crop: 'Rice',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    label: '🌾 Rice — Spindle Leaf Blast Lesions',
    badgeColor: '#eab308',
  },
  {
    id: 'wheat_rust',
    crop: 'Wheat',
    disease: 'Brown Leaf Rust (Puccinia triticina)',
    label: '🌾 Wheat — Brown Pustules & Rust',
    badgeColor: '#d97706',
  },
  {
    id: 'healthy_leaf',
    crop: 'Vegetables',
    disease: 'Healthy Crop (No Disease)',
    label: '🌿 Healthy Vibrant Leaf — Clean Control',
    badgeColor: '#22c55e',
  },
];

export async function generateSampleLeafFile(presetId: string): Promise<{ file: File; dataUrl: string }> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Draw natural agricultural soil/field background
  const bgGrad = ctx.createLinearGradient(0, 0, 600, 450);
  bgGrad.addColorStop(0, '#1c1917');
  bgGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 450);

  // Subtle background grid/blur
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 600; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 450);
    ctx.stroke();
  }

  // Draw Leaf Base Shape
  ctx.save();
  ctx.translate(300, 225);

  // Leaf shadow
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 15;

  ctx.beginPath();
  ctx.moveTo(0, -170);
  ctx.bezierCurveTo(140, -110, 160, 90, 0, 170);
  ctx.bezierCurveTo(-160, 90, -140, -110, 0, -170);
  ctx.closePath();

  // Leaf gradient
  const leafGrad = ctx.createLinearGradient(-100, -150, 100, 150);
  if (presetId === 'healthy_leaf') {
    leafGrad.addColorStop(0, '#15803d');
    leafGrad.addColorStop(0.5, '#22c55e');
    leafGrad.addColorStop(1, '#166534');
  } else if (presetId === 'tomato_early_blight') {
    leafGrad.addColorStop(0, '#4d7c0f');
    leafGrad.addColorStop(0.5, '#65a30d');
    leafGrad.addColorStop(1, '#365314');
  } else if (presetId === 'potato_late_blight') {
    leafGrad.addColorStop(0, '#3f6212');
    leafGrad.addColorStop(0.5, '#4d7c0f');
    leafGrad.addColorStop(1, '#1e293b');
  } else {
    leafGrad.addColorStop(0, '#84cc16');
    leafGrad.addColorStop(0.5, '#65a30d');
    leafGrad.addColorStop(1, '#3f6212');
  }

  ctx.fillStyle = leafGrad;
  ctx.fill();
  ctx.restore();

  // Draw Leaf Main Stem / Vein
  ctx.save();
  ctx.translate(300, 225);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -160);
  ctx.quadraticCurveTo(5, 0, 0, 180);
  ctx.stroke();

  // Side veins
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  for (let y = -120; y <= 120; y += 30) {
    const spread = 75 - Math.abs(y) * 0.3;
    // Right vein
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(spread * 0.6, y - 10, spread, y - 25);
    ctx.stroke();

    // Left vein
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(-spread * 0.6, y - 10, -spread, y - 25);
    ctx.stroke();
  }

  // Draw Disease Spots based on preset
  if (presetId === 'tomato_early_blight') {
    // Concentric dark brown/black spots with yellow halo
    const spots = [
      { x: -35, y: -40, r: 24 },
      { x: 45, y: 20, r: 30 },
      { x: -50, y: 60, r: 20 },
      { x: 25, y: -80, r: 18 },
    ];
    for (const spot of spots) {
      // Yellow chlorotic halo
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r + 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.45)';
      ctx.fill();

      // Dark brown necrotic center
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
      ctx.fillStyle = '#451a03';
      ctx.fill();

      // Concentric ring target pattern
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (presetId === 'potato_late_blight') {
    // Large irregular water-soaked dark lesions
    const lesions = [
      { x: -20, y: -50, w: 90, h: 50 },
      { x: 30, y: 40, w: 100, h: 60 },
      { x: -40, y: 80, w: 70, h: 40 },
    ];
    for (const les of lesions) {
      ctx.save();
      ctx.translate(les.x, les.y);
      ctx.beginPath();
      ctx.ellipse(0, 0, les.w / 2, les.h / 2, Math.PI / 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(24, 24, 27, 0.85)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(161, 98, 7, 0.6)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }
  } else if (presetId === 'wheat_rust') {
    // Small reddish-brown powdery pustules
    for (let i = 0; i < 35; i++) {
      const rx = (Math.random() - 0.5) * 110;
      const ry = (Math.random() - 0.5) * 220;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 6, 3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = '#b45309';
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  } else if (presetId === 'rice_blast') {
    // Diamond or spindle-shaped lesions
    const spindles = [
      { x: -30, y: -60, len: 45 },
      { x: 35, y: 10, len: 55 },
      { x: -25, y: 70, len: 40 },
    ];
    for (const sp of spindles) {
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.beginPath();
      ctx.moveTo(0, -sp.len / 2);
      ctx.lineTo(12, 0);
      ctx.lineTo(0, sp.len / 2);
      ctx.lineTo(-12, 0);
      ctx.closePath();
      ctx.fillStyle = '#e2e8f0'; // Grayish center
      ctx.fill();
      ctx.strokeStyle = '#991b1b'; // Dark reddish brown border
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Label watermark
  ctx.restore();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(`Sample: ${presetId.replace(/_/g, ' ').toUpperCase()}`, 24, 420);

  // Return as Blob and File
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to convert canvas to blob'));
    }, 'image/jpeg', 0.92);
  });

  const file = new File([blob], `${presetId}.jpg`, { type: 'image/jpeg' });
  return { file, dataUrl };
}
