@echo off

set WORK_DIR=D:/im/workspace/xudong-web
set BUILD_DIR=D:\im\build\portal\
set HOST=http://127.0.0.1:9003

echo Begin build......

cd %WORK_DIR%

git pull

call npm install

call webpack --config vue.portal.config.js --host %HOST%

rd /s /q %BUILD_DIR%

xcopy build-portal\* %BUILD_DIR% /C /Y /F /E
