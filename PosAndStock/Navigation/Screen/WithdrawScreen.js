import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import {
  getStock,
  deleteStock,
  updateStockAndProductQuantity,
  updateStockQuantity,
} from '../../database/StockDatabase';
import {
  insertProduct,
  getProductsByBarCode,
  updateProductQuantityByBarCode,
} from '../../database/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function WithdrawScreen({navigation}) {
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
      console.log(
        '-------------------------------------------------------------------------------------',
      );
      console.log(stockData);
    } catch (error) {
      console.error('Error loading stock:', error);
    }
  };

  const addProduct = async item => {
    try {
      // ส่วนนี้จะตรวจสอบก่อนว่ามีสินค้าใน Products หรือยัง
      const productsWithBarCode = await getProductsByBarCode(item.BarCode);

      if (productsWithBarCode.length > 0) {
        // สินค้ามีอยู่แล้ว อัปเดตจำนวน
        const newQuantity = productsWithBarCode[0].Quantity + item.Pack;
        await updateProductQuantityByBarCode(item.BarCode, newQuantity);
      } else {
        // สินค้ายังไม่มี ให้ทำการเพิ่มสินค้าใหม่ใน Products
        //"INSERT INTO Stock    (Name, ptID, PicturePath, Price, Quantity, BarCode, Pack) VALUES (?, ?, ?, ?, ?, ?, ?);",
        //"INSERT INTO Products (Name, pmID, ptID, pcID, PicturePath, Price, Quantity,BarCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        await insertProduct(
          item.Name,
          '',
          item.ptID,
          '',
          item.PicturePath,
          (item.Price * 1.2).toFixed(2),
          item.Pack,
          item.BarCode,
        );
      }

      // อัปเดตจำนวนใน Stock
      await updateStockQuantity(item.ID, item.Quantity - 1);

      Alert.alert('สำเร็จ', 'สินค้าได้ถูกเพิ่มและจำนวนได้ถูกอัปเดต');
    } catch (error) {
      console.error('Failed to add product:', error);
      Alert.alert('ผิดพลาด', 'ไม่สามารถเพิ่มสินค้าได้: ' + error.message);
    }
  };

  const handleDelete = async id => {
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
      {cancelable: false},
    );
  };

  const renderItem = ({item, navigation}) => (
    <View style={styles.productContainer}>
      {item.PicturePath ? (
        <Image source={{uri: item.PicturePath}} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>No Image</Text> // แสดงข้อความหากไม่มีภาพ
      )}

      <View style={styles.productTextContainer}>
        <Text style={styles.productText}>{item.Name}</Text>
        <Text style={styles.productText}>ราคา ฿ {item.Price}</Text>
        <Text style={styles.productText}>{item.ptID}</Text>
      </View>
      <View style={styles.productActionContainer}>
        <Text style={styles.productText}>จำนวน : {item.Quantity}</Text>

        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={() => addProduct(item) } style={{padding:5,marginTop:5}}>
            <Image
              style={styles.tinyLogo}
              source={require('../../Icon/plus-circle.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => handleDelete(item.ID)} style={{padding:5}}>
            <Image
              style={styles.tinyLogo}
              source={require('../../Icon/trash.png')}
            />
          </TouchableOpacity>
          
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
    //alignItems: 'center',
    margin: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productText: {
    color: 'black',
    fontSize: 16,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  productActionContainer: {
    alignItems: 'flex-end', // Align the icon and text to the right
    justifyContent: 'center', // Center the content vertically
  },
});
