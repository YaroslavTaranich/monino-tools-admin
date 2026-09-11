FROM node:20-alpine AS builder

WORKDIR /app
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
COPY package*.json ./
RUN npm ci
COPY public ./public
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

FROM nginx:1.27-alpine AS runner

ARG APP_VERSION=development
ARG VCS_REF=unknown
LABEL org.opencontainers.image.version=$APP_VERSION \
  org.opencontainers.image.revision=$VCS_REF

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
