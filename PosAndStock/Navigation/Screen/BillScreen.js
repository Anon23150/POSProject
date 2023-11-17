import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState, useEffect} from 'react';
import {storeData, getData, removeData} from '../../database/temporaryStoreage';
import {
  getProductsByBarCode,
  decreaseProductQuantityByBarcode,
  createBillAndBillItems,
} from '../../database/database';

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
        <Image
          style={styles.tinyLogo}
          source={require('../../Icon/camera.png')}
        />
        <Text> เพิ่มสินค้า</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text>รหัสใบเสร็จ :</Text>
        <Text>วันที่ : {currentDate}</Text>
      </View>
      <View style={styles.productContainer}>
        {Object.entries(productDetails).map(([barcode, detail], index) => (
          <View key={index} style={styles.productItem}>
            <View style={{flex: 1}}>
              {detail.PicturePath ? (
                <Image
                  source={{uri: detail.PicturePath}}
                  style={styles.image}
                />
              ) : (
                <Text style={styles.imagePlaceholder}>No Image</Text>
              )}
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
          if (Object.keys(productDetails).length === 0) {
            console.log('No products to checkout');
            Alert.alert("ไม่มีรายการสินค้า");
            return;
          }

          // ตรวจสอบว่า currentDate ได้ถูกกำหนดค่าแล้ว
          if (!currentDate) {
            console.error('The current date is not set.');
            return;
          }

          // สร้างบิลและรายการบิล
          await createBillAndBillItems(productDetails, totalPrice, currentDate);

          // คำสั่ง console.log สำหรับตรวจสอบข้อมูล
          console.log(productDetails);
          console.log(totalPrice);
          console.log(currentDate);

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
    backgroundColor: '#009900',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    margin: 10,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 2,
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
    marginLeft: 24,
  },
  productPrice: {
    fontSize: 18,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    // add styles for your quantity buttons as needed
  },
  image: {
    width: 70,
    height: 70,
  },
});

export default BillScreen;
