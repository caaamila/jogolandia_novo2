import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Colors from './../../constants/Colors';
import { useRouter } from 'expo-router';

export default function GameListItem({ game }) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: '/game-details',
        params: game,
      })}
      style={styles.card}
    >
      {/* Background Image */}
      <Image 
        source={{ uri: game?.imageUrl }} 
        style={styles.image} 
        resizeMode="cover" 
      />

      {/* Start Button in Bottom Left */}
      <TouchableOpacity 
        onPress={() => router.push({
          pathname: '/game-details',
          params: game
        })}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    overflow: 'hidden', // Garante cantos arredondados
    alignSelf: 'center', // Centraliza o cartão horizontalmente
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
    marginTop: 15,
    width: Dimensions.get('screen').width * 0.9,
    height:  Dimensions.get('screen').height * 0.2,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Coloca a imagem embaixo de todos os elementos
  },
  button: {
    position: 'absolute',
    bottom: 10, // Coloca o botão 10px acima da borda inferior
    left: 10, // Coloca o botão 10px da borda esquerda
    backgroundColor: Colors.WHITE, // Cor de fundo do botão
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: Colors.CYAN, // Cor do texto do botão
    fontWeight: 'bold',
    fontSize: 16,
  },
});
