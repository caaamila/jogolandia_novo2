import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Conquistas() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Conquistas</Text>
      
      {/* Botão estilizado */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/game/qisso')}>
        <Text style={styles.buttonText}>Ir para o jogo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Cor de fundo para evitar fundo transparente
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db', // Azul bonito
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
