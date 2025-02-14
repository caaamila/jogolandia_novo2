import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ImageBackground } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import { usePoints } from '../context/PointsContext'; // Importando o contexto de pontos

export default function CuboMagico() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentSense, setCurrentSense] = useState<string | null>(null);
  const [availableCards, setAvailableCards] = useState<string[]>([]);
  const [targetCard, setTargetCard] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const qrCodeLock = useRef(false);

  const { points, addPoints } = usePoints(); // Acessando pontos e função para adicionar pontos

  async function handleOpenCamera() {
    const { granted } = await requestPermission();
    if (!granted) {
      return Alert.alert("Câmara", "É preciso habilitar o uso da câmara");
    }
    setModalIsVisible(true);
    qrCodeLock.current = false;
  }

  function handleQRCodeRead(data: string | null) {
    if (!data) {
      Alert.alert("Erro", "O QR Code lido não é válido.");
      return;
    }

    setModalIsVisible(false);

    const senses: Record<string, string>= {
      "QR_VISÃO": "Visão - Cores",
      "QR_OLFATO": "Olfato",
      "QR_AUDIÇÃO": "Audição",
      "QR_PALADAR": "Paladar",
      "QR_TATO": "Tato",
    };

    if (data in senses) {
      const sense = senses[data];
      setCurrentSense(sense);
      const cards = sense.includes("Visão") ? ["roxo", "rosa", "azul", "verde"] : ["carta1", "carta2", "carta3"];
      setAvailableCards(cards);
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      setTargetCard(randomCard);
      Alert.alert(`Sentido: ${sense}`, `Encontre o cartão: ${randomCard}`);
      return;
    }

    if (data === targetCard) {
      setGameResult("Correto! Você encontrou o cartão.");
      addPoints(10); // Adiciona 10 pontos ao contexto global
    } else {
      setGameResult("Errado. Tente novamente!");
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/nuvem_back_light.png')} style={styles.backgroundImage}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Cubo Mágico</Text>
        <Text style={styles.description}>Bem-vindo(a) ao jogo do cubo mágico! Faça scan ao QR Code para começar a diversão.</Text>

        <Text style={styles.pointsText}>Pontos: {points}</Text>

        <TouchableOpacity style={styles.startButton} onPress={handleOpenCamera}>
          <Text style={styles.startButtonText}>Começar a Jogar</Text>
        </TouchableOpacity>

        {gameResult && (
          <View style={styles.gameResultContainer}>
            <Text style={styles.gameResultText}>{gameResult}</Text>
          </View>
        )}

        <Modal visible={modalIsVisible}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={({ data }) => {
              if (data && !qrCodeLock.current) {
                qrCodeLock.current = true;
                setTimeout(() => handleQRCodeRead(data), 500);
              }
            }}
          />
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalIsVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' },
  contentContainer: { width: '85%', padding: 20, backgroundColor: '#fff', borderRadius: 15, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 20 },
  description: { fontSize: 18, color: '#1E3A8A', textAlign: 'center', marginBottom: 30 },
  pointsText: { fontSize: 20, color: 'black', marginBottom: 10 },
  startButton: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 10 },
  startButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  gameResultContainer: { marginTop: 20, padding: 10, backgroundColor: '#4CAF50', borderRadius: 10, alignItems: 'center' },
  gameResultText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 32, left: 32, right: 32, alignItems: 'center' },
  cancelButton: { backgroundColor: '#E53935', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});
