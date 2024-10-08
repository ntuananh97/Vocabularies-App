import { API_ENDPOINTS } from '@/configs/api';
import axiosInstance from '@/helpers/axios';
import { handleAxiosError } from '@/helpers/axios/handleError';
import { TApiSearchWordParams, TWordFormDataType } from '@/types/word';

export const getWords = async (params: TApiSearchWordParams) => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.WORD.INDEX, {
      params
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createNewWord = async (data: TWordFormDataType) => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.WORD.INDEX, data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateWord = async (updatedId: string, data: TWordFormDataType) => {
  try {
    const res = await axiosInstance.put(`${API_ENDPOINTS.WORD.INDEX}/${updatedId}`, data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const markWordAsReviewed = async (updatedId: string) => {
  try {
    const res = await axiosInstance.put(`${API_ENDPOINTS.WORD.MARK}/${updatedId}`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getDetailWord = async (updatedId: string) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.WORD.INDEX}/${updatedId}`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
