FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Comando para construir la aplicación en modo producción
# Los assets estáticos se generan en la carpeta 'dist' por defecto.
# Vue CLI inyectará la variable VUE_APP_API_BASE_URL si está en un archivo .env
RUN npm run build

FROM nginx:stable-alpine

# Copiar los archivos de la carpeta 'dist' del BUILDER a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Eliminar la configuración predeterminada de Nginx
RUN rm /etc/nginx/conf.d/default.conf

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $$uri $$uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]