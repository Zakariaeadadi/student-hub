import axiosInstance from "./axiosInstance";

export const getAllCategories = () => {
    return axiosInstance.get('/categories');
};

export const getCategoryById = (id) => {
    return axiosInstance.get(`/categories/${id}`)
}