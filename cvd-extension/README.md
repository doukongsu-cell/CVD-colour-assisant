# Color Accessibility Extension - CVD Assistant

Chrome Extension - Color Vision Deficiency Accessibility Assistant

## Project Path

```
C:\Users\xinch\Desktop\color-accessibility-extension\
```

## Load Extension in Chrome (Development Mode)

### Steps:

1. Open Chrome browser
2. Navigate to `chrome://extensions/` or `edge://extensions/`
3. Enable **"Developer mode"** in the top right corner
4. Click **"Load unpacked"**
5. Select the following folder:

```
C:\Users\xinch\Desktop\color-accessibility-extension
```

**Important**: You must select the folder that contains `manifest.json`, which is the `color-accessibility-extension` folder itself.

## Package Extension (For Distribution)

### Method 1: Using Chrome Extension Management Page

1. Open `chrome://extensions/`
2. Enable **"Developer mode"**
3. Find your extension and click **"Pack extension"**
4. In **"Extension root directory"**, select:
   ```
   C:\Users\xinch\Desktop\color-accessibility-extension
   ```
5. Leave **"Private key file"** empty (first time packaging) or select an existing `.pem` file
6. Click **"Pack extension"**

After packaging, the following files will be generated in the **parent directory** of the extension root (i.e., `C:\Users\xinch\Desktop\`):
- `color-accessibility-extension.crx` - Extension package (can be distributed to users)
- `color-accessibility-extension.pem` - Private key file (**Important! Please keep this safe, needed for future updates**)

### Method 2: Manual ZIP Packaging

1. Right-click the `color-accessibility-extension` folder
2. Select **"Send to"** → **"Compressed (zipped) folder"**
3. Rename the generated `.zip` file to `.crx` (optional, or distribute the `.zip` file directly)

## Project File Structure

```
color-accessibility-extension/
├── manifest.json              Extension configuration file (must be in root directory)
├── background/
│   └── background.js
├── content/
│   ├── content.js
│   └── content.css
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── lib/
│   ├── color-utils.js
│   └── color-blind-simulator.js
├── icons/                     (Icon files)
├── scripts/
└── test/
```

## Important Notes

1. **When loading extension**: You must select the folder that contains `manifest.json`
2. **When packaging extension**: Also select the folder that contains `manifest.json`
3. **Do not select subfolders** (such as `lib/` or `content/`), otherwise loading will fail
4. **The `.pem` file after packaging**: Please keep it safe, you will need the same key for extension updates

## Update Extension

If you have already distributed the extension, when updating later you need to:
1. Use the **same `.pem` key file** for packaging
2. Or have users uninstall the old version and reinstall the new version

## Verify Extension Loaded Successfully

1. Open the extension management page, you should see your extension in the extension list
2. Check console logs: Open Developer Tools (F12), you should see:
   ```
   [CVD] Script injected in Frame: ...
   [ContentScript] Content script loaded
   ```
