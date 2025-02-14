import { View, Text, StyleSheet, ImageBackground, FlatList, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Home/Header';
import Colors from '../../constants/Colors';
import { useNavigation } from 'expo-router';
import Slider from '../../components/Home/Slider';
import { usePoints } from '../context/PointsContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { format, differenceInCalendarDays, addDays } from "date-fns";
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';
import { pt } from "date-fns/locale"; // Importa o idioma português


export default function Home() {
  const navigation = useNavigation();
  const { points, addPoints } = usePoints();  // Garante que pode adicionar pontos
const [streak, setStreak] = useState(0);  // Estado para a streak de login
const [streakDays, setStreakDays] = useState([]);
const bobAnimation = useRef(new Animated.Value(1)).current;

useEffect(() => {
  navigation.setOptions({
    headerTransparent: true,
  });
}, []);

useEffect(()=> {
  initializeStreak();
});

const initializeStreak = async () => {
          const today = new Date();
          const lastOpened = await AsyncStorage.getItem("lastOpened");
          const storedStreak = parseInt(
            (await AsyncStorage.getItem("streak")) || "0",10);
          const startDay = new Date(
            (await AsyncStorage.getItem("startDay")) || today
          );
          let newStreak = storedStreak;
          let newStartDay = startDay;
          let shouldAddPoints = false;


          if (lastOpened) {
            const lastDate = new Date(lastOpened);
            const dayDifference = differenceInCalendarDays(today, lastDate);

            if (dayDifference === 1) {
              newStreak++; // Continue the streak
              bob();
              shouldAddPoints = true;
            } else if (dayDifference > 1) {
              newStreak = 1; // Reset the streak
              newStartDay = today;
              shouldAddPoints = true;
            }
          } else {
            newStreak = 1; // First-time initialization
            shouldAddPoints = true;
          }

          await AsyncStorage.multiSet([
            ["streak", newStreak.toString()],
            ["startDay", newStartDay.toISOString()],
            ["lastOpened", today.toISOString()],
            ]);
  
            setStreak(newStreak);
            setStreakDays(generateStreakDays(newStartDay, newStreak));
            
            if (shouldAddPoints) {
              const pointsToAdd = newStreak * 5; // Points increase by 5 for each consecutive day
              addPoints(pointsToAdd);
            }
    };

    const generateStreakDays = (startDay, streakCount) => {
      return Array.from({ length: 7 }, (_, i) => ({
        day: addDays(startDay, i),
        completed: 
        i < (streakCount % 7 === 0 && streakCount !== 0 ? 7 : streakCount % 7),
      }));
    };

    const bob = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobAnimation, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(bobAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ).start();
    };

    const renderDay = ({ item, index }) => {
      const isLastDayOfStreak = index === (streak - 1) % 7;

      return (
        <View style={styles.dayContainer}>
          <Animated.View
            style={
              isLastDayOfStreak
                ? { transform: [{ scale: bobAnimation }] }
                : null
            }
          >
            <Octicons
              name={item.completed ? "check-circle-fill" : "circle"}
              size={40}
              color="lightgreen"
            />
          </Animated.View>
      <Text style={styles.dayText}>{format(item.day, "EEE", { locale: pt })}</Text>
        </View>
      );
    };


  return (
    <View style={styles.container}>
        <Header />

        <Text style={styles.texto}>Login Streak: {streak} 🔥</Text>
        <FlatList style={styles.FlatList}
        data={streakDays}
        horizontal
        keyExtractor={(item) => item.day.toISOString()}
        renderItem={renderDay}
        contentContainerStyle={[styles.daysContainer, { paddingBottom: 5 }]} // Reduz padding interno
        />
        <Slider style={styles.slider} />

        <Text style={styles.texto_pts}>Pontos atuais</Text>

        <ImageBackground 
          source={require('../../assets/images/background2.png')}
          style={styles.imageBackground}
        >
          <Text style={styles.pontos}>{points}</Text> 
        </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    backgroundColor: Colors.WHITE,
  },

  imageBackground: {
    width: '100%',
    height: hp(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(8),
    borderRadius: wp(8),
    overflow: 'hidden',
  },

  pontos: {
    marginTop: wp(12),
    fontFamily: 'outfit-medium',
    fontSize: wp(10),
    color: Colors.WHITE,
  },

  texto: {
    marginTop: hp(4),
    marginBottom: hp(2),
    fontFamily: 'outfit-medium',
    fontSize: wp(5),
  },

  texto_pts: {
    marginTop: hp(4),
    marginBottom: hp(2),
    fontFamily: 'outfit-medium',
    fontSize: wp(5),
  },
  daysContainer: {
    flexDirection: "row",
  },
  dayContainer: {
    alignItems: "center",
    marginHorizontal: wp(1.8),
  },
  dayText: {
    fontFamily: 'outfit',
    marginTop: hp(0.5),
    fontSize:  wp(3.5),
  },
  FlatList: {
    marginTop: hp(0.5),
    fontSize:  wp(3.5),
  },
});
