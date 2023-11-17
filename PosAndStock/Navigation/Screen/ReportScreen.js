import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  fetchBillList,
  fetchBillItems,
  getProducts,
} from '../../database/database';
import {useFocusEffect} from '@react-navigation/native';

const ReportScreen = ({navigation}) => {
  const [currentDate, setCurrentDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const [combinedItems, setCombinedItems] = useState([]);

  useEffect(() => {
    const loadBillsAndCalculateTotal = async () => {
      try {
        const bills = await fetchBillList();
        console.log(bills);
        // Calculate the total amount
        const total = bills.reduce(
          (acc, bill) => acc + Number(bill.TotalAmount),
          0,
        );
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching bills: ', error);
      }
    };

    loadBillsAndCalculateTotal();
    setCurrentDate(formatDate(new Date()));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadBillsAndCalculateTotal = async () => {
        try {
          const bills = await fetchBillList();
          console.log(bills);
          // Calculate the total amount
          const total = bills.reduce(
            (acc, bill) => acc + Number(bill.TotalAmount),
            0,
          );
          setTotalAmount(total);
        } catch (error) {
          console.error('Error fetching bills: ', error);
        }
      };
      loadBillsAndCalculateTotal();
    }, []),
  );

  const formatDate = date => {
    let day = date.getDate();
    let month = date.getMonth() + 1; // getMonth() returns month from 0-11
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day; // Add leading 0 if necessary
    month = month < 10 ? `0${month}` : month; // Add leading 0 if necessary

    return `${day} : ${month} : ${year}`;
  };

  const navigateToBillList = () => {
    navigation.navigate('BillList'); // Use the name of your BillList screen as defined in the navigator
  };

  useEffect(() => {
    const fetchData = async () => {
      const billItems = await fetchBillItems();
      const products = await getProducts();

      console.log('Bill Items:', billItems);
      console.log('Products:', products);

      const combined = combineBillItems(billItems);
      const detailedItems = addProductDetailsToCombinedItems(
        combined,
        products,
      );
      setCombinedItems(detailedItems);
    };

    fetchData();
  }, []);
  const combineBillItems = billItems => {
    const combined = {};

    billItems.forEach(item => {
      if (combined[item.ProductBarcode]) {
        combined[item.ProductBarcode].quantity += item.Quantity;
        combined[item.ProductBarcode].total += item.Subtotal;
      } else {
        combined[item.ProductBarcode] = {
          barcode: item.ProductBarcode,
          quantity: item.Quantity,
          total: item.Subtotal,
        };
      }
    });

    return Object.values(combined);
  };

  const addProductDetailsToCombinedItems = (combinedItems, products) => {
    return combinedItems.map(item => {
      const product = products.find(p => p.BarCode == item.barcode);

      return {
        ...item,
        name: product ? product.Name : 'Unknown Product',
        image: product ? product.PicturePath : null,
        price: product ? product.Price : 0,
      };
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.dateText}>{currentDate}</Text>
          <Text style={styles.secondaryText}>ยอดขายทั้งหมด</Text>
          <Text style={styles.totalAmountText}>฿{totalAmount.toFixed(2)}</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToBillList}>
            <Text style={styles.buttonText}>ดูใบเสร็จทั้งหมด </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grob}>
          {combinedItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              {item.image ? (
                <Image source={{uri: item.image}} style={styles.image} />
              ) : (
                <Text>No Image</Text>
              )}
              <View style={{marginLeft: 20}}>
                <Text style={styles.text}>Name: {item.name}</Text>
                <Text style={styles.text}>
                  Quantity: {item.quantity}
                </Text>
                <Text style={{fontSize: 18, marginVertical: 5 , color:'blue', fontWeight:'bold'}}>Total: {item.total.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    // Styles for header
  },
  headerText: {
    // Styles for header text
  },
  summaryCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ffebcd', // Use your color here
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  totalAmountText: {
    fontSize: 30,
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  secondaryText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  button: {
    backgroundColor: 'orange', // Use your color here
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  grob: {
    margin: 10,
    padding: 10,
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
});

export default ReportScreen;
