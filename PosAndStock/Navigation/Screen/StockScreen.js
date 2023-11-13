import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { insertProduct } from '../../database/database'; // ตรวจสอบว่าฟังก์ชันนี้ถูกสร้างและนำเข้ามาอย่างถูกต้อง

// import { RNCamera } from 'react-native-camera';

export default function StockScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pdType, setpdType] = useState('');
  const [pmID, setpmID] = useState('');
  const [barCode, setBarCode] = useState('');




  // const handleBarCodeRead = e => {
  //   // จัดการกับข้อมูลบาร์โค้ดที่สแกนได้
  //   setBarCode(e.data);
  // };



  const handleInsert = async () => {
    if (!name.trim() || !price || !quantity) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      // แปลงราคาและจำนวนเป็นตัวเลขถ้าจำเป็น
      const productPrice = parseFloat(price);
      const productQuantity = parseInt(quantity, 10);
      if (isNaN(productPrice) || isNaN(productQuantity)) {
        alert('Price and Quantity need to be valid numbers.');
        return;
      }
      //await insertProduct(name, productPrice, productQuantity);
      //await insertProduct('Name', 'Promotion', 'ProductType', 'bill', 'paht', price, quantity);
      //await insertProduct(name, pmID, pdType, '', '', productPrice, productQuantity);
      await insertProduct(name, pmID, pdType, '','', productPrice, productQuantity,barCode);
   
      alert('Product inserted successfully');
      // ทำการ clear fields หลังจากการ insert
      setName('');
      setPrice('');
      setQuantity('');
      setpdType('');
      setpmID('');
      setBarCode('')
    } catch (error) {
      console.error('Failed to insert the product', error);
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
        placeholder="Product type"
        value={pdType}
        onChangeText={setpdType} 
      />

      <TextInput
        style={styles.input}
        placeholder="Promotion"
        value={pmID}
        keyboardType="default" 
        onChangeText={setpmID} 
      />
      <TextInput
        style={styles.input}
        placeholder="Barcode"
        value={barCode}
        keyboardType="default"
        onChangeText={setBarCode} 
      />
      {/* <Button title="Scan Barcode" onPress={() => setScanning(true)} />
      {scanning && (
        <RNCamera
          style={styles.preview}
          onBarCodeRead={handleBarCodeRead}
          // ... คุณสมบัติอื่นๆ ที่คุณอาจต้องการตั้งค่า ...
        />
      )} */}
      <Button title="Insert Product" onPress={handleInsert} />
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
  // เพิ่มสไตล์อื่น ๆ ตามที่คุณต้องการ
});
