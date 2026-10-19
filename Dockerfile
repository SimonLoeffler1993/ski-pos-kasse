# --- Build-Stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime-Stage ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Das nginx-Image ersetzt beim Start Variablen in Templates per envsubst
COPY config.js.template /etc/nginx/templates/config.js.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]