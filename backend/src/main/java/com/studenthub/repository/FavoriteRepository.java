package com.studenthub.repository;

import com.studenthub.model.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Boolean existsByUserIdAndPostId(Long userId, Long postId);
    Page<Favorite> findByUserId(Long userId, Pageable pageable);
    void deleteByUserIdAndPostId(Long userId, Long postId);
    void deleteByPostId(Long postId);
    void deleteByUserId(Long userId);
}
