// @/frontend/context/SionDataProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useSionData } from '../hooks/useSionData';
import { ProcessedAsset } from '../lib/types';

// Define a estrutura do nosso contexto
interface SionDataContextType {
  data: ProcessedAsset[];
  loading: boolean;
}

// Cria o Context com um valor padrão
const SionDataContext = createContext<SionDataContextType>({
  data: [],
  loading: true,
});

// Componente Provedor
export function SionDataProvider({ children }: { children: ReactNode }) {
  const { data, loading } = useSionData(); // Usa nosso hook para buscar os dados

  return (
    <SionDataContext.Provider value={{ data, loading }}>
      {children}
    </SionDataContext.Provider>
  );
}

// Hook customizado para facilitar o uso do nosso contexto em outros componentes
export function useSionContext() {
  const context = useContext(SionDataContext);
  if (context === undefined) {
    throw new Error('useSionContext must be used within a SionDataProvider');
  }
  return context;
}