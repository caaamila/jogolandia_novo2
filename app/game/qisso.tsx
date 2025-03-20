import { View, Text, StyleSheet, Image, ActivityIndicator, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as tensorflow from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { Classification, ClassificationProps } from '@/components/Classification';

export default function qisso() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState('');
    const [showOptionsModal, setShowOptionsModal] = useState(false); // Estado para controlar o modal
    const [results, setResults] = useState<ClassificationProps[]>([]);
    const [targetObject, setTargetObject] = useState('uma maçã'); // Objeto que a criança tem que encontrar (exemplo: maçã)
    const [gameStarted, setGameStarted] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Ionicons name="close" size={28} color={Colors.DARKBLUE} />
            </TouchableOpacity>
          ),
        });
    }, [navigation]);


    async function handleSelectedImage() {
        setIsLoading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });

            if (!result.canceled) {
                const { uri } = result.assets[0];
                setSelectedImageUri(uri);
                await imageClassification(uri); // Função de classificação de imagem
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setShowOptionsModal(false); // Fechar o modal após a seleção
        }
    }

 // Função para abrir a câmera
 async function handleTakePhoto() {
    setIsLoading(true);
    try {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            setSelectedImageUri(uri);
            await imageClassification(uri); // Função de classificação de imagem
        }
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
        setShowOptionsModal(false); // Fechar o modal após a captura
    }
}

    const openImagePickerOptions = () => {
        setShowOptionsModal(true);
    };


    async function setupTensorFlow() {
        await tf.ready();
        await tensorflow.setBackend('rn-webgl');
        console.log("Backend selecionado:", tf.getBackend());
    }
    
    setupTensorFlow();

    async function handleSelectImage() {
        setIsLoading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true
            });

            if (!result.canceled) {
                const { uri } = result.assets[0];
                setSelectedImageUri(uri);
                await imageClassification(uri);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function imageClassification(imageUri: string) {
        setResults([]);
        await tensorflow.setBackend('rn-webgl');
        await tensorflow.ready();

        const model = await mobilenet.load();
        const imageBase64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
        const imgBuffer = tensorflow.util.encodeString(imageBase64, 'base64').buffer;
        const raw = new Uint8Array(imgBuffer);
        const imageTensor = decodeJpeg(raw);
        const classificationResult = await model.classify(imageTensor);
        setResults(classificationResult);

        // Verificar se o objeto classificado é o alvo
        const isCorrect = classificationResult.some((result) => result.className.toLowerCase().includes(targetObject));
        if (isCorrect) {
            alert('Parabéns, você encontrou o objeto certo!');
        } else {
            alert('Tente novamente!');
        }
    }

    return (
        <ImageBackground source={require('../../assets/images/nuvem_back_light.png')} style={styles.container}>
            <View style={styles.container}>
                <StatusBar style="light" backgroundColor="transparent" translucent />
                
                {/* Tela inicial do jogo */}
                {!gameStarted ? (
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>Encontra {targetObject}!</Text>
                        {/* Exibir uma imagem do objeto que a criança precisa procurar */}
                        <Image 
                            source={require(`../../assets/images/maça.png`)} // Coloque a imagem correspondente
                            style={styles.targetImage} 
                        />
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => setGameStarted(true)}
                        >
                            <Text style={styles.title}>Começar o Jogo</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.gameContainer}>
                        <Image 
                            source={selectedImageUri ? { uri: selectedImageUri } : require('../../assets/images/placeholder.png')}
                            style={styles.image} 
                        />
                        <View style={styles.results}>
                            {results.map((result) => (
                                <Classification key={result.className} data={result} />
                            ))}
                        </View>
                        {isLoading ? (
                            <ActivityIndicator color="darkblue" />
                        ) : (
                            <View style={styles.buttonWrapper}>
                                <View style={styles.box} />
                                <TouchableOpacity style={styles.button} onPress={openImagePickerOptions}>
                                    <Text style={styles.title}>Selecionar Imagem</Text>
                                </TouchableOpacity>
                                <Modal
                                    visible={showOptionsModal}
                                    transparent={true}
                                    animationType="slide"
                                    onRequestClose={() => setShowOptionsModal(false)}
                                >
                                    <View style={styles.modalOverlay}>
                                        <View style={styles.modalContent}>
                                            <TouchableOpacity style={styles.optionButton} onPress={handleSelectImage}>
                                                <Text style={styles.optionText}>Abrir Galeria</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionButton} onPress={handleTakePhoto}>
                                                <Text style={styles.optionText}>Tirar Foto</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowOptionsModal(false)}>
                                                <Text style={styles.cancelText}>Cancelar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
    },
    instructionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionText: {
        fontFamily: "outfit-medium",
        fontSize: wp(6),
        textAlign: 'center',
        color: Colors.DARKBLUE,
        marginBottom: 20,
    },
    targetImage: {
        width: wp(70),
        height: hp(30),
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    gameContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginTop: wp(5),
        width: wp(80),
        height: hp(39),
        borderRadius: hp(2.5),
        backgroundColor: 'white',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 3,
        padding: 5,
    },
    results: {
        marginTop: hp(3),
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 30,
        justifyContent: 'center',
    },
    buttonWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#3ec630',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        zIndex: 1,
    },
    title: {
        color: "#FFF",
        fontFamily: "outfit-medium",
        fontSize: wp(5),
        fontWeight: '600',
        textAlign: 'center',
    },
    box: {
        backgroundColor: '#32b623',
        width: wp(53.8),
        height: hp(6),
        position: 'absolute',
        borderRadius: 20,
        bottom: hp(-1),
        zIndex: 0,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    optionButton: {
        width: '100%',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    cancelButton: {
        width: '100%',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelText: {
        fontSize: 16,
        color: '#FF3B30',
    },
});
