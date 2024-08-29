package fr.nepta.madcoffee.service;

import java.util.List;

import fr.nepta.madcoffee.model.Category;

public interface CategoryService {

	Category saveCategory(Category category);

	Category getCategory(String categoryLabel);

	List<Category> getCategories();

}
