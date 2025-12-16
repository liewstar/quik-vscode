<div align="center">

# ⚡ Quik VSCode Preview

**Real-time preview for Quik XML UI files in VSCode**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![VSCode](https://img.shields.io/badge/VSCode-1.80+-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/) [![Qt](https://img.shields.io/badge/Qt-6.x_WebAssembly-41CD52?logo=qt&logoColor=white)](https://www.qt.io/)

[🚀 Install](#installation--usage) · [🔧 Build](#build-steps) · [📖 Docs](https://liewstar.github.io/quik-docs/)

English | [中文](README.md)

</div>

---

A VSCode extension for real-time preview of Quik XML interface files.

## Project Structure

```
quik-vscode/
├── wasm/                    # Qt WebAssembly preview app
│   ├── QuikPreview.pro
│   ├── main.cpp
│   └── build/               # Build output (wasm, js)
├── extension/               # VSCode extension
│   ├── src/
│   │   └── extension.ts
│   ├── wasm/                # Wasm artifacts (copied here after build)
│   ├── package.json
│   └── tsconfig.json
├── build-wasm.bat           # Windows build script
└── README.md
```

---

## Environment Setup (Developers Only)

### 1. Install Qt 6.x with WebAssembly

**Method 1: Qt Online Installer**
1. Download [Qt Online Installer](https://www.qt.io/download-qt-installer)
2. During installation, select:
   - Qt 6.6.x (or higher)
   - WebAssembly (single-threaded)

**Method 2: Using aqtinstall (Command Line)**
```bash
pip install aqtinstall
aqt install-qt windows desktop 6.6.0 wasm_singlethread -m qtxml
```

### 2. Install Emscripten SDK

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
```

On Windows, add emsdk path to environment variables, or run `emsdk_env.bat` each time.

### 3. Install Node.js

Download and install [Node.js](https://nodejs.org/) (LTS version)

---

## Build Steps

### Step 1: Compile Wasm Preview App

**Windows:**
1. Edit `build-wasm.bat`, modify `QT_WASM_PATH` and `EMSDK_PATH` to your actual paths
2. Double-click to run `build-wasm.bat`

**Manual Build:**
```bash
# Set up Emscripten environment
source /path/to/emsdk/emsdk_env.sh

# Build
cd wasm
mkdir build && cd build
/path/to/qt/6.6.0/wasm_singlethread/bin/qmake ../QuikPreview.pro
make -j4

# Copy artifacts to extension directory
cp quik-preview.js quik-preview.wasm qtloader.js ../../extension/wasm/
```

### Step 2: Build VSCode Extension

```bash
cd extension
npm install
npm run compile
```

### Step 3: Package Extension

```bash
cd extension
npx vsce package
```

This generates `quik-preview-0.1.0.vsix` file.

---

## Installation & Usage

### Install Extension

**Method 1: Install from VSIX**
1. Open VSCode
2. `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. Select the generated `.vsix` file

**Method 2: Development Mode**
1. Open the `extension` folder in VSCode
2. Press `F5` to start debugging

### Usage

1. Open any Quik `.xml` file
2. Open preview using any of these methods:
   - Shortcut `Ctrl+Shift+V`
   - Command palette `Quik: Preview XML`
   - Click the preview icon in the top right corner of the editor
3. Preview updates in real-time as you edit the XML

---

## Notes

- First load may take 3-5 seconds (loading Wasm)
- Extension size is approximately 20-40MB (includes Qt runtime)
- Preview rendering is identical to actual Qt rendering

---

## 📄 License

This project is open source under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

| Project | Description | Links |
|---------|-------------|-------|
| **Quik** | Core Framework | [GitHub](https://github.com/liewstar/quik) |
| **Quik Docs** | Official Documentation | [GitHub](https://github.com/liewstar/quik-docs) · [Online Docs](https://liewstar.github.io/quik-docs/) |
| **Quik VSCode** | VSCode Preview Extension | [GitHub](https://github.com/liewstar/quik-vscode) |
