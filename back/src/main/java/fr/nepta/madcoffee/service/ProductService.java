package fr.nepta.madcoffee.service;

import java.util.List;

import fr.nepta.madcoffee.model.Product;

public interface ProductService {

	Product saveProduct(Product product);

	Product getProduct(String productName);

	List<Product> getProducts();

	Product getProduct(long productId);

}
