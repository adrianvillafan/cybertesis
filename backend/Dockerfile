# Usar una imagen oficial de Node.js como imagen base
FROM node:18-alpine

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
#ENV DB_HOST=buckhannon.pdx1-mysql-a7-2a.dreamhost.com
#ENV DB_USER=quierochicharron
#ENV DB_PASSWORD=carajo123
#ENV DB_DATABASE=pruebaspruebas_db

# Definir variables de entorno para las credenciales de PostgreSQL
ENV DB_HOST=cybertesis-cybertesis.h.aivencloud.com
ENV DB_USER=avnadmin
ENV DB_PASSWORD=AVNS_12534vn8JCCz0xKpNOo
ENV DB_DATABASE=defaultdb
ENV DB_PORT=27628

ENV USER=adrianmarcelv@gmail.com
ENV APP_PASSWORD=xpjpxrzjrgrsjdme



# Copiar todos los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Exponer el puerto en el que corre tu aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
