#!/bin/bash
# Load nvm and use the correct Node version, then run dev server

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Use Node version from .nvmrc
nvm use

# Run dev server
npm run dev
