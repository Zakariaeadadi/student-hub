import { parsePath } from 'react-router-dom';
import axiosInstance from './axiosInstance';

export const addFavorite = (id) => {
    return axiosInstance.post(`/posts/${id}/favorite`);
}

export const removeFavorite = (id) => {
    return axiosInstance.delete(`/posts/${id}/favorite`);
}

export const getMyFavorites = ({page, size}) => {
    return axiosInstance.get('/users/me/favorites', {params: {page, size}});
}