package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.Category;
import com.coirmiq.ticket.exception.ResourceNotFoundException;
import com.coirmiq.ticket.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        log.info("Fetching all categories");
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(UUID id) {
        log.info("Fetching category by ID: {}", id);
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Transactional
    public Category createCategory(Category category) {
        log.info("Creating category with name: {}", category.getName());
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with name '" + category.getName() + "' already exists.");
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(UUID id, Category categoryDetails) {
        log.info("Updating category with ID: {}", id);
        Category category = getCategoryById(id);
        
        if (!category.getName().equals(categoryDetails.getName()) && 
            categoryRepository.existsByName(categoryDetails.getName())) {
            throw new IllegalArgumentException("Category with name '" + categoryDetails.getName() + "' already exists.");
        }

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        log.info("Deleting category with ID: {}", id);
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
