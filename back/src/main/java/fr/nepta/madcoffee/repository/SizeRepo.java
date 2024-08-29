package fr.nepta.madcoffee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.nepta.madcoffee.model.Category;

@Repository
public interface SizeRepo extends JpaRepository<Category, Long> {

	Category findByLabel(String label);

}
