# ==================================================
# Stage 1: Build de la aplicación React + Vite
# ==================================================
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Argumento para la URL de la API (por defecto localhost:3000)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Compilar proyecto para producción
RUN npm run build

# ==================================================
# Stage 2: Servidor Web NGINX para producción
# ==================================================
FROM nginx:alpine

# Copiar configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados del build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto HTTP estándar
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
