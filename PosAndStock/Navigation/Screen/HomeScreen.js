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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getProducts,
  deleteProduct,
  deleteAllProducts,
} from '../../database/database';

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
      <Image source={require('../../Image/water.jpg')} style={styles.image} />
      <View style={styles.productTextContainer}>
        <Text style={styles.productText}>{item.Name}</Text>
        <Text style={styles.productText}>ราคา ฿ {item.Price}</Text>
        <Text style={styles.productText}>{item.BarCode}</Text>
        <Text style={styles.productText}>{item.ptID}</Text>
       
        
      </View>
      <View>
      <Text style={styles.productText}>จำนวน : {item.Quantity}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.ID) }>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="black"
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
});
