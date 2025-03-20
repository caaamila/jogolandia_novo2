import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';

export type ClassificationProps = {
    probability: number;
    className: string;
}

type Props = {
    data: ClassificationProps;
}

async function translateText(text: string): Promise<string> {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=en|pt`);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Erro na tradução:", error);
        return text;
    }
}

export function Classification({ data }: Props) {
    const [translatedText, setTranslatedText] = useState(data.className);

    useEffect(() => {
        translateText(data.className).then(setTranslatedText);
    }, [data.className]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.box} />
            <View style={styles.container}>
                <View style={styles.probability}>
                    <Text style={styles.probabilityText}>
                        {(data.probability * 100).toFixed(0)}%
                    </Text>
                </View>
                <Text style={styles.className}>
                    {translatedText}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        position: 'absolute',
        backgroundColor: Colors.YELLOW,
        width: wp(80),
        height: hp(9),
        borderRadius: 20,
        zIndex: 0,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center', // Ensure items are aligned properly in the row
        borderRadius: 20,
        overflow: 'hidden',
        height: hp(9),
        width: wp(80),
    },
    probability: {
        backgroundColor: '#FFB800',
        borderRadius: 50, // This creates a circular shape
        width: hp(6),
        height: hp(6),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: hp(1.5), // Add some space between the circle and the class name
    },
    probabilityText: {
        fontFamily: 'outfit-medium',
        fontSize: wp(4),
        textAlign: 'center',
        color: Colors.DARKBLUE,
    },
    className: {
        backgroundColor: Colors.YELLOW,
        padding: 12,
        fontFamily: 'outfit',
        fontSize: wp(5),
        color: Colors.DARKBLUE,
        flex: 1, // This will make the class name text take up the remaining space
    },
});
