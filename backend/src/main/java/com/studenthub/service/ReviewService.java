package com.studenthub.service;

import com.studenthub.exception.AlreadyReviewedException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.exception.SelfReviewException;
import com.studenthub.model.dto.review.ReviewRequest;
import com.studenthub.model.dto.review.ReviewResponse;
import com.studenthub.model.entity.Post;
import com.studenthub.model.entity.Review;
import com.studenthub.model.entity.User;
import com.studenthub.repository.PostRepository;
import com.studenthub.repository.ReviewRepository;
import com.studenthub.repository.UserRepository;
import com.studenthub.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;


@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, PostRepository postRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public ReviewResponse addReview(Long postId, ReviewRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Long userId = user.getId();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post non trouvé avec l'id : " + postId));

        if (Objects.equals(post.getUser().getId(), userId)) {
            throw new SelfReviewException("Vous ne pouvez pas noter votre propre post");
        }

        if (reviewRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new AlreadyReviewedException("Vous avez déjà noté ce post");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setPost(post);

        reviewRepository.save(review);
        return ReviewResponse.toDto(review);
    }

    public Page<ReviewResponse> getReviewsByPost(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Review> reviewPage = reviewRepository.findByPostId(postId, pageable);
        return reviewPage.map(ReviewResponse::toDto);
    }
}
