// api/postApi.js — je te montre celui-ci en exemple, tu feras authApi.js/categoryApi.js pareil
import axiosInstance from './axiosInstance';

export const getAllPosts = ({categoryId, search, page, size}) => {
  return axiosInstance.get('/posts', {params: {categoryId, search, page, size}});
};

export const getPostById = (id) => {
  return axiosInstance.get(`/posts/${id}`);
};

export const getPostsByUser = ({page, size}) => {
  return axiosInstance.get('/posts/my', {params: {page, size}});
}

export const createPost = (postData) => {
  return axiosInstance.post('/posts', postData);
};

export const uploadPostImage = (postId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post(`/posts/${postId}/image`, formData);
};

export const updatePost = (id, postData) => {
  return axiosInstance.put(`/posts/${id}`, postData);
};

export const toggleStatus = (id) => {
    return axiosInstance.patch(`/posts/${id}/status`);
};

export const deletePost = (id) => {
  return axiosInstance.delete(`/posts/${id}`);
};

// Explication :

// Chaque fonction correspond à un endpoint backend qu'on a construit (PostController) — remarque la correspondance directe : GET /api/posts ↔ getAllPosts(), PUT /api/posts/{id} ↔ updatePost(id, ...).
// Ces fonctions ne font qu'envoyer la requête — elles ne gèrent pas encore l'affichage, le state React, les erreurs. Ça, c'est le rôle des composants/pages qui les appelleront (HomePage, PostDetailPage...) avec useEffect/useState — c'est là que la vraie logique React interviendra, et c'est là que tu apprendras le plus.
// axiosInstance.get(...) retourne une Promise (pas la donnée directement) — dans un composant, tu l'utiliseras avec async/await ou .then(). On verra ça concrètement dès qu'on écrira HomePage.