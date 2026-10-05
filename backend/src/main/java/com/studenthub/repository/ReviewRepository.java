package com.studenthub.repository;

import com.studenthub.model.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByPostId(Long postId, Pageable pageable);

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    void deleteByPostId(Long postId);
    void deleteByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.post.id = :postId")
    Double findAverageRatingByPostId(@Param("postId") Long postId);
}