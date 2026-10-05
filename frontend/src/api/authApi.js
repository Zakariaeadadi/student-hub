import axiosInstance from "./axiosInstance";

export const register = (registerData) => {
    return axiosInstance.post('/auth/register', registerData)
}

export const login = (loginData) => {
    return axiosInstance.post('/auth/login', loginData)
}

export const deleteUser = () => {
    return axiosInstance.delete('/auth/me')
}