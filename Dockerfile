# Usar una imagen oficial de Node.js como imagen base
FROM node:18-alpine

# Instalar herramientas de construcción necesarias
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev jpeg-dev giflib-dev

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de definición del proyecto y de bloqueo
COPY package.json ./

# Instalar dependencias del proyecto, incluyendo Vite y react-pdf
RUN npm install

# Copiar todos los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Exponer el puerto que Vite usará
EXPOSE 5173

# Comando para ejecutar Vite
CMD ["npm", "run", "dev"]
