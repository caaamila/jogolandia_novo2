import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ColorPaletteProps {
  currentColor: string;
  changeColor: (color: string) => void;
}

const ColorPalette = ({ currentColor, changeColor }: ColorPaletteProps) => {
  const colors = [
    '#5271ff' ,
    '#0cc0df',
    '#69e05c',
    '#ffd939',
    '#ff914d',
    '#F21B3F',
    '#ff7aa7',
    '#dd7bff',
    '#ffffff',
    '#000000',

  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/cepo_demadera.jpg')}  
        style={styles.backgroundImage}  resizeMode="cover" // Ajuste da imagem
        imageStyle={styles.imageStyle} // Aplica bordas arredondadas na imagem
        >
        <SafeAreaView style={styles.paletacontainer}>
          {colors.map((color) => {
            const activeClass = currentColor === color;
            return (
              <TouchableOpacity
                key={color}
                onPress={() => changeColor(color)}
              >
                <View
                  style={[
                    styles.item,
                    { backgroundColor: color },
                    activeClass ? styles.active : null,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz com que o container ocupe toda a tela disponível
    marginBottom: hp(19),
    marginTop: hp(5),
  },
  backgroundImage: {
    flex: 1, // Faz a imagem de fundo ocupar todo o espaço do container
    borderRadius: hp(4),
    height: hp(15),
    margin: hp(1),
  },
  imageStyle: {
    borderRadius: hp(3), // Arredonda as bordas da imagem
  },
  paletacontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: hp(1),
    justifyContent: 'center',
  },
  item: {
    width: hp(7),
    height: hp(5),
    borderWidth: hp(0.16),
    borderColor: 'black',
    borderRadius: 10,
    marginTop: hp(1.3),
  },
  active: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 9,
    shadowRadius: 7,
  },
});

export default ColorPalette;
