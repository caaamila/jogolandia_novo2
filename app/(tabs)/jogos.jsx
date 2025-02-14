import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, FlatList, Modal } from 'react-native';
import { useRouter } from 'expo-router'; // Expo Router
import Colors from '../../constants/Colors';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Category from '../../components/Home/Category';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colorir from '../game/colorir'; // Importa o componente do jogo Colorir

export default function Jogos() {
  const router = useRouter();

  // Estados
  const [allGames, setAllGames] = useState([]); // Todos os jogos
  const [filteredGames, setFilteredGames] = useState([]); // Jogos filtrados
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState(null); // Declare currentGame state

  const openGame = (game) => {
    setCurrentGame(game); // Defina o jogo que foi clicado
    setModalVisible(true); // Abre o modal para renderizar o jogo
  };

  // Função para buscar todos os jogos
  const GetAllGames = async () => {
    setLoader(true);
    try {
      const snapshot = await getDocs(collection(db, 'Jogos'));
      const games = [];
      snapshot.forEach((doc) => {
        games.push(doc.data());
      });

      setAllGames(games); // Armazena todos os jogos
      setFilteredGames(games); // Exibe todos os jogos inicialmente
    } catch (err) {
      console.error('Erro ao buscar todos os jogos:', err);
    } finally {
      setLoader(false);
    }
  };

  // Função para buscar jogos por categoria
  const GetGamesByCategory = (category) => {
    if (category === 'Tudo') {
      setFilteredGames(allGames); // Mostra todos os jogos
    } else {
      const filtered = allGames.filter((game) => game.category === category);
      setFilteredGames(filtered);
    }
  };

  // Carregar todos os jogos na montagem do componente
  useEffect(() => {
    GetAllGames();
  }, []);

  useEffect(() => {
    if (currentGame) {
      // Verifica se `currentGame.asset` é válido e direciona para a página correta
      if (currentGame.asset) {
        // Navega para a tela do jogo baseado no nome do arquivo (como 'colorir')
        router.push(`/game/${currentGame.asset}`); // Navegar para a tela específica
      } else {
        console.error('Jogo não possui uma propriedade "asset" válida');
      }
    }
  }, [currentGame, router]);

  return (
    <ImageBackground source={require('../../assets/images/nuvem_back_light.png')} style={styles.container}>
      {/* Título */}
      <Text style={styles.titulo}>Jogos</Text>

      {/* Categorias */}
      <View style={styles.categoryContainer}>
        <Category category={(value) => GetGamesByCategory(value)} />
      </View>

      {/* Lista de Jogos */}
      <FlatList
        data={filteredGames}
        numColumns={2} // Mostra dois jogos por linha
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              // Defina o jogo que foi clicado e abra o modal
              setCurrentGame(item); // Defina o jogo clicado
              setModalVisible(true); // Abre o modal
            }}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal para exibir o jogo */}
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>

          {/* Renderiza o jogo, aqui você pode substituir pelo componente do jogo */}
          {currentGame?.name === 'Colorir' && <Colorir />}
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp(2),
  },
  titulo: {
    fontSize: wp(9),
    color: Colors.DARKBLUE,
    fontFamily: 'outfit-medium',
    marginBottom: hp(1),
    marginTop: hp(3),
  },
  categoryContainer: {
    marginBottom: hp(1),
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    marginTop: hp(1),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(45),
    aspectRatio: 1,
    margin: wp(2),
    backgroundColor: Colors.WHITE,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
    padding: 5,
  },
  imagem: {
    width: wp(35),
    height: wp(35),
    borderRadius: 20,
    resizeMode: 'cover',
    alignContent: 'center',
    shadowColor: Colors.DARKBLUE,
  },
  name: {
    fontSize: wp(4.5),
    marginTop: hp(0.5),
    fontFamily: 'outfit-medium',
    color: Colors.DARKBLUE,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 20,
  },
  closeText: {
    color: 'white',
  },
});
