@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title TellezSoftware - Servidor
cd /d "%~dp0"

set "PORT=8788"

echo ============================================================
echo   TellezSoftware - Iniciar servidor
echo ============================================================
echo.
echo   Aplicacion completa con D1 y R2 simulados en local.
echo.
echo   1) Solo local         http://localhost:%PORT%
echo   2) Local y red Wi-Fi  http://localhost:%PORT%  +  http://IP-DE-TU-PC:%PORT%
echo   0) Salir
echo.

set /p "OPCION=Selecciona una opcion [1/2]: "

if "%OPCION%"=="1" goto LOCAL
if "%OPCION%"=="2" goto LAN
if "%OPCION%"=="0" exit /b 0
echo.
echo Opcion no valida. Vuelve a ejecutar el archivo.
pause
exit /b 1

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo No se encontro Node.js en el PATH. Instalalo desde https://nodejs.org
  pause
  exit /b 1
)

:LOCAL
echo.
echo Iniciando servidor solo para este equipo...
echo   URL: http://localhost:%PORT%
echo.
call npm run dev:stack
goto FIN

:LAN
set "LANIP="
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "@((Get-NetIPConfiguration).Where({ $_.IPv4DefaultGateway -ne $null -and $_.NetAdapter.Status -eq 'Up' }).IPv4Address.IPAddress)[0]"`) do set "LANIP=%%i"
if not defined LANIP set "LANIP=IP-NO-DETECTADA"
echo.
echo Iniciando servidor para este equipo y la red local...
echo   Este equipo: http://localhost:%PORT%
echo   Red Wi-Fi:   http://%LANIP%:%PORT%
echo.
echo NOTA: desde el celular u otra PC el catalogo se ve sin problema,
echo pero para INICIAR SESION hace falta HTTPS, porque la cookie de
echo sesion es Secure y el navegador la descarta sobre HTTP.
echo.
call npm run dev:stack:lan

:FIN
echo.
echo El servidor se detuvo.
pause
