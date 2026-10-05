package com.studenthub.service;


import com.studenthub.exception.EmailAlreadyUsedException;
import com.studenthub.exception.InvalidCredentialsException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.model.dto.auth.AuthResponse;
import com.studenthub.model.dto.auth.LoginRequest;
import com.studenthub.model.dto.auth.RegisterRequest;
import com.studenthub.model.entity.Post;
import com.studenthub.model.entity.User;
import com.studenthub.repository.FavoriteRepository;
import com.studenthub.repository.PostRepository;
import com.studenthub.repository.ReviewRepository;
import com.studenthub.repository.UserRepository;
import com.studenthub.security.JwtTokenProvider;
import com.studenthub.security.SecurityUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PostRepository postRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final FileStorageService fileStorageService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, PostRepository postRepository, FavoriteRepository favoriteRepository, ReviewRepository reviewRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.postRepository = postRepository;
        this.favoriteRepository = favoriteRepository;
        this.reviewRepository = reviewRepository;
        this.fileStorageService = fileStorageService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException("Cet email est déjà utilisé");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        String token = generateTokenForUser(user.getEmail(), request.getPassword());
        return new AuthResponse(user.getId(), token, user.getEmail(), request.getFullName(), user.getPhone());
    }

    public AuthResponse login(LoginRequest request) {
        String token;
        try {
            token = generateTokenForUser(request.getEmail(), request.getPassword());
        } catch (Exception e) {
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        return new AuthResponse(user.getId(), token, user.getEmail(), user.getFullName(), user.getPhone());
    }

    @Transactional
    public void delete() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Long userId = user.getId();

        List<Post> userPosts = postRepository.findAllByUserId(userId);

        for (Post post : userPosts) {
            favoriteRepository.deleteByPostId(post.getId());
            reviewRepository.deleteByPostId(post.getId());

            if (post.getImageUrl() != null) {
                String imageName = Paths.get(post.getImageUrl()).getFileName().toString();
                try {
                    fileStorageService.delete(imageName);
                } catch (Exception e) {
                    // log seulement — ne bloque pas la suppression du compte pour un fichier orphelin
                }
            }
        }

        favoriteRepository.deleteByUserId(userId);
        reviewRepository.deleteByUserId(userId);
        postRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }

    private String generateTokenForUser(String email, String rawPassword) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, rawPassword)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);
    }
}