import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';

export const getWords = async (params) => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.WORD.INDEX, {
      params
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

