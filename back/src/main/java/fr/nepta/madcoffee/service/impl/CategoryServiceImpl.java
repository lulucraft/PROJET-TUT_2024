package fr.nepta.madcoffee.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.nepta.madcoffee.model.Category;
import fr.nepta.madcoffee.repository.SizeRepo;
import fr.nepta.madcoffee.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor @Slf4j
@Transactional
public class CategoryServiceImpl implements CategoryService {

	private final SizeRepo sizeRepo;

	@Override
	public Category saveCategory(Category category) {
		log.info("Saving new category in the database");
		return sizeRepo.save(category);
	}

	@Override
	public Category getCategory(String categoryLabel) {
		log.info("Fetching category '{}'", categoryLabel);
		return sizeRepo.findByLabel(categoryLabel);
	}

	@Override
	public List<Category> getCategories() {
		log.info("Fetching categories");
		return sizeRepo.findAll();
	}

}
