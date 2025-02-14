import { View, Text , Image} from 'react-native';
import React, { useEffect } from 'react';
import { Tabs, useNavigation } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo'


export default function TabLayout() {
  const navigation = useNavigation();
      const {user}=useUser();
  

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.MANTISGREEN,
        tabBarStyle: {
          position: 'absolute',
          elevation: 5,
          backgroundColor: Colors.WHITE,
          height: 70, // Altura da navbar
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          justifyContent: 'center', // Garantir alinhamento vertical
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center', // Centralizar verticalmente cada ícone
          alignItems: 'center', // Centralizar horizontalmente cada ícone
          bottom: -12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <Octicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jogos"
        options={{
          title: 'Jogos',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="gamepad-variant-outline" size={31.5} color={color} marginLeft="-8"/>,
        }}
      />
      <Tabs.Screen
        name="conquistas"
        options={{
          title: 'Conquistas',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" size={30} color={color} />,
        }}
      />
      
          <Tabs.Screen
      name="profile"
      options={{
        title: 'Perfil',
        headerShown: false,
        tabBarIcon: () => (
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              width: 35, // Ajuste para o tamanho desejado
              height: 35,
              borderRadius: 20, 
            }}
          />
        ),
      }}
    />
    </Tabs>
  );
}