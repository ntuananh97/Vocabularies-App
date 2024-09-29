import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';
import { TLoginType } from '@/types/auth/auth';

export const loginAuth = async (data: TLoginType) => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const logoutAuth = async () => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getMe = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
