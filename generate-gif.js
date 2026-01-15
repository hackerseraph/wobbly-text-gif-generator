const { createCanvas } = require('canvas');
const fs = require('fs');
const GifEncoder = require('gif-encoder');

const text = 'HACKERSERAPH';
const width = 500;
const height = 300;

// Create canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Create GIF encoder
const gif = new GifEncoder(width, height);
const stream = fs.createWriteStream('HACKERSERAPH.gif');
gif.pipe(stream);

// Draw function
function drawFrame(tick) {
  // Clear screen
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);

  const cy = height / 2;
  const cut1 = cy - 40;
  const cut2 = cy;
  const cut3 = cy + 40;

  // Create buffer canvas for clean text
  const bufferCanvas = createCanvas(width, height);
  const bufferCtx = bufferCanvas.getContext('2d');
  bufferCtx.fillStyle = '#1a1a1a';
  bufferCtx.fillRect(0, 0, width, height);

  // Draw text on buffer
  const fontSize = 160;
  bufferCtx.font = `900 ${fontSize}px Arial, Impact, sans-serif`;
  bufferCtx.textAlign = 'center';
  bufferCtx.textBaseline = 'middle';

  const x = width / 2;
  const y = height / 2;

  // Stroke
  bufferCtx.lineWidth = 18;
  bufferCtx.strokeStyle = 'black';
  bufferCtx.lineJoin = 'round';
  bufferCtx.strokeText(text, x, y);

  // Gradient fill
  const gradient = bufferCtx.createLinearGradient(0, y - fontSize / 2, 0, y + fontSize / 2);
  gradient.addColorStop(0, '#5a86ce');
  gradient.addColorStop(0.5, '#7ec288');
  gradient.addColorStop(1, '#a9f542');

  bufferCtx.fillStyle = gradient;
  bufferCtx.fillText(text, x, y);

  // Apply wave distortion
  const zones = [
    { y: 0, h: cut1 },
    { y: cut1, h: cut2 - cut1 },
    { y: cut2, h: cut3 - cut2 },
    { y: cut3, h: height - cut3 }
  ];

  zones.forEach((zone, index) => {
    const wavePhase = Math.sin(tick + index);
    const offset = wavePhase * 25;

    ctx.drawImage(
      bufferCanvas,
      0, zone.y, width, zone.h,
      offset, zone.y, width, zone.h
    );
  });
}

// Generate 30 frames
for (let i = 0; i < 30; i++) {
  const tick = i * 0.8;
  drawFrame(tick);

  gif.addFrame(ctx);
}

gif.end();

stream.on('finish', () => {
  console.log('GIF generated: HACKERSERAPH.gif');
});
