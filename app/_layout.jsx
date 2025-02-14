import React, { useEffect } from 'react';  
import { useFonts } from "expo-font";
import * as SecureStore from 'expo-secure-store';
import { useRouter, Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { PointsProvider } from './context/PointsContext'; // Ajuste o caminho conforme necessário

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const router = useRouter();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Carregar fontes
  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-ExtraBold.ttf'),
  });

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <PointsProvider>
        <ClerkLoaded>
          <AuthenticatedNavigation router={router} />
        </ClerkLoaded>
        {/* O Slot já lida com a navegação. Não é necessário mais navegação externa */}
        <Slot />
      </PointsProvider>
    </ClerkProvider>
  );
}

// Componente separado para a navegação autenticada
function AuthenticatedNavigation({ router }) {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return; // Espera o Clerk carregar completamente

    if (isSignedIn === false) {
      router.replace('/login');
    } else if (isSignedIn) {
      router.replace('/(tabs)/home');
    }
  }, [isSignedIn, isLoaded, router]); // Executa o efeito quando o estado de isSignedIn ou isLoaded mudar

  return null; // O componente AuthenticatedNavigation agora não precisa retornar nada
}
