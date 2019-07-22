@echo off

set url=http://116.62.114.198/demo/xudong-web.git
set WORK_DIR=D:/im/workspace/

echo Begin clone......

cd %WORK_DIR%

git clone %url%

cmd