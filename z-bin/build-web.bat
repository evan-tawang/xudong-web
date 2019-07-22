@echo off

set WORK_DIR=D:/im/workspace/xudong-web
set BUILD_DIR=D:\im\build\web\

echo Begin build......

cd %WORK_DIR%

echo git pull......

git pull

echo npm build......

call npm install

call npm run build-prod

echo copy......

rd /S /Q %BUILD_DIR%

xcopy build\* %BUILD_DIR% /C /Y /F /E



