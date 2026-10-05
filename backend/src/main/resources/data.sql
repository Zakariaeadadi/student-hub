INSERT IGNORE INTO categories (name, description)
VALUES ('Livres', 'Livres et manuels scolaires');

INSERT IGNORE INTO categories (name, description)
VALUES ('Électronique', 'Ordinateurs, calculatrices, accessoires électroniques');

INSERT IGNORE INTO categories (name, description)
VALUES ('Mobilier', 'Bureaux, chaises, étagères pour étudiants');

INSERT IGNORE INTO categories (name, description)
VALUES ('Vêtements', 'Vêtements et accessoires');

INSERT IGNORE INTO categories (name, description)
VALUES ('Services', 'Cours particuliers, tutorat, aide aux devoirs');

-- =========================
-- TEST USERS
-- =========================

-- INSERT INTO users
-- (email, password, full_name, phone, role, created_at)
-- VALUES
--     ('testA@gmail.com', '$2a$10$GjEOm5A3CONRe/axZ5tEuEgjPakzSag5DasxW1XR33A3j4cTZ/dG', 'Zakaria', '0611111111', 'USER', NOW()),
--     ('testB@gmail.com', '$2a$10$GjEOm5A3CONRe/axZ5tEuEgjPakzSag5DasxW1XR33A3j4cTZ/dG', 'Hatim', '0611111111', 'USER', NOW()),
--     ('testC@gmail.com', '$2a$10$GjEOm5A3CONRe/axZ5tEuEgjPakzSag5DasxW1XR33A3j4cTZ/dG', 'Ahmed', '0611111111', 'USER', NOW()),
--     ('testD@gmail.com', '$2a$10$GjEOm5A3CONRe/axZ5tEuEgjPakzSag5DasxW1XR33A3j4cTZ/dG', 'Yassine', '0622222222', 'USER', NOW()),
--     ('testE@gmail.com', '$2a$10$GjEOm5A3CONRe/axZ5tEuEgjPakzSag5DasxW1XR33A3j4cTZ/dG', 'Sara', '0633333333', 'USER', NOW());

-- =========================
-- TEST POSTS
-- =========================

-- INSERT INTO posts
-- (title, description, price, image_url, status, created_at, user_id, category_id)
-- VALUES
-- -- User 6 : Ahmed
-- ('Livre Java - Programmation orientée objet',
--  'Livre complet pour apprendre Java et la programmation orientée objet.',
--  120.00, NULL, 'AVAILABLE', NOW(), 6, 1),
--
-- ('Algorithmes et structures de données',
--  'Livre en bon état pour apprendre les algorithmes et structures de données.',
--  80.00, NULL, 'AVAILABLE', NOW(), 6, 1),
--
-- ('Calculatrice scientifique Casio',
--  'Calculatrice scientifique en très bon état, peu utilisée.',
--  150.00, NULL, 'AVAILABLE', NOW(), 6, 2),
--
-- ('Bureau étudiant',
--  'Petit bureau pratique pour une chambre universitaire.',
--  350.00, NULL, 'SOLD', NOW(), 6, 3),
--
-- -- User 7 : Yassine
-- ('Livre Python pour débutants',
--  'Cours et exercices Python avec plusieurs exemples pratiques.',
--  100.00, NULL, 'AVAILABLE', NOW(), 7, 1),
--
-- ('Clavier mécanique USB',
--  'Clavier mécanique avec touches rétroéclairées.',
--  250.00, NULL, 'AVAILABLE', NOW(), 7, 2),
--
-- ('Souris sans fil',
--  'Souris Bluetooth sans fil avec bonne autonomie.',
--  90.00, NULL, 'AVAILABLE', NOW(), 7, 2),
--
-- ('Chaise de bureau',
--  'Chaise confortable pour étudier et travailler.',
--  250.00, NULL, 'AVAILABLE', NOW(), 7, 3),
--
-- -- User 8 : Sara
-- ('Livre de bases de données SQL',
--  'Livre consacré à SQL, MySQL et aux bases de données relationnelles.',
--  90.00, NULL, 'SOLD', NOW(), 8, 1),
--
-- ('Casque audio avec microphone',
--  'Casque audio confortable avec microphone intégré.',
--  180.00, NULL, 'AVAILABLE', NOW(), 8, 2),
--
-- ('Ordinateur portable Lenovo',
--  'Ordinateur portable adapté aux études et à la programmation.',
--  3200.00, NULL, 'AVAILABLE', NOW(), 8, 2),
--
-- ('Étagère en bois',
--  'Étagère compacte pour livres et accessoires.',
--  180.00, NULL, 'AVAILABLE', NOW(), 8, 3),
--
-- -- User 14 : Zakaria
-- ('Petite table d étude',
--  'Table simple et solide, idéale pour une chambre étudiant.',
--  280.00, NULL, 'SOLD', NOW(), 14, 3),
--
-- ('Sac à dos étudiant',
--  'Sac à dos avec plusieurs compartiments et espace ordinateur.',
--  150.00, NULL, 'AVAILABLE', NOW(), 14, 4),
--
-- ('Veste homme taille M',
--  'Veste en bon état, taille M.',
--  200.00, NULL, 'AVAILABLE', NOW(), 14, 4),
--
-- ('Chaussures de sport',
--  'Chaussures de sport en bon état, peu utilisées.',
--  220.00, NULL, 'AVAILABLE', NOW(), 14, 4),
--
-- -- User 15 : Hatim
-- ('Sweat-shirt taille L',
--  'Sweat-shirt confortable, taille L.',
--  130.00, NULL, 'SOLD', NOW(), 15, 4),
--
-- ('Cours particuliers en Java',
--  'Cours particuliers pour débuter en Java et programmation orientée objet.',
--  80.00, NULL, 'AVAILABLE', NOW(), 15, 5),
--
-- ('Aide en programmation Python',
--  'Accompagnement pour les exercices et petits projets Python.',
--  90.00, NULL, 'AVAILABLE', NOW(), 15, 5),
--
-- ('Lampe de bureau LED',
--  'Lampe LED pratique pour travailler le soir.',
--  100.00, NULL, 'AVAILABLE', NOW(), 15, 2);

-- =========================
-- TEST REVIEWS
-- =========================

INSERT INTO review
(rating, comment, created_at, user_id, post_id)
VALUES
(5, 'Excellent produit, exactement comme décrit.', NOW(), 7, 45),
(4, 'Très bon état et vendeur sérieux.', NOW(), 8, 46),
(5, 'Je recommande, très bonne expérience.', NOW(), 14, 47),
(4, 'Très bon produit pour le prix.', NOW(), 15, 48),

(5, 'Excellent rapport qualité prix.', NOW(), 6, 49),
(4, 'Tout était conforme à la description.', NOW(), 8, 50),
(3, 'Produit correct pour le prix.', NOW(), 14, 51),
(5, 'Très bonne qualité.', NOW(), 15, 52),

(4, 'Très satisfait de mon achat.', NOW(), 6, 53),
(5, 'Je recommande ce produit.', NOW(), 7, 54),
(4, 'Bonne expérience avec le vendeur.', NOW(), 14, 55),
(3, 'Produit acceptable.', NOW(), 15, 56),

(5, 'Parfait pour les études.', NOW(), 6, 57),
(4, 'Je suis satisfait.', NOW(), 7, 58),
(5, 'Très bon produit.', NOW(), 8, 59),
(3, 'Correct mais pourrait être amélioré.', NOW(), 15, 60),

(5, 'Excellent achat.', NOW(), 6, 61),
(4, 'Très bonne qualité pour ce prix.', NOW(), 7, 62),
(5, 'Je recommande fortement.', NOW(), 8, 63),
(4, 'Bonne expérience générale.', NOW(), 14, 64);

-- =========================
-- TEST FAVORITES
-- =========================

INSERT INTO favorite
(created_at, user_id, post_id)
VALUES
(NOW(), 7, 45),
(NOW(), 8, 46),
(NOW(), 14, 47),
(NOW(), 15, 48),

(NOW(), 6, 49),
(NOW(), 8, 50),
(NOW(), 14, 51),
(NOW(), 15, 52),

(NOW(), 6, 53),
(NOW(), 7, 54),
(NOW(), 14, 55),
(NOW(), 15, 56),

(NOW(), 6, 57),
(NOW(), 7, 58),
(NOW(), 8, 59),
(NOW(), 15, 60),

(NOW(), 6, 61),
(NOW(), 7, 62),
(NOW(), 8, 63),
(NOW(), 14, 64);
