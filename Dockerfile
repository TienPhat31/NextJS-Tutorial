# Sử dụng image Node.js LTS
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt các dependency
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Xây dựng ứng dụng Next.js
RUN npm run build

# Expose port 3000 cho ứng dụng
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["npm", "run", "dev"]
