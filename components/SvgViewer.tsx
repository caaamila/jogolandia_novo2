import { View, Text, Dimensions, ScrollView } from 'react-native';
import DummySvg from './DummySvg';
import Svg from 'react-native-svg';

type SvgViewerProps = {
    onFill: (i: number) => void;
    fillColors: string[];
};

const SvgViewer = ({ onFill, fillColors }: SvgViewerProps) => {
return(
    <View>
        <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={3}
        minimumZoomScale={0.5} style={{width: Dimensions.get('screen').width}}
        contentContainerStyle={{width: Dimensions.get('screen').width * 2}}>
        <Svg 
        width={Dimensions.get('screen').width *2} 
        height={Dimensions.get('screen').height *2}
        viewBox={'0 0 400 900'}>
            <DummySvg fillColors={fillColors} onFill={onFill} />
        </Svg>
        </ScrollView>
 

    </View>
    );
};

export default SvgViewer;