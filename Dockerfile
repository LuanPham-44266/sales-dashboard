FROM node:22-alpine

WORKDIR /app

# Bật corepack để sử dụng pnpm
RUN corepack enable

# TỐI ƯU 1: Chỉ copy các file cấu hình thư viện trước
COPY package.json pnpm-lock.yaml ./

# TỐI ƯU 2: Cài đặt dependencies (sẽ được Docker cache lại nếu 2 file trên không đổi)
RUN pnpm install --config.ignore-scripts=false

# TỐI ƯU 3: Copy toàn bộ mã nguồn còn lại vào
COPY . .

# Thông báo port ứng dụng (Lưu ý: Render sẽ cấp Port động)
EXPOSE 3000

# TỐI ƯU 4: Dùng CMD thay vì ENTRYPOINT để linh hoạt hơn trong môi trường Cloud
CMD [ "pnpm", "run", "start" ]      