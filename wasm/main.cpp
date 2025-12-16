#include <QApplication>
#include <QWidget>
#include <QVBoxLayout>
#include <QScrollArea>
#include <QDebug>
#include <QFont>
#include <QFontDatabase>
#include <emscripten.h>
#include <emscripten/val.h>
#include "parser/XMLUIBuilder.h"

static QApplication* g_app = nullptr;
static Quik::XMLUIBuilder* g_builder = nullptr;
static QWidget* g_mainWindow = nullptr;
static QScrollArea* g_scrollArea = nullptr;
static QWidget* g_previewWidget = nullptr;

// 通知 JS 端状态变化
void notifyJS(const char* event, const char* message = "") {
    EM_ASM({
        if (window.onQuikEvent) {
            window.onQuikEvent(UTF8ToString($0), UTF8ToString($1));
        }
    }, event, message);
}

// JS 调用：加载 XML 内容
extern "C" EMSCRIPTEN_KEEPALIVE
void loadXmlContent(const char* xmlContent) {
    qDebug() << "[QuikPreview] Loading XML content...";
    
    // 清理旧的预览
    if (g_previewWidget) {
        g_previewWidget->deleteLater();
        g_previewWidget = nullptr;
    }
    
    // 重新创建 builder 以清理旧状态
    if (g_builder) {
        delete g_builder;
    }
    g_builder = new Quik::XMLUIBuilder();
    
    // 连接错误信号
    QObject::connect(g_builder, &Quik::XMLUIBuilder::buildError, [](const QString& error) {
        qWarning() << "[QuikPreview] Build error:" << error;
        notifyJS("error", error.toUtf8().constData());
    });
    
    // 构建 UI
    QString xml = QString::fromUtf8(xmlContent);
    g_previewWidget = g_builder->buildFromString(xml);
    
    if (g_previewWidget) {
        // 设置到滚动区域
        g_scrollArea->setWidget(g_previewWidget);
        g_previewWidget->show();
        
        // 强制更新布局和重绘
        g_previewWidget->adjustSize();
        g_mainWindow->update();
        g_mainWindow->repaint();
        
        notifyJS("loaded", "");
        qDebug() << "[QuikPreview] XML loaded successfully";
    } else {
        notifyJS("error", "Failed to build UI from XML");
    }
}

// JS 调用：调整画布大小
extern "C" EMSCRIPTEN_KEEPALIVE
void resizeCanvas(int width, int height) {
    if (g_mainWindow) {
        g_mainWindow->setFixedSize(width, height);
    }
}

int main(int argc, char *argv[]) {
    g_app = new QApplication(argc, argv);
    
    // 加载中文字体
    int fontId = QFontDatabase::addApplicationFont(":/fonts/NotoSansSC-Regular.ttf");
    if (fontId != -1) {
        QStringList families = QFontDatabase::applicationFontFamilies(fontId);
        if (!families.isEmpty()) {
            QFont font(families.first(), 10);
            g_app->setFont(font);
            qDebug() << "[QuikPreview] Loaded font:" << families.first();
        }
    } else {
        qWarning() << "[QuikPreview] Failed to load Chinese font";
    }
    
    // 设置应用样式
    g_app->setStyle("Fusion");
    
    // 创建主窗口
    g_mainWindow = new QWidget();
    g_mainWindow->setWindowTitle("Quik Preview");
    g_mainWindow->setMinimumSize(400, 300);
    
    // 创建滚动区域
    auto* layout = new QVBoxLayout(g_mainWindow);
    layout->setContentsMargins(0, 0, 0, 0);
    
    g_scrollArea = new QScrollArea();
    g_scrollArea->setWidgetResizable(true);
    g_scrollArea->setFrameShape(QFrame::NoFrame);
    layout->addWidget(g_scrollArea);
    
    // 创建空的占位 widget
    auto* placeholder = new QWidget();
    placeholder->setStyleSheet("background-color: #f5f5f5;");
    g_scrollArea->setWidget(placeholder);
    
    g_mainWindow->show();
    
    // 通知 JS 已准备好
    notifyJS("ready", "");
    qDebug() << "[QuikPreview] Wasm application ready";
    
    return g_app->exec();
}
