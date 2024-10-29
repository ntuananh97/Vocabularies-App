import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';
import { TApiResponse, TGetListApiResponse, TQueryParams } from '@/types/common';
import { TTopicFormData, TTopicType } from '@/types/topic';

export const getTopics = async (params?: TQueryParams): Promise<TApiResponse<TGetListApiResponse<TTopicType>>> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.TOPIC.INDEX, {
      params
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }

  // This should never happen because handleAxiosError always throws an error
  throw new Error("This should never happen");
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
