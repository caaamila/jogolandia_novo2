import { View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Category from './Category';
import { collection, where, getDocs, query } from '@firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GameListItem from './GameListItem'; 

export default function GameListByCategory() {
  
  const [gameList, setGameList] = useState([]);
  const [loader, setLoader] = useState(false); 

  useEffect(() => {
    GetGameList('Cores');
  }, []);

  const GetGameList = async (category) => {
    setLoader(true);  // Start loader when fetching data
    setGameList([]);  // Clear existing game list

    try {
      const q = query(collection(db, 'Jogos'), where('category', '==', category));
      const querySnapshot = await getDocs(q);

      const games = [];
      querySnapshot.forEach((doc) => {
        games.push(doc.data());  // Collect games in an array
      });

      setGameList(games);  // Update game list once all data is fetched
    } catch (err) {
      console.error('Erro em obter informação:', err);
    } finally {
      setLoader(false);  // Stop loader after fetching data
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <Category category={(value) => GetGameList(value)} />

        {/* Show Activity Indicator if loader is true */}
        {loader ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={gameList}
            style={{ marginTop: 10 }}
            horizontal={true}
            refreshing={loader}  // Tied to loader state
            onRefresh={() => GetGameList('Cores')}
            renderItem={({ item }) => <GameListItem game={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}