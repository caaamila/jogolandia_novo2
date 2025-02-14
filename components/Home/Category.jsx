import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Colors from './../../constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Category({ category = () => {} }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Tudo');

    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        setCategoryList([]);
        try {
            const snapshot = await getDocs(collection(db, 'Category'));
            const categories = [];
            snapshot.forEach((doc) => {
                categories.push(doc.data());
            });
            setCategoryList(categories);
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
        onPress={() => {
          console.log('Categoria selecionada:', item.name);
          setSelectedCategory(item.name);
          category(item.name);
        }}
        style={{ flex: 1 }}
      >
      
            <View
              style={[
                styles.container,
                selectedCategory === item.name && styles.selectedCategoryContainer,
            ]}
            >
                <Image source={{ uri: item?.imageUrl }} style={styles.image} />
            </View>
            <Text
                style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 17,
                    marginBottom: 10,
                    textAlign: 'center',
                    width: 80
                }}
            >
                {item?.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Categorias</Text>
            <FlatList
                data={categoryList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                horizontal // Adiciona rolagem horizontal
                showsHorizontalScrollIndicator={false} // Remove a barra de rolagem
                contentContainerStyle={{
                paddingHorizontal: 10, // Espaçamento horizontal
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: hp(4),
        paddingHorizontal: 0,
    },
    title: {
        fontFamily: 'outfit-medium',
        fontSize: hp(2),
        marginBottom: hp(1),
        marginLeft: hp(1.5),
        color: Colors.DARKBLUE,
    },
    container: {
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        margin: 5,
    },
    image: {
        width: 50,
        height: 50,
    },

    selectedCategoryContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5,
    },
});