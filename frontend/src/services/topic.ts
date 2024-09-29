import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';


export const getTopics = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.TOPIC.GET_ALL);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
