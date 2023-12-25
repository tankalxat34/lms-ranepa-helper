@echo off
setlocal enabledelayedexpansion

rem Устанавливаем исходную и целевую директории
set "sourceDir=src"
set "targetDir=foo"

rem Создаем целевую директорию, если ее нет
if not exist "%targetDir%" mkdir "%targetDir%"

rem Копируем файлы из всех поддиректорий, исключая *.ts
for /r "%sourceDir%" %%i in (*.*) do (
    set "excludeFile=%%~xi"
    if /i not !excludeFile! == .ts (
        set "relativePath=%%~pi"
        xcopy "%%i" "%targetDir%!relativePath!" /y
    )
)

echo "Содержимое папки src (за исключением файлов *.ts) успешно скопировано в папку foo."
