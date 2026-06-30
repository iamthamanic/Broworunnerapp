import { createContext, useContext, ReactNode } from 'react';

interface User {
  name: string;
  id: string;
}

interface UserContextType {
  user: User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  // Mock user - in production würde das aus dem Auth-System kommen
  const user: User = {
    name: 'Max Mustermann',
    id: 'user-001'
  };

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
