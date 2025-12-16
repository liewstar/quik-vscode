# Quik VSCode Preview Extension

VSCode 插件，用于实时预览 Quik XML 界面文件。

## 项目结构

```
quik-vscode/
├── wasm/                    # Qt WebAssembly 预览应用
│   ├── QuikPreview.pro
│   ├── main.cpp
│   └── build/               # 编译输出 (wasm, js)
├── extension/               # VSCode 插件
│   ├── src/
│   │   └── extension.ts
│   ├── wasm/                # Wasm 产物（构建后复制到这里）
│   ├── package.json
│   └── tsconfig.json
├── build-wasm.bat           # Windows 构建脚本
└── README.md
```

---

## 环境准备（仅开发者需要）

### 1. 安装 Qt 6.x with WebAssembly

**方法一：Qt 在线安装器**
1. 下载 [Qt Online Installer](https://www.qt.io/download-qt-installer)
2. 安装时勾选：
   - Qt 6.6.x (或更高版本)
   - WebAssembly (single-threaded)

**方法二：使用 aqtinstall（命令行）**
```bash
pip install aqtinstall
aqt install-qt windows desktop 6.6.0 wasm_singlethread -m qtxml
```

### 2. 安装 Emscripten SDK

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
```

Windows 下需要将 emsdk 路径添加到环境变量，或每次运行 `emsdk_env.bat`。

### 3. 安装 Node.js

下载安装 [Node.js](https://nodejs.org/) (LTS 版本)

---

## 构建步骤

### 步骤 1：编译 Wasm 预览应用

**Windows:**
1. 编辑 `build-wasm.bat`，修改 `QT_WASM_PATH` 和 `EMSDK_PATH` 为你的实际路径
2. 双击运行 `build-wasm.bat`

**手动编译:**
```bash
# 设置 Emscripten 环境
source /path/to/emsdk/emsdk_env.sh

# 编译
cd wasm
mkdir build && cd build
/path/to/qt/6.6.0/wasm_singlethread/bin/qmake ../QuikPreview.pro
make -j4

# 复制产物到插件目录
cp quik-preview.js quik-preview.wasm qtloader.js ../../extension/wasm/
```

### 步骤 2：构建 VSCode 插件

```bash
cd extension
npm install
npm run compile
```

### 步骤 3：打包插件

```bash
cd extension
npx vsce package
```

生成 `quik-preview-0.1.0.vsix` 文件。

---

## 安装与使用

### 安装插件

**方法一：从 VSIX 安装**
1. 打开 VSCode
2. `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. 选择生成的 `.vsix` 文件

**方法二：开发模式**
1. 在 VSCode 中打开 `extension` 文件夹
2. 按 `F5` 启动调试

### 使用方法

1. 打开任意 Quik `.xml` 文件
2. 使用以下任一方式打开预览：
   - 快捷键 `Ctrl+Shift+V`
   - 命令面板 `Quik: Preview XML`
   - 点击编辑器右上角的预览图标
3. 编辑 XML 时预览会实时更新

---

## 注意事项

- 首次加载预览可能需要 3-5 秒（加载 Wasm）
- 插件体积约 20-40MB（包含 Qt 运行时）
- 预览效果与实际 Qt 渲染完全一致
