import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAccess {
  username: string;
  pass: string;
  role?: 'master' | 'user';
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  users: UserAccess[];
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  addUser: (username: string, pass: string, role?: 'master' | 'user') => void;
  removeUser: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: UserAccess[] = [
  { username: 'lucas almeida', pass: '123456', role: 'master' },
  { username: 'admin', pass: '1234', role: 'master' } // Keeping admin as backup based on previous behavior
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('investech_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('investech_current_user') || null;
  });

  const [users, setUsers] = useState<UserAccess[]>(() => {
    try {
      const saved = localStorage.getItem('investech_users');
      if (saved) {
        let parsed = JSON.parse(saved) as UserAccess[];
        return parsed.map(u => ({
           ...u,
           role: u.role || (['lucas almeida', 'admin'].includes(u.username.toLowerCase()) ? 'master' : 'user')
        }));
      }
      return defaultUsers;
    } catch {
      return defaultUsers;
    }
  });

  useEffect(() => {
    localStorage.setItem('investech_users', JSON.stringify(users));
  }, [users]);

  const login = (username: string, pass: string) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.pass === pass);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user.username);
      localStorage.setItem('investech_auth', 'true');
      localStorage.setItem('investech_current_user', user.username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('investech_auth');
    localStorage.removeItem('investech_current_user');
  };

  const addUser = (username: string, pass: string, role: 'master' | 'user' = 'user') => {
    setUsers(prevUsers => {
      if (!prevUsers.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return [...prevUsers, { username, pass, role }];
      }
      return prevUsers;
    });
  };

  const removeUser = (username: string) => {
    setUsers(prevUsers => {
      if (prevUsers.length > 1) {
        return prevUsers.filter(u => u.username.toLowerCase() !== username.toLowerCase());
      }
      return prevUsers;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, users, login, logout, addUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
