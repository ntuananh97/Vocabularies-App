'use client';
import { useState } from 'react';
import { logoutAuth } from '@/services/auth';
import { handleErrorResponse } from '@/helpers/response';
import { useAuth } from '@/contexts/AuthContext';

const useLogout = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logoutAuth();
      logout();
    } catch (error) {
      handleErrorResponse(error);
    }

    setLoading(false);
  };

  return {
    handleLogout,
    loading,
  };
};

export default useLogout;
