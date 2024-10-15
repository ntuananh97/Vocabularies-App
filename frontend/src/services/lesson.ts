import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';
import { TGroupFormData } from '@/types/lesson';

export const getLessons = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.LESSON.INDEX);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createGroup = async (data: TGroupFormData) => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.LESSON.INDEX, data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};


export const updateGroup = async (updatedId: string, data: TGroupFormData) => {
  try {
    const res = await axiosInstance.put(`${API_ENDPOINTS.LESSON.INDEX}/${updatedId}`, data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

