# ProductAPI Dashboard

A React frontend for the Spring Boot Product Management API.

## Prerequisites

- Node.js 16+ installed
- Your Spring Boot backend running on port 1234

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

The app opens at **http://localhost:3000**

---

## CORS — Important!

Your Spring Boot backend needs to allow requests from the React dev server.
Add this annotation to your `ProductController.java`:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
  ...
}
```

Or add a global CORS config — create this file in your Spring Boot project:

```java
// src/main/java/com/jsp/productapi/config/CorsConfig.java

package com.jsp.productapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}
```

---

## Features

| Feature | API Call |
|---|---|
| View all products | `GET /api/v1/products` |
| Search by name | `GET /api/v1/products/name/{name}` |
| Filter by category | `GET /api/v1/products/category/{cat}` |
| Add a product | `POST /api/v1/products` |
| Edit a product | `PATCH /api/v1/products/{id}` |
| Delete a product | `DELETE /api/v1/products/{id}` |

---

## Project Structure

```
src/
  App.js       ← All components + API logic
  App.css      ← Full dark theme stylesheet
  index.js     ← React entry point
```

---

## Build for Production

```bash
npm run build
```

Output goes to the `build/` folder — can be served by any static file server.
