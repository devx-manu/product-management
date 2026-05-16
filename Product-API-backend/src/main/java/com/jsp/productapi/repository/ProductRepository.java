package com.jsp.productapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jsp.productapi.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	boolean existsByName(String name);

	List<Product> findByNameContaining(String name);

	List<Product> findByCategoryContaining(String category);

}
