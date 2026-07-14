package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.domain.entity.Category;
import com.coirmiq.ticket.dto.CategoryDTO;
import com.coirmiq.ticket.dto.CategoryRequest;
import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.mapper.CategoryMapper;
import com.coirmiq.ticket.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        log.info("Request received to get all categories");
        List<CategoryDTO> categories = categoryService.getAllCategories().stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(categories, "Categories fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable UUID id) {
        log.info("Request received to get category with ID: {}", id);
        CategoryDTO category = categoryMapper.toDto(categoryService.getCategoryById(id));
        return ResponseEntity.ok(ApiResponse.success(category, "Category fetched successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryRequest request) {
        log.info("Request received to create category: {}", request.getName());
        Category category = categoryMapper.toEntity(request);
        CategoryDTO created = categoryMapper.toDto(categoryService.createCategory(category));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Category created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryRequest request
    ) {
        log.info("Request received to update category ID: {}", id);
        Category categoryDetails = categoryMapper.toEntity(request);
        CategoryDTO updated = categoryMapper.toDto(categoryService.updateCategory(id, categoryDetails));
        return ResponseEntity.ok(ApiResponse.success(updated, "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        log.info("Request received to delete category ID: {}", id);
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }
}
