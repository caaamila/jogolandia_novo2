import { View, Text, Image, Pressable, SafeAreaView, Animated } from 'react-native'
import React, { useCallback, useRef, useEffect } from 'react'
import Colors from '../../constants/Colors'
import * as WebBrowser from 'expo-web-browser'
import { useOAuth, useAuth } from '@clerk/clerk-expo'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as Linking from 'expo-linking'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen({ navigation }) {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const { isSignedIn } = useAuth();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSignedIn) {
      navigation.replace('home'); // Redireciona para a página inicial se já estiver logado
    }
  }, [isSignedIn, navigation]);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const onPress = useCallback(async () => {
    console.log("button clicked")
    try {
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }),
      })

      if (createdSessionId) {
        console.log("Login Feito!");
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.CYAN }}>
      <Image 
        source={require('./../../assets/images/boneki.png')}
        style={{
          width: wp('100%'),
          height: hp('50%'),
          resizeMode: 'cover',
        }}
      />

      <View style={{
        flex: 1,
        backgroundColor: Colors.CYAN,
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingTop: hp('5%')
      }}>
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: wp('8%'),
          textAlign: 'center',
          color: Colors.WHITE,
        }}>
          Começa a aprender!
        </Text>

        <Text style={{
          fontFamily: 'outfit',
          fontSize: wp('5%'),
          textAlign: 'center',
          color: Colors.WHITE,
          marginTop: hp('1%'),
        }}>
          Basta fazer login!
        </Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={{
              paddingVertical: hp('2%'),
              marginTop: hp('4%'),
              backgroundColor: Colors.YELLOW,
              width: wp('80%'),
              borderRadius: wp('4%'),
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontFamily: 'outfit-medium',
              fontSize: wp('6%'),
              color: Colors.DARKBLUE,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <AntDesign name="google" size={wp('6%')} color={Colors.DARKBLUE} /> {' '}
              Entrar com Google
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}
