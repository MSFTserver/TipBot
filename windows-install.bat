@echo off
Mode 51, 30
set mainDir=%~dp0Logs
set dlDir=%~dp0Downloads
set nodeLog=%mainDir%\node-install.log
set nodeCheck=%mainDir%\nodeCheck.txt
set gitCheck=%mainDir%\gitCheck.txt
:Start
echo Installing Wunderbot for Windows!
ping localhost -n 4 >nul
goto :gitCheck
:gitCheck
echo ___________________________________________________
git --version > %gitCheck%
if %errorlevel%==9009 (
echo git not found, Installing git!
ping localhost -n 4 >nul
goto :gitInstall
)
set /p gitVersion=<%gitCheck%
if /I "%gitVersion%"==" " (
echo git not found, Installing git!
ping localhost -n 4 >nul
goto :gitInstall
)
echo git found, running %gitVersion%
ping localhost -n 4 >nul
goto :nodeCheck
:gitInstall
echo ___________________________________________________
echo Downloading git from https://github.com/git-for-windows/git/releases/ to %dlDir%
ping localhost -n 4 >nul
start bitsadmin.exe /transfer "Install Git" https://github.com/git-for-windows/git/releases/download/v2.16.2.windows.1/Git-2.16.2-32-bit.exe %dlDir%\Git-2.16.2-32-bit.exe
echo continuing in 1 minute
echo if the process finishes before time-
echo is up you can press any key to continue
timeout /t 60
echo ___________________________________________________
echo Installing Git-2.16.2-32-bit.exe
start Git-2.16.2-32-bit.exe /i %dlDir%\Git-2.16.2-32-bit.exe /N /L*V "%nodeLog%"
echo continuing in 3 minutes
echo if the process finishes before time-
echo is up you can press any key to continue
timeout /t 180
del %dlDir%\Git-2.16.2-32-bit.exe
echo ___________________________________________________
echo finished installing git
ping localhost -n 4 >nul
goto :nodeCheck
:nodeCheck
echo ___________________________________________________
node -v > %nodeCheck%
if %errorlevel%==9009 (
echo node.js not found, Installing Node.js!
ping localhost -n 4 >nul
goto :nodeInstall
)
set /p nodeVersion=<%nodeCheck%
if /I "%nodeVersion%"==" " (
echo node.js not found, Installing Node.js!
ping localhost -n 4 >nul
goto :nodeInstall
)
echo node.js found, running %nodeVersion%
ping localhost -n 4 >nul
goto :npmInstall
:nodeInstall
echo ___________________________________________________
echo Downloading node.js from https://nodejs.org/dist/latest/ to %dlDir%
ping localhost -n 4 >nul
start bitsadmin.exe /transfer "Install Node" https://nodejs.org/dist/latest/node-v9.9.0-x64.msi %dlDir%\node-v9.9.0-x64.msi
echo continuing in 1 minute
echo if the process finishes before time-
echo is up you can press any key to continue
timeout /t 60
echo ___________________________________________________
echo Installing node-v9.9.0-x64.msi
start msiexec.exe /i %dlDir%\node-v9.9.0-x64.msi /N /L*V "%nodeLog%"
echo continuing in 3 minutes
echo if the process finishes before time-
echo is up you can press any key to continue
timeout /t 180
del %dlDir%\node-v9.9.0-x64.msi
echo ___________________________________________________
echo finished installing node.js
ping localhost -n 4 >nul
goto :npmInstall
:npmInstall
echo ___________________________________________________
echo Installing npm packages for rvnButler!
ping localhost -n 4 >nul
start npm install
echo continuing in 60 seconds
echo if the process finishes before time-
echo is up you can press any key to continue
timeout /t 60
echo ___________________________________________________
echo installing yarn!
start npm install yarn -g
echo continuing in 60 seconds
echo if the process finishes before time-
echo is up you can press any key to continue
timeout /t 60
echo ___________________________________________________
echo installing pm2!
start npm install pm2 -g
echo continuing in 60 seconds
echo if the process finishes before time-
echo is up you can press any key to continue
timeout /t 60
echo ___________________________________________________
echo Finished installing npm packages
ping localhost -n 4 >nul
goto :exit
:exit
echo ___________________________________________________
echo done installing rvnButler!
del "%nodeCheck%"
echo please run windows-start.bat to run rvnButler with pm2!
echo Bye Bye...
timeout /t 60 /nobreak
