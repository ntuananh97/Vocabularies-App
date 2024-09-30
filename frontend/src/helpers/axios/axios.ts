
import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  withCredentials: true,
  // headers: {'X-Custom-Header': 'foobar'}
});

export default axiosInstance;
