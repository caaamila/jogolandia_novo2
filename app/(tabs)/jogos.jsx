import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, FlatList, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router'; 
import Colors from '../../constants/Colors';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Category from '../../components/Home/Category';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colorir from '../game/colorir';
import CuboMagico from '../game/cubomagico'; 
import Qisso from '../game/qisso'; 


export default function Jogos() {
  const router = useRouter();

  const [allGames, setAllGames] = useState([]); // Todos os jogos
  const [filteredGames, setFilteredGames] = useState([]); // Jogos filtrados
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState(null); // Jogo selecionado

  const openGame = (game) => {
    setCurrentGame(game); 
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false); 
    setCurrentGame(null); 
  };
  
  const CloseBtn = () => {
    return (
    <TouchableOpacity 
        onPress={closeModal}
        style={styles.closeButton} // Adicione o estilo aqui
      >
        <AntDesign name="close" size={24} color="black" />      
    </TouchableOpacity>
    );
  }

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

  useEffect(() => {
    GetAllGames();
  }, []);

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
            onPress={() => openGame(item)} // Abre o modal com o jogo selecionado
          >
            <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent} // Adicione isso
      />

     
      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          {/* Renderiza o jogo dinamicamente */}
          <CloseBtn></CloseBtn>
          <View style={styles.gameContainer}>
            {currentGame?.name === 'Colorir' && <Colorir />}
            {currentGame?.name === 'Cubo dos Sentidos' && <CuboMagico />}
            {currentGame?.name === 'Caçar objetos' && <Qisso />}

          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp(1),
  },
  titulo: {
    fontSize: wp(9),
    color: Colors.DARKBLUE,
    fontFamily: 'outfit-medium',
    marginBottom: hp(-2),
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
    backgroundColor: 'white',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute', 
    padding: wp(2),
    backgroundColor: 'transparent', 
    zIndex: 1, 
  },

  flatListContent: {
    flexGrow: 1,
    paddingBottom: hp(9), // Ajuste conforme necessário
  },
});