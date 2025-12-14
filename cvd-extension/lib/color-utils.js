/**
 * CVD Color Assistant - 颜色工具库
 * 提供颜色转换、对比度计算等基础功能
 */

const ColorUtils = (function() {
  'use strict';

  /**
   * 将十六进制颜色转换为 RGB
   * @param {string} hex - 十六进制颜色值
   * @returns {Object} RGB 对象 {r, g, b}
   */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
    // 处理 3 位十六进制
    const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (shortResult) {
      return {
        r: parseInt(shortResult[1] + shortResult[1], 16),
        g: parseInt(shortResult[2] + shortResult[2], 16),
        b: parseInt(shortResult[3] + shortResult[3], 16)
      };
    }
    return null;
  }

  /**
   * RGB 转十六进制
   * @param {number} r - 红色值
   * @param {number} g - 绿色值
   * @param {number} b - 蓝色值
   * @returns {string} 十六进制颜色
   */
  function rgbToHex(r, g, b) {
    const toHex = (c) => {
      const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  /**
   * 解析 CSS 颜色值为 RGB
   * @param {string} color - CSS 颜色值
   * @returns {Object|null} RGB 对象
   */
  function parseColor(color) {
    if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') {
      return null;
    }

    // 处理十六进制
    if (color.startsWith('#')) {
      return hexToRgb(color);
    }

    // 处理 rgb/rgba
    const rgbMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }

    // 处理命名颜色
    const namedColors = {
      'white': { r: 255, g: 255, b: 255 },
      'black': { r: 0, g: 0, b: 0 },
      'red': { r: 255, g: 0, b: 0 },
      'green': { r: 0, g: 128, b: 0 },
      'blue': { r: 0, g: 0, b: 255 },
      'yellow': { r: 255, g: 255, b: 0 },
      'cyan': { r: 0, g: 255, b: 255 },
      'magenta': { r: 255, g: 0, b: 255 },
      'gray': { r: 128, g: 128, b: 128 },
      'grey': { r: 128, g: 128, b: 128 },
      'orange': { r: 255, g: 165, b: 0 },
      'purple': { r: 128, g: 0, b: 128 },
      'pink': { r: 255, g: 192, b: 203 },
      'brown': { r: 165, g: 42, b: 42 },
      'navy': { r: 0, g: 0, b: 128 },
      'teal': { r: 0, g: 128, b: 128 },
      'olive': { r: 128, g: 128, b: 0 },
      'maroon': { r: 128, g: 0, b: 0 },
      'lime': { r: 0, g: 255, b: 0 },
      'aqua': { r: 0, g: 255, b: 255 },
      'silver': { r: 192, g: 192, b: 192 },
      'fuchsia': { r: 255, g: 0, b: 255 }
    };

    const lowerColor = color.toLowerCase();
    if (namedColors[lowerColor]) {
      return namedColors[lowerColor];
    }

    return null;
  }

  /**
   * RGB 转 sRGB（线性化）
   * @param {number} value - RGB 值 (0-255)
   * @returns {number} 线性化后的值
   */
  function sRGBToLinear(value) {
    const v = value / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  /**
   * 线性 RGB 转 sRGB
   * @param {number} value - 线性值
   * @returns {number} sRGB 值 (0-255)
   */
  function linearToSRGB(value) {
    const v = Math.max(0, Math.min(1, value));
    return v <= 0.0031308 
      ? Math.round(v * 12.92 * 255) 
      : Math.round((1.055 * Math.pow(v, 1/2.4) - 0.055) * 255);
  }

  /**
   * RGB 转 XYZ 色彩空间
   * @param {Object} rgb - RGB 对象
   * @returns {Object} XYZ 对象
   */
  function rgbToXyz(rgb) {
    const r = sRGBToLinear(rgb.r);
    const g = sRGBToLinear(rgb.g);
    const b = sRGBToLinear(rgb.b);

    return {
      x: r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
      y: r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
      z: r * 0.0193339 + g * 0.1191920 + b * 0.9503041
    };
  }

  /**
   * XYZ 转 RGB
   * @param {Object} xyz - XYZ 对象
   * @returns {Object} RGB 对象
   */
  function xyzToRgb(xyz) {
    const r = xyz.x *  3.2404542 + xyz.y * -1.5371385 + xyz.z * -0.4985314;
    const g = xyz.x * -0.9692660 + xyz.y *  1.8760108 + xyz.z *  0.0415560;
    const b = xyz.x *  0.0556434 + xyz.y * -0.2040259 + xyz.z *  1.0572252;

    return {
      r: linearToSRGB(r),
      g: linearToSRGB(g),
      b: linearToSRGB(b)
    };
  }

  /**
   * RGB 转 LAB 色彩空间
   * @param {Object} rgb - RGB 对象
   * @returns {Object} LAB 对象
   */
  function rgbToLab(rgb) {
    const xyz = rgbToXyz(rgb);
    
    // D65 白点
    const refX = 0.95047;
    const refY = 1.00000;
    const refZ = 1.08883;

    let x = xyz.x / refX;
    let y = xyz.y / refY;
    let z = xyz.z / refZ;

    const epsilon = 0.008856;
    const kappa = 903.3;

    x = x > epsilon ? Math.pow(x, 1/3) : (kappa * x + 16) / 116;
    y = y > epsilon ? Math.pow(y, 1/3) : (kappa * y + 16) / 116;
    z = z > epsilon ? Math.pow(z, 1/3) : (kappa * z + 16) / 116;

    return {
      l: 116 * y - 16,
      a: 500 * (x - y),
      b: 200 * (y - z)
    };
  }

  /**
   * LAB 转 RGB
   * @param {Object} lab - LAB 对象
   * @returns {Object} RGB 对象
   */
  function labToRgb(lab) {
    const refX = 0.95047;
    const refY = 1.00000;
    const refZ = 1.08883;

    let y = (lab.l + 16) / 116;
    let x = lab.a / 500 + y;
    let z = y - lab.b / 200;

    const epsilon = 0.008856;
    const kappa = 903.3;

    const x3 = Math.pow(x, 3);
    const y3 = Math.pow(y, 3);
    const z3 = Math.pow(z, 3);

    x = x3 > epsilon ? x3 : (116 * x - 16) / kappa;
    y = lab.l > kappa * epsilon ? y3 : lab.l / kappa;
    z = z3 > epsilon ? z3 : (116 * z - 16) / kappa;

    const xyz = {
      x: x * refX,
      y: y * refY,
      z: z * refZ
    };

    return xyzToRgb(xyz);
  }

  /**
   * RGB 转 HSL
   * @param {Object} rgb - RGB 对象
   * @returns {Object} HSL 对象
   */
  function rgbToHsl(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h, s;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * HSL 转 RGB
   * @param {Object} hsl - HSL 对象
   * @returns {Object} RGB 对象
   */
  function hslToRgb(hsl) {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * 计算相对亮度 (WCAG 2.0)
   * @param {Object} rgb - RGB 对象
   * @returns {number} 相对亮度值
   */
  function getRelativeLuminance(rgb) {
    const r = sRGBToLinear(rgb.r);
    const g = sRGBToLinear(rgb.g);
    const b = sRGBToLinear(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * 计算两个颜色之间的对比度 (WCAG 2.0)
   * @param {Object} rgb1 - 第一个 RGB 颜色
   * @param {Object} rgb2 - 第二个 RGB 颜色
   * @returns {number} 对比度 (1-21)
   */
  function getContrastRatio(rgb1, rgb2) {
    const l1 = getRelativeLuminance(rgb1);
    const l2 = getRelativeLuminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 计算两个颜色在 LAB 空间的 Delta E (CIE76)
   * @param {Object} rgb1 - 第一个 RGB 颜色
   * @param {Object} rgb2 - 第二个 RGB 颜色
   * @returns {number} Delta E 值
   */
  function getDeltaE(rgb1, rgb2) {
    const lab1 = rgbToLab(rgb1);
    const lab2 = rgbToLab(rgb2);
    
    const deltaL = lab1.l - lab2.l;
    const deltaA = lab1.a - lab2.a;
    const deltaB = lab1.b - lab2.b;
    
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  }

  /**
   * 计算 CIEDE2000 色差 (ΔE00)
   * 这是最准确的色差公式，考虑了人眼感知的非均匀性
   * 
   * 参考: Sharma et al. (2005) "The CIEDE2000 Color-Difference Formula"
   * 
   * @param {Object} rgb1 - 第一个 RGB 颜色
   * @param {Object} rgb2 - 第二个 RGB 颜色
   * @returns {number} CIEDE2000 ΔE00 值
   */
  function getDeltaE00(rgb1, rgb2) {
    const lab1 = rgbToLab(rgb1);
    const lab2 = rgbToLab(rgb2);
    
    // 转换为 L*C*h* 色彩空间
    const L1 = lab1.l;
    const a1 = lab1.a;
    const b1 = lab1.b;
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const h1 = Math.atan2(b1, a1) * 180 / Math.PI;
    if (h1 < 0) h1 += 360;
    
    const L2 = lab2.l;
    const a2 = lab2.a;
    const b2 = lab2.b;
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    let h2 = Math.atan2(b2, a2) * 180 / Math.PI;
    if (h2 < 0) h2 += 360;
    
    // 平均 L*
    const LBar = (L1 + L2) / 2;
    
    // 平均 C*
    const CBar = (C1 + C2) / 2;
    
    // G 因子（用于补偿 a* 的非均匀性）
    const G = 0.5 * (1 - Math.sqrt(Math.pow(CBar, 7) / (Math.pow(CBar, 7) + Math.pow(25, 7))));
    
    // 调整后的 a*
    const a1Prime = (1 + G) * a1;
    const a2Prime = (1 + G) * a2;
    
    // 调整后的 C*
    const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
    const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
    
    // 调整后的 h*
    let h1Prime = Math.atan2(b1, a1Prime) * 180 / Math.PI;
    if (h1Prime < 0) h1Prime += 360;
    let h2Prime = Math.atan2(b2, a2Prime) * 180 / Math.PI;
    if (h2Prime < 0) h2Prime += 360;
    
    // ΔL', ΔC', ΔH'
    const deltaLPrime = L2 - L1;
    const deltaCPrime = C2Prime - C1Prime;
    
    let deltaHPrime;
    if (C1Prime * C2Prime === 0) {
      deltaHPrime = 0;
    } else if (Math.abs(h2Prime - h1Prime) <= 180) {
      deltaHPrime = h2Prime - h1Prime;
    } else if (h2Prime - h1Prime > 180) {
      deltaHPrime = h2Prime - h1Prime - 360;
    } else {
      deltaHPrime = h2Prime - h1Prime + 360;
    }
    
    const deltaHPrimeRad = deltaHPrime * Math.PI / 180;
    const deltaHPrimeValue = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(deltaHPrimeRad / 2);
    
    // 平均 C' 和 h'
    const CBarPrime = (C1Prime + C2Prime) / 2;
    
    let HBarPrime;
    if (C1Prime * C2Prime === 0) {
      HBarPrime = h1Prime + h2Prime;
    } else if (Math.abs(h2Prime - h1Prime) <= 180) {
      HBarPrime = (h1Prime + h2Prime) / 2;
    } else if (Math.abs(h2Prime - h1Prime) > 180 && h1Prime + h2Prime < 360) {
      HBarPrime = (h1Prime + h2Prime + 360) / 2;
    } else {
      HBarPrime = (h1Prime + h2Prime - 360) / 2;
    }
    
    // T 因子
    const T = 1 - 0.17 * Math.cos((HBarPrime - 30) * Math.PI / 180) +
              0.24 * Math.cos(2 * HBarPrime * Math.PI / 180) +
              0.32 * Math.cos((3 * HBarPrime + 6) * Math.PI / 180) -
              0.20 * Math.cos((4 * HBarPrime - 63) * Math.PI / 180);
    
    // 权重函数
    const deltaTheta = 30 * Math.exp(-Math.pow((HBarPrime - 275) / 25, 2));
    const RC = 2 * Math.sqrt(Math.pow(CBarPrime, 7) / (Math.pow(CBarPrime, 7) + Math.pow(25, 7)));
    const RT = -Math.sin(2 * deltaTheta * Math.PI / 180) * RC;
    
    // SL, SC, SH
    const SL = 1 + (0.015 * Math.pow(LBar - 50, 2)) / Math.sqrt(20 + Math.pow(LBar - 50, 2));
    const SC = 1 + 0.045 * CBarPrime;
    const SH = 1 + 0.015 * CBarPrime * T;
    
    // kL, kC, kH (标准观察条件)
    const kL = 1;
    const kC = 1;
    const kH = 1;
    
    // 计算 ΔE00
    const term1 = deltaLPrime / (kL * SL);
    const term2 = deltaCPrime / (kC * SC);
    const term3 = deltaHPrimeValue / (kH * SH);
    const term4 = RT * (deltaCPrime / (kC * SC)) * (deltaHPrimeValue / (kH * SH));
    
    const deltaE00 = Math.sqrt(
      Math.pow(term1, 2) +
      Math.pow(term2, 2) +
      Math.pow(term3, 2) +
      term4
    );
    
    return deltaE00;
  }

  /**
   * 检查对比度是否符合 WCAG 标准
   * @param {number} ratio - 对比度
   * @param {string} level - 'AA' 或 'AAA'
   * @param {boolean} isLargeText - 是否为大文本
   * @returns {boolean}
   */
  function meetsWCAG(ratio, level = 'AA', isLargeText = false) {
    if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }

  /**
   * 获取计算后的样式颜色
   * @param {Element} element - DOM 元素
   * @param {string} property - CSS 属性名
   * @returns {Object|null} RGB 对象
   */
  function getComputedColor(element, property) {
    const computed = window.getComputedStyle(element);
    return parseColor(computed[property]);
  }

  /**
   * 混合两个颜色（考虑透明度）
   * @param {Object} fg - 前景色 RGB
   * @param {Object} bg - 背景色 RGB
   * @param {number} alpha - 透明度 (0-1)
   * @returns {Object} 混合后的 RGB
   */
  function blendColors(fg, bg, alpha = 1) {
    return {
      r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
      g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
      b: Math.round(fg.b * alpha + bg.b * (1 - alpha))
    };
  }

  /**
   * 调整颜色亮度
   * @param {Object} rgb - RGB 对象
   * @param {number} amount - 调整量 (-100 到 100)
   * @returns {Object} 调整后的 RGB
   */
  function adjustBrightness(rgb, amount) {
    const hsl = rgbToHsl(rgb);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
    return hslToRgb(hsl);
  }

  /**
   * 调整颜色饱和度
   * @param {Object} rgb - RGB 对象
   * @param {number} amount - 调整量 (-100 到 100)
   * @returns {Object} 调整后的 RGB
   */
  function adjustSaturation(rgb, amount) {
    const hsl = rgbToHsl(rgb);
    hsl.s = Math.max(0, Math.min(100, hsl.s + amount));
    return hslToRgb(hsl);
  }

  /**
   * 旋转色相
   * @param {Object} rgb - RGB 对象
   * @param {number} degrees - 旋转角度
   * @returns {Object} 旋转后的 RGB
   */
  function rotateHue(rgb, degrees) {
    const hsl = rgbToHsl(rgb);
    hsl.h = (hsl.h + degrees) % 360;
    if (hsl.h < 0) hsl.h += 360;
    return hslToRgb(hsl);
  }

  return {
    hexToRgb,
    rgbToHex,
    parseColor,
    rgbToXyz,
    xyzToRgb,
    rgbToLab,
    labToRgb,
    rgbToHsl,
    hslToRgb,
    sRGBToLinear,
    linearToSRGB,
    getRelativeLuminance,
    getContrastRatio,
    getDeltaE,
    getDeltaE00,
    meetsWCAG,
    getComputedColor,
    blendColors,
    adjustBrightness,
    adjustSaturation,
    rotateHue
  };
})();

// 导出给其他脚本使用
if (typeof window !== 'undefined') {
  window.ColorUtils = ColorUtils;
}

