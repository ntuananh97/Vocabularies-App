'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROUTE_CONFIG } from '@/configs/route';
import {  useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(ROUTE_CONFIG.TOPIC);
    
  }, [user])
 

  return <>{children}</>;
};

export default ProtectedAuthRoute;
