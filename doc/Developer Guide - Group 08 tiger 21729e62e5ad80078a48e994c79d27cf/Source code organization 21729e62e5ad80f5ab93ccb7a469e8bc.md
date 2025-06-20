# Source code organization

# Cấu trúc Dự án - Student Management System

## 📁 Cây thư mục với chú thích

```
├──── backend                                  # 🏗️ Backend API server
│    ├──── docs                                # 📚 Tài liệu API và hệ thống
│    ├──── seed                                # 🌱 Dữ liệu khởi tạo
│    │    └──── data                           # 📊 File dữ liệu mẫu (JSON)
|    |    └──── index                          # 📊 script chạy seed 
│    ├──── src                                 # 💻 Mã nguồn chính
│    │    ├──── application                    # 🎯 Tầng ứng dụng (Business Logic)
│    │    │    ├──── usecases                  # 📋 Use cases/Services cho từng domain
│    │    │    │    ├──── classSection         # 📅 Logic nghiệp vụ lớp học phần
│    │    │    │    ├──── course               # 📖 Logic nghiệp vụ học phần
│    │    │    │    ├──── faculty              # 🏫 Logic nghiệp vụ khoa/viện
│    │    │    │    ├──── log                  # 📝 Logic nghiệp vụ nhật ký
│    │    │    │    ├──── program              # 🎓 Logic nghiệp vụ chương trình đào tạo
│    │    │    │    ├──── registration         # ✅ Logic nghiệp vụ đăng ký học phần
│    │    │    │    ├──── semester             # 📆 Logic nghiệp vụ học kỳ
│    │    │    │    ├──── setting              # ⚙️ Logic nghiệp vụ cài đặt hệ thống
│    │    │    │    ├──── status               # 🔄 Logic nghiệp vụ trạng thái
│    │    │    │    └──── student              # 👨‍🎓 Logic nghiệp vụ sinh viên
│    │    │    └──── validators                # ✔️ Validation rules và schemas
│    │    ├──── configs                        # ⚙️ Cấu hình ứng dụng
│    │    │    └──── db                        # 🗄️ Cấu hình database
│    │    │    └──── locales.js                # 🗄️ Cấu hình đa ngôn ngữ
│    │    ├──── domain                         # 🏗️ Tầng domain (Entities, Repositories)
│    │    │    ├──── entities                  # 📋 Models/Schemas (Mongoose)
│    │    │    └──── repositories              # 🔍 Repository interfaces
│    │    ├──── infrastructure                 # 🛠️ Tầng infrastructure
│    │    │    └──── repositories              # 💾 Repository implementations
│    │    ├──── presentation                   # 🎭 Tầng presentation (HTTP)
│    │    │    ├──── controllers               # 🎮 Controllers xử lý HTTP requests
│    │    │    ├──── middlewares               # 🛡️ Middleware (auth, cors, validation)
│    │    │    └──── routes                    # 🛣️ API routes definitions
│    │    └──── shared                         # 🔧 Utilities dùng chung
│    │         └──── utils                     # 🛠️ Helper functions, constants
│    └──── tests                               # 🧪 Test suite
│         ├──── controllers                    # 🎮 Controller tests
│         └──── usecases                       # 📋 Use case tests
│              ├──── classSection              # 📅 Test cho class section
│              ├──── course                    # 📖 Test cho course
│              ├──── faculty                   # 🏫 Test cho faculty
│              ├──── log                       # 📝 Test cho log
│              ├──── program                   # 🎓 Test cho program
│              ├──── registration              # ✅ Test cho registration
│              ├──── setting                   # ⚙️ Test cho setting
│              └──── status                    # 🔄 Test cho status
└──── frontend                                 # 🖥️ Frontend React/Next.js application
     ├──── app                                 # 📱 Next.js App Router
     │    ├──── students                       # 👨‍🎓 Pages liên quan đến sinh viên
     │    │    └──── new                       # ➕ Trang thêm sinh viên mới
     │    └──── [locale]                       # 🌍 Internationalization routes
     │         ├──── classes                   # 📅 Trang quản lý lớp học phần
     │         ├──── courses                   # 📖 Trang quản lý học phần
     │         ├──── registration              # ✅ Trang đăng ký học phần
     │         ├──── settings                  # ⚙️ Trang cài đặt hệ thống
     │         ├──── students                  # 👨‍🎓 Trang quản lý sinh viên
     │         └──── transcripts               # 📜 Trang bảng điểm/học bạ
     ├──── components                          # 🧩 React components
     │    └──── ui                             # 🎨 UI components (buttons, forms, etc.)
     ├──── config                              # ⚙️ Frontend configuration
     ├──── data                                # 📊 Static data, mock data
     ├──── docs                                # 📚 Frontend documentation
     ├──── hooks                               # 🪝 Custom React hooks
     ├──── lib                                 # 📚 Libraries và utilities
     ├──── messages                            # 💬 Internationalization messages
     ├──── public                              # 🌐 Static assets (images, icons)
     ├──── services                            # 🔌 API services và HTTP clients
     ├──── styles                              # 🎨 CSS/SCSS styles
     └──── types                               # 📝 TypeScript type definitions

```

---

## 🏗️ Giải thích chi tiết kiến trúc

### 🔧 **Backend Architecture (Clean Architecture)**

### **1. Domain Layer (`domain/`)**

- **Entities**: Chứa các model Mongoose, định nghĩa cấu trúc dữ liệu
- **Repositories**: Interface định nghĩa các phương thức truy cập dữ liệu
- **Vai trò**: Tầng cốt lõi, chứa business rules và entities

### **2. Application Layer (`application/`)**

- **Use Cases**: Chứa business logic, orchestrate các operations
- **Validators**: Validation schemas và rules cho input data
- **Vai trò**: Điều phối giữa domain và infrastructure

### **3. Infrastructure Layer (`infrastructure/`)**

- **Repositories**: Implementation cụ thể của repository interfaces
- **Vai trò**: Xử lý database operations, external services

### **4. Presentation Layer (`presentation/`)**

- **Controllers**: Xử lý HTTP requests/responses
- **Routes**: Định nghĩa API endpoints
- **Middlewares**: Authentication, CORS, validation, error handling
- **Vai trò**: Interface với client, handle HTTP communication

### **5. Shared (`shared/`)**

- **Utils**: Helper functions, constants, common utilities
- **Vai trò**: Code được sử dụng chung across layers

### 🖥️ **Frontend Architecture (Next.js 13+ App Router)**

### **1. App Router (`app/`)**

- **File-based routing**: Sử dụng Next.js 13+ App Router
- **Internationalization**: Support multi-language với `[locale]`
- **Nested routes**: Tổ chức theo feature modules

### **2. Components (`components/`)**

- **UI Components**: Reusable UI elements
- **Feature Components**: Components specific cho từng feature
- **Vai trò**: Tái sử dụng code, maintainability

### **3. Services (`services/`)**

- **API Clients**: HTTP clients để gọi backend APIs
- **Data fetching**: Functions để fetch và cache data
- **Vai trò**: Centralized API communication

### **4. Hooks (`hooks/`)**

- **Custom Hooks**: Reusable stateful logic
- **Data hooks**: Hooks cho data fetching và state management
- **Vai trò**: Share logic giữa components

### **5. Types (`types/`)**

- **TypeScript Definitions**: Type definitions cho toàn bộ app
- **API Types**: Types cho API requests/responses
- **Vai trò**: Type safety và better developer experience

### 🧪 **Testing Strategy**

### **Backend Tests**

- **Unit Tests**: Test individual functions và methods
- **Integration Tests**: Test API endpoints end-to-end
- **Use Case Tests**: Test business logic
- **Repository Tests**: Test database operations

### **Frontend Tests** (suggested structure)

- **Component Tests**: Test React components
- **Hook Tests**: Test custom hooks
- **Integration Tests**: Test user workflows
- **E2E Tests**: Test complete user journeys

### 📊 **Data Flow**

```
Frontend → API Call → Routes → Controllers → Use Cases → Repositories → Database
                                     ↓
                              Validators (input validation)
                                     ↓
                              Entities (data models)

```

### 🔑 **Key Benefits của Architecture này**

1. **Separation of Concerns**: Mỗi layer có responsibility riêng biệt
2. **Testability**: Dễ dàng test từng layer độc lập
3. **Maintainability**: Code organized và dễ maintain
4. **Scalability**: Dễ dàng thêm features mới
5. **Reusability**: Components và services có thể tái sử dụng
6. **Type Safety**: TypeScript ensures compile-time safety
7. **Internationalization**: Support multiple languages
8. **Modern Stack**: Next.js 13+, Clean Architecture principles