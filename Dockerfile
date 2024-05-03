# Usar una imagen oficial de Node.js como imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de definición del proyecto y de bloqueo
COPY package*.json ./

# Instalar dependencias del proyecto, incluyendo Vite
RUN npm install

# Copiar todos los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Exponer el puerto que Vite usará
EXPOSE 5173

# Comando para ejecutar Vite
CMD ["npm", "run", "dev"]
