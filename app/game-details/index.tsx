import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import GameInfo from '../../components/Home/GameDetails/GameInfo';

export default function GameDetails() {
    const game=useLocalSearchParams();
    const navigation=useNavigation();
    useEffect(()=>{
        navigation.setOptions({
            headerTransparent:true,
            headerTitle:''
        })
    }, [])
  return (
    <View>
      <GameInfo game={game}/>
    </View>
  )
}   