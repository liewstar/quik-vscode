@echo off
REM Quik Preview Wasm 构建脚本 (Windows)
REM 
REM 使用前请确保：
REM 1. 已安装 Qt 6.x with WebAssembly 组件
REM 2. 已安装 Emscripten SDK 3.1.25
REM 3. 修改下面的路径为你的实际路径

REM ========== 配置区域 ==========
SET QT_WASM_PATH=D:\qt\6.5.3\wasm_singlethread
SET EMSDK_PATH=D:\emsdk
SET SCRIPT_DIR=%~dp0
REM ==============================

echo ========================================
echo Quik Preview Wasm Build Script
echo ========================================
echo.

echo [1/4] Setting up Emscripten environment...
call %EMSDK_PATH%\emsdk_env.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to setup Emscripten environment
    pause
    exit /b 1
)

echo [2/4] Running qmake...
cd /d %SCRIPT_DIR%wasm
if not exist build mkdir build
cd build

call %QT_WASM_PATH%\bin\qmake6.bat ..\QuikPreview.pro
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: qmake failed
    pause
    exit /b 1
)

echo [3/4] Building...
make -j4
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo [4/4] Copying to extension folder...
copy /Y quik-preview.js %SCRIPT_DIR%extension\wasm\
copy /Y quik-preview.wasm %SCRIPT_DIR%extension\wasm\
copy /Y qtloader.js %SCRIPT_DIR%extension\wasm\

echo.
echo ========================================
echo Build completed successfully!
echo Output files in: %SCRIPT_DIR%extension\wasm\
echo ========================================
pause
