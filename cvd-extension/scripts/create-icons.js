/**
 * 图标生成脚本
 * 运行方式: node scripts/create-icons.js
 * 需要安装: npm install canvas
 */

const fs = require('fs');
const path = require('path');

// 尝试使用 canvas 模块，如果没有则使用 fallback
let createCanvas;
try {
  const { createCanvas: cc } = require('canvas');
  createCanvas = cc;
} catch (e) {
  console.log('canvas 模块未安装，将创建占位符图标');
  console.log('如需生成真实图标，请运行: npm install canvas');
  console.log('或者在浏览器中打开 scripts/generate-icons.html 来生成图标\n');
}

const iconsDir = path.join(__dirname, '..', 'icons');

// 确保 icons 目录存在
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function drawIcon(ctx, size) {
  const scale = size / 128;
  
  // 背景渐变
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#6366f1');
  bgGrad.addColorStop(1, '#8b5cf6');
  
  // 绘制圆角背景
  const radius = 24 * scale;
  const margin = 8 * scale;
  
  ctx.beginPath();
  ctx.moveTo(margin + radius, margin);
  ctx.lineTo(size - margin - radius, margin);
  ctx.quadraticCurveTo(size - margin, margin, size - margin, margin + radius);
  ctx.lineTo(size - margin, size - margin - radius);
  ctx.quadraticCurveTo(size - margin, size - margin, size - margin - radius, size - margin);
  ctx.lineTo(margin + radius, size - margin);
  ctx.quadraticCurveTo(margin, size - margin, margin, size - margin - radius);
  ctx.lineTo(margin, margin + radius);
  ctx.quadraticCurveTo(margin, margin, margin + radius, margin);
  ctx.closePath();
  ctx.fillStyle = bgGrad;
  ctx.fill();
  
  // 眼睛外形
  const eyeGrad = ctx.createLinearGradient(0, 0, size, size);
  eyeGrad.addColorStop(0, '#ffffff');
  eyeGrad.addColorStop(1, '#e0e7ff');
  
  ctx.beginPath();
  ctx.ellipse(64 * scale, 64 * scale, 40 * scale, 28 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = eyeGrad;
  ctx.fill();
  
  // 虹膜
  ctx.beginPath();
  ctx.arc(64 * scale, 64 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#4f46e5';
  ctx.fill();
  
  // 瞳孔
  ctx.beginPath();
  ctx.arc(64 * scale, 64 * scale, 10 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#1e1b4b';
  ctx.fill();
  
  // 高光
  ctx.beginPath();
  ctx.arc(58 * scale, 58 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fill();
  
  // 色彩条纹 (只在大尺寸显示)
  if (size >= 48) {
    const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];
    const barHeight = 8 * scale;
    const barY = 96 * scale;
    const barRadius = 4 * scale;
    
    ctx.globalAlpha = 0.9;
    colors.forEach((color, i) => {
      const barWidth = (i === 3 ? 16 : 20) * scale;
      const barX = (20 + i * 24) * scale;
      
      ctx.beginPath();
      ctx.moveTo(barX + barRadius, barY);
      ctx.lineTo(barX + barWidth - barRadius, barY);
      ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + barRadius);
      ctx.lineTo(barX + barWidth, barY + barHeight - barRadius);
      ctx.quadraticCurveTo(barX + barWidth, barY + barHeight, barX + barWidth - barRadius, barY + barHeight);
      ctx.lineTo(barX + barRadius, barY + barHeight);
      ctx.quadraticCurveTo(barX, barY + barHeight, barX, barY + barHeight - barRadius);
      ctx.lineTo(barX, barY + barRadius);
      ctx.quadraticCurveTo(barX, barY, barX + barRadius, barY);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
}

function generateIcons() {
  if (!createCanvas) {
    // 创建简单的占位符 PNG（1x1 紫色像素）
    // 这是一个有效的 PNG 文件头 + IHDR + IDAT + IEND
    const placeholderPng = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG 签名
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR 长度和类型
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 尺寸
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // 8位RGB，CRC
      0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT 长度和类型
      0x08, 0xD7, 0x63, 0x60, 0x60, 0xF8, 0x0F, 0x00, // 压缩数据 (紫色)
      0x01, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, // CRC
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82
    ]);

    [16, 48, 128].forEach(size => {
      const filePath = path.join(iconsDir, `icon${size}.png`);
      fs.writeFileSync(filePath, placeholderPng);
      console.log(`✓ 创建占位符: ${filePath}`);
    });
    
    console.log('\n⚠️  已创建占位符图标。');
    console.log('要生成真实图标，请：');
    console.log('1. 运行 npm install canvas');
    console.log('2. 再次运行此脚本');
    console.log('或者在浏览器中打开 scripts/generate-icons.html');
    return;
  }

  const sizes = [16, 48, 128];
  
  sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    drawIcon(ctx, size);
    
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ 生成图标: ${filePath}`);
  });
  
  console.log('\n✅ 所有图标生成完成！');
}

generateIcons();

