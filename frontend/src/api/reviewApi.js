import axiosInstance from "./axiosInstance";

export const addReview = (postId, data) => {
    return axiosInstance.post(`/posts/${postId}/reviews`, data);
}

export const getReviewsByPost = (postId, {page, size}) => {
    return axiosInstance.get(`/posts/${postId}/reviews`, {params: {page, size}});
}