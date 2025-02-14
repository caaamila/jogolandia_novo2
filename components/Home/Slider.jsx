import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const flatListRef = useRef(null); // Referência para o FlatList
  const [currentIndex, setCurrentIndex] = useState(0); // Índice atual do slider
  const autoSlideInterval = useRef(null); // Armazena o intervalo para limpeza posterior

  useEffect(() => {
    GetSliders();
  }, []);

  useEffect(() => {
    if (sliderList.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide(); // Limpa o intervalo ao desmontar ou quando sliderList muda
  }, [sliderList]);

  const GetSliders = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Sliders'));
      const sliders = [];
      snapshot.forEach((doc) => {
        sliders.push(doc.data());
      });
      setSliderList(sliders);
      console.log('Fetched slider data:', sliders);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sliderList.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 5000); // Aumente o intervalo para 5 segundos entre slides
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
  };

  // Renderizar mensagem se não houver sliders
  if (!sliderList.length) {
    return (
      <View style={styles.centeredView}>
        <Text>No Sliders Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image
              source={item?.imageUrl ? { uri: item.imageUrl } : require('../../assets/images/boneki.png')}
              style={styles.sliderImage}
              onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onScrollToIndexFailed={(info) => {
          console.warn('Failed to scroll to index:', info);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  sliderImage: {
    width: Dimensions.get('screen').width * 0.9,
    height: 200,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: 'gray',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
