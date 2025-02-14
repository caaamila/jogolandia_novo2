import React from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Por favor, faça login para acessar o seu perfil.
        </Text>
        <Pressable
          style={styles.loginButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.loginText}>Fazer Login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/nuvem_back.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Card com informações do usuário */}
        <View style={styles.card}>
          {/* Foto do Usuário */}
          {user?.imageUrl ? (
            <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
          ) : (
            <Image
              source={require('../../assets/images/boneki.png')} // Imagem padrão
              style={styles.profileImage}
            />
          )}
  
          {/* Nome do Usuário */}
          <Text style={styles.nameText}>
            {user?.firstName || 'Utilizador'} {user?.lastName || ''}
          </Text>
  
          {/* Email do Usuário */}
          <Text style={styles.emailText}>
            {user?.emailAddresses[0]?.emailAddress || 'Email não encontrado'}
          </Text>
  
          {/* Botão de Logout */}
          <Pressable style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
  
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').width * 0.9,
    backgroundColor: Colors.WHITE,
    borderRadius: 35,
    padding: 20,
    alignItems: 'center',
    alignContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Para sombras no Android
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    marginTop: 35,
  },
  nameText: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: Colors.DARKBLUE,
    marginBottom: 8,
  },
  emailText: {
    fontFamily: 'outfit',
    fontSize: 18,
    color: Colors.GRAY,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: Colors.YELLOW, // Amarelo sólido
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARKBLUE,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: Colors.YELLOW,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  loginText: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: Colors.DARKBLUE,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: Colors.WHITE,
    textAlign: 'center',
    marginBottom: 20,
  },
});
