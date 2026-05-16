package com.jsp.productapi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.jsp.productapi.entity.Product;
import com.jsp.productapi.service.ProductService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

	@Autowired
	ProductService service;

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public Map<String, List<Product>> getProducts() {
		return service.getProducts();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Map<String, Product> saveProduct(@RequestBody Product product) {
		return service.saveProduct(product);
	}

	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Map<String, Product> getProductById(@PathVariable Long id) {
		return service.getProductById(id);
	}

	@GetMapping("/name/{name}")
	@ResponseStatus(HttpStatus.OK)
	public Map<String, List<Product>> getProductsByName(@PathVariable String name) {
		return service.getProductsByName(name);
	}

	@GetMapping("/category/{category}")
	@ResponseStatus(HttpStatus.OK)
	public Map<String, List<Product>> getProductsByCategory(@PathVariable String category) {
		return service.getProductsByCategory(category);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteById(@PathVariable Long id) {
		service.deleteById(id);
	}

	@PutMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Map<String, Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
		return service.completeUpdateProduct(id, product);
	}

	@PatchMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Map<String, Product> partialUpdateProduct(@PathVariable Long id, @RequestBody Product product) {
		return service.partialUpdateProduct(id, product);
	}
}
