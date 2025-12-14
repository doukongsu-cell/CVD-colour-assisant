/**
 * CVD Color Assistant - 色觉缺陷模拟算法
 * 
 * 使用精确的 Brettel/Machado 矩阵进行色盲模拟
 * 参考: Brettel et al. (1997) "Computerized simulation of color appearance for dichromats"
 * 
 * 注意：使用固定的 dichromacy（全色盲）矩阵，不是可调节的
 */

const CVDSimulation = (function() {
  'use strict';

  /**
   * 精确的 Brettel/Machado 矩阵
   * 这些是固定的 dichromacy（全色盲）矩阵
   */
  const MATRICES = {
    protanopia: [
      [0.56667, 0.43333, 0],
      [0.55833, 0.44167, 0],
      [0,       0.24167, 0.75833]
    ],
    deuteranopia: [
      [0.625,   0.375,   0],
      [0.7,     0.3,     0],
      [0,       0.3,     0.7]
    ],
    tritanopia: [
      [0.95,    0.05,    0],
      [0,       0.43333, 0.56667],
      [0,       0.475,   0.525]
    ]
  };

  /**
   * 钳制值到 [0, 255]
   */
  function clamp(v) {
    return Math.min(255, Math.max(0, Math.round(v)));
  }

  /**
   * 应用矩阵变换
   * @param {Array} rgb - [r, g, b] 数组
   * @param {Array} matrix - 3x3 矩阵
   * @returns {Array} 变换后的 [r, g, b]
   */
  function applyMatrix(rgb, matrix) {
    const [r, g, b] = rgb;
    return [
      clamp(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b),
      clamp(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b),
      clamp(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b)
    ];
  }

  /**
   * 模拟 CVD 颜色
   * @param {Object} rgb - RGB 对象 {r, g, b}
   * @param {string} type - CVD 类型: 'protanopia', 'deuteranopia', 'tritanopia'
   * @returns {Object} 模拟后的 RGB 对象
   */
  function simulateCVD(rgb, type) {
    if (!rgb || typeof rgb.r === 'undefined') {
      return rgb;
    }

    // 映射类型名称（兼容旧代码）
    let matrixType = type;
    if (type === 'protanomaly') matrixType = 'protanopia';
    if (type === 'deuteranomaly') matrixType = 'deuteranopia';
    if (type === 'tritanomaly') matrixType = 'tritanopia';

    const matrix = MATRICES[matrixType];
    if (!matrix) {
      console.warn(`[CVD] 未知的 CVD 类型: ${type}`);
      return rgb;
    }

    const rgbArray = [rgb.r, rgb.g, rgb.b];
    const result = applyMatrix(rgbArray, matrix);

    return {
      r: result[0],
      g: result[1],
      b: result[2]
    };
  }

  /**
   * 批量模拟多个颜色
   * @param {Array} colors - RGB 颜色数组
   * @param {string} type - CVD 类型
   * @returns {Array} 模拟后的颜色数组
   */
  function simulateColors(colors, type) {
    return colors.map(color => simulateCVD(color, type));
  }

  /**
   * 计算两个 RGB 颜色的欧氏距离
   * @param {Object} rgb1 - 第一个 RGB 颜色
   * @param {Object} rgb2 - 第二个 RGB 颜色
   * @returns {number} 欧氏距离
   */
  function rgbDistance(rgb1, rgb2) {
    const dr = rgb1.r - rgb2.r;
    const dg = rgb1.g - rgb2.g;
    const db = rgb1.b - rgb2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  /**
   * 检查两个颜色在 CVD 视角下是否不可区分
   * @param {Object} rgb1 - 第一个 RGB 颜色
   * @param {Object} rgb2 - 第二个 RGB 颜色
   * @param {string} type - CVD 类型
   * @param {number} threshold - 距离阈值，默认 15
   * @returns {boolean} 是否不可区分
   */
  function colorsIndistinguishable(rgb1, rgb2, type, threshold = 15) {
    const sim1 = simulateCVD(rgb1, type);
    const sim2 = simulateCVD(rgb2, type);
    const distance = rgbDistance(sim1, sim2);
    return distance < threshold;
  }

  /**
   * 检测两个颜色在 CVD 视角下的可区分性
   * @param {Object} rgb1 - 第一个 RGB 颜色
   * @param {Object} rgb2 - 第二个 RGB 颜色
   * @param {string} type - CVD 类型
   * @param {number} threshold - 距离阈值
   * @returns {Object} 包含是否可区分和详细信息
   */
  function checkDistinguishability(rgb1, rgb2, type, threshold = 15) {
    const sim1 = simulateCVD(rgb1, type);
    const sim2 = simulateCVD(rgb2, type);
    const distance = rgbDistance(sim1, sim2);
    
    return {
      distinguishable: distance >= threshold,
      distance: distance,
      simulatedColor1: sim1,
      simulatedColor2: sim2,
      originalDistance: rgbDistance(rgb1, rgb2)
    };
  }

  /**
   * 分析颜色对在所有 CVD 类型下的可区分性
   * @param {Object} rgb1 - 第一个 RGB 颜色
   * @param {Object} rgb2 - 第二个 RGB 颜色
   * @param {number} threshold - 距离阈值
   * @returns {Object} 各类型的分析结果
   */
  function analyzeColorPair(rgb1, rgb2, threshold = 15) {
    const types = ['protanopia', 'deuteranopia', 'tritanopia'];
    const results = {};
    
    types.forEach(type => {
      results[type] = checkDistinguishability(rgb1, rgb2, type, threshold);
    });
    
    results.hasIssue = types.some(type => !results[type].distinguishable);
    results.problematicTypes = types.filter(type => !results[type].distinguishable);
    
    return results;
  }

  /**
   * 获取 CVD 类型的中文名称
   */
  function getCVDTypeName(type) {
    const names = {
      'protanopia': '红色盲 (Protanopia)',
      'protanomaly': '红色弱 (Protanomaly)',
      'deuteranopia': '绿色盲 (Deuteranopia)',
      'deuteranomaly': '绿色弱 (Deuteranomaly)',
      'tritanopia': '蓝黄色盲 (Tritanopia)',
      'tritanomaly': '蓝黄弱 (Tritanomaly)'
    };
    return names[type] || type;
  }

  /**
   * 获取所有支持的 CVD 类型
   */
  function getSupportedTypes() {
    return [
      { id: 'protanopia', name: '红色盲', description: 'L锥体完全缺失' },
      { id: 'deuteranopia', name: '绿色盲', description: 'M锥体完全缺失' },
      { id: 'tritanopia', name: '蓝黄色盲', description: 'S锥体完全缺失' }
    ];
  }

  /**
   * 生成颜色的 CVD 预览信息
   */
  function generatePreview(rgb) {
    return {
      original: rgb,
      protanopia: simulateCVD(rgb, 'protanopia'),
      deuteranopia: simulateCVD(rgb, 'deuteranopia'),
      tritanopia: simulateCVD(rgb, 'tritanopia')
    };
  }

  /**
   * 获取模拟矩阵（用于 SVG 滤镜）
   */
  function getSimulationMatrix(type) {
    let matrixType = type;
    if (type === 'protanomaly') matrixType = 'protanopia';
    if (type === 'deuteranomaly') matrixType = 'deuteranopia';
    if (type === 'tritanomaly') matrixType = 'tritanopia';
    
    return MATRICES[matrixType] || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  }

  return {
    simulateCVD,
    simulateColors,
    colorsIndistinguishable,
    checkDistinguishability,
    analyzeColorPair,
    getSimulationMatrix,
    getCVDTypeName,
    getSupportedTypes,
    generatePreview,
    rgbDistance
  };
})();

// 导出
if (typeof window !== 'undefined') {
  window.CVDSimulation = CVDSimulation;
}
