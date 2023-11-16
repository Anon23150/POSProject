import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity ,FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { storeData, getData ,removeData} from '../../database/temporaryStoreage';
import {getProductsByBarCode } from '../../database/database';

const BillScreen = ({  navigation }) => {

    const [currentDate, setCurrentDate] = useState('');
    const [scannedBarcodes, setScannedBarcodes] = useState([]);
    const [productDetails, setProductDetails] = useState({});




    
    useEffect(() => {
      const date = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const hours = new Date().getHours();
      const min = new Date().getMinutes();
      
      setCurrentDate(
        date + ' : ' + month + ' : ' + year + '   TIME : ' + hours + ' : ' + min
      );
  
      const fetchScannedBarcodes = async () => {
        const barcodeData = await getData('@scanned_barcodes');
        if (barcodeData) {
          const barcodeCounts = {};
          barcodeData.forEach((barcode) => {
            if (barcodeCounts[barcode]) {
              barcodeCounts[barcode]++;
            } else {
              barcodeCounts[barcode] = 1;
            }
          });
          setScannedBarcodes(barcodeCounts);
        }
      };
    

      fetchScannedBarcodes();
    }, []);

    useEffect(() => {
      const fetchProductDetails = async () => {
        let details = {};
        for (const [barcode, count] of Object.entries(scannedBarcodes)) {
            const products = await getProductsByBarCode(barcode);
            if (products.length > 0) {
                details[barcode] = { ...products[0], count };
            }
        }
        setProductDetails(details);
    };

    if (Object.keys(scannedBarcodes).length > 0) {
        fetchProductDetails();
    }
    }, [scannedBarcodes]);

    

    const handleRemoveData = async () => {
      const key = '@scanned_barcodes'; 
      await removeData(key);


    };



      const goToSanScreen = () => {
        navigation.navigate('Scan');
      };
  
  
  
  
  
  
  
  
  
    return (
    <View style={styles.container}>
       <TouchableOpacity
            style={styles.scanButton}
            onPress={goToSanScreen}
            >
            <Ionicons name="camera-outline" size={24} color="black" />
            <Text>Scan product</Text>
        </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text>ID : 12345</Text>
        <Text>Date : {currentDate}</Text>
      </View>
      <View style={styles.productContainer}>
        {Object.entries(productDetails).map(([barcode, detail], index) => (
          <View key={index} style={styles.productItem}>
            <Image source={require('../../Image/water.jpg')} style={styles.productImage} />
            <View style={styles.productDetail}>
              <Text style={styles.productName}>{detail.Name}</Text>
              <Text style={styles.productPrice}>฿{detail.Price}</Text>
              <View style={styles.productQuantityContainer}>
                <Ionicons name="remove-circle-outline" size={24} color="black" onPress={() => handleDecreaseQuantity(barcode)} />
                <Text style={styles.productQuantity}>{detail.count}</Text>
                <Ionicons name="add-circle-outline" size={24} color="black" onPress={() => handleIncreaseQuantity(barcode)} />
              </View>
            </View>
          </View>
        ))}


      </View>
      <View style={styles.totalContainer}>
        <Text>Total</Text>
        <Text>฿15</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>ชำระเงิน</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleRemoveData}>
        <Text style={styles.checkoutButtonText}>ลบข้อมูล</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFA',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scanButton: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 10,
  },
  productContainer: {
    flexDirection: 'culum',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FDD',
  },
  productImage: {
    width: 50,
    height: 100,
    resizeMode: 'contain',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  checkoutButton: {
    backgroundColor: '#F00',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  
});

export default BillScreen;
