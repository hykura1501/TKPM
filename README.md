## Project name
Dự án quản lý danh sách sinh viên.

Web demo: [Student Management](https://group06-ex-tkpm.vercel.app/)

## Cấu trúc source code
Dưới đây là mô tả các thư mục và tệp chính trong dự án:

- `/src` - Chứa mã nguồn chính của ứng dụng, bao gồm các components, pages, và logic xử lý.
  - `/app` - Chứa các tệp liên quan đến routing và giao diện chính của ứng dụng.
  - `/components` - Chứa các thành phần UI tái sử dụng.
  - `/lib` - Chứa các tệp hỗ trợ, như kết nối database hoặc utilities.
- `/public` - Chứa các tệp tĩnh như hình ảnh, favicon, fonts.
- `package.json` - Danh sách các dependencies và scripts để chạy dự án.
- `tsconfig.json` - Cấu hình TypeScript cho dự án.
- `.env` - Chứa biến môi trường (có thể cần thiết nếu dự án sử dụng API hoặc database).

## Hướng dẫn cài đặt & chạy chương trình

### Yêu cầu môi trường
Trước khi chạy dự án, cần đảm bảo đã cài đặt:
- **Node.js** phiên bản 16 trở lên.
- **npm** (được cài đặt cùng với Node.js).

### Cài đặt dependencies
Sử dụng lệnh sau để cài đặt các package cần thiết:

```sh
npm install
```

Lệnh này sẽ đọc file `package.json` và tải về tất cả các thư viện cần thiết cho dự án.

## Biên dịch (tùy theo ngôn ngữ sử dụng)
Next.js sử dụng TypeScript, vì vậy cần biên dịch mã TypeScript trước khi chạy bản production.

```sh
npm run build
```

Lệnh này sẽ tạo thư mục `.next` chứa phiên bản biên dịch của ứng dụng.

## Chạy chương trình
Sử dụng lệnh sau để chạy ứng dụng trong môi trường phát triển:

```sh
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ [http://localhost:3000](http://localhost:3000).

## Ghi chú
- Đảm bảo `.env` được cấu hình đúng nếu có sử dụng biến môi trường.
- Trong quá trình chạy chương trình, đôi khi sẽ tốn đôi chút thời gian.

