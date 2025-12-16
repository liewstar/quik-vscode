"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let currentPanel = undefined;
let currentDocument = undefined;
let httpServer = undefined;
let serverPort = 0;
function activate(context) {
    console.log('Quik Preview extension activated');
    // 启动 HTTP 服务器（仅用于提供 wasm 文件）
    startHttpServer(context);
    // 注册预览命令
    const previewCommand = vscode.commands.registerCommand('quik.preview', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        const document = editor.document;
        if (!document.fileName.endsWith('.xml')) {
            vscode.window.showErrorMessage('Not an XML file');
            return;
        }
        showPreview(context, document);
    });
    context.subscriptions.push(previewCommand);
    // 监听编辑器切换，记录当前文档（不自动刷新）
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.fileName.endsWith('.xml')) {
            currentDocument = editor.document;
        }
    });
}
function startHttpServer(context) {
    const wasmDir = path.join(context.extensionPath, 'wasm');
    httpServer = http.createServer((req, res) => {
        const url = (req.url || '/').split('?')[0];
        const fileName = url === '/' ? 'index.html' : url.substring(1);
        const filePath = path.join(wasmDir, fileName);
        const extname = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.wasm': 'application/wasm',
            '.css': 'text/css',
            '.ttf': 'font/ttf',
            '.svg': 'image/svg+xml'
        };
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found: ' + url);
                return;
            }
            res.writeHead(200, {
                'Content-Type': contentTypes[extname] || 'application/octet-stream',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        });
    });
    httpServer.listen(0, '127.0.0.1', () => {
        const addr = httpServer.address();
        if (addr && typeof addr !== 'string') {
            serverPort = addr.port;
            console.log(`Quik wasm server: http://127.0.0.1:${serverPort}`);
        }
    });
}
function showPreview(context, document) {
    const column = vscode.ViewColumn.Beside;
    // 保存当前文档引用
    currentDocument = document;
    // 确保服务器已启动
    if (serverPort === 0) {
        vscode.window.showErrorMessage('Quik Preview server starting, please try again...');
        return;
    }
    // 如果已有面板，直接显示（保持焦点在编辑器）
    if (currentPanel) {
        currentPanel.reveal(column, true);
        currentPanel.webview.postMessage({
            type: 'updateXml',
            content: document.getText()
        });
        return;
    }
    // 获取资源 URI - 使用 HTTP 服务器提供 wasm 相关文件
    const serverUrl = `http://127.0.0.1:${serverPort}`;
    // 创建新面板（不抢夺焦点）
    currentPanel = vscode.window.createWebviewPanel('quikPreview', 'Quik Preview', { viewColumn: column, preserveFocus: true }, {
        enableScripts: true,
        retainContextWhenHidden: true
    });
    currentPanel.webview.html = getWebviewContent(serverUrl, document.getText());
    // 监听面板关闭
    currentPanel.onDidDispose(() => {
        currentPanel = undefined;
        currentDocument = undefined;
    });
    // 监听面板获得焦点时刷新内容
    currentPanel.onDidChangeViewState(e => {
        if (e.webviewPanel.active && currentDocument) {
            // 面板变为活动状态时，发送最新的 XML 内容
            e.webviewPanel.webview.postMessage({
                type: 'updateXml',
                content: currentDocument.getText()
            });
        }
    });
    // 监听来自 webview 的消息
    currentPanel.webview.onDidReceiveMessage(message => {
        if (message.type === 'error') {
            vscode.window.showErrorMessage(`Quik Preview: ${message.text}`);
        }
    });
}
function getWebviewContent(serverUrl, initialXml) {
    // 转义 XML 内容中的特殊字符
    const escapedXml = initialXml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quik Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { width: 100vw; height: 100vh; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe id="preview" src="${serverUrl}/preview.html"></iframe>
    <script>
        const vscode = acquireVsCodeApi();
        let lastXml = \`${escapedXml}\`;
        
        // 监听来自扩展的消息（Ctrl+S 保存时触发）
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'updateXml') {
                lastXml = message.content;
                const iframe = document.getElementById('preview');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'loadXml', content: lastXml }, '*');
                }
            }
        });
        
        // iframe 加载完成后发送初始 XML
        document.getElementById('preview').onload = function() {
            setTimeout(function() {
                const iframe = document.getElementById('preview');
                if (iframe && iframe.contentWindow && lastXml) {
                    iframe.contentWindow.postMessage({ type: 'loadXml', content: lastXml }, '*');
                }
            }, 1000);
        };
    </script>
</body>
</html>`;
}
function deactivate() {
    if (currentPanel) {
        currentPanel.dispose();
    }
    if (httpServer) {
        httpServer.close();
    }
}
//# sourceMappingURL=extension.js.map