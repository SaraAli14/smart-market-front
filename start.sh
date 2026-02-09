#!/bin/bash
cd Grad-Frontend
npm install
npm run build
npx serve -s dist -l $PORT