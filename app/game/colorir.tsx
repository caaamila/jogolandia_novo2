import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SvgViewer from '@/components/SvgViewer';
import {useEffect, useState} from 'react'
import ColorPalette from '@/components/ColorPalette';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, useNavigation } from 'expo-router';



export default function colorir() {
    const navigation = useNavigation();
    const [fillColors, setFillColors] = useState<string[]>(Array(5).fill('white'));
    const [currentColor, setCurrentColor] = useState<string>('#000000');

    useEffect(()=>{
        setFillColors(Array(5).fill('white'));
    },[]);

    useEffect(() => {
        navigation.setOptions({
          headerTransparent: true,
          headerTitle: '',
        });
      }, []);

    const onFill = (i: number) => {
    let newFillColors = fillColors.slice(0);
    newFillColors[i] = currentColor;
    setFillColors(newFillColors);
    };

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar style='auto'/>
        <ColorPalette currentColor={currentColor} changeColor={setCurrentColor}/>
        <SvgViewer fillColors={fillColors} onFill={onFill}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})