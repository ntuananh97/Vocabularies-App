'use client';

import { redirect } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTE_CONFIG } from '@/configs/route';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  
  if (!user) {
    return null; // Có thể hiển thị loading trong khi chờ điều hướng
  }

  return <>{children}</>;
};

export default ProtectedRoute;
