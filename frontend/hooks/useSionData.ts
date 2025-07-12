// @/frontend/hooks/useSionData.ts
"use client"; // Marca este como um Componente de Cliente para usar hooks

import { useState, useEffect } from "react";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "../lib/firebase"; // Importa nossa configuração inicial do Firebase
import { ProcessedAsset } from "../lib/types"; // Importa o tipo que acabamos de criar

// Inicializa a instância do Firestore
const db = getFirestore(app);

export function useSionData() {
  // Estado para armazenar nossa lista de ativos
  const [data, setData] = useState<ProcessedAsset[]>([]);
  // Estado para sabermos quando os dados estão sendo carregados pela primeira vez
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Referência para a coleção sion_cache no Firestore
    const sionCacheCollection = collection(db, "sion_cache");

    // onSnapshot é o ouvinte em tempo real. Ele é acionado imediatamente com os dados atuais
    // e depois novamente toda vez que os dados mudam no backend.
    const unsubscribe = onSnapshot(sionCacheCollection, (querySnapshot) => {
      const assets: ProcessedAsset[] = [];
      querySnapshot.forEach((doc) => {
        // Monta o objeto de cada ativo, adicionando o ID do documento
        assets.push({ id: doc.id, ...doc.data() } as ProcessedAsset);
      });
      
      // Atualiza nosso estado com os novos dados
      setData(assets);
      setLoading(false);
    });

    // Função de limpeza: Quando o componente que usa o hook for "desmontado",
    // ele para de ouvir para evitar vazamentos de memória.
    return () => unsubscribe();
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  // O hook retorna os dados e o status de carregamento
  return { data, loading };
}