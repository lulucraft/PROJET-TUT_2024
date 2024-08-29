package fr.nepta.madcoffee.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.nepta.madcoffee.model.Product;
import fr.nepta.madcoffee.repository.ProductRepo;
import fr.nepta.madcoffee.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor @Slf4j
@Transactional
public class ProductServiceImpl implements ProductService {

	private final ProductRepo productRepo;

	@Override
	public Product saveProduct(Product product) {
		log.info("Saving product in the database");
		return productRepo.save(product);
	}

	@Override
	public Product getProduct(String productName) {
		log.info("Fetching product '{}'", productName);
		return productRepo.findByName(productName);
	}

	@Override
	public List<Product> getProducts() {
		log.info("Fetching all products");
		return productRepo.findAll();
	}

	@Override
	public Product getProduct(long productId) {
		log.info("Fetching product '{}'", productId);
		return productRepo.findById(productId);
	}

}
