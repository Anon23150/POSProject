import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity , Alert, Button} from 'react-native';
import { getStock , deleteStock , updateStockAndProductQuantity ,updateStockQuantity} from '../../database/StockDatabase';
import { insertProduct , getProductsByBarCode , updateProductQuantityByBarCode} from '../../database/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function WithdrawScreen({ navigation }) {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStock();
    });

    loadStock();


    return unsubscribe;
  }, [navigation]);

  const loadStock = async () => {
    try {
      const stockData = await getStock();
      setStock(stockData);
    } catch (error) {
      console.error('Error loading stock:', error);
    }
  };




  const addProduct = async (item) => {
    try {
      // ส่วนนี้จะตรวจสอบก่อนว่ามีสินค้าใน Products หรือยัง
      const productsWithBarCode = await getProductsByBarCode(item.BarCode);
      
      if (productsWithBarCode.length > 0) {
        // สินค้ามีอยู่แล้ว อัปเดตจำนวน
        const newQuantity = productsWithBarCode[0].Quantity + item.Pack;
        await updateProductQuantityByBarCode(item.BarCode, newQuantity);
      } else {
        // สินค้ายังไม่มี ให้ทำการเพิ่มสินค้าใหม่ใน Products
        //"INSERT INTO Products (Name, pmID, ptID, pcID, PicturePath, Price, Quantity,BarCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        //"INSERT INTO Stock (Name, ptID, PicturePath, Price, Quantity, BarCode, Pack) VALUES (?, ?, ?, ?, ?, ?, ?);",
        await insertProduct(item.Name, '', item.ptID, '', '', item.Price*1.2, item.Pack, item.BarCode);
      }
      
      // อัปเดตจำนวนใน Stock
      await updateStockQuantity(item.ID, item.Quantity - 1);
      
      Alert.alert("สำเร็จ", "สินค้าได้ถูกเพิ่มและจำนวนได้ถูกอัปเดต");
    } catch (error) {
      console.error('Failed to add product:', error);
      Alert.alert("ผิดพลาด", "ไม่สามารถเพิ่มสินค้าได้: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'ลบข้อมูล',
      'คุณแน่ใจหรือว่าต้องการลบข้อมูลนี้?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ลบ',
          onPress: async () => {
            try {
              const result = await deleteStock(id);
              console.log(result);
              // After deleting, refresh the list to remove the item from UI
              await loadStock();
            } catch (error) {
              console.error('Failed to delete the product', error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };
  
  
  const renderItem = ({item, navigation}) => (
    <View style={styles.productContainer}>
      <Image source={require('../../Image/water.jpg')} style={styles.image} />

      <View style={styles.productTextContainer}>
        <Text style={styles.productText}>{item.Name}</Text>
        <Text style={styles.productText}>ราคา ฿ {item.Price}</Text>
        <Text style={styles.productText}>{item.BarCode}</Text>
        
      </View>
      <View>
        <Text style={styles.productText}>จำนวน : {item.Quantity}</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="เพิ่ม"
            onPress={() => addProduct(item)}
          />
          <Button
            title="ลบ"
            onPress={() => handleDelete(item.ID)}
          />
        </View>
        
        

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stock}
        keyExtractor={item => item.ID.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row', 
    padding: 10,
    alignItems: 'center',
  },
  productTextContainer: {
    flex: 1, 
    marginLeft: 10, 
  },
  productText: {
    color: 'black',
  },
  productImage: {
    width: 50, 
    height: 50,
    resizeMode: 'cover',
  },
  image: {
    width: 50, 
    height: 50, 
    resizeMode: 'contain', 
  },
  button:{
    width: 50,
    height:50
  },
  buttonContainer: {
    flexDirection: 'row', // ให้ปุ่มเรียงแนวนอน
    justifyContent: 'flex-end', // จัดให้ปุ่มอยู่ทางด้านขวา
  },
});
