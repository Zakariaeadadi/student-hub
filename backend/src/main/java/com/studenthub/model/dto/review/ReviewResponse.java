package com.studenthub.model.dto.review;

import com.studenthub.model.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class ReviewResponse {

    Long id;
    Integer rating;
    String comment;
    LocalDateTime createdAt;
    Long userId;
    String userFullName;

    public static ReviewResponse toDto(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .userId(review.getUser().getId())
                .userFullName(review.getUser().getFullName())
                .build();
    }
}
