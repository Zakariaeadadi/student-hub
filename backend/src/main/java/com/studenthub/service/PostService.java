package com.studenthub.service;

import com.studenthub.exception.InvalidFileException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.exception.UnauthorizedActionException;
import com.studenthub.model.dto.post.PostRequest;
import com.studenthub.model.dto.post.PostResponse;
import com.studenthub.model.entity.Category;
import com.studenthub.model.entity.Post;
import com.studenthub.model.entity.User;
import com.studenthub.model.enums.Status;
import com.studenthub.repository.*;
import com.studenthub.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository, CategoryRepository categoryRepository, FileStorageService fileStorageService, FavoriteRepository favoriteRepository, ReviewRepository reviewRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
        this.favoriteRepository = favoriteRepository;
        this.reviewRepository = reviewRepository;
    }

    @Value("${app.upload.public-path}")
    private String uploadPublicPath;

    private Post getPostAndCheckOwnership(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post non trouvé avec l'id : " + id));

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if(!post.getUser().getId().equals(user.getId())) {
            throw  new UnauthorizedActionException("Vous n'êtes pas autorisé à modifier ce post");
        }
        return post;
    }

    public PostResponse createPost(PostRequest postRequest) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        Category category = categoryRepository.findById(postRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category non trouvé avec l'id : " + postRequest.getCategoryId()));

        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setDescription(postRequest.getDescription());
        post.setPrice(postRequest.getPrice());
        post.setImageUrl(postRequest.getImageUrl());
        post.setStatus(Status.AVAILABLE);
        post.setUser(user);
        post.setCategory(category);
        post.setCreatedAt(LocalDateTime.now());

        postRepository.save(post);

        return PostResponse.toDto(post);
    }

    public PostResponse uploadImage(Long postId, MultipartFile file) throws IOException {
        Post post = getPostAndCheckOwnership(postId);

        String oldImageUrl = post.getImageUrl();
        String oldImageName = null;
        if (oldImageUrl != null) {
            oldImageName = Paths.get(oldImageUrl).getFileName().toString();
        }

        String newImage = fileStorageService.store(file);

        post.setImageUrl(uploadPublicPath + "/" + newImage);
        postRepository.save(post);

        if (oldImageName != null) {
            fileStorageService.delete(oldImageName);
        }

        return PostResponse.toDto(post);
    }

    public Page<PostResponse> getAllPosts(Long categoryId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage;

        if (categoryId != null && search != null) {
            postPage = postRepository.findByCategoryIdAndTitleContainingIgnoreCase(categoryId, search, pageable);
        } else if (categoryId != null) {
            postPage = postRepository.findByCategoryId(categoryId, pageable);
        } else if (search != null) {
            postPage = postRepository.findByTitleContainingIgnoreCase(search, pageable);
        } else {
            postPage = postRepository.findAll(pageable);
        }
        return postPage.map(PostResponse::toDto);
    }

    public Page<PostResponse> getPostsByUser(int page, int size) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Long userId = user.getId();

        Pageable pageable = PageRequest.of(page, size);

        Page<Post> posts = postRepository.findByUserId(userId, pageable);
        return posts.map(PostResponse::toDto);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post non trouvé avec l'id : " + id));

        String email = SecurityUtils.getCurrentUserEmailOrNull();
        Double averageRating = null;
        Boolean hasReviewed = null;
        boolean isFavorite = false;
        User currentUser = null;
        if (email != null) {
            currentUser = userRepository.findByEmail(email).orElse(null);
            if (currentUser != null) {
                isFavorite = favoriteRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId());
                hasReviewed = reviewRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId());
            }
        }
        averageRating = reviewRepository.findAverageRatingByPostId(post.getId());
        return PostResponse.toDto(post, isFavorite, averageRating, hasReviewed);
    }

    public PostResponse updatePost(Long id, PostRequest postRequest) {
        Post post = getPostAndCheckOwnership(id);
        if (!postRequest.getCategoryId().equals(post.getCategory().getId())) {
            Category category = categoryRepository.findById(postRequest.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category non trouvé avec l'id : " + postRequest.getCategoryId()));
            post.setCategory(category);
        }

        post.setTitle(postRequest.getTitle());
        post.setDescription(postRequest.getDescription());
        post.setPrice(postRequest.getPrice());
        post.setImageUrl(postRequest.getImageUrl());
        if (postRequest.getStatus() != null) {
            post.setStatus(postRequest.getStatus());
        }

        postRepository.save(post);

        return PostResponse.toDto(post);
    }

    public PostResponse toggleStatus(Long id) {
        Post post = getPostAndCheckOwnership(id);

        if (post.getStatus() == Status.AVAILABLE) {
            post.setStatus(Status.SOLD);
        } else {
            post.setStatus(Status.AVAILABLE);
        }

        postRepository.save(post);
        return PostResponse.toDto(post);
    }

        @Transactional
    public void deletePost(Long id) {
        Post post = getPostAndCheckOwnership(id);
        favoriteRepository.deleteByPostId(id);
        reviewRepository.deleteByPostId(id);
        postRepository.delete(post);
    }
}
