import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

// Explication :

// axios.create({ baseURL: ... }) : crée une instance avec une URL de base — donc tu n'écriras plus jamais
//  http://localhost:8080/api/... en entier, juste /posts, /auth/login, etc.

// interceptors.request.use((config) => {...}) : cette fonction s'exécute avant chaque requête envoyée par
//  cette instance. config contient tous les détails de la requête (URL, méthode, headers...). On lit le token stocké
//  dans localStorage, et si présent, on l'ajoute au header Authorization — exactement le mécanisme qu'on avait expliqué en théorie.
// return config : obligatoire — sans ça, la requête ne partirait jamais (comme filterChain.doFilter() côté 
// backend, il faut toujours "laisser passer" après avoir fait ton traitement).