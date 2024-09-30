import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';

export const getPeriods = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.PERIOD.INDEX);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
