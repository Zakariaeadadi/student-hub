package com.studenthub.service;


import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.model.dto.category.CategoryResponse;
import com.studenthub.model.entity.Category;
import com.studenthub.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryResponse::toDto)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        Optional<Category> categoryOptional =  categoryRepository.findById(id);
        return categoryOptional.map(CategoryResponse::toDto).orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée avec l'id : " + id));
    }
}
