import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {storeData, getData, removeData} from '../../database/temporaryStoreage';

export default function ScanScreen({navigation}) {
  const [isScanning, setIsScanning] = useState(false);

  const handleBarCodeRead = async e => {
    if (isScanning) {
      return; // If already scanning, do nothing
    }
    setIsScanning(true); // Set scanning to true to prevent further scans

    // Add a delay before setting scanning to false again
    setTimeout(() => {
      setIsScanning(false); // After 2 seconds, allow scanning again
    }, 2000); // Delay of 2 seconds

    // Show the alert to the user
    Alert.alert('รหัส Barcode', e.data, [
      {
        text: 'ยกเลิก',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'เพิ่ม', onPress: () => addBarcodeToList(e.data)},
    ]);
  };

  const goToBillScreen = barcodes => {
    navigation.navigate('Bill');
  };


  const addBarcodeToList = async barcode => {
    // Retrieve the current list of scanned barcodes from storage
    const currentBarcodes = (await getData('@scanned_barcodes')) || [];

    // Add the new barcode to the list
    const updatedBarcodes = [...currentBarcodes, barcode];

    // Save the updated list back to storage
    await storeData('@scanned_barcodes', updatedBarcodes);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={handleBarCodeRead}
        flashMode={RNCamera.Constants.FlashMode.off}></RNCamera>
      <TouchableOpacity style={styles.fab} onPress={goToBillScreen}>
        <Text style={styles.fabIcon}>ใบเสร็จ</Text>
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFFFCC',
    borderRadius: 100,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 18,
    color: 'black',
  },
  fabLeft: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    bottom: 20,
    backgroundColor: '#FAB',
    borderRadius: 30,
    elevation: 8,
  },
});
