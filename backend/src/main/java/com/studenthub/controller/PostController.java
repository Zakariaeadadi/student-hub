package com.studenthub.controller;


import com.studenthub.model.dto.post.PostRequest;
import com.studenthub.model.dto.post.PostResponse;
import com.studenthub.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest post) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(post));
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<PostResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException
    {
        return ResponseEntity.ok(postService.uploadImage(id, file));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(@RequestParam(required = false) Long categoryId,
                                                          @RequestParam(required = false) String search,
                                                          @RequestParam(defaultValue = "0") Integer page,
                                                          @RequestParam(defaultValue = "5") Integer size)
    {
        return ResponseEntity.ok(postService.getAllPosts(categoryId, search, page, size));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<PostResponse>> getPostsByUser(@RequestParam(defaultValue = "0") Integer page,
                                            @RequestParam(defaultValue = "5") Integer size)
    {
        return ResponseEntity.ok(postService.getPostsByUser(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@Valid @RequestBody PostRequest post, @PathVariable Long id) {
        return ResponseEntity.ok(postService.updatePost(id, post));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PostResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(postService.toggleStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
