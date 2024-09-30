'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTE_CONFIG } from '@/configs/route';
import { getMe } from '@/services/auth';
import { TUser } from '@/types/auth';
import '@/configs/dayjs-config';

type TUserContext = TUser | null;

interface AuthContextProps {
  user: TUserContext;
  status: boolean;
  login: (_T: TUser) => void;
  logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TUserContext>(null);
  const [status, setStatus] = useState(false)
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        setStatus(true)
        const  response = await getMe();
        const userData = response.data;
        
        setUser(userData);
      } catch {
        setUser(null);
        // Điều hướng người dùng chưa đăng nhập về trang login
        router.push(ROUTE_CONFIG.LOGIN);
      }
      finally {
        setStatus(false)
      }
    };
    checkUser();
  }, [router]);

  const login = (userData: TUser) => {
    setUser(userData);
    router.push(ROUTE_CONFIG.TOPIC);
   
  };

  const logout = () => {
    setUser(null);
    router.push(ROUTE_CONFIG.LOGIN);
  };

  return (
    <AuthContext.Provider value={{ status, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
