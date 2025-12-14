# 🎨 CVD Color Assistant

**智能色觉辅助 Chrome 扩展** - 帮助色觉缺陷用户更好地浏览网页

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ 功能特性

### 🔍 智能检测
- 自动分析网页中所有颜色对（文本/背景、边框等）
- 基于 WCAG 2.0 标准计算对比度
- 识别对色觉缺陷用户不友好的颜色组合

### 👁️ CVD 模拟
- **红色弱 (Protanomaly)**: L锥体功能异常
- **绿色弱 (Deuteranomaly)**: M锥体功能异常
- **蓝黄弱 (Tritanomaly)**: S锥体功能异常
- 可调节模拟强度 (0-100%)
- 基于 Machado 等人的科学模拟算法

### 🎭 智能重新着色
- AI 驱动的颜色优化算法
- 保持原始网页的视觉风格
- 确保所有信息在 CVD 视角下可区分
- 实时颜色调整，无需刷新页面

### 🔬 颜色检查器
- 实时检查任意元素的颜色信息
- 显示文本色、背景色、对比度
- CVD 模拟预览
- WCAG AA/AAA 合规性检查

## 📦 安装方法

### 开发者模式安装

1. 下载或克隆此仓库
   ```bash
   git clone https://github.com/yourusername/cvd-extension.git
   ```

2. 生成图标
   - 打开 `scripts/generate-icons.html`
   - 点击"下载所有图标"
   - 将下载的 PNG 文件放入 `icons` 文件夹

3. 加载扩展
   - 打开 Chrome，访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `cvd-extension` 文件夹

## 🚀 使用指南

### 基本使用

1. 点击浏览器工具栏中的扩展图标
2. 打开主开关启用扩展
3. 选择你的色觉缺陷类型
4. 调整模拟强度
5. 点击"智能重新着色"优化页面颜色

### 功能按钮

| 按钮 | 功能 |
|------|------|
| 🎭 智能重新着色 | 自动优化页面颜色，提高可读性 |
| 👓 模拟视觉 | 查看色弱用户看到的页面效果 |
| 🔍 颜色检查器 | 检查特定元素的颜色信息 |
| ⚠️ 高亮问题 | 标记页面中存在问题的颜色区域 |
| ↩️ 恢复原始颜色 | 撤销所有更改 |

### 设置选项

- **自动重新着色**: 在新页面加载时自动应用颜色优化
- **记住我的选择**: 保存你的偏好设置

## 🧪 技术原理

### CVD 模拟算法

本扩展使用基于 **Machado et al. (2009)** 的色觉缺陷模拟算法，该算法基于人眼锥体细胞的物理模型：

```
模拟颜色 = 变换矩阵 × 原始颜色 (RGB)
```

变换矩阵根据色觉缺陷类型和严重程度动态计算。

### 颜色优化策略

1. **色相偏移**: 将难以区分的颜色向可区分的方向偏移
2. **亮度增强**: 增加颜色对之间的亮度差异
3. **饱和度调整**: 适当增加饱和度以增强区分度
4. **风格保持**: 使用 Delta E 算法控制调整幅度，保持原始视觉风格

## 📁 项目结构

```
cvd-extension/
├── manifest.json           # 扩展配置
├── popup/                   # 弹出窗口
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/                 # 内容脚本
│   ├── content.js          # 主脚本
│   ├── content.css         # 样式
│   ├── cvd-simulation.js   # CVD 模拟算法
│   └── recolor-engine.js   # 重新着色引擎
├── background/              # 后台服务
│   └── service-worker.js
├── lib/                     # 工具库
│   └── color-utils.js      # 颜色转换工具
├── icons/                   # 扩展图标
│   ├── icon.svg
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── scripts/                 # 辅助脚本
│   └── generate-icons.html
└── README.md
```

## 🎨 颜色科学参考

- [WCAG 2.0 对比度指南](https://www.w3.org/TR/WCAG20/)
- [Machado et al. - A Physiologically-based Model for Simulation of Color Vision Deficiency](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)
- [Brettel et al. - Computerized simulation of color appearance for dichromats](https://vision.psychol.cam.ac.uk/jdmollon/papers/coloursimulations.pdf)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢所有色觉科学研究者的贡献
- 感谢开源社区的支持

---

**让网页对每个人都友好** 🌈

