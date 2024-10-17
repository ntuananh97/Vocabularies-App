import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';
import { TGroupFormData, TGroupType } from '@/types/lesson';
import { TApiResponse, TGetListApiResponse, TQueryParams } from '../types/common';

export const getLessons = async (params?: TQueryParams): Promise<TApiResponse<TGetListApiResponse<TGroupType>>> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.LESSON.INDEX, {
      params
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }

  // This should never happen because handleAxiosError always throws an error
  throw new Error("This should never happen");
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

