git add .
@echo off
set /p param=������commit��
echo on
git commit -m "%param%"
git pull origin master
git push origin master
pause