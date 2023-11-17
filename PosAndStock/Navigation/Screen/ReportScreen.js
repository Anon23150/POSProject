import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fetchBillList, fetchBillItems} from '../../database/database';
import { useFocusEffect } from '@react-navigation/native';

const ReportScreen = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState('');

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const loadBillsAndCalculateTotal = async () => {
      try {
        const bills = await fetchBillList();
        console.log(bills)
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
          console.log(bills)
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
    }, [])
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

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.secondaryText}>ยอดขายทั้งหมด</Text>
        <Text style={styles.totalAmountText}>฿{totalAmount.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToBillList}>
          <Text style={styles.buttonText}>ดูใบเสร็จทั้งหมด </Text>
        </TouchableOpacity>
      </View>

      {/* Footer with navigation */}
      <View style={styles.footer}>{/* Navigation buttons */}</View>
    </View>
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
    fontSize:16,
    textAlign: 'center',
  },
  totalAmountText: {
    fontSize:30,
    color : 'green',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  secondaryText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:20
    
    ,
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
    fontSize:18,
  },
  footer: {
    // Styles for footer navigation
  },
  // Add other styles as needed
});

export default ReportScreen;
