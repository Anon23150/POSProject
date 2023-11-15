import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default function ScanScreen() {
  const [barcode, setBarcode] = useState('');

  const handleBarCodeRead = e => {
    setBarcode(e.data);
    Alert.alert('Barcode Value', e.data, [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={handleBarCodeRead}
        flashMode={RNCamera.Constants.FlashMode.auto}
      >
        {barcode !== '' && (
          <View style={styles.barcodeBox}>
            <Text style={styles.barcodeText}>{barcode}</Text>
          </View>
        )}
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barcodeBox: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    right: '20%',
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  barcodeText: {
    fontSize: 18,
    color: 'black',
  },
});
