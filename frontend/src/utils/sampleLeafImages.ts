/**
 * Generates realistic agricultural leaf disease samples, soil health documents,
 * and test field video clips directly in the browser for instant testing.
 */

export interface SampleLeafOption {
  id: string;
  crop: string;
  disease: string;
  label: string;
  badgeColor: string;
  type?: 'image' | 'video' | 'document';
}

export const SAMPLE_LEAF_PRESETS: SampleLeafOption[] = [
  {
    id: 'tomato_early_blight',
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    label: '🍅 Tomato — Early Blight Leaf Spots',
    badgeColor: '#ef4444',
    type: 'image',
  },
  {
    id: 'potato_late_blight',
    crop: 'Potato',
    disease: 'Late Blight (Phytophthora infestans)',
    label: '🥔 Potato — Late Blight Dark Lesions',
    badgeColor: '#f97316',
    type: 'image',
  },
  {
    id: 'rice_blast',
    crop: 'Rice',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    label: '🌾 Rice — Spindle Leaf Blast Lesions',
    badgeColor: '#eab308',
    type: 'image',
  },
  {
    id: 'wheat_rust',
    crop: 'Wheat',
    disease: 'Brown Leaf Rust (Puccinia triticina)',
    label: '🌾 Wheat — Brown Pustules & Rust',
    badgeColor: '#d97706',
    type: 'image',
  },
  {
    id: 'cotton_bacterial_blight',
    crop: 'Cotton',
    disease: 'Bacterial Blight / Black Arm (Xanthomonas)',
    label: '☁️ Cotton — Angular Leaf Blight',
    badgeColor: '#0ea5e9',
    type: 'image',
  },
  {
    id: 'sugarcane_red_rot',
    crop: 'Sugarcane',
    disease: 'Red Rot (Colletotrichum falcatum)',
    label: '🎋 Sugarcane — Red Rot Foliar Stripes',
    badgeColor: '#dc2626',
    type: 'image',
  },
  {
    id: 'banana_sigatoka',
    crop: 'Banana',
    disease: 'Yellow Sigatoka (Mycosphaerella musicola)',
    label: '🍌 Banana — Sigatoka Leaf Streak',
    badgeColor: '#84cc16',
    type: 'image',
  },
  {
    id: 'maize_leaf_blight',
    crop: 'Maize',
    disease: 'Northern Leaf Blight (Exserohilum turcicum)',
    label: '🌽 Maize — Elliptical Leaf Blight',
    badgeColor: '#eab308',
    type: 'image',
  },
  {
    id: 'groundnut_tikka',
    crop: 'Groundnut',
    disease: 'Tikka Leaf Spot (Cercospora arachidicola)',
    label: '🥜 Groundnut — Tikka Spot with Halo',
    badgeColor: '#a16207',
    type: 'image',
  },
  {
    id: 'chilli_leaf_curl',
    crop: 'Chilli',
    disease: 'Chilli Leaf Curl Virus (ToLCV)',
    label: '🌶️ Chilli — Upward Leaf Curl & Mites',
    badgeColor: '#ef4444',
    type: 'image',
  },
  {
    id: 'sample_soil_health_card',
    crop: 'Soil Health',
    disease: 'Soil Nutrient Profile & N-P-K Deficiency',
    label: '📄 Soil Health Card (ICAR Lab Report)',
    badgeColor: '#10b981',
    type: 'document',
  },
  {
    id: 'sample_canopy_video',
    crop: 'Tomato',
    disease: 'Field Canopy Walkthrough Scan',
    label: '🎥 Crop Field Video Scan (3s Clip)',
    badgeColor: '#8b5cf6',
    type: 'video',
  },
];

/**
 * Generate synthetic leaf image on HTML5 canvas
 */
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

  // Subtle background grid
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
  if (presetId === 'cotton_bacterial_blight') {
    leafGrad.addColorStop(0, '#15803d');
    leafGrad.addColorStop(0.5, '#4ade80');
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

  // Draw Disease Lesion Patterns
  if (presetId === 'tomato_early_blight') {
    // Concentric dark brown target-board rings
    const spots = [
      { x: -45, y: -50, r: 24 },
      { x: 35, y: -20, r: 32 },
      { x: -20, y: 45, r: 20 },
      { x: 40, y: 70, r: 26 },
    ];
    for (const spot of spots) {
      // Yellow chlorotic halo
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r + 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.45)';
      ctx.fill();

      // Outer necrotic ring
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
      ctx.fillStyle = '#451a03';
      ctx.fill();

      // Concentric inner rings
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Central dark spot
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#1c1917';
      ctx.fill();
    }
  } else if (presetId === 'potato_late_blight' || presetId === 'cotton_bacterial_blight') {
    // Irregular water-soaked greasy blotches
    const patches = [
      { x: -50, y: -30, r: 42 },
      { x: 40, y: 35, r: 48 },
    ];
    for (const p of patches) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fill();

      // Downy fuzzy halo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  } else {
    // General leaf lesions
    for (let i = 0; i < 6; i++) {
      const rx = (Math.random() - 0.5) * 120;
      const ry = (Math.random() - 0.5) * 180;
      ctx.beginPath();
      ctx.arc(rx, ry, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#78350f';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
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

/**
 * Generate a realistic Soil Health Card Document File (Text/Report format)
 */
export function generateSampleSoilReportFile(): { file: File; text: string; dataUrl: string } {
  const text = `=====================================================
GOVERNMENT OF INDIA - MINISTRY OF AGRICULTURE & FARMERS WELFARE
NATIONAL SOIL HEALTH CARD & FERTILITY REPORT
=====================================================
Sample ID: SHC-2026-AP-94102
Farmer Name: Rajeshwar Reddy
Village / District: Guntur, Andhra Pradesh
Survey / Field No: 42/B (Block 3 - Sandy Loam)
Target Crop Season: Kharif 2026

1. PHYSICAL & ELECTROCHEMICAL PARAMETERS
-----------------------------------------------------
- Soil Reaction (pH): 6.8 (Neutral - Optimum for Nutrient Availability)
- Electrical Conductivity (EC): 0.38 dS/m (Normal / Non-saline)
- Soil Organic Carbon (SOC): 0.48% (Low - Threshold: > 0.75%)

2. PRIMARY NUTRIENTS (MACRONUTRIENTS)
-----------------------------------------------------
- Available Nitrogen (N): 192 kg/ha (Rating: LOW - Threshold: 280 kg/ha)
  * Recommendation: Additional split application of Urea required
- Available Phosphorus (P2O5): 18.5 kg/ha (Rating: MEDIUM - Threshold: 11-25 kg/ha)
- Available Potassium (K2O): 315 kg/ha (Rating: HIGH - Threshold: > 280 kg/ha)

3. SECONDARY & MICRONUTRIENTS
-----------------------------------------------------
- Available Sulphur (S): 8.4 ppm (Deficient)
- Available Zinc (Zn): 0.52 ppm (Deficient - Threshold: 0.60 ppm)
- Available Iron (Fe): 6.2 ppm (Sufficient)
- Available Boron (B): 0.45 ppm (Marginal)

4. AGRONOMIC PRESCRIPTION & FERTILIZER SCHEDULE
-----------------------------------------------------
a) Basal Application at Field Preparation:
   - Well-decomposed Farm Yard Manure (FYM): 4.0 Tonnes/Acre
   - Single Super Phosphate (SSP): 75 kg/Acre
   - Zinc Sulphate (21%): 10 kg/Acre

b) Vegetative Top-Dressing:
   - Urea (split into 3 equal doses at 20, 45, and 65 days): 45 kg/Acre total

c) Bio-fertilizer Inoculation:
   - Azotobacter & Phosphobacteria (PSB) @ 2 kg/Acre mixed with compost
=====================================================`;

  const blob = new Blob([text], { type: 'text/plain' });
  const file = new File([blob], 'Soil_Health_Card_Guntur_Sample.txt', { type: 'text/plain' });

  // Generate thumbnail canvas for UI display
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, 400, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('📄 SOIL HEALTH CARD', 16, 26);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText('pH: 6.8 (Neutral)', 20, 75);
    ctx.fillText('N: 192 kg/ha (LOW DEFICIENCY)', 20, 105);
    ctx.fillText('P: 18.5 kg/ha (MEDIUM)', 20, 135);
    ctx.fillText('K: 315 kg/ha (HIGH)', 20, 165);
    ctx.fillText('Organic Carbon: 0.48% (LOW)', 20, 195);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('✓ ICAR-IISS Calibrated Soil Analysis', 20, 245);
  }

  const dataUrl = canvas.toDataURL('image/png');
  return { file, text, dataUrl };
}

/**
 * Generate a 3-second animated sample crop video file directly in the browser
 */
export async function generateSampleVideoFile(): Promise<{ file: File; dataUrl: string }> {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(25);
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  } catch {
    recorder = new MediaRecorder(stream);
  }

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: 'video/webm' }));
    };
  });

  recorder.start();

  // Animate 60 frames (~2.4 seconds)
  for (let frame = 0; frame < 60; frame++) {
    // Green field background with camera pan
    const panOffset = Math.sin(frame / 10) * 20;

    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, 480, 360);

    // Leaf moving gently in wind
    ctx.save();
    ctx.translate(240 + panOffset, 180);
    ctx.beginPath();
    ctx.moveTo(0, -120);
    ctx.bezierCurveTo(100, -80, 120, 60, 0, 130);
    ctx.bezierCurveTo(-120, 60, -100, -80, 0, -120);
    ctx.fillStyle = '#4d7c0f';
    ctx.fill();

    // Vein
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(0, 130);
    ctx.stroke();

    // Necrotic lesion spots
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(-25, -20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 25, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Video recording overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, 220, 32);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(26, 26, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`FIELD SCAN CLIP • ${(frame / 25).toFixed(1)}s`, 40, 30);

    await new Promise((r) => setTimeout(r, 40));
  }

  recorder.stop();
  const videoBlob = await recordingPromise;
  const file = new File([videoBlob], 'sample_tomato_crop_field_scan.webm', { type: 'video/webm' });
  const dataUrl = URL.createObjectURL(videoBlob);

  return { file, dataUrl };
}
