import { G, Path, Ellipse, Rect } from 'react-native-svg';

type ImageProps = {
  onFill: (i: number) => void;
  fillColors: string[];
};

const ColorableSVG = ({ onFill, fillColors }: ImageProps) => {
  return (
    <G>
      {/* Retângulo grande ao fundo */}
      <Rect
        onPress={() => onFill(0)}
        fill={fillColors[0]}
        width="200"
        height="200"
        x="10"
        y="10"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Retângulo intermediário */}
      <Rect
        onPress={() => onFill(1)}
        fill={fillColors[1]}
        width="160"
        height="160"
        x="30"
        y="30"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Retângulo pequeno */}
      <Rect
        onPress={() => onFill(2)}
        fill={fillColors[2]}
        width="120"
        height="120"
        x="50"
        y="50"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Círculo central */}
      <Ellipse
        onPress={() => onFill(3)}
        fill={fillColors[3]}
        cx="110"
        cy="110"
        rx="50"
        ry="50"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Caminho curvado */}
      <Path
        onPress={() => onFill(4)}
        fill={fillColors[4]}
        d="M 10 180 Q 110 120, 210 180"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  );
};

export default ColorableSVG;
