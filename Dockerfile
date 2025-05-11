# 1단계: 빌드
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 파일을 Nginx의 기본 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 파일 덮어쓰기(선택)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"] 