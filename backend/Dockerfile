# Usar una imagen oficial de Node.js como imagen base
FROM node:16-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de definición del proyecto y de bloqueo
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install
RUN npm install nodemon --save-dev
RUN npm install minio
RUN npm install dotenv


# Definir variables de entorno para las credenciales sensibles
ENV DB_HOST=sql.freedb.tech
ENV DB_USER=freedb_marcelasdasd
ENV DB_PASSWORD=tCADemhZRPF39d!
ENV DB_DATABASE=freedb_Cybertesis


# Copiar todos los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Exponer el puerto en el que corre tu aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
