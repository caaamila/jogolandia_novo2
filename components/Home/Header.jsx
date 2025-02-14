import { View, Text, Image,  TouchableOpacity  } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router';


export default function Header() {
    const {user}=useUser();
    const router = useRouter();

  return (
    <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    }}>
        <View>
        <Text style={{
            fontFamily: 'outfit',
            fontSize: 30,
        }}>Olá, </Text>    
        <Text style={{
            fontFamily: 'outfit-medium',
            fontSize: 35,
        }}>{user?.firstName}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
        <Image
            source={{ uri: user?.imageUrl }}
            style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            }}
        />
        </TouchableOpacity>
    </View>
  )
}