QT += core gui widgets xml

CONFIG += c++17

TARGET = quik-preview
TEMPLATE = app

# Quik 库源码（直接包含，避免链接问题）
INCLUDEPATH += \
    $$PWD/../../quik-code/include \
    $$PWD/../../quik-code/src

HEADERS += \
    $$PWD/../../quik-code/include/Quik/QuikAPI.h \
    $$PWD/../../quik-code/include/Quik/Quik.h \
    $$PWD/../../quik-code/src/core/QuikContext.h \
    $$PWD/../../quik-code/src/core/QuikViewModel.h \
    $$PWD/../../quik-code/src/parser/ExpressionParser.h \
    $$PWD/../../quik-code/src/parser/XMLUIBuilder.h \
    $$PWD/../../quik-code/src/widget/WidgetFactory.h

SOURCES += \
    main.cpp

RESOURCES += \
    fonts.qrc

SOURCES += \
    $$PWD/../../quik-code/src/core/QuikContext.cpp \
    $$PWD/../../quik-code/src/core/QuikViewModel.cpp \
    $$PWD/../../quik-code/src/parser/ExpressionParser.cpp \
    $$PWD/../../quik-code/src/parser/XMLUIBuilder.cpp \
    $$PWD/../../quik-code/src/widget/WidgetFactory.cpp

# WebAssembly 特定配置
QMAKE_LFLAGS += -s EXPORTED_FUNCTIONS=_main,_loadXmlContent,_resizeCanvas,_malloc,_free
QMAKE_LFLAGS += -s EXPORTED_RUNTIME_METHODS=ccall,cwrap,UTF8ToString,stringToUTF8,lengthBytesUTF8
QMAKE_LFLAGS += -s ALLOW_MEMORY_GROWTH=1
