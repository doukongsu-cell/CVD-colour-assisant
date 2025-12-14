/**
 * CVD Color Assistant - Popup Script
 * Controls the extension's user interface interactions
 */

(function() {
  'use strict';

  // DOM element references
  const elements = {
    enableToggle: document.getElementById('enableToggle'),
    cvdTypes: document.querySelectorAll('input[name="cvdType"]'),
    severitySlider: document.getElementById('severitySlider'),
    severityValue: document.getElementById('severityValue'),
    recolorBtn: document.getElementById('recolorBtn'),
    simulateBtn: document.getElementById('simulateBtn'),
    inspectorBtn: document.getElementById('inspectorBtn'),
    highlightBtn: document.getElementById('highlightBtn'),
    restoreBtn: document.getElementById('restoreBtn'),
    reportContent: document.getElementById('reportContent'),
    refreshReport: document.getElementById('refreshReport'),
    autoRecolor: document.getElementById('autoRecolor'),
    rememberSettings: document.getElementById('rememberSettings'),
    previewSection: document.getElementById('previewSection'),
    previewContent: document.getElementById('previewContent')
  };

  // Current state
  let state = {
    enabled: false,
    simulationMode: false,
    recolorMode: false,
    inspectorMode: false,
    highlightMode: false,
    cvdType: 'deuteranomaly',
    severity: 0.8
  };

  // Get current active tab
  async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  // Send message to content script
  async function sendMessage(type, data = {}) {
    try {
      const tab = await getCurrentTab();
      if (!tab || !tab.id) {
        console.error('Unable to get current tab');
        return null;
      }
      
      // 检查是否是特殊页面
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        showNotification('Extension features are not available on this page', 'warning');
        return null;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { type, data });
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Try to inject content script
      try {
        const tab = await getCurrentTab();
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [
            'lib/color-utils.js',
            'content/cvd-simulation.js',
            'content/content.js'
          ]
        });
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content/content.css']
        });
        // Retry sending message
        const response = await chrome.tabs.sendMessage(tab.id, { type, data });
        return response;
      } catch (injectError) {
        console.error('Failed to inject script:', injectError);
        return null;
      }
    }
  }

  // Load settings
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'enabled',
        'cvdType',
        'severity',
        'autoRecolor',
        'rememberSettings'
      ]);

      if (result.enabled !== undefined) {
        state.enabled = result.enabled;
        elements.enableToggle.checked = result.enabled;
      }

      if (result.cvdType) {
        state.cvdType = result.cvdType;
        document.querySelector(`input[value="${result.cvdType}"]`).checked = true;
      }

      if (result.severity !== undefined) {
        state.severity = result.severity;
        elements.severitySlider.value = result.severity * 100;
        elements.severityValue.textContent = `${Math.round(result.severity * 100)}%`;
      }

      if (result.autoRecolor !== undefined) {
        elements.autoRecolor.checked = result.autoRecolor;
      }

      if (result.rememberSettings !== undefined) {
        elements.rememberSettings.checked = result.rememberSettings;
      }

      // Get current state from content script
      const response = await sendMessage('GET_STATE');
      if (response && response.state) {
        state = { ...state, ...response.state };
        updateUIState();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  // Save settings
  async function saveSettings() {
    if (!elements.rememberSettings.checked) return;
    
    try {
      await chrome.storage.sync.set({
        enabled: state.enabled,
        cvdType: state.cvdType,
        severity: state.severity,
        autoRecolor: elements.autoRecolor.checked,
        rememberSettings: elements.rememberSettings.checked
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  // Update UI state
  function updateUIState() {
    // Update button states
    if (state.simulationMode) {
      elements.simulateBtn.classList.add('active');
      elements.simulateBtn.querySelector('.btn-text').textContent = 'Turn Off Simulation';
    } else {
      elements.simulateBtn.classList.remove('active');
      elements.simulateBtn.querySelector('.btn-text').textContent = 'Simulate Vision';
    }

    if (state.recolorMode) {
      elements.recolorBtn.classList.add('active');
      elements.recolorBtn.querySelector('.btn-text').textContent = 'Recolored';
    } else {
      elements.recolorBtn.classList.remove('active');
      elements.recolorBtn.querySelector('.btn-text').textContent = 'Smart Recolor';
    }

    if (state.inspectorMode) {
      elements.inspectorBtn.classList.add('active');
      elements.inspectorBtn.querySelector('.btn-text').textContent = 'Turn Off Inspector';
    } else {
      elements.inspectorBtn.classList.remove('active');
      elements.inspectorBtn.querySelector('.btn-text').textContent = 'Color Inspector';
    }

    if (state.highlightMode) {
      elements.highlightBtn.classList.add('active');
      elements.highlightBtn.querySelector('.btn-text').textContent = 'Turn Off Highlight';
    } else {
      elements.highlightBtn.classList.remove('active');
      elements.highlightBtn.querySelector('.btn-text').textContent = 'Highlight Issues';
    }

    // Disable/enable buttons
    const actionBtns = document.querySelectorAll('.action-btn, .restore-btn');
    actionBtns.forEach(btn => {
      if (state.enabled) {
        btn.classList.remove('disabled');
      } else {
        btn.classList.add('disabled');
      }
    });
  }

  // Load issue report
  async function loadReport() {
    elements.reportContent.innerHTML = `
      <div class="report-loading">
        <div class="spinner"></div>
        <span>Analyzing...</span>
      </div>
    `;

    const response = await sendMessage('GET_ISSUES_REPORT');
    
    if (!response || !response.success) {
      elements.reportContent.innerHTML = `
        <div class="no-issues">
          <span class="icon">❌</span>
          Unable to analyze page
        </div>
      `;
      return;
    }

    const report = response.report;
    
    if (report.issueCount === 0) {
      elements.reportContent.innerHTML = `
        <div class="no-issues">
          <span class="icon">✨</span>
          <div>Great! No color issues found</div>
        </div>
      `;
      return;
    }

    let issuesHtml = '';
    const topIssues = report.issues.slice(0, 5);
    
    topIssues.forEach(issue => {
      // Determine severity: distance < 8 is error, < 15 is warning
      const cvdDistance = issue.cvdDistance || 0;
      const severity = cvdDistance < 8 ? 'error' : 'warning';
      
      issuesHtml += `
        <div class="issue-item ${severity}">
          <div class="issue-colors">
            <div class="color-swatch" style="background: ${issue.color1}"></div>
            <div class="color-swatch" style="background: ${issue.color2}"></div>
          </div>
          <div class="issue-info">
            <div class="issue-title">Indistinguishable after CVD!</div>
            <div class="issue-detail">RGB Distance: ${(issue.originalDistance || 0).toFixed(0)} → ${cvdDistance.toFixed(0)}</div>
          </div>
          <div class="issue-count">${issue.affectedElements || 0} elements</div>
        </div>
      `;
    });

    const errorCount = report.issues.filter(i => (i.cvdDistance || 0) < 8).length;
    const warningCount = report.issues.length - errorCount;

    elements.reportContent.innerHTML = `
      <div class="report-summary">
        <div class="report-stat">
          <div class="stat-value">${report.totalElements || 0}</div>
          <div class="stat-label">Elements Analyzed</div>
        </div>
        <div class="report-stat">
          <div class="stat-value error">${errorCount}</div>
          <div class="stat-label">Severe Conflicts</div>
        </div>
        <div class="report-stat">
          <div class="stat-value warning">${warningCount}</div>
          <div class="stat-label">Minor Conflicts</div>
        </div>
      </div>
      <div class="issue-list">
        ${issuesHtml}
      </div>
      ${report.issues.length > 5 ? `<div style="text-align: center; color: var(--text-muted); font-size: 11px; margin-top: 10px;">${report.issues.length - 5} more issues...</div>` : ''}
    `;
  }

  // Show notification
  function showNotification(message, type = 'info') {
    // Can add notification logic here
    console.log(`[${type}] ${message}`);
  }

  // Event listeners

  // Main toggle - 控制所有功能
  elements.enableToggle.addEventListener('change', async (e) => {
    state.enabled = e.target.checked;
    
    if (state.enabled) {
      // 打开时：启用功能
      await sendMessage('ENABLE');
      loadReport();
    } else {
      // 关闭时：关闭所有功能（simulation和recolor）
      await sendMessage('DISABLE');
      await sendMessage('REMOVE_SIMULATION');
      await sendMessage('RESTORE_PAGE');
      state.simulationMode = false;
      state.recolorMode = false;
      state.inspectorMode = false;
      state.highlightMode = false;
      showNotification('All features disabled', 'info');
    }
    
    updateUIState();
    saveSettings();
  });

  // CVD type selection
  elements.cvdTypes.forEach(radio => {
    radio.addEventListener('change', async (e) => {
      state.cvdType = e.target.value;
      await sendMessage('SET_CVD_TYPE', { cvdType: state.cvdType });
      saveSettings();
      
      if (state.enabled) {
        loadReport();
      }
    });
  });

  // Severity slider
  elements.severitySlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    elements.severityValue.textContent = `${value}%`;
  });

  elements.severitySlider.addEventListener('change', async (e) => {
    state.severity = parseInt(e.target.value) / 100;
    await sendMessage('SET_SEVERITY', { severity: state.severity });
    saveSettings();
    
    if (state.enabled) {
      loadReport();
    }
  });

  // Recolor button - Toggle functionality
  elements.recolorBtn.addEventListener('click', async () => {
    if (!state.enabled) return;
    
    if (state.recolorMode) {
      // 如果已经recolor，点击后恢复
      await sendMessage('RESTORE_PAGE');
      state.recolorMode = false;
      showNotification('Restored original colors', 'info');
    } else {
      // 如果未recolor，点击后开始recolor
      const response = await sendMessage('RECOLOR_PAGE');
      if (response && response.success) {
        state.recolorMode = true;
        showNotification(`Optimized ${response.result?.recolored || 0} elements`, 'success');
      }
    }
    
    updateUIState();
  });

  // Simulate button
  elements.simulateBtn.addEventListener('click', async () => {
    if (!state.enabled) return;
    
    if (state.simulationMode) {
      await sendMessage('REMOVE_SIMULATION');
      state.simulationMode = false;
    } else {
      await sendMessage('APPLY_SIMULATION');
      state.simulationMode = true;
    }
    
    updateUIState();
  });

  // Inspector button
  elements.inspectorBtn.addEventListener('click', async () => {
    if (!state.enabled) return;
    
    if (state.inspectorMode) {
      await sendMessage('DISABLE_INSPECTOR');
      state.inspectorMode = false;
    } else {
      await sendMessage('ENABLE_INSPECTOR');
      state.inspectorMode = true;
    }
    
    updateUIState();
  });

  // Highlight button
  elements.highlightBtn.addEventListener('click', async () => {
    if (!state.enabled) return;
    
    if (state.highlightMode) {
      await sendMessage('REMOVE_HIGHLIGHTS');
      state.highlightMode = false;
    } else {
      await sendMessage('HIGHLIGHT_ISSUES');
      state.highlightMode = true;
    }
    
    updateUIState();
  });

  // Restore button
  elements.restoreBtn.addEventListener('click', async () => {
    if (!state.enabled) return;
    
    await sendMessage('RESTORE_PAGE');
    await sendMessage('REMOVE_SIMULATION');
    await sendMessage('REMOVE_HIGHLIGHTS');
    await sendMessage('DISABLE_INSPECTOR');
    
    state.recolorMode = false;
    state.simulationMode = false;
    state.highlightMode = false;
    state.inspectorMode = false;
    
    updateUIState();
    showNotification('Restored original colors', 'info');
  });

  // Refresh report
  elements.refreshReport.addEventListener('click', () => {
    if (state.enabled) {
      loadReport();
    }
  });

  // Auto recolor setting
  elements.autoRecolor.addEventListener('change', async (e) => {
    await sendMessage('SET_STATE', { autoRecolor: e.target.checked });
    saveSettings();
  });

  // Remember settings
  elements.rememberSettings.addEventListener('change', () => {
    saveSettings();
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'INSPECTOR_DISABLED':
        state.inspectorMode = false;
        updateUIState();
        break;
      
      case 'ELEMENT_ANALYZED':
        showElementPreview(message.data);
        break;
    }
  });

  // Show element preview
  function showElementPreview(data) {
    elements.previewSection.style.display = 'block';

    elements.previewContent.innerHTML = `
      <div class="preview-colors">
        <div class="preview-color-item">
          <div class="preview-swatch" style="background: ${data.color}"></div>
          <div class="preview-hex">${data.color}</div>
        </div>
      </div>
      <div style="font-size: 13px; margin-top: 10px;">
        Color analyzed using CVD simulation
      </div>
    `;
  }

  // Initialize
  loadSettings();

  // Delay loading report (wait for content script to be ready)
  setTimeout(() => {
    if (state.enabled) {
      loadReport();
    }
  }, 300);
})();

