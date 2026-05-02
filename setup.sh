#!/bin/bash

# GUÍA RÁPIDA DE INSTALACIÓN Y EJECUCIÓN

echo "=========================================="
echo "WVG MANTENIMIENTO - REACT FRONTEND"
echo "=========================================="
echo ""

# Paso 1: Instalar dependencias
echo "📦 Paso 1: Instalando dependencias..."
npm install

# Paso 2: Copiar .env
echo ""
echo "📝 Paso 2: Configurando variables de entorno..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Archivo .env creado. Por favor edita los valores si es necesario."
else
  echo "✅ Archivo .env ya existe."
fi

echo ""
echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "📍 Próximos pasos:"
echo ""
echo "1️⃣  Editar .env con los datos correctos:"
echo "   VITE_API_URL=http://localhost:8000/api"
echo ""
echo "2️⃣  Iniciar servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "3️⃣  El navegador se abrirá en: http://localhost:5173"
echo ""
echo "=========================================="
echo "🚀 Para producción:"
echo "   npm run build"
echo "   npm run preview"
echo "=========================================="
