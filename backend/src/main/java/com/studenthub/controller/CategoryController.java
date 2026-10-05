package com.studenthub.controller;


import com.studenthub.model.dto.category.CategoryResponse;
import com.studenthub.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
}


//CategoryController — endpoints nécessaires
//
//1. GET /api/categories
//
//Appelle categoryService.getAllCategories(), retourne la liste en 200 OK.
//        Public — pas de vérification d'authentification nécessaire ici (déjà configuré dans SecurityConfig).
//
//        2. GET /api/categories/{id}
//
//Récupère l'id depuis l'URL (via @PathVariable), appelle categoryService.getCategoryById(id), retourne la catégorie en 200 OK, ou laisse ResourceNotFoundException remonter (elle sera interceptée plus tard par GlobalExceptionHandler pour donner un 404 propre — qu'on n'a pas encore écrit, donc pour l'instant l'erreur sera peut-être moins jolie, ce n'est pas grave à ce stade).