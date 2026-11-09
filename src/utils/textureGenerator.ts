import { ConceptId } from '../types';

/**
 * Procedural Vector/Canvas Illustrator for "Őszi kincskereső"
 * Draws high-fidelity, child-friendly 768x768 illustrations for all 10 concepts.
 * Returns crisp Data URLs for seamless 2D UI and cards.
 */

const dataUrlCache = new Map<string, string>();

export function drawConceptCanvas(
  conceptId: ConceptId,
  isFound: boolean = false,
  size: number = 768
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const s = size / 512; // Base scale factor against 512 design coords

  // Clear
  ctx.clearRect(0, 0, size, size);

  // Outer badge card: warm rounded square / soft circle
  ctx.save();
  ctx.beginPath();
  const radius = 244 * s;
  ctx.arc(256 * s, 256 * s, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf7';
  ctx.fill();

  // Subtle warm gradient overlay
  const grad = ctx.createRadialGradient(256 * s, 190 * s, 50 * s, 256 * s, 256 * s, radius);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.75, 'rgba(255, 248, 230, 0.95)');
  grad.addColorStop(1, 'rgba(242, 226, 190, 0.95)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Border ring
  ctx.lineWidth = 16 * s;
  ctx.strokeStyle = isFound ? '#22c55e' : '#c9a46a';
  ctx.stroke();

  // Inner subtle accent ring
  ctx.beginPath();
  ctx.arc(256 * s, 256 * s, radius - 14 * s, 0, Math.PI * 2);
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = isFound ? 'rgba(34, 197, 94, 0.5)' : 'rgba(201, 164, 106, 0.4)';
  ctx.stroke();

  ctx.restore();

  // Draw Specific Concept Artwork (Larger scale for maximum visibility)
  ctx.save();
  ctx.translate(256 * s, 192 * s);
  ctx.scale(1.26, 1.26); // Boost artwork size so it is prominent and fills the card!

  switch (conceptId) {
    case 'oszi-level': {
      drawAutumnLeaf(ctx, s);
      break;
    }
    case 'gesztenye': {
      drawChestnut(ctx, s);
      break;
    }
    case 'makk': {
      drawAcorn(ctx, s);
      break;
    }
    case 'alma': {
      drawApple(ctx, s);
      break;
    }
    case 'korte': {
      drawPear(ctx, s);
      break;
    }
    case 'szolo': {
      drawGrapes(ctx, s);
      break;
    }
    case 'tok': {
      drawPumpkin(ctx, s);
      break;
    }
    case 'eso': {
      drawRain(ctx, s);
      break;
    }
    case 'esernyo': {
      drawUmbrella(ctx, s);
      break;
    }
    case 'gumicsizma': {
      drawBoots(ctx, s);
      break;
    }
  }
  ctx.restore();

  // Concept Title Text on bottom
  const labels: Record<ConceptId, string> = {
    'oszi-level': 'Őszi levél',
    'gesztenye': 'Gesztenye',
    'makk': 'Makk',
    'alma': 'Alma',
    'korte': 'Körte',
    'szolo': 'Szőlő',
    'tok': 'Tök',
    'eso': 'Eső',
    'esernyo': 'Esernyő',
    'gumicsizma': 'Gumicsizma',
  };

  const label = labels[conceptId];

  ctx.save();
  // Pill background for label to ensure 100% legibility
  ctx.beginPath();
  const textY = 425 * s;
  const pillWidth = 350 * s;
  const pillHeight = 64 * s;
  ctx.roundRect((256 * s) - pillWidth / 2, textY - pillHeight / 2, pillWidth, pillHeight, 32 * s);
  ctx.fillStyle = isFound ? 'rgba(236, 253, 245, 0.98)' : 'rgba(255, 255, 255, 0.96)';
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = isFound ? '#10b981' : '#d8c49e';
  ctx.stroke();

  ctx.font = `900 ${36 * s}px 'Nunito', 'Comfortaa', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isFound ? '#064e3b' : '#1c1917';
  ctx.fillText(label, 256 * s, textY);
  ctx.restore();

  // If found: draw celebratory checkmark overlay badge
  if (isFound) {
    ctx.save();
    // Big green checkmark circle at top right
    const badgeX = 390 * s;
    const badgeY = 100 * s;
    const badgeR = 60 * s;

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();
    ctx.lineWidth = 7 * s;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Checkmark tick
    ctx.beginPath();
    ctx.moveTo(badgeX - 24 * s, badgeY + 2 * s);
    ctx.lineTo(badgeX - 6 * s, badgeY + 20 * s);
    ctx.lineTo(badgeX + 26 * s, badgeY - 18 * s);
    ctx.lineWidth = 11 * s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  }

  return canvas;
}

// Artwork Drawing Functions:

function drawAutumnLeaf(ctx: CanvasRenderingContext2D, s: number) {
  // Maple Leaf Shape
  ctx.save();
  ctx.scale(1.2, 1.2);

  // Gradient: Yellow -> Orange -> Deep Amber
  const leafGrad = ctx.createLinearGradient(0, -90 * s, 0, 70 * s);
  leafGrad.addColorStop(0, '#f97316');
  leafGrad.addColorStop(0.4, '#ea580c');
  leafGrad.addColorStop(0.8, '#c2410c');
  leafGrad.addColorStop(1, '#9a3412');

  // Maple leaf silhouette
  ctx.beginPath();
  ctx.moveTo(0, -95 * s); // Top tip
  // Top-right lobe
  ctx.bezierCurveTo(25 * s, -80 * s, 35 * s, -60 * s, 30 * s, -50 * s);
  ctx.lineTo(55 * s, -65 * s);
  ctx.bezierCurveTo(75 * s, -45 * s, 85 * s, -20 * s, 80 * s, 0 * s);
  ctx.lineTo(60 * s, 5 * s);
  // Bottom-right lobe
  ctx.bezierCurveTo(75 * s, 25 * s, 60 * s, 55 * s, 40 * s, 50 * s);
  ctx.lineTo(25 * s, 50 * s);
  // Base
  ctx.bezierCurveTo(15 * s, 65 * s, 5 * s, 70 * s, 0 * s, 70 * s);
  // Left side symmetric
  ctx.bezierCurveTo(-5 * s, 70 * s, -15 * s, 65 * s, -25 * s, 50 * s);
  ctx.lineTo(-40 * s, 50 * s);
  ctx.bezierCurveTo(-60 * s, 55 * s, -75 * s, 25 * s, -60 * s, 5 * s);
  ctx.lineTo(-80 * s, 0 * s);
  ctx.bezierCurveTo(-85 * s, -20 * s, -75 * s, -45 * s, -55 * s, -65 * s);
  ctx.lineTo(-30 * s, -50 * s);
  ctx.bezierCurveTo(-35 * s, -60 * s, -25 * s, -80 * s, 0, -95 * s);
  ctx.closePath();

  ctx.fillStyle = leafGrad;
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#7c2d12';
  ctx.stroke();

  // Leaf Veins
  ctx.beginPath();
  ctx.moveTo(0, 95 * s); // Stem start
  ctx.lineTo(0, -75 * s);
  // Side branches
  ctx.moveTo(0, 20 * s);
  ctx.lineTo(50 * s, -10 * s);
  ctx.moveTo(0, 20 * s);
  ctx.lineTo(-50 * s, -10 * s);
  ctx.moveTo(0, 45 * s);
  ctx.lineTo(35 * s, 40 * s);
  ctx.moveTo(0, 45 * s);
  ctx.lineTo(-35 * s, 40 * s);
  ctx.moveTo(0, -20 * s);
  ctx.lineTo(35 * s, -45 * s);
  ctx.moveTo(0, -20 * s);
  ctx.lineTo(-35 * s, -45 * s);

  ctx.lineWidth = 5 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#fed7aa';
  ctx.stroke();

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, 70 * s);
  ctx.quadraticCurveTo(8 * s, 90 * s, 5 * s, 105 * s);
  ctx.lineWidth = 8 * s;
  ctx.strokeStyle = '#78350f';
  ctx.stroke();

  ctx.restore();
}

function drawChestnut(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.15, 1.15);

  // Spiky green cup / burr on the left/background
  ctx.beginPath();
  ctx.arc(-35 * s, -10 * s, 68 * s, 0, Math.PI * 2);
  ctx.fillStyle = '#65a30d';
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#365314';
  ctx.stroke();

  // Little spikes
  for (let a = 0; a < Math.PI * 2; a += 0.35) {
    const x1 = -35 * s + Math.cos(a) * 65 * s;
    const y1 = -10 * s + Math.sin(a) * 65 * s;
    const x2 = -35 * s + Math.cos(a) * 82 * s;
    const y2 = -10 * s + Math.sin(a) * 82 * s;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 4 * s;
    ctx.strokeStyle = '#3f6212';
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Brown Chestnut Seed
  ctx.save();
  ctx.translate(20 * s, 10 * s);

  // Chestnut body gradient
  const nutGrad = ctx.createRadialGradient(-15 * s, -20 * s, 10 * s, 0, 0, 70 * s);
  nutGrad.addColorStop(0, '#a16207');
  nutGrad.addColorStop(0.3, '#78350f');
  nutGrad.addColorStop(0.9, '#451a03');

  ctx.beginPath();
  ctx.ellipse(0, 0, 65 * s, 58 * s, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = nutGrad;
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#290e03';
  ctx.stroke();

  // Tan spot (hilum / base)
  ctx.beginPath();
  ctx.ellipse(-15 * s, 25 * s, 36 * s, 22 * s, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#d4a373';
  ctx.fill();
  ctx.lineWidth = 2 * s;
  ctx.strokeStyle = '#a27244';
  ctx.stroke();

  // Shiny highlight reflection
  ctx.beginPath();
  ctx.ellipse(15 * s, -25 * s, 22 * s, 10 * s, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

function drawAcorn(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.2, 1.2);

  // Nut body (bottom oval tapering to a point)
  const nutGrad = ctx.createLinearGradient(-40 * s, 0, 40 * s, 60 * s);
  nutGrad.addColorStop(0, '#d97706');
  nutGrad.addColorStop(0.5, '#b45309');
  nutGrad.addColorStop(1, '#78350f');

  ctx.beginPath();
  ctx.moveTo(-45 * s, 5 * s);
  ctx.bezierCurveTo(-45 * s, 55 * s, -20 * s, 78 * s, 0, 85 * s); // Pointed tip
  ctx.bezierCurveTo(20 * s, 78 * s, 45 * s, 55 * s, 45 * s, 5 * s);
  ctx.closePath();
  ctx.fillStyle = nutGrad;
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#451a03';
  ctx.stroke();

  // Nut highlight
  ctx.beginPath();
  ctx.ellipse(-18 * s, 35 * s, 8 * s, 25 * s, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();

  // Acorn Cap (cupule)
  const capGrad = ctx.createLinearGradient(0, -50 * s, 0, 15 * s);
  capGrad.addColorStop(0, '#78350f');
  capGrad.addColorStop(1, '#451a03');

  ctx.beginPath();
  ctx.ellipse(0, 5 * s, 55 * s, 26 * s, 0, Math.PI, 0, false);
  ctx.closePath();
  ctx.fillStyle = capGrad;
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#290e03';
  ctx.stroke();

  // Textured pattern on cap
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 3 * s;
  for (let x = -50 * s; x <= 50 * s; x += 14 * s) {
    ctx.beginPath();
    ctx.moveTo(x, -50 * s);
    ctx.lineTo(x + 25 * s, 15 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 25 * s, -50 * s);
    ctx.lineTo(x, 15 * s);
    ctx.stroke();
  }
  ctx.restore();

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, -20 * s);
  ctx.quadraticCurveTo(15 * s, -45 * s, 12 * s, -65 * s);
  ctx.lineWidth = 8 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#57300a';
  ctx.stroke();

  ctx.restore();
}

function drawApple(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.15, 1.15);

  // Red Apple Body
  const appleGrad = ctx.createRadialGradient(-20 * s, -15 * s, 15 * s, 0, 10 * s, 75 * s);
  appleGrad.addColorStop(0, '#f87171');
  appleGrad.addColorStop(0.35, '#dc2626');
  appleGrad.addColorStop(0.85, '#991b1b');
  appleGrad.addColorStop(1, '#7f1d1d');

  ctx.beginPath();
  ctx.moveTo(0, -45 * s);
  // Right apple cheek
  ctx.bezierCurveTo(45 * s, -70 * s, 85 * s, -20 * s, 68 * s, 35 * s);
  ctx.bezierCurveTo(55 * s, 75 * s, 15 * s, 75 * s, 0, 68 * s);
  // Left apple cheek
  ctx.bezierCurveTo(-15 * s, 75 * s, -55 * s, 75 * s, -68 * s, 35 * s);
  ctx.bezierCurveTo(-85 * s, -20 * s, -45 * s, -70 * s, 0, -45 * s);
  ctx.closePath();

  ctx.fillStyle = appleGrad;
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#601111';
  ctx.stroke();

  // Apple glossy highlight
  ctx.beginPath();
  ctx.ellipse(-30 * s, -15 * s, 16 * s, 28 * s, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.fill();

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, -45 * s);
  ctx.quadraticCurveTo(8 * s, -75 * s, 18 * s, -85 * s);
  ctx.lineWidth = 7 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#5c3317';
  ctx.stroke();

  // Green Leaf
  ctx.beginPath();
  ctx.moveTo(8 * s, -65 * s);
  ctx.quadraticCurveTo(45 * s, -95 * s, 62 * s, -70 * s);
  ctx.quadraticCurveTo(35 * s, -55 * s, 8 * s, -65 * s);
  ctx.fillStyle = '#65a30d';
  ctx.fill();
  ctx.lineWidth = 2 * s;
  ctx.strokeStyle = '#365314';
  ctx.stroke();

  ctx.restore();
}

function drawPear(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.15, 1.15);

  // Pear Body (bell-shaped)
  const pearGrad = ctx.createRadialGradient(-15 * s, 0, 20 * s, 0, 20 * s, 80 * s);
  pearGrad.addColorStop(0, '#fef08a');
  pearGrad.addColorStop(0.4, '#a3e635');
  pearGrad.addColorStop(0.85, '#65a30d');
  pearGrad.addColorStop(1, '#4d7c0f');

  ctx.beginPath();
  ctx.moveTo(0, -65 * s);
  // Narrow neck down to plump belly
  ctx.bezierCurveTo(22 * s, -65 * s, 28 * s, -25 * s, 42 * s, 0 * s);
  ctx.bezierCurveTo(70 * s, 35 * s, 55 * s, 75 * s, 0, 75 * s);
  ctx.bezierCurveTo(-55 * s, 75 * s, -70 * s, 35 * s, -42 * s, 0 * s);
  ctx.bezierCurveTo(-28 * s, -25 * s, -22 * s, -65 * s, 0, -65 * s);
  ctx.closePath();

  ctx.fillStyle = pearGrad;
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#365314';
  ctx.stroke();

  // Soft pear freckles
  ctx.fillStyle = 'rgba(101, 67, 33, 0.25)';
  const freckles = [
    [-15, 20], [10, 35], [-25, 45], [25, 25], [5, 55], [-5, 30]
  ];
  for (const [fx, fy] of freckles) {
    ctx.beginPath();
    ctx.arc(fx * s, fy * s, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Highlight
  ctx.beginPath();
  ctx.ellipse(-22 * s, 15 * s, 14 * s, 32 * s, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, -65 * s);
  ctx.quadraticCurveTo(-10 * s, -85 * s, -5 * s, -95 * s);
  ctx.lineWidth = 7 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#5c3317';
  ctx.stroke();

  // Small leaf
  ctx.beginPath();
  ctx.moveTo(-5 * s, -80 * s);
  ctx.quadraticCurveTo(25 * s, -100 * s, 35 * s, -80 * s);
  ctx.quadraticCurveTo(15 * s, -70 * s, -5 * s, -80 * s);
  ctx.fillStyle = '#84cc16';
  ctx.fill();
  ctx.lineWidth = 2 * s;
  ctx.strokeStyle = '#365314';
  ctx.stroke();

  ctx.restore();
}

function drawGrapes(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.15, 1.15);

  // Grape stem and tendrils
  ctx.beginPath();
  ctx.moveTo(0, -35 * s);
  ctx.quadraticCurveTo(5 * s, -65 * s, 15 * s, -80 * s);
  ctx.lineWidth = 7 * s;
  ctx.strokeStyle = '#5c3317';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Green vine leaf
  ctx.beginPath();
  ctx.moveTo(5 * s, -55 * s);
  ctx.quadraticCurveTo(45 * s, -75 * s, 50 * s, -45 * s);
  ctx.quadraticCurveTo(25 * s, -35 * s, 5 * s, -55 * s);
  ctx.fillStyle = '#65a30d';
  ctx.fill();
  ctx.lineWidth = 3 * s;
  ctx.strokeStyle = '#365314';
  ctx.stroke();

  // Grape berries cluster
  const berries: [number, number, number][] = [
    // Top row
    [-38, -25, 22], [-12, -28, 23], [14, -28, 23], [38, -25, 22],
    // 2nd row
    [-30, -3, 23], [-5, -5, 24], [22, -3, 24],
    // 3rd row
    [-18, 20, 23], [8, 22, 23],
    // Bottom
    [-5, 44, 21], [0, 65, 18],
  ];

  for (const [bx, by, br] of berries) {
    const grad = ctx.createRadialGradient(
      (bx - 6) * s, (by - 6) * s, 4 * s,
      bx * s, by * s, br * s
    );
    grad.addColorStop(0, '#c084fc');
    grad.addColorStop(0.35, '#9333ea');
    grad.addColorStop(0.85, '#6b21a8');
    grad.addColorStop(1, '#4c1d95');

    ctx.beginPath();
    ctx.arc(bx * s, by * s, br * s, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3 * s;
    ctx.strokeStyle = '#3b0764';
    ctx.stroke();

    // Berry shine
    ctx.beginPath();
    ctx.arc((bx - 6) * s, (by - 6) * s, 4 * s, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
  }

  ctx.restore();
}

function drawPumpkin(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.15, 1.15);

  // Pumpkin Ribbed Segments (Outer to inner for layering)
  const segments: [number, number, number, number][] = [
    [-45, 10, 36, 55],
    [45, 10, 36, 55],
    [-25, 12, 38, 62],
    [25, 12, 38, 62],
    [0, 15, 40, 66],
  ];

  for (const [sx, sy, rx, ry] of segments) {
    const grad = ctx.createRadialGradient(
      (sx - 10) * s, (sy - 15) * s, 10 * s,
      sx * s, sy * s, Math.max(rx, ry) * s
    );
    grad.addColorStop(0, '#fdba74');
    grad.addColorStop(0.35, '#f97316');
    grad.addColorStop(0.85, '#ea580c');
    grad.addColorStop(1, '#9a3412');

    ctx.beginPath();
    ctx.ellipse(sx * s, sy * s, rx * s, ry * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 4 * s;
    ctx.strokeStyle = '#7c2d12';
    ctx.stroke();
  }

  // Stem (curly green stalk)
  ctx.beginPath();
  ctx.moveTo(-10 * s, -45 * s);
  ctx.bezierCurveTo(-15 * s, -75 * s, 15 * s, -85 * s, 22 * s, -75 * s);
  ctx.lineWidth = 14 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#3f6212';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(18 * s, -75 * s);
  ctx.quadraticCurveTo(35 * s, -70 * s, 30 * s, -55 * s);
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#65a30d';
  ctx.stroke();

  ctx.restore();
}

function drawRain(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.1, 1.1);

  // Soft Blue Rain Cloud
  const cloudGrad = ctx.createLinearGradient(0, -60 * s, 0, 20 * s);
  cloudGrad.addColorStop(0, '#e0f2fe');
  cloudGrad.addColorStop(0.5, '#7dd3fc');
  cloudGrad.addColorStop(1, '#38bdf8');

  ctx.beginPath();
  ctx.arc(-40 * s, -10 * s, 36 * s, Math.PI * 0.7, Math.PI * 1.85);
  ctx.arc(0, -32 * s, 42 * s, Math.PI * 0.9, Math.PI * 2.1);
  ctx.arc(42 * s, -10 * s, 34 * s, Math.PI * 1.25, Math.PI * 0.3);
  ctx.lineTo(-45 * s, 20 * s);
  ctx.closePath();

  ctx.fillStyle = cloudGrad;
  ctx.fill();
  ctx.lineWidth = 5 * s;
  ctx.strokeStyle = '#0284c7';
  ctx.stroke();

  // Cloud eye/smile or cute highlight
  ctx.beginPath();
  ctx.arc(-10 * s, -30 * s, 24 * s, 0, Math.PI);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 4 * s;
  ctx.stroke();

  // Raindrops
  const drops = [
    [-45, 45], [-20, 65], [5, 45], [30, 65], [50, 40]
  ];

  for (const [dx, dy] of drops) {
    ctx.save();
    ctx.translate(dx * s, dy * s);

    const dropGrad = ctx.createLinearGradient(0, -18 * s, 0, 10 * s);
    dropGrad.addColorStop(0, '#bae6fd');
    dropGrad.addColorStop(1, '#0284c7');

    ctx.beginPath();
    ctx.moveTo(0, -16 * s);
    ctx.quadraticCurveTo(10 * s, 5 * s, 0, 12 * s);
    ctx.quadraticCurveTo(-10 * s, 5 * s, 0, -16 * s);
    ctx.closePath();

    ctx.fillStyle = dropGrad;
    ctx.fill();
    ctx.lineWidth = 2 * s;
    ctx.strokeStyle = '#0369a1';
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function drawUmbrella(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.15, 1.15);

  // Top pointy tip (ferrule)
  ctx.beginPath();
  ctx.moveTo(0, -75 * s);
  ctx.lineTo(0, -60 * s);
  ctx.lineWidth = 6 * s;
  ctx.strokeStyle = '#713f12';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Umbrella Canopy (alternating panels: Red and Orange/Yellow)
  const panels = [
    { start: -75, end: -35, color1: '#ef4444', color2: '#b91c1c' },
    { start: -35, end: 0, color1: '#f59e0b', color2: '#d97706' },
    { start: 0, end: 35, color1: '#ef4444', color2: '#b91c1c' },
    { start: 35, end: 75, color1: '#f59e0b', color2: '#d97706' },
  ];

  for (const p of panels) {
    const pGrad = ctx.createLinearGradient(0, -60 * s, 0, 10 * s);
    pGrad.addColorStop(0, p.color1);
    pGrad.addColorStop(1, p.color2);

    ctx.beginPath();
    ctx.moveTo(0, -60 * s);
    ctx.quadraticCurveTo((p.start + p.end) / 2 * s * 1.2, -40 * s, p.end * s, 10 * s);
    ctx.quadraticCurveTo((p.start + p.end) / 2 * s, 18 * s, p.start * s, 10 * s);
    ctx.closePath();
    ctx.fillStyle = pGrad;
    ctx.fill();
    ctx.lineWidth = 3 * s;
    ctx.strokeStyle = '#991b1b';
    ctx.stroke();
  }

  // Umbrella Shaft and J-hook handle
  ctx.beginPath();
  ctx.moveTo(0, 10 * s);
  ctx.lineTo(0, 65 * s);
  ctx.quadraticCurveTo(0, 85 * s, 18 * s, 85 * s);
  ctx.quadraticCurveTo(32 * s, 85 * s, 30 * s, 70 * s);
  ctx.lineWidth = 8 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#78350f';
  ctx.stroke();

  ctx.restore();
}

function drawBoots(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.scale(1.15, 1.15);

  // Bright Yellow Rubber Boots
  const bootGrad = ctx.createLinearGradient(-30 * s, -65 * s, 40 * s, 65 * s);
  bootGrad.addColorStop(0, '#fef08a');
  bootGrad.addColorStop(0.3, '#facc15');
  bootGrad.addColorStop(0.8, '#eab308');
  bootGrad.addColorStop(1, '#ca8a04');

  // Boot silhouette
  ctx.beginPath();
  ctx.moveTo(-25 * s, -65 * s);
  ctx.lineTo(15 * s, -65 * s); // Top opening
  ctx.lineTo(20 * s, 10 * s); // Leg back
  ctx.quadraticCurveTo(22 * s, 40 * s, 15 * s, 50 * s); // Heel curve
  ctx.lineTo(65 * s, 50 * s); // Foot top
  ctx.quadraticCurveTo(80 * s, 60 * s, 65 * s, 72 * s); // Toe rounded
  ctx.lineTo(-20 * s, 72 * s); // Sole
  ctx.lineTo(-20 * s, 52 * s); // Heel
  ctx.quadraticCurveTo(-10 * s, 25 * s, -20 * s, 10 * s); // Ankle front
  ctx.lineTo(-25 * s, -65 * s); // Up front
  ctx.closePath();

  ctx.fillStyle = bootGrad;
  ctx.fill();
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = '#854d0e';
  ctx.stroke();

  // Boot Top Trim
  ctx.beginPath();
  ctx.moveTo(-28 * s, -65 * s);
  ctx.lineTo(18 * s, -65 * s);
  ctx.lineWidth = 10 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#a16207';
  ctx.stroke();

  // Dark Treaded Rubber Sole
  ctx.beginPath();
  ctx.moveTo(-22 * s, 70 * s);
  ctx.lineTo(66 * s, 70 * s);
  ctx.lineWidth = 10 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#713f12';
  ctx.stroke();

  // Boot Highlight shine
  ctx.beginPath();
  ctx.moveTo(-15 * s, -50 * s);
  ctx.lineTo(-12 * s, 10 * s);
  ctx.lineWidth = 6 * s;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.stroke();

  ctx.restore();
}

/**
 * Get or create cached Three.js CanvasTexture for the concept sphere
 */
/**
 * Get a high-res Data URL for React 2D cards and UI elements
 */
export function getConceptDataUrl(conceptId: ConceptId, isFound: boolean = false): string {
  const key = `${conceptId}_${isFound ? 'found' : 'normal'}`;
  let url = dataUrlCache.get(key);
  if (!url) {
    const canvas = drawConceptCanvas(conceptId, isFound, 512);
    url = canvas.toDataURL('image/png');
    dataUrlCache.set(key, url);
  }
  return url;
}
