# Requisitos
# - PowerShell, NPM, NestJS e Git
#
# Será gerado o diretório organizador-dist no nível do diretório dos projetos

#
$DIST_DIR = "organizador-dist"
$DIST_DIR_PATH = "..\$($DIST_DIR)\"

if (Test-Path $DIST_DIR_PATH) {
    Remove-Item $DIST_DIR_PATH -Recurse -Force
}
New-Item -Path ".." -Name $DIST_DIR -ItemType "directory"

# Build da API
npm install
nest build
Copy-Item -Path ".\dist\" -Destination "$($DIST_DIR_PATH)\dist" -PassThru -Recurse
Copy-Item -Path ".\package.json" -Destination $DIST_DIR_PATH -PassThru
Copy-Item -Path ".\vercel.json" -Destination $DIST_DIR_PATH -PassThru

# # Subindo para o github
Set-Location $DIST_DIR_PATH
git init
git add .
git commit -m "Commit gerado por script"
git remote add origin https://github.com/leandrofabianjr/organizador-dist.git
git branch -M main
git push -f origin main
