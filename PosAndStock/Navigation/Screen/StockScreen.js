import * as React from 'react'
import { View , Text , StyleSheet} from 'react-native'

export default function StockScreen ({navigation}){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Stock Screen</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
      fontSize: 20,
      // สไตล์อื่น ๆ ที่คุณต้องการเพิ่ม
    },
  });