import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';
import { TTopicFormData } from '@/types/topic';

export const getTopics = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.TOPIC.INDEX);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createNewTopic = async (data: TTopicFormData) => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.TOPIC.INDEX, data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateTopic = async (updatedId: string, data: TTopicFormData) => {
  try {
    const res = await axiosInstance.put(`${API_ENDPOINTS.TOPIC.INDEX}/${updatedId}`, data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
