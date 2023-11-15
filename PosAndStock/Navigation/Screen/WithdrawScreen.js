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


    const handleDelete = id => {
    Alert.alert(
      'ลบข้อมูล',
      'คุณแน่ใจหรือว่าต้องการลบข้อมูลนี้?',
      [
        {
          text: 'ยกเลิก',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'ลบ',
          onPress: async () => {
            try {
              await deleteStock (id);
              setStock(products =>
                products.filter(product => product.ID !== id),
              );
            } catch (error) {
              console.error('Failed to delete the product', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const deleteItem = async (id) => {
    try {
      await deleteStock(id);
      setStock(currentStock => currentStock.filter(item => item.ID !== id));
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Failed to delete the item', error);
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
        await insertProduct(item.Name, '', '', '', '', item.Price, item.Pack, item.BarCode);
      }
      
      // อัปเดตจำนวนใน Stock
      await updateStockQuantity(item.ID, item.Quantity - 1);
      
      Alert.alert("สำเร็จ", "สินค้าได้ถูกเพิ่มและจำนวนได้ถูกอัปเดต");
    } catch (error) {
      console.error('Failed to add product:', error);
      Alert.alert("ผิดพลาด", "ไม่สามารถเพิ่มสินค้าได้: " + error.message);
    }
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
        <Button
          title="เพิ่ม"
          onPress={() => addProduct(item)}
        />
        <Button style={styles.button}
          onPress={handleDelete}
          title="ลบ"
        />
        
        

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
});
