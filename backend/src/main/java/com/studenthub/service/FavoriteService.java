package com.studenthub.service;

import com.studenthub.exception.AlreadyFavoritedException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.model.dto.post.PostResponse;
import com.studenthub.model.entity.Favorite;
import com.studenthub.model.entity.Post;
import com.studenthub.model.entity.User;
import com.studenthub.repository.FavoriteRepository;
import com.studenthub.repository.PostRepository;
import com.studenthub.repository.UserRepository;
import com.studenthub.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, UserRepository userRepository, PostRepository postRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public void addFavorite(Long postId) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Long userId = user.getId();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post non trouvé"));

        if (favoriteRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new AlreadyFavoritedException("déja en favorite");
        }
        Favorite favorite = new Favorite();
        favorite.setCreatedAt(LocalDateTime.now());
        favorite.setPost(post);
        favorite.setUser(user);

        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long postId) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Long userId = user.getId();

        favoriteRepository.deleteByUserIdAndPostId(userId, postId);
    }

    public Page<PostResponse> getMyFavorites(int page, int size) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Long userId = user.getId();

        Pageable pageable = PageRequest.of(page, size);
        Page<Favorite> favorites = favoriteRepository.findByUserId(userId, pageable);
        Page<Post> postPage = favorites.map(Favorite::getPost);

        return postPage.map(PostResponse::toDto);
    }
}
