package com.studenthub.repository;

import com.studenthub.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Post> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Post> findByCategoryIdAndTitleContainingIgnoreCase(Long categoryId, String keyword, Pageable pageable);
    Page<Post> findByUserId(Long userId, Pageable pageable);
    List<Post> findAllByUserId(Long userId);
    void deleteByUserId(Long userId);
}
