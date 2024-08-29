package fr.nepta.madcoffee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.nepta.madcoffee.model.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

	Product findByName(String name);

	Product findById(long id);

}
