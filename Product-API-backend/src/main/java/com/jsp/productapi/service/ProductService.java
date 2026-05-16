package com.jsp.productapi.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jsp.productapi.entity.Product;
import com.jsp.productapi.exception.DataExistException;
import com.jsp.productapi.exception.DataNotFoundException;
import com.jsp.productapi.repository.ProductRepository;

@Service
public class ProductService {

	@Autowired
	ProductRepository repository;

	public Map<String, List<Product>> getProducts() {
		List<Product> products = repository.findAll();
		if (products.isEmpty())
			throw new DataNotFoundException("No products found");
		return Map.of("data", products);
	}

	public Map<String, Product> saveProduct(Product product) {
		if (repository.existsByName(product.getName()))
			throw new DataExistException("Product with name " + product.getName() + " already exists");
		repository.save(product);
		return Map.of("data", product);
	}

	public Map<String, Product> getProductById(Long id) {
		return Map.of("data", repository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Product with id " + id + " not found")));
	}

	public Map<String, List<Product>> getProductsByName(String name) {
		List<Product> products = repository.findByNameContaining(name);
		if (products.isEmpty())
			throw new DataNotFoundException("No products with name containing " + name + " found");
		return Map.of("data", products);
	}

	public Map<String, List<Product>> getProductsByCategory(String category) {
		List<Product> products = repository.findByCategoryContaining(category);
		if (products.isEmpty())
			throw new DataNotFoundException("No products with Category containing " + category + " found");
		return Map.of("data", products);
	}

	public void deleteById(Long id) {
		if (!repository.existsById(id))
			throw new DataNotFoundException("Product with id " + id + " not found");
		repository.deleteById(id);
	}

	public Map<String, Product> completeUpdateProduct(Long id, Product product) {
		product.setId(id);
		return Map.of("data", repository.save(product));
	}

	public Map<String, Product> partialUpdateProduct(Long id, Product newProduct) {
		Product existingProduct = repository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Product with id " + id + " not found"));
		if (newProduct.getName() != null)
			existingProduct.setName(newProduct.getName());
		if (newProduct.getPrice() != null)
			existingProduct.setPrice(newProduct.getPrice());
		if (newProduct.getDescription() != null)
			existingProduct.setDescription(newProduct.getDescription());
		if (newProduct.getCategory() != null)
			existingProduct.setCategory(newProduct.getCategory());
		if (newProduct.getStock() != null)
			existingProduct.setStock(newProduct.getStock());
		repository.save(existingProduct);
		return Map.of("data", existingProduct);
	}
}
