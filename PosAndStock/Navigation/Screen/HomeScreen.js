import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity ,FlatList , Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getProducts , deleteProduct } from '../../database/database';



const ProductItem = ({ item, onDelete }) => {
  const confirmDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDelete(item.ID) }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={confirmDelete} style={styles.settingsIcon}>
      <Ionicons name="trash" size={24} color="black" />
    </TouchableOpacity>
  );
};


export default function HomeScreen({ navigation }) {
  
  const [products, setProducts] = useState([]); // เริ่มต้น state ด้วย array ว่าง

  useEffect(() => {
    
    const loadProducts = async () => {
      try {
        const productsFromDB = await getProducts(); // ดึงข้อมูลจากฐานข้อมูล
        setProducts(productsFromDB); // อัปเดต state
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };

    loadProducts();
    
  }, []);
  const renderProduct = ({ item, navigation }) => (
    <View style={styles.productContainer}>
      {/* <Image
        source={{ uri: item.PicturePath }}
        style={styles.productImage}
      /> */}
      <View style={styles.productTextContainer}>
        <Text style={styles.productText}>{item.Name}</Text>
        <Text style={styles.productText}>ราคา : {item.Price}</Text>
        <Text style={styles.productText}>จำนวน : {item.Quantity}</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('SettingsScreen', { product: item })}
        style={styles.settingsIcon}
      >
        <Ionicons name="settings" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.ID.toString()} // ID คือ primary key ของผลิตภัณฑ์ในฐานข้อมูล
      />

    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // text: {
  //   textAlign: 'center',
  //   fontSize: 20,
  // },
  // productContainer: {
  //   padding: 10,
  //   marginTop: 3,
  //   backgroundColor: '#d9f9b1',
  //   alignItems: 'center',
  // },
  // productText: {
  //   color: 'black',
  // },
  productContainer: {
    flexDirection: 'row', // ทำให้ items ภายใน container นี้เรียงแนวนอน
    padding: 10,
    alignItems: 'center', // จัดกลางแนวตั้ง
  },
  productTextContainer: {
    flex: 1, // ให้ text container ยืดเต็มพื้นที่ที่เหลือ
    marginLeft: 10, // ระยะห่างจากรูปภาพ
  },
  productText: {
    color: 'black',
  },
  productImage: {
    width: 50, // กำหนดขนาดของรูปภาพ
    height: 50, // กำหนดขนาดของรูปภาพ
    resizeMode: 'cover', // กำหนดวิธีการ resize ภาพ
  },
});
