import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function GameInfo({ game }) {
  const router = useRouter();

  return (
    <View>
      {/* Exibe a imagem do jogo */}
      <Image
        source={{ uri: game.imageUrl }}
        style={styles.image}
      />
      <Text>hiiiii</Text>

      {/* Botão para jogar o cubo mágico */}
      <Button
        title="Jogar Cubo Mágico"
        onPress={() => {
          console.log("Navegando para o cubo mágico...");
          router.push('/game/cubomagico');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
});
