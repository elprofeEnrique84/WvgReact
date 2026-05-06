# 1. Usamos una imagen de Node.js ligera (Alpine)
FROM node:18-alpine

# 2. Creamos el directorio de trabajo en el contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias primero para optimizar el caché
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos todo el código de la carpeta backend al contenedor
COPY . .

# 6. Exponemos el puerto 3001 (que es el que definiste en server.js)
EXPOSE 3001

# 7. Comando para ejecutar tu servidor
CMD ["node", "server.js"]