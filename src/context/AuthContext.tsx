import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type User = {
  id: number;
  username: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Updated mock user data with new credentials (username: halim, password: admin123@#$)
const MOCK_USERS = [
  { id: 1, username: 'halim', password: 'admin123@#$', isAdmin: true },
  { id: 2, username: 'user', password: 'user123', isAdmin: false },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check for saved user on initial load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = MOCK_USERS.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    }
    
    toast.error('اسم المستخدم أو كلمة المرور غير صحيحة');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('تم تسجيل الخروج');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};
