import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { insertStock } from '../../database/StockDatabase'; // ตรวจสอบว่าฟังก์ชันนี้ถูกสร้างและนำเข้ามาอย่างถูกต้อง
import { RNCamera } from 'react-native-camera';

// import { RNCamera } from 'react-native-camera';

export default function StockScreen({ navigation }) {
  const [name, setName] = useState('');
  const [ptID, setPtID] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [barCode, setBarCode] = useState('');
  const [pack, setPack] = useState('');




  const [isScanning, setIsScanning] = useState(false);

  const handleBarCodeRead = ({ type, data }) => {
    setBarCode(data);
    if(data){
      setIsScanning(false); // ปิดกล้องหลังจากสแกนได้สำเร็จ

    }
    // หากต้องการทำอย่างอื่นกับข้อมูลบาร์โค้ดที่ได้ สามารถทำได้ที่นี่
  };



  const handleInsert = async () => {
    if (!name.trim() || !price || !quantity || !ptID || !pack) {
      alert('โปรดกรอกข้อมูลทุกช่อง');
      return;
    }
    try {

      const productPrice = parseFloat(price);
      const productQuantity = parseInt(quantity, 10);
      const productPack = parseInt(pack, 10);
      if (isNaN(productPrice) || isNaN(productQuantity) || isNaN(productPack)) {
        alert('Price, Quantity and Pack need to be valid numbers.');
        return;
      }
  
      "(Name TEXT, ptID TEXT, PicturePath TEXT, Price REAL, Quantity INTEGER, BarCode TEXT, Pack INTEGER);",
      await insertStock(name,ptID,'',price,quantity,barCode,pack);
   
      alert('Stock inserted successfully');

      setName('');
      setPtID('');
      setPrice('');
      setQuantity('');
      setBarCode('');
      setPack('');
    } catch (error) {
      console.error('Failed to insert the stock', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stock Screen</Text>


      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="Unit per Pack"
        value={pack}
        keyboardType="numeric"
        onChangeText={setPack}
      />
      <TextInput
        style={styles.input}
        placeholder="Product type"
        value={ptID}
        onChangeText={setPtID} 
      />
     <TextInput
        style={styles.input}
        placeholder="Barcode"
        value={barCode}
        keyboardType="default"
        onChangeText={setBarCode} 
      />
      {!isScanning && (
        <View style={styles.buttonContainer}>
          <Button
            title="Scan Barcode"
            onPress={() => setIsScanning(true)}
          />
        </View>
      )}

      {isScanning && (
        <View style={styles.cameraContainer}>
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            onBarCodeRead={handleBarCodeRead}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
          <View style={styles.buttonContainer}>
            <Button title="Stop Scanning" onPress={() => setIsScanning(false)} />
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Insert Product" onPress={handleInsert} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },

  image: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
  },

  cameraContainer: {
    width: '50%',
    height: '50%',
  },
  preview: {
    width: '100%',
    height: '50%',
  },
  buttonContainer: {
    marginVertical: 10, // เพิ่มระยะห่างแนวตั้ง
  },
});
