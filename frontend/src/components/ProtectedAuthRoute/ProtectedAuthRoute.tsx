'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROUTE_CONFIG } from '@/configs/route';
import { redirect } from 'next/navigation';

const ProtectedAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    redirect(ROUTE_CONFIG.TOPIC);
  }

  return <>{children}</>;
};

export default ProtectedAuthRoute;
