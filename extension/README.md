# Quik XML Preview

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/liewstar.quik-preview?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=liewstar.quik-preview)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Quik-181717?style=flat-square&logo=github)](https://github.com/liewstar/Quik)

Real-time preview extension for **Quik XML UI files** in Visual Studio Code.

Quik is a declarative UI framework for Qt that allows you to build beautiful interfaces using simple XML syntax.

![Preview Demo](https://raw.githubusercontent.com/liewstar/Quik/main/docs/preview-demo.gif)

## Features

- 🚀 **Real-time Preview** - Instantly see your UI changes when clicking the preview panel
- 🎨 **WASM Powered** - Uses Qt WebAssembly for accurate native Qt rendering
- ⚡ **Fast & Lightweight** - No external dependencies required
- 🔧 **Easy to Use** - One-click preview with keyboard shortcut support

## Usage

1. Open any `.xml` file containing Quik UI markup
2. Press `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (macOS)
3. Or click the preview icon in the editor title bar
4. Click on the preview panel to refresh with latest changes

## Keyboard Shortcuts

| Command | Windows/Linux | macOS |
|---------|---------------|-------|
| Open Preview | `Ctrl+Shift+V` | `Cmd+Shift+V` |

## Example

```xml
<Window title="Hello Quik" width="400" height="300">
    <VBoxLayout>
        <Label text="Welcome to Quik!" alignment="center"/>
        <Button text="Click Me" onClick="handleClick"/>
    </VBoxLayout>
</Window>
```

## Requirements

- Visual Studio Code 1.74.0 or higher

## About Quik

Quik is a declarative UI framework that brings modern UI development patterns to Qt. Write simple XML, get beautiful native UIs.

- 📖 [Documentation](https://github.com/liewstar/Quik)
- 🐛 [Report Issues](https://github.com/liewstar/Quik/issues)
- ⭐ [Star on GitHub](https://github.com/liewstar/Quik)

## Author

**liewstar** - [GitHub](https://github.com/liewstar)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
