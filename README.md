# 🛒 Product Management System

A Full Stack Product Management Application built using **Spring Boot** and **React.js**.  
This project provides RESTful APIs for managing products along with a responsive frontend UI for performing CRUD operations.

---

# 🚀 Tech Stack

## ⚙️ Backend
- ☕ Java
- 🌱 Spring Boot
- 🔗 Spring Web
- 🗄️ Spring Data JPA
- 🧩 Hibernate
- 🐬 MySQL
- 📦 Maven

## 🎨 Frontend
- ⚛️ React.js
- 🔄 Axios
- 🛣️ React Router
- 🎨 Bootstrap / CSS

---

# ✨ Features

## 🔧 Backend Features
- ✅ Create Product
- ✅ Fetch All Products
- ✅ Fetch Product By ID
- ✅ Search Products By Name
- ✅ Search Products By Category
- ✅ Update Product (PUT)
- ✅ Partial Update Product (PATCH)
- ✅ Delete Product
- ✅ RESTful API Design
- ✅ Layered Architecture

## 💻 Frontend Features
- ✅ Responsive UI
- ✅ Product Listing
- ✅ Add Product Form
- ✅ Update Product
- ✅ Delete Product
- ✅ Search & Filter Functionality
- ✅ API Integration with Axios

---

# 📁 Project Structure

```bash
product-management-system/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── exception/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│
└── README.md
```

---

# 🔗 REST API Endpoints

## 🌐 Base URL

```http
/api/v1/products
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| 🟢 GET | `/` | Get all products |
| 🔵 POST | `/` | Create product |
| 🟢 GET | `/{id}` | Get product by ID |
| 🟢 GET | `/name/{name}` | Search products by name |
| 🟢 GET | `/category/{category}` | Search products by category |
| 🟠 PUT | `/{id}` | Complete update product |
| 🟡 PATCH | `/{id}` | Partial update product |
| 🔴 DELETE | `/{id}` | Delete product |

---

# 📦 Sample Product JSON

```json
{
  "name": "iPhone 15",
  "category": "Electronics",
  "price": 79999,
  "brand": "Apple"
}
```

---

# ⚙️ Backend Setup

## 📥 Clone Repository

```bash
git clone https://github.com/your-username/product-management-system.git
cd product-management-system
```

## 🗄️ Configure Database

Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/productdb
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## ▶️ Run Backend

```bash
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# 💻 Frontend Setup

## 📁 Navigate to Frontend

```bash
cd frontend
```

## 📦 Install Dependencies

```bash
npm install
```

## ▶️ Run React App

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 📸 Screenshots

## 🏠 Home Page
_Add screenshot here_

## ➕ Add Product Page
_Add screenshot here_

## ✏️ Update Product Page
_Add screenshot here_

---

# 🔮 Future Enhancements

- 🔐 JWT Authentication
- 👥 Role-Based Authorization
- 🖼️ Product Image Upload
- 📄 Swagger API Documentation
- 📊 Pagination & Sorting
- 🐳 Docker Deployment
- 🧪 Unit Testing

---

# 📚 Learning Outcomes

- 🚀 Building REST APIs using Spring Boot
- 🗄️ CRUD Operations with MySQL
- 🔄 API Integration with React
- 🏗️ Layered Architecture
- ⚛️ State Management in React
- 🛡️ Error Handling & Validation

---

# 👨‍💻 Author

### Your Name

- 🐙 GitHub: https://github.com/devx.manu
- 💼 LinkedIn: www.linkedin.com/in/manu-sh-md220304

---

# 📄 License

This project is licensed under the MIT License.
