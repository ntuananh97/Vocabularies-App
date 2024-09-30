import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';

export const getLessons = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.LESSON.INDEX);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
