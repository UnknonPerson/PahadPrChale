import { createContext, useContext, ReactNode } from 'react';

interface ApiContextType {
  baseUrl: string;
}

const ApiContext = createContext<ApiContextType | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  return (
    <ApiContext.Provider value={{ baseUrl }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
