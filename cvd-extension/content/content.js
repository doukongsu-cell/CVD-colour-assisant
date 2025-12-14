
(function() {
    'use strict';
    
    console.log("🚀 [CVD] Blocking all red borders - guaranteed.");

    function killAllRedBorders() {
        try {
            const all = document.querySelectorAll('*');
            all.forEach(el => {
                try {
                    const style = el.style;
                    if (style) {
                        const stroke = style.stroke;
                        if (stroke && (
                            stroke.includes('255, 0, 0') || 
                            stroke.includes('#ff0000') || 
                            stroke.includes('#FF0000') ||
                            stroke.toLowerCase() === 'red' ||
                            stroke.includes('rgb(255,0,0)')
                        )) {
                            style.setProperty('stroke', 'none', 'important');
                            style.removeProperty('stroke');
                        }
                        
                        const outline = style.outline;
                        const outlineColor = style.outlineColor;
                        if (outline && outline !== 'none' && outlineColor && (
                            outlineColor.includes('255, 0, 0') || 
                            outlineColor.includes('#ff0000') || 
                            outlineColor.includes('#ff4444')
                        )) {
                            style.setProperty('outline', 'none', 'important');
                            style.setProperty('outline-color', 'transparent', 'important');
                        }
                    }

                    const strokeAttr = el.getAttribute('stroke');
                    if (strokeAttr && (
                        strokeAttr.includes('255, 0, 0') || 
                        strokeAttr.includes('#ff0000') || 
                        strokeAttr.includes('#FF0000') ||
                        strokeAttr.toLowerCase() === 'red'
                    )) {
                        el.removeAttribute('stroke');
                        el.removeAttribute('stroke-width');
                    }

                    el.removeAttribute('data-cvd-highlighted');
                    el.removeAttribute('data-cvd-fixed');
                    el.removeAttribute('data-accessibility-highlighted');
                } catch (e) {

                }
            });
        } catch (e) {

        }
    }

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {

        if (name === 'stroke' && value && (
            value.includes('255, 0, 0') || 
            value.includes('#ff0000') || 
            value.includes('#FF0000') ||
            value.toLowerCase() === 'red' ||
            value.includes('rgb(255,0,0)')
        )) {
            console.log('[CVD] BLOCKED setAttribute: red stroke =', value);
            return;
        }
        

        if (name === 'data-cvd-highlighted' || name === 'data-cvd-fixed') {
            console.log('[CVD] BLOCKED setAttribute:', name);
            return;
        }
        
        return originalSetAttribute.call(this, name, value);
    };

    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {

        if (property === 'stroke' && value && (
            value.includes('255, 0, 0') || 
            value.includes('#ff0000') || 
            value.includes('#FF0000') ||
            value.toLowerCase() === 'red' ||
            value.includes('rgb(255,0,0)')
        )) {
            console.log('[CVD] BLOCKED setProperty: red stroke =', value);
            return false;
        }

        if ((property === 'outline-color' || property === 'outline') && value && (
            value.includes('255, 0, 0') || 
            value.includes('#ff0000') || 
            value.includes('#ff4444')
        )) {
            console.log('[CVD] BLOCKED setProperty: red outline =', value);
            return false;
        }
        
        return originalSetProperty.call(this, property, value, priority);
    };

    if (typeof window !== 'undefined') {

        window.__cvdScanAndHighlight = function() {
            console.log('[CVD] BLOCKED: __cvdScanAndHighlight');
            killAllRedBorders();
            return 0;
        };

        const blockFunctions = [
            '__cvdScanAndHighlight',
            'scanAndHighlight',
            'recolorEngine',
            'RecolorEngine'
        ];
        
        blockFunctions.forEach(funcName => {
            if (window[funcName] && typeof window[funcName] === 'function') {
                window[funcName] = function() {
                    console.log(`[CVD] BLOCKED: ${funcName}`);
                    killAllRedBorders();
                    return 0;
                };
            }
        });

        const originalCreateElement = document.createElement;
        document.createElement = function(tagName, options) {
            const element = originalCreateElement.call(this, tagName, options);
            
            if (tagName.toLowerCase() === 'script') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'src' && value && value.includes('recolor-engine')) {
                        console.log('[CVD] BLOCKED: Attempt to load recolor-engine.js:', value);
                        return;
                    }
                    return originalSetAttribute.call(this, name, value);
                };

                Object.defineProperty(element, 'src', {
                    set: function(value) {
                        if (value && value.includes('recolor-engine')) {
                            console.log('[CVD] BLOCKED: Attempt to set script.src to recolor-engine.js:', value);
                            return;
                        }
                        Object.defineProperty(this, 'src', {
                            value: value,
                            writable: true,
                            configurable: true
                        });
                    },
                    get: function() {
                        return this.getAttribute('src');
                    },
                    configurable: true
                });
            }
            
            return element;
        };
    }

    killAllRedBorders();

    setInterval(killAllRedBorders, 100);

    if (document.body) {
        killAllRedBorders();
    } else {
        document.addEventListener('DOMContentLoaded', killAllRedBorders);
    }

    if (typeof MutationObserver !== 'undefined') {
        const killerObserver = new MutationObserver(() => {
            killAllRedBorders();
        });
        
        const startObserver = () => {
            if (document.body) {
                killerObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'stroke', 'fill', 'stroke-width']
                });
            }
        };
        
        if (document.body) {
            startObserver();
        } else {
            document.addEventListener('DOMContentLoaded', startObserver);
        }
    }
})();

(function() {
  'use strict';

  console.log("🚀 [CVD] Full feature version loaded! Ready to process seat map...");
  console.log(`[CVD] Script injected in Frame: ${window.location.href || window.location}`);

  const processedElements = new WeakSet();
  const colorGroups = new Map();
  const originalColors = new WeakMap();


  const OKABE_ITO_PALETTE = [
    { name: 'Black', r: 0, g: 0, b: 0 },
    { name: 'Orange', r: 230, g: 159, b: 0 },
    { name: 'Sky Blue', r: 86, g: 180, b: 233 },
    { name: 'Bluish Green', r: 0, g: 158, b: 115 },
    { name: 'Yellow', r: 240, g: 228, b: 66 },
    { name: 'Blue', r: 0, g: 114, b: 178 },
    { name: 'Vermillion', r: 213, g: 94, b: 0 },
    { name: 'Reddish Purple', r: 204, g: 121, b: 167 }
  ];

  const CONFLICT_THRESHOLD = 35;

  const CVD_TYPES = ['protanopia', 'deuteranopia', 'tritanopia'];
  

  function isGrayWhiteBlack(rgb) {
    const { r, g, b } = rgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    

    if (max < 30) return true;

    if (min > 240) return true;
    

    if (diff < 30) return true;
    
    return false;
  }

  function mixColors(color1, color2) {
    return {
      r: Math.round((color1.r + color2.r) / 2),
      g: Math.round((color1.g + color2.g) / 2),
      b: Math.round((color1.b + color2.b) / 2)
    };
  }
  

  function findReplacementFromPalette(originalColor, allColors, cvdType) {

    const simOriginal = simulateColor(originalColor, cvdType);
    if (!simOriginal) return OKABE_ITO_PALETTE[1];

    const simAllColors = allColors.map(c => simulateColor(c, cvdType)).filter(c => c);
    
    for (const paletteColor of OKABE_ITO_PALETTE) {
      const simPalette = simulateColor(paletteColor, cvdType);
      if (!simPalette) continue;
      
      let allDistinct = true;
      for (const simColor of simAllColors) {
        const dist = colorDistance(simPalette, simColor);
        if (dist < CONFLICT_THRESHOLD) {
          allDistinct = false;
          break;
        }
      }
      
      if (allDistinct) {
        console.log(`[CVD] Found palette replacement: ${paletteColor.name} (${rgbToHex(paletteColor.r, paletteColor.g, paletteColor.b)})`);
        return paletteColor;
      }
    }
    
    console.log(`[CVD] Palette colors insufficient, generating mixed color...`);
    
    for (let i = 0; i < OKABE_ITO_PALETTE.length; i++) {
      for (let j = i + 1; j < OKABE_ITO_PALETTE.length; j++) {
        const mixedColor = mixColors(OKABE_ITO_PALETTE[i], OKABE_ITO_PALETTE[j]);
        const simMixed = simulateColor(mixedColor, cvdType);
        if (!simMixed) continue;
        
        let allDistinct = true;
        for (const simColor of simAllColors) {
          const dist = colorDistance(simMixed, simColor);
          if (dist < CONFLICT_THRESHOLD) {
            allDistinct = false;
            break;
          }
        }
        
        if (allDistinct) {
          console.log(`[CVD] Found mixed color: ${rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b)} (mix of ${OKABE_ITO_PALETTE[i].name} and ${OKABE_ITO_PALETTE[j].name})`);
          return mixedColor;
        }
      }
    }
    
    for (let i = 0; i < OKABE_ITO_PALETTE.length; i++) {
      for (let j = i + 1; j < OKABE_ITO_PALETTE.length; j++) {
        for (let k = j + 1; k < OKABE_ITO_PALETTE.length; k++) {
          const mixed1 = mixColors(OKABE_ITO_PALETTE[i], OKABE_ITO_PALETTE[j]);
          const mixedColor = mixColors(mixed1, OKABE_ITO_PALETTE[k]);
          const simMixed = simulateColor(mixedColor, cvdType);
          if (!simMixed) continue;
          
          let allDistinct = true;
          for (const simColor of simAllColors) {
            const dist = colorDistance(simMixed, simColor);
            if (dist < CONFLICT_THRESHOLD) {
              allDistinct = false;
              break;
            }
          }
          
          if (allDistinct) {
            console.log(`[CVD] Found triple-mixed color: ${rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b)}`);
            return mixedColor;
          }
        }
      }
    }
    
    console.warn(`[CVD] Could not find suitable replacement, using closest palette color (excluding black)`);
    let minDist = Infinity;
    let bestReplacement = OKABE_ITO_PALETTE[1];
    
    for (let i = 1; i < OKABE_ITO_PALETTE.length; i++) {
      const paletteColor = OKABE_ITO_PALETTE[i];
      const dist = colorDistance(originalColor, paletteColor);
      if (dist < minDist) {
        minDist = dist;
        bestReplacement = paletteColor;
      }
    }
    
    return bestReplacement;
  }

  function scanSVGElementsInRoot(root) {
    const elements = [];
    
    try {
      const shapes = root.querySelectorAll('svg path, svg rect, svg circle, svg polygon, svg ellipse, svg polyline, svg line, svg text, svg use');
      
      shapes.forEach(el => {
        try {
          const rect = el.getBoundingClientRect();
          if (!rect || rect.width < 5 || rect.height < 5) {
            return;
          }
          
          const style = window.getComputedStyle(el);
          const fill = style.fill;
          const stroke = style.stroke;
          
          const hasFill = fill && fill !== 'none' && fill !== 'transparent' && fill !== 'rgba(0, 0, 0, 0)';
          const hasStroke = stroke && stroke !== 'none' && stroke !== 'transparent' && stroke !== 'rgba(0, 0, 0, 0)';
          
          if (hasFill || hasStroke) {
            elements.push({ element: el, fill: fill, stroke: stroke });
          }
        } catch (error) {
          console.warn('[CVD] 处理 SVG 元素时出错:', error);
        }
      });
      
      const allNodes = root.querySelectorAll('*');
      for (const node of allNodes) {
        if (node.shadowRoot) {
          const shadowElements = scanSVGElementsInRoot(node.shadowRoot);
          elements.push(...shadowElements);
        }
      }
    } catch (error) {
      console.warn('[CVD] 扫描 SVG 元素时出错:', error);
    }
    
    return elements;
  }

  function parseColorToRgb(colorStr) {
    if (!colorStr) return null;
    
    if (typeof ColorUtils !== 'undefined' && ColorUtils.parseColor) {
      const rgb = ColorUtils.parseColor(colorStr);
      if (rgb && rgb.length >= 3) {
        return { r: rgb[0], g: rgb[1], b: rgb[2] };
      }
    }
    
    const rgbMatch = colorStr.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const parts = rgbMatch[1].split(',').map(s => parseFloat(s.trim()));
      if (parts.length >= 3) {
        return { r: Math.round(parts[0]), g: Math.round(parts[1]), b: Math.round(parts[2]) };
      }
    }
    
    const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorStr);
    if (hexMatch) {
      return {
        r: parseInt(hexMatch[1], 16),
        g: parseInt(hexMatch[2], 16),
        b: parseInt(hexMatch[3], 16)
      };
    }
    
    return null;
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function colorDistance(c1, c2) {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  }

  function simulateColor(rgb, cvdType = 'protanopia') {
    if (!rgb) return null;
    
    if (typeof CVDSimulation !== 'undefined' && CVDSimulation.simulateCVD) {
      const result = CVDSimulation.simulateCVD(rgb, cvdType);
      return result;
    }
    
    const MATRICES = {
      protanopia: [
        [0.56667, 0.43333, 0],
        [0.55833, 0.44167, 0],
        [0, 0.24167, 0.75833]
      ],
      deuteranopia: [
        [0.625, 0.375, 0],
        [0.7, 0.3, 0],
        [0, 0.3, 0.7]
      ],
      tritanopia: [
        [0.95, 0.05, 0],
        [0, 0.43333, 0.56667],
        [0, 0.475, 0.525]
      ]
    };
    
    if (cvdType === 'protanomaly') cvdType = 'protanopia';
    if (cvdType === 'deuteranomaly') cvdType = 'deuteranopia';
    if (cvdType === 'tritanomaly') cvdType = 'tritanopia';
    
    const matrix = MATRICES[cvdType] || MATRICES.protanopia;
    const { r, g, b } = rgb;
    
    return {
      r: Math.min(255, Math.round(r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2])),
      g: Math.min(255, Math.round(r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2])),
      b: Math.min(255, Math.round(r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]))
    };
  }

  function processSeats() {
    colorGroups.clear();
    
    let newFound = 0;
    
    const svgElements = scanSVGElementsInRoot(document);
    
    svgElements.forEach(({ element, fill, stroke }) => {
      if (processedElements.has(element)) return;
      
      const colorStr = fill && fill !== 'none' ? fill : stroke;
      if (!colorStr || colorStr === 'none' || colorStr === 'transparent') return;
      
      const rgb = parseColorToRgb(colorStr);
      if (!rgb) return;
      
      if (isGrayWhiteBlack(rgb)) {
        processedElements.add(element);
        return;
      }
      
      processedElements.add(element);
      newFound++;
      
      const originalFill = element.getAttribute('fill') || fill;
      const originalStyle = element.getAttribute('style') || '';
      originalColors.set(element, { fill: originalFill, style: originalStyle });
      
      const colorKey = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      if (!colorGroups.has(colorKey)) {
        colorGroups.set(colorKey, {
          originalRgb: rgb,
          elements: []
        });
      }
      colorGroups.get(colorKey).elements.push(element);
    });
    
    try {
      const iframes = document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        try {
          const contentDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
          if (contentDoc) {
            const iframeElements = scanSVGElementsInRoot(contentDoc);
            iframeElements.forEach(({ element, fill, stroke }) => {
              if (processedElements.has(element)) return;
              
              const colorStr = fill && fill !== 'none' ? fill : stroke;
              if (!colorStr || colorStr === 'none') return;
              
              const rgb = parseColorToRgb(colorStr);
              if (!rgb) return;
              
              if (isGrayWhiteBlack(rgb)) {
                processedElements.add(element);
                return;
              }
              
              processedElements.add(element);
              newFound++;
              
              const originalFill = element.getAttribute('fill') || fill;
              const originalStyle = element.getAttribute('style') || '';
              originalColors.set(element, { fill: originalFill, style: originalStyle });
              
              const colorKey = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
              if (!colorGroups.has(colorKey)) {
                colorGroups.set(colorKey, {
                  originalRgb: rgb,
                  elements: []
                });
              }
              colorGroups.get(colorKey).elements.push(element);
            });
          }
        } catch (e) {
        }
      }
    } catch (e) {
      console.warn('[CVD] 扫描 iframe 时出错:', e);
    }
    
    if (newFound > 0 && state.enabled && state.recolorMode) {
      console.log(`[CVD] ⚡ Found ${newFound} new colored elements, analyzing conflicts...`);
      analyzeAndFixConflicts();
    }
    
    return newFound;
  }

  function analyzeAndFixConflicts(cvdType = 'protanopia') {
    const groups = Array.from(colorGroups.values());
    
    if (groups.length === 0) {
      console.log('[CVD] No colors to analyze');
      return;
    }
    
    const filteredGroups = groups.filter(g => !isGrayWhiteBlack(g.originalRgb));
    
    if (filteredGroups.length === 0) {
      console.log('[CVD] No colors to analyze (all are gray/white/black)');
      return;
    }
    
    console.log(`[CVD] Starting color conflict analysis using Brettel matrix simulation...`);
    console.log(`[CVD] Total unique colors found: ${filteredGroups.length} (after filtering gray/white/black)`);
    
    const allConflicts = new Map(); // { "rgb(r,g,b)": { replacement: {r,g,b}, cvdTypes: ['protanopia', ...] } }
    
    for (const testCvdType of CVD_TYPES) {
      console.log(`[CVD] Testing ${testCvdType}...`);
      
      const simulatedColors = new Map(); // { "rgb(r,g,b)": {r, g, b} }
      filteredGroups.forEach(g => {
        const key = `rgb(${g.originalRgb.r},${g.originalRgb.g},${g.originalRgb.b})`;
        const simColor = simulateColor(g.originalRgb, testCvdType);
        if (simColor) {
          simulatedColors.set(key, simColor);
        }
      });
      
      const conflicts = [];
      const colorKeys = Array.from(simulatedColors.keys());
      
      for (let i = 0; i < colorKeys.length; i++) {
        for (let j = i + 1; j < colorKeys.length; j++) {
          const keyA = colorKeys[i];
          const keyB = colorKeys[j];
          const simA = simulatedColors.get(keyA);
          const simB = simulatedColors.get(keyB);
          
          if (!simA || !simB) continue;
          
          const dist = colorDistance(simA, simB);
          
          if (dist < CONFLICT_THRESHOLD) {
            conflicts.push({
              colorAKey: keyA,
              colorBKey: keyB,
              colorA: filteredGroups.find(g => `rgb(${g.originalRgb.r},${g.originalRgb.g},${g.originalRgb.b})` === keyA)?.originalRgb,
              colorB: filteredGroups.find(g => `rgb(${g.originalRgb.r},${g.originalRgb.g},${g.originalRgb.b})` === keyB)?.originalRgb,
              distance: dist
            });
          }
        }
      }
      
      if (conflicts.length === 0) {
        console.log(`[CVD] ✅ No conflicts detected for ${testCvdType}`);
        continue;
      }
      
      console.log(`[CVD] ⚠️ Found ${conflicts.length} conflicts for ${testCvdType}`);
      
      conflicts.forEach((conflict, idx) => {
        const { colorAKey, colorBKey, colorA, colorB, distance } = conflict;
        
        console.warn(`⚠️ [CVD] Conflict ${idx + 1} in ${testCvdType}: ${colorAKey} vs ${colorBKey} (distance: ${distance.toFixed(2)})`);
        
        const allOtherColors = filteredGroups
          .filter(g => {
            const key = `rgb(${g.originalRgb.r},${g.originalRgb.g},${g.originalRgb.b})`;
            return key !== colorBKey && !allConflicts.has(key);
          })
          .map(g => g.originalRgb);
        
        const replacement = findReplacementFromPalette(colorB, allOtherColors, testCvdType);
        
        if (!allConflicts.has(colorBKey)) {
          allConflicts.set(colorBKey, {
            replacement: replacement,
            cvdTypes: [testCvdType]
          });
        } else {
          const existing = allConflicts.get(colorBKey);
          existing.cvdTypes.push(testCvdType);
        }
        
        console.log(`✅ [CVD] Replacement for ${colorBKey}: ${rgbToHex(replacement.r, replacement.g, replacement.b)}`);
      });
    }
    
    if (allConflicts.size === 0) {
      console.log(`[CVD] ✅ No color conflicts detected across all CVD types`);
      return;
    }
    
    console.log(`[CVD] ⚠️ Total colors to replace: ${allConflicts.size}`);
    
    let conflictsFixed = 0;
    
    allConflicts.forEach((data, originalColorKey) => {
      const { replacement } = data;
      
      const matchingGroup = filteredGroups.find(g => {
        const key = `rgb(${g.originalRgb.r},${g.originalRgb.g},${g.originalRgb.b})`;
        return key === originalColorKey;
      });
      
      if (!matchingGroup) return;
      
      const replacementHex = rgbToHex(replacement.r, replacement.g, replacement.b);
      
      matchingGroup.elements.forEach(el => {
        try {
          const computed = window.getComputedStyle(el);
          const origStroke = computed ? computed.stroke : el.getAttribute('stroke');
          const origFill = computed ? computed.fill : el.getAttribute('fill');
          
          const hasVisibleStroke = origStroke && origStroke !== 'none' && origStroke !== 'transparent';
          const hasVisibleFill = origFill && origFill !== 'none' && origFill !== 'transparent';
          
          if (hasVisibleStroke) {
            el.style.setProperty('stroke', replacementHex, 'important');
            el.setAttribute('stroke', replacementHex);
          }
          if (hasVisibleFill || !hasVisibleStroke) {
            el.style.setProperty('fill', replacementHex, 'important');
            el.setAttribute('fill', replacementHex);
          }
          
          el.setAttribute('data-cvd-fixed', 'true');
          el.setAttribute('data-cvd-original-color', originalColorKey);
          conflictsFixed++;
        } catch (e) {
        }
      });
    });
    
    console.log(`[CVD] ✅ Total: ${conflictsFixed} elements recolored using Okabe & Ito palette`);
  }

  function findDistinguishableColor(originalColor, allColors, cvdType) {
    const candidates = generateColorCandidates(originalColor, cvdType);
    
    for (const candidate of candidates) {
      let isDistinguishable = true;
      
      for (const pageColor of allColors) {
        if (pageColor === originalColor) continue;
        
        const simCandidate = simulateColor(candidate, cvdType);
        const simPageColor = simulateColor(pageColor, cvdType);
        
        if (!simCandidate || !simPageColor) continue;
        
        const dist = colorDistance(simCandidate, simPageColor);
        
        if (dist < CONFLICT_THRESHOLD) {
          isDistinguishable = false;
          break;
        }
      }
      
      if (isDistinguishable) {
        return candidate;
      }
    }
    
    return getDefaultDistinguishableColor(originalColor, cvdType);
  }
  
  function generateColorCandidates(originalColor, cvdType) {
    const candidates = [];
    const { r, g, b } = originalColor;
    
    if (cvdType === 'protanopia' || cvdType === 'protanomaly') {
      candidates.push(
        { r: Math.max(0, r - 40), g: Math.min(255, g + 60), b: Math.min(255, b + 80) },
        { r: Math.max(0, r - 50), g: Math.min(255, g + 50), b: Math.min(255, b + 100) },
        { r: Math.max(0, r - 30), g: Math.min(255, g + 70), b: Math.min(255, b + 70) }
      );
    } else if (cvdType === 'deuteranopia' || cvdType === 'deuteranomaly') {
      candidates.push(
        { r: Math.min(255, r + 60), g: Math.max(0, g - 40), b: Math.min(255, b + 80) },
        { r: Math.min(255, r + 70), g: Math.max(0, g - 50), b: Math.min(255, b + 70) },
        { r: Math.min(255, r + 50), g: Math.max(0, g - 30), b: Math.min(255, b + 90) }
      );
    } else {
      candidates.push(
        { r: Math.min(255, r + 80), g: Math.min(255, g + 60), b: Math.max(0, b - 40) },
        { r: Math.min(255, r + 70), g: Math.min(255, g + 70), b: Math.max(0, b - 50) },
        { r: Math.min(255, r + 90), g: Math.min(255, g + 50), b: Math.max(0, b - 30) }
      );
    }
    
    return candidates.map(c => ({
      r: Math.max(0, Math.min(255, Math.round(c.r))),
      g: Math.max(0, Math.min(255, Math.round(c.g))),
      b: Math.max(0, Math.min(255, Math.round(c.b)))
    }));
  }
  
  function getDefaultDistinguishableColor(originalColor, cvdType) {
    const { r, g, b } = originalColor;
    
    if (cvdType === 'protanopia' || cvdType === 'protanomaly') {
      return {
        r: Math.max(0, r - 60),
        g: Math.min(255, g + 40),
        b: Math.min(255, b + 120)
      };
    } else if (cvdType === 'deuteranopia' || cvdType === 'deuteranomaly') {
      return {
        r: Math.min(255, r + 120),
        g: Math.max(0, g - 60),
        b: Math.min(255, b + 40)
      };
    } else {
      return {
        r: Math.min(255, r + 100),
        g: Math.min(255, g + 80),
        b: Math.max(0, b - 80)
      };
    }
  }

  function initAutoScanAndFix() {
    function waitForLibraries(callback, maxAttempts = 50) {
      if (maxAttempts <= 0) {
        console.warn('[CVD] 库文件加载超时，使用内置功能');
        callback();
        return;
      }
      
      if (typeof ColorUtils !== 'undefined' && typeof CVDSimulation !== 'undefined') {
        callback();
      } else {
        setTimeout(() => waitForLibraries(callback, maxAttempts - 1), 100);
      }
    }
    
    waitForLibraries(() => {
      console.log('[CVD] 库文件已加载，准备扫描（不自动recolor）');
      
      setTimeout(() => {
        colorGroups.clear();
        const svgElements = scanSVGElementsInRoot(document);
        let newFound = 0;
        svgElements.forEach(({ element, fill, stroke }) => {
          if (processedElements.has(element)) return;
          const colorStr = fill && fill !== 'none' ? fill : stroke;
          if (!colorStr || colorStr === 'none' || colorStr === 'transparent') return;
          const rgb = parseColorToRgb(colorStr);
          if (!rgb) return;
          if (isGrayWhiteBlack(rgb)) {
            processedElements.add(element);
            return;
          }
          processedElements.add(element);
          newFound++;
          const colorKey = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
          if (!colorGroups.has(colorKey)) {
            colorGroups.set(colorKey, {
              originalRgb: rgb,
              elements: []
            });
          }
          colorGroups.get(colorKey).elements.push(element);
        });
        console.log(`[CVD] 首次扫描完成，找到 ${newFound} 个元素（未recolor）`);
      }, 1000);
    });
    
    let observerTimeout;
    const observer = new MutationObserver((mutations) => {
      if (!state.enabled || !state.recolorMode) return;
      
      clearTimeout(observerTimeout);
      observerTimeout = setTimeout(() => {
        if (state.enabled && state.recolorMode) {
          processSeats();
        }
      }, 500);
    });
    
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log('[CVD] MutationObserver 已启动，监控动态加载的内容');
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
  }

  initAutoScanAndFix();
  
  window.__cvdProcessSeats = processSeats;
  window.__cvdAnalyzeAndFix = analyzeAndFixConflicts;

  let state = {
    enabled: false,
    simulationMode: false,
    recolorMode: false,
    cvdType: 'deuteranomaly',
    severity: 0.8,
    autoRecolor: false,
    highlightIssues: false
  };

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'enabled',
        'cvdType',
        'severity',
        'autoRecolor',
        'highlightIssues'
      ]);
      
      if (result.enabled !== undefined) state.enabled = result.enabled;
      if (result.cvdType) state.cvdType = result.cvdType;
      if (result.severity !== undefined) state.severity = result.severity;
      if (result.autoRecolor !== undefined) state.autoRecolor = result.autoRecolor;
      if (result.highlightIssues !== undefined) state.highlightIssues = result.highlightIssues;

    } catch (error) {
      console.log('CVD Assistant: 加载设置失败', error);
    }
  }

  async function saveSettings() {
    try {
      await chrome.storage.sync.set({
        enabled: state.enabled,
        cvdType: state.cvdType,
        severity: state.severity,
        autoRecolor: state.autoRecolor,
        highlightIssues: state.highlightIssues
      });
    } catch (error) {
      console.log('CVD Assistant: 保存设置失败', error);
    }
  }

  function recolorPage() {
    if (!state.enabled) return { recolored: 0 };
    
    state.recolorMode = true;
    
    const count = processSeats();
    
    return { recolored: count };
  }

  function restorePage() {
    let restoredCount = 0;
    colorGroups.forEach((group, colorKey) => {
      group.elements.forEach(el => {
        const original = originalColors.get(el);
        if (original) {
          try {
            if (original.fill) {
              el.setAttribute('fill', original.fill);
              el.style.removeProperty('fill');
            }
            if (original.style) {
              el.setAttribute('style', original.style);
            }
            el.removeAttribute('data-cvd-fixed');
            restoredCount++;
          } catch (e) {
          }
        }
      });
    });
    state.recolorMode = false;
    console.log(`[CVD] Restored ${restoredCount} elements`);
  }

  function applySimulation() {
    if (typeof CVDSimulation === 'undefined') {
      console.warn('[CVD] CVDSimulation not available');
      return;
    }
    
    let filterContainer = document.getElementById('cvd-simulation-filters');
    if (!filterContainer) {
      filterContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      filterContainer.id = 'cvd-simulation-filters';
      filterContainer.style.position = 'absolute';
      filterContainer.style.width = '0';
      filterContainer.style.height = '0';
      document.body.appendChild(filterContainer);
    }
    
    const matrix = CVDSimulation.getSimulationMatrix(state.cvdType);
    const filterId = `cvd-filter-${state.cvdType}`;
    
    let filter = document.getElementById(filterId);
    if (!filter) {
      filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = filterId;
      filterContainer.appendChild(filter);
    }
    
    filter.innerHTML = `
      <feColorMatrix type="matrix" values="
        ${matrix[0][0]} ${matrix[0][1]} ${matrix[0][2]} 0 0
        ${matrix[1][0]} ${matrix[1][1]} ${matrix[1][2]} 0 0
        ${matrix[2][0]} ${matrix[2][1]} ${matrix[2][2]} 0 0
        0 0 0 1 0
      "/>
    `;
    
    document.body.style.filter = `url(#${filterId})`;
    state.simulationMode = true;
    console.log(`[CVD] Applied ${state.cvdType} simulation filter`);
  }

  function removeSimulation() {
    document.body.style.filter = '';
    state.simulationMode = false;
    console.log('[CVD] Removed simulation filter');
  }

  function getIssuesReport() {
    const groups = Array.from(colorGroups.values());
    const issues = [];
    let totalElements = 0;
    
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const groupA = groups[i];
        const groupB = groups[j];
        
        const colorA = groupA.originalRgb;
        const colorB = groupB.originalRgb;
        
        const simA = simulateColor(colorA, state.cvdType);
        const simB = simulateColor(colorB, state.cvdType);
        
        if (!simA || !simB) continue;
        
        const dist = colorDistance(simA, simB);
        const originalDist = colorDistance(colorA, colorB);
        
        if (dist < CONFLICT_THRESHOLD) {
          issues.push({
            color1: rgbToHex(colorA.r, colorA.g, colorA.b),
            color2: rgbToHex(colorB.r, colorB.g, colorB.b),
            originalDistance: originalDist,
            cvdDistance: dist,
            affectedElements: groupA.elements.length + groupB.elements.length
          });
        }
        
        totalElements += groupA.elements.length + groupB.elements.length;
      }
    }
    
    return {
      totalElements: totalElements,
      totalColors: groups.length,
      issueCount: issues.length,
      cvdType: state.cvdType,
      severity: state.severity,
      issues: issues
    };
  }

  function highlightIssues() {
    const report = getIssuesReport();
    report.issues.forEach(issue => {
      colorGroups.forEach((group, colorKey) => {
        const hex = rgbToHex(group.originalRgb.r, group.originalRgb.g, group.originalRgb.b);
        if (hex === issue.color1 || hex === issue.color2) {
          group.elements.forEach(el => {
            el.setAttribute('data-cvd-issue', 'true');
          });
        }
      });
    });
    state.highlightIssues = true;
    console.log(`[CVD] Highlighted ${report.issueCount} color conflicts`);
  }

  function removeHighlights() {
    document.querySelectorAll('[data-cvd-issue]').forEach(el => {
      el.removeAttribute('data-cvd-issue');
    });
    state.highlightIssues = false;
    console.log('[CVD] Removed highlights');
  }

  function analyzeElement(element) {
    const computed = window.getComputedStyle(element);
    const fill = computed.fill || element.getAttribute('fill');
    const stroke = computed.stroke || element.getAttribute('stroke');
    
    const colorStr = fill && fill !== 'none' ? fill : stroke;
    if (!colorStr || colorStr === 'none' || colorStr === 'transparent') {
      return null;
    }
    
    const rgb = parseColorToRgb(colorStr);
    if (!rgb) return null;
    
    const preview = CVDSimulation ? CVDSimulation.generatePreview(rgb) : null;

    return {
      color: rgb,
      preview: preview
    };
  }

  function createTooltip(info, x, y) {
    removeTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'cvd-color-tooltip';
    tooltip.className = 'cvd-tooltip';
    
    const colorHex = rgbToHex(info.color.r, info.color.g, info.color.b);
    
    let previewHtml = '';
    if (info.preview && CVDSimulation) {
      previewHtml = `
        <div class="cvd-tooltip-preview">
          <div class="cvd-tooltip-preview-title">CVD Simulation Preview:</div>
          <div class="cvd-tooltip-preview-row">
            <span>Protanopia:</span>
            <span class="cvd-tooltip-color" style="background:${rgbToHex(info.preview.protanopia.r, info.preview.protanopia.g, info.preview.protanopia.b)}"></span>
          </div>
          <div class="cvd-tooltip-preview-row">
            <span>Deuteranopia:</span>
            <span class="cvd-tooltip-color" style="background:${rgbToHex(info.preview.deuteranopia.r, info.preview.deuteranopia.g, info.preview.deuteranopia.b)}"></span>
          </div>
          <div class="cvd-tooltip-preview-row">
            <span>Tritanopia:</span>
            <span class="cvd-tooltip-color" style="background:${rgbToHex(info.preview.tritanopia.r, info.preview.tritanopia.g, info.preview.tritanopia.b)}"></span>
          </div>
        </div>
      `;
    }

    tooltip.innerHTML = `
      <div class="cvd-tooltip-header">Color Analysis</div>
      <div class="cvd-tooltip-row">
        <span class="cvd-tooltip-label">Color:</span>
        <span class="cvd-tooltip-color" style="background:${colorHex}"></span>
        <span>${colorHex}</span>
      </div>
      ${previewHtml}
    `;

    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y + 15}px`;
    
    document.body.appendChild(tooltip);

    const rect = tooltip.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      tooltip.style.left = `${x - rect.width - 15}px`;
    }
    if (rect.bottom > window.innerHeight) {
      tooltip.style.top = `${y - rect.height - 15}px`;
    }
  }

  function removeTooltip() {
    const existing = document.getElementById('cvd-color-tooltip');
    if (existing) {
      existing.remove();
    }
  }

  let inspectorMode = false;
  let lastInspectedElement = null;

  function enableInspector() {
    inspectorMode = true;
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousemove', onInspectorMouseMove);
    document.addEventListener('click', onInspectorClick, true);
    document.addEventListener('keydown', onInspectorKeyDown);
  }

  function disableInspector() {
    inspectorMode = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', onInspectorMouseMove);
    document.removeEventListener('click', onInspectorClick, true);
    document.removeEventListener('keydown', onInspectorKeyDown);
    removeTooltip();
    if (lastInspectedElement) {
      lastInspectedElement.style.outline = '';
      lastInspectedElement = null;
    }
  }

  function onInspectorMouseMove(e) {
    if (!inspectorMode) return;
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element || element.id === 'cvd-color-tooltip' || element.closest('#cvd-color-tooltip')) {
      return;
    }

    if (lastInspectedElement && lastInspectedElement !== element) {
      lastInspectedElement.style.outline = '';
    }

    lastInspectedElement = element;
    element.style.outline = '2px solid #4a9eff';

    const info = analyzeElement(element);
    if (info) {
      createTooltip(info, e.clientX, e.clientY);
    }
  }

  function onInspectorClick(e) {
    if (!inspectorMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element.id !== 'cvd-color-tooltip' && !element.closest('#cvd-color-tooltip')) {
        const info = analyzeElement(element);
        if (info) {
          chrome.runtime.sendMessage({
            type: 'ELEMENT_ANALYZED',
            data: {
              color: rgbToHex(info.color.r, info.color.g, info.color.b)
            }
          });
        }
    }
  }

  function onInspectorKeyDown(e) {
    if (e.key === 'Escape') {
      disableInspector();
      chrome.runtime.sendMessage({ type: 'INSPECTOR_DISABLED' });
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'GET_STATE':
        sendResponse({ state });
        break;

      case 'SET_STATE':
        Object.assign(state, message.data);
        saveSettings();
        sendResponse({ success: true });
        break;

      case 'ENABLE':
        state.enabled = true;
        saveSettings();
        sendResponse({ success: true });
        break;

      case 'DISABLE':
        state.enabled = false;
        state.recolorMode = false;
        state.simulationMode = false;
        restorePage();
        removeSimulation();
        removeHighlights();
        saveSettings();
        sendResponse({ success: true });
        break;

      case 'SET_CVD_TYPE':
        state.cvdType = message.data.cvdType;
        if (state.simulationMode) {
          applySimulation();
        }
        if (state.recolorMode) {
          restorePage();
          recolorPage();
        }
        saveSettings();
        sendResponse({ success: true });
        break;

      case 'SET_SEVERITY':
        state.severity = message.data.severity;
        if (state.simulationMode) {
          applySimulation();
        }
        if (state.recolorMode) {
          restorePage();
          recolorPage();
        }
        saveSettings();
        sendResponse({ success: true });
        break;

      case 'RECOLOR_PAGE':
        const recolorResult = recolorPage();
        sendResponse({ success: true, result: recolorResult });
        break;

      case 'PROCESS_SEATS':
        const seatCount = processSeats();
        sendResponse({ success: true, count: seatCount });
        break;

      case 'RESTORE_PAGE':
        restorePage();
        sendResponse({ success: true });
        break;

      case 'APPLY_SIMULATION':
        applySimulation();
        sendResponse({ success: true });
        break;

      case 'REMOVE_SIMULATION':
        removeSimulation();
        sendResponse({ success: true });
        break;

      case 'GET_ISSUES_REPORT':
        try {
          const report = getIssuesReport();
          const sanitizedReport = {
            totalElements: report.totalElements || 0,
            totalColors: report.totalColors || 0,
            issueCount: report.issueCount || 0,
            cvdType: report.cvdType,
            severity: report.severity,
            issues: (report.issues || []).map(issue => ({
              color1: issue.color1 || '#000000',
              color2: issue.color2 || '#000000',
              originalDistance: issue.originalDistance || 0,
              cvdDistance: issue.cvdDistance || 0,
              affectedElements: issue.affectedElements || 0
            }))
          };
          sendResponse({ success: true, report: sanitizedReport });
        } catch (error) {
          console.error('[CVD] 获取报告失败:', error);
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'HIGHLIGHT_ISSUES':
        highlightIssues();
        sendResponse({ success: true });
        break;

      case 'REMOVE_HIGHLIGHTS':
        removeHighlights();
        sendResponse({ success: true });
        break;

      case 'ENABLE_INSPECTOR':
        enableInspector();
        sendResponse({ success: true });
        break;

      case 'DISABLE_INSPECTOR':
        disableInspector();
        sendResponse({ success: true });
        break;

      case 'ANALYZE_ELEMENT':
        const x = message.data.x;
        const y = message.data.y;
        const el = document.elementFromPoint(x, y);
        if (el) {
          const analysis = analyzeElement(el);
          sendResponse({ success: true, analysis });
        } else {
          sendResponse({ success: false });
        }
        break;

      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
    
    return true; // 保持消息通道开放
  });

  loadSettings();

  const observer = new MutationObserver((mutations) => {
    if (state.enabled && state.autoRecolor && state.recolorMode) {
      clearTimeout(window.cvdRecolorTimeout);
      window.cvdRecolorTimeout = setTimeout(() => {
        recolorPage();
      }, 500);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  console.log('CVD Color Assistant: 内容脚本已加载');
})();

