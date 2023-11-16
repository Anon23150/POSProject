import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState, useEffect} from 'react';
import {storeData, getData, removeData} from '../../database/temporaryStoreage';
import {getProductsByBarCode, decreaseProductQuantityByBarcode , createBillAndBillItems} from '../../database/database';
import {Button} from 'react-native-elements';
import {fonts} from 'react-native-elements/dist/config';

const BillScreen = ({navigation}) => {
  const [currentDate, setCurrentDate] = useState('');
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const min = new Date().getMinutes();

    setCurrentDate(
      date + ' : ' + month + ' : ' + year + '   TIME : ' + hours + ' : ' + min,
    );

    const fetchScannedBarcodes = async () => {
      const barcodeData = await getData('@scanned_barcodes');
      if (barcodeData) {
        const barcodeCounts = {};
        barcodeData.forEach(barcode => {
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
          details[barcode] = {...products[0], count};
        }
      }
      setProductDetails(details);
    };

    if (Object.keys(scannedBarcodes).length > 0) {
      fetchProductDetails();
    }
  }, [scannedBarcodes]);

  useEffect(() => {
    let newTotalPrice = 0;
    for (const [barcode, detail] of Object.entries(productDetails)) {
      newTotalPrice += detail.Price * detail.count;
    }
    setTotalPrice(newTotalPrice);
  }, [productDetails]);

  const handleRemoveData = async () => {
    const key = '@scanned_barcodes';
    await removeData(key);
  };

  const goToSanScreen = () => {
    navigation.navigate('Scan');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.scanButton} onPress={goToSanScreen}>
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
            <View style={{flex: 1}}>
              <Image
                source={require('../../Image/water.jpg')}
                style={styles.productImage}
              />
            </View>
            <View style={{flex: 3, justifyContent: 'center'}}>
              <Text style={styles.productName}>{detail.Name}</Text>
            </View>
            <View
              style={{
                flex: 2,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <Text style={styles.productPrice}>
                ราคา : ฿{detail.Price * detail.count}
              </Text>
              <View style={styles.quantityControls}>
                <Text style={{fontSize: 18}}>จำนวน : {detail.count}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.totalContainer}>
        <Text>Total</Text>
        <Text>฿{totalPrice.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={async () => {
          // สร้างบิลและรายการบิล
          await createBillAndBillItems(productDetails, totalPrice);

          // ลดจำนวนสินค้าในสต็อก
          Object.entries(productDetails).forEach(async ([barcode, detail]) => {
            await decreaseProductQuantityByBarcode(barcode, detail.count);
          });

          // รีเซ็ตข้อมูลบนหน้า BillScreen
          setProductDetails({});
          setScannedBarcodes([]);
          setTotalPrice(0);
          // รีเซ็ตข้อมูลที่เก็บชั่วคราว
          await removeData('@scanned_barcodes');
        }}>
        <Text style={styles.checkoutButtonText}>ชำระเงิน</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleRemoveData}>
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
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FDD',
  },
  productName: {
    fontSize: 18,

    // add other styles for product name as needed
  },
  productPrice: {
    fontSize: 18,
    // add other styles for product price as needed
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    // add other styles for quantity controls as needed
  },
  quantityButton: {
    // add styles for your quantity buttons as needed
  },
});

export default BillScreen;
