package com.studenthub.model.dto.post;

import com.studenthub.model.entity.Post;
import com.studenthub.model.enums.Status;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Status status;
    private LocalDateTime createdAt;
    private Long categoryId;
    private String categoryName;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;
    private Boolean isFavorite;
    private Double averageRating;
    private Boolean hasReviewed;

    public static PostResponse toDto(Post post) {
        return toDto(post, null, null, null);
    }

        public static PostResponse toDto(Post post, Boolean isFavorite, Double averageRating, Boolean hasReviewed) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .price(post.getPrice())
                .imageUrl(post.getImageUrl())
                .status(post.getStatus())
                .createdAt(post.getCreatedAt())
                .categoryId(post.getCategory().getId())
                .categoryName(post.getCategory().getName())
                .userId(post.getUser().getId())
                .userFullName(post.getUser().getFullName())
                .userEmail(post.getUser().getEmail())
                .userPhone(post.getUser().getPhone())
                .isFavorite(isFavorite)
                .averageRating(averageRating)
                .hasReviewed(hasReviewed)
                .build();
    }
}
