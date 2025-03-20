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
    const targetObjects = [
        { name: 'uma maçã', image: require('../../assets/images/maça.png') },
        { name: 'um cão', image: require('../../assets/images/cao.png') },
        { name: 'um gato', image: require('../../assets/images/gato.png') },
        { name: 'um lápis', image: require('../../assets/images/lapis.png') },
        { name: 'uma flor', image: require('../../assets/images/flor.png') },
        { name: 'uma cadeira', image: require('../../assets/images/cadeira.png') },
    ];
    const [targetObject, setTargetObject] = useState(targetObjects[0]);
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Para seguir uma sequência
    const [gameStarted, setGameStarted] = useState(false);
    const navigation = useNavigation();
    const [foundObjectsCount, setFoundObjectsCount] = useState(0);

    const chooseRandomTarget = () => {
        const randomIndex = Math.floor(Math.random() * targetObjects.length);
        setTargetObject(targetObjects[randomIndex]);
    };

    const nextTarget = () => {
        const nextIndex = (currentTargetIndex + 1) % targetObjects.length;
        setCurrentTargetIndex(nextIndex);
        setTargetObject(targetObjects[nextIndex]);
    };

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

         const isCorrect = classificationResult.some((result) => 
            result.className.toLowerCase().includes(targetObject.name.toLowerCase())
        );

        if (isCorrect) {
            alert(`Parabéns, você encontrou ${targetObject.name}!`);
            setFoundObjectsCount(foundObjectsCount + 1);
            nextTarget();
        }
        <Text style={styles.counterText}>Objetos encontrados: {foundObjectsCount}</Text>
    }

    if (foundObjectsCount === targetObjects.length) {
        alert('Parabéns, você encontrou todos os objetos!');
        setGameStarted(false); // Reinicia o jogo
        setFoundObjectsCount(0); // Reseta a contagem
    }

    return (
        <ImageBackground source={require('../../assets/images/nuvem_back_light.png')} style={styles.container}>
            <View style={styles.container}>
                <StatusBar style="light" backgroundColor="transparent" translucent />
                
                {!gameStarted ? (
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>Encontra {targetObject.name}!</Text>
                        <Image 
                            source={targetObject.image} // Exibe a imagem do objeto atual
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
        width: '100%',  
        height: '100%', 
        resizeMode: 'cover', // Isso garante que a imagem preencha a tela
        position: 'absolute' ,
         justifyContent: 'center', 
         alignItems: 'center'
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
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 3,
        padding: 5,
    },
    gameContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginTop: wp(15),
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
        paddingVertical: wp(2),
        paddingHorizontal: hp(2.5),
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(7),
        zIndex: 1,
        marginBottom: hp(6),
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
        bottom: hp(5),
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
    counterText: {
        fontFamily: "outfit-medium",
        fontSize: wp(5),
        color: Colors.DARKBLUE,
        marginBottom: 20,
    },
});
