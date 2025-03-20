import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet } from "react-native";

type Props = TouchableOpacityProps & {
    title: string;
}

export function Button({ title, ...rest}: Props){
    return (
        <TouchableOpacity style={styles.container} {...rest}>
            <Text style={styles.title}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
      height: 56,
      width: "100%",
      backgroundColor: "#5F1BBF",
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
       color:"#FFF" ,
       fontSize: 16,
      },
  
  });