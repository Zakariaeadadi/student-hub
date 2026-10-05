package com.studenthub.controller;


import com.studenthub.model.dto.post.PostResponse;
import com.studenthub.service.FavoriteService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/posts/{id}/favorite")
    public ResponseEntity<?> addFavorite(@PathVariable Long id) {
        favoriteService.addFavorite(id);
        return ResponseEntity.status(200).build();
    }

    @DeleteMapping("/posts/{id}/favorite")
    public ResponseEntity<?> removeFavorite(@PathVariable Long id) {
        favoriteService.removeFavorite(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/me/favorites")
    public ResponseEntity<Page<PostResponse>> getMyFavorites(@RequestParam(defaultValue = "0") Integer page,
                                                             @RequestParam(defaultValue = "5") Integer size)
    {
        return ResponseEntity.ok(favoriteService.getMyFavorites(page, size));
    }
}
