import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {insertStock} from '../../database/StockDatabase'; // ตรวจสอบว่าฟังก์ชันนี้ถูกสร้างและนำเข้ามาอย่างถูกต้อง
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';

// import { RNCamera } from 'react-native-camera';

export default function StockScreen({navigation}) {
  const [name, setName] = useState('');
  const [ptID, setPtID] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [barCode, setBarCode] = useState('');
  const [pack, setPack] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [imageUri, setImageUri] = useState('');

  const handleBarCodeRead = ({type, data}) => {
    setBarCode(data);
    if (data) {
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
      // ตรวจสอบความถูกต้องของตัวเลข
      const productPrice = parseFloat(price);
      const productQuantity = parseInt(quantity, 10);
      const productPack = parseInt(pack, 10);
      if (isNaN(productPrice) || isNaN(productQuantity) || isNaN(productPack)) {
        alert('ราคา, จำนวน และจำนวนสินค้าต่อแพ็คต้องเป็นตัวเลข');
        return;
      }

      // ส่งข้อมูลไปยังฟังก์ชัน insertStock
      await insertStock(
        name,
        ptID,
        imageUri,
        productPrice,
        productQuantity,
        barCode,
        productPack,
      );

      alert('เพิ่มสินค้าในคลังเสร็จสิ้น');

      // รีเซ็ตข้อมูล
      setName('');
      setPtID('');
      setPrice('');
      setQuantity('');
      setBarCode('');
      setPack('');
      setImageUri('');
    } catch (error) {
      console.error('Failed to insert the stock', error);
    }
  };

  const handleSelectImage = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // เก็บ URI ของภาพ
        setImageUri(response.assets[0].uri);
        console.log('Image URI: ', response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ชื่อสินค้า"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="ราคาที่ต้องการขาย"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="จำนวน"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="จำนวนสินค้าต่อแพ็ค"
        value={pack}
        keyboardType="numeric"
        onChangeText={setPack}
      />
      <TextInput
        style={styles.input}
        placeholder="ชนิดของสินค้า"
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
          <TouchableOpacity
            onPress={() => setIsScanning(true)}
            style={styles.button}>
            <Text style={styles.buttonText}>สแกนบาร์โค้ดสินค้า</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSelectImage} style={styles.button}>
          <Text style={styles.buttonText}>เลือกภาพ</Text>
        </TouchableOpacity>
      </View>
      {imageUri !== '' && (
        <Image source={{uri: imageUri}} style={styles.image} />
      )}

      {isScanning && (
        <View style={styles.cameraContainer}>
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            onBarCodeRead={handleBarCodeRead}
            androidCameraPermissionOptions={{
              title: 'ขออณุญาตใช้กล้อง',
              message: 'เราต้องได้รับอนุญาตจากคุณเพื่อใช้กล้องของคุณ',
              buttonPositive: 'อนุญาต',
              buttonNegative: 'ไม่อนุญาต',
            }}
          />
          <View style={styles.button}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setIsScanning(false)}
                style={styles.button}>
                <Text style={styles.buttonText}>หยุดสแกน</Text>
              </TouchableOpacity>
            </View>

            
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleInsert} style={styles.buttoninsert}>
          <Text style={styles.buttonText}>เพิ่มสินค้า</Text>
        </TouchableOpacity>
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
    height: '40%',
  },
  preview: {
    width: '100%',
    height: '50%',
  },
  buttonContainer: {
    marginVertical: 10, // เพิ่มระยะห่างแนวตั้ง
  },

  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20, // ระยะข้างในปุ่ม
    paddingVertical: 10, // ระยะข้างในปุ่ม
    margin: 5, // ระยะห่างจากปุ่มอื่น
    minWidth: 160, // ขนาดขั้นต่ำของปุ่ม
    alignItems: 'center', // จัดกลางข้อความ
    backgroundColor: '#0066cc',
    maxHeight:100
  },
  buttonText: {
    color: 'white', // สีข้อความ
    fontWeight: 'bold', // ความหนาของข้อความ
  },
  buttoninsert: {
    paddingHorizontal: 20, // ระยะข้างในปุ่ม
    paddingVertical: 10, // ระยะข้างในปุ่ม
    margin: 5, // ระยะห่างจากปุ่มอื่น
    minWidth: 160, // ขนาดขั้นต่ำของปุ่ม
    alignItems: 'center', // จัดกลางข้อความ
    backgroundColor: 'green',
    maxHeight:100
  },
});
