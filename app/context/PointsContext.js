// app/context/PointsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criação do contexto
const PointsContext = createContext();

// Provedor do contexto
export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);

  // Carregar pontos ao iniciar o app
  useEffect(() => {
    async function loadPoints() {
      try {
        const storedPoints = await AsyncStorage.getItem('userPoints');
        if (storedPoints !== null) {
          setPoints(parseInt(storedPoints, 10));
        }
      } catch (error) {
        console.error("Erro ao carregar pontos:", error);
      }
    }

    loadPoints();
  }, []);

  // Salvar pontos sempre que forem atualizados
  useEffect(() => {
    async function savePoints() {
      try {
        await AsyncStorage.setItem('userPoints', points.toString());
      } catch (error) {
        console.error("Erro ao salvar pontos:", error);
      }
    }

    savePoints();
  }, [points]);

  // Funções para manipular pontos
  const addPoints = (value) => setPoints((prev) => prev + value);
  const resetPoints = () => setPoints(0);

  return (
    <PointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

// Hook para acessar o contexto de pontos
export const usePoints = () => useContext(PointsContext);
