import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity ,FlatList , Alert ,Button} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getProducts , deleteProduct ,deleteAllProducts} from '../../database/database';








export default function HomeScreen({ navigation }) {
  
  const [products, setProducts] = useState([]); // เริ่มต้น state ด้วย array ว่าง

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // โหลดข้อมูลผลิตภัณฑ์
      loadProducts();
    });
  
    // โหลดข้อมูลเมื่อหน้านี้ถูกเปิดครั้งแรก
    loadProducts();
  
    // ทำความสะอาด listener เมื่อหน้านี้ไม่ได้ใช้งานแล้ว
    return unsubscribe;
  }, [navigation]);
  
  const loadProducts = async () => {
    try {
      const productsFromDB = await getProducts(); // ดึงข้อมูลจากฐานข้อมูล
      setProducts(productsFromDB); // อัปเดต state
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };
  

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

  const handleDelete = (id) => {
    Alert.alert(
      "ลบข้อมูล",
      "คุณแน่ใจหรือว่าต้องการลบข้อมูลนี้?",
      [
        {
          text: "ยกเลิก",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "ลบ", onPress: async () => {
            try {
              await deleteProduct(id);
              setProducts(products => products.filter(product => product.ID !== id));
            } catch (error) {
              console.error("Failed to delete the product", error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };



  
  const renderProduct = ({ item, navigation }) => (
    
    
    <View style={styles.productContainer}>
      <Image
        source={require('../../Image/123.jpg')}
        style={styles.image}
      />
     
      
      <View style={styles.productTextContainer}>
        <Text style={styles.productText}>{item.Name}</Text>
        <Text style={styles.productText}>ราคา : {item.Price}</Text>
        <Text style={styles.productText}>จำนวน : {item.Quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.ID)}>
        <MaterialCommunityIcons name="trash-can-outline" size={24} color="black" />
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

<Button
  onPress={deleteAllProducts}
  title="Learn More"
/>

    </View>
  );
}

const styles = StyleSheet.create({
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
  image: {
    width: 50,  // กำหนดความกว้างของรูปภาพ
    height: 50, // กำหนดความสูงของรูปภาพ
    resizeMode: 'contain', // หรือ 'cover', 'stretch', 'center' ตามที่คุณต้องการ
  },
});
