import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Button,
} from 'react-native';
// import Icon from 'react-native-vector-icons/EvilIcons';
import {
  getProducts,
  deleteProduct,
  deleteAllProducts,
} from '../../database/database';
import {Icon} from '@rneui/base';

export default function HomeScreen({navigation}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProducts();
    });

    loadProducts();

    return unsubscribe;
  }, [navigation]);

  const loadProducts = async () => {
    try {
      const productsFromDB = await getProducts();
      setProducts(productsFromDB);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsFromDB = await getProducts();
        setProducts(productsFromDB);
      } catch (error) {
        console.error('Failed to load products', error);
      }
    };

    loadProducts();
  }, []);

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
              await deleteProduct(id);
              setProducts(products =>
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
  // "INSERT INTO Products (Name, pmID, ptID, pcID, PicturePath, Price, Quantity,BarCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
  const renderProduct = ({item, navigation}) => (
    <View style={styles.productContainer}>
      {item.PicturePath ? (
        <Image source={{uri: item.PicturePath}} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>ไม่มีภาพ</Text> // แสดงข้อความหากไม่มีภาพ
      )}
      <View style={styles.productTextContainer}>
        <Text style={styles.productText}>{item.Name}</Text>
        <Text style={{color:'red',fontSize:16}}>ราคา ฿ {item.Price}</Text>
        <Text style={styles.productText}>{item.Type}</Text>
      </View>
      <View style={styles.productActionContainer}>
        <Text style={styles.productText}>จำนวน : {item.Quantity}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.ID)} style={{padding:10}}>
          <Image
            style={styles.tinyLogo}
            source={require('../../Icon/cog-6-tooth.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.ID.toString()}
      />

      {/* <Button onPress={deleteAllProducts} title="Delete ALL" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    padding: 10,
    // alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    shadowColor: '#000',
    margin: 10,
    padding: 10,
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
