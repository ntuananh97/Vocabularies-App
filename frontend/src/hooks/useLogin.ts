'use client';
import { useState } from "react";
import { TLoginType } from "@/types/auth/auth";
import { loginAuth } from "@/services/auth";
import { handleErrorResponse } from "@/helpers/response";
import { useAuth } from "@/contexts/AuthContext";


const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: TLoginType) => {
    const data = {
      password: values.password.trim(),
      email: values.email.trim(),
    };

    setLoading(true);

    try {
     const response = await loginAuth(data);
      login(response.data)
      
    } catch (error) {
      handleErrorResponse(error);
    }
    
    setLoading(false);
  };

  return {
    handleLogin,
    loading,
  };
};

export default useLogin;
