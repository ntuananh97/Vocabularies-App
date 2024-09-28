import { BASE_URL } from "@/configs/api";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export default axiosInstance;
