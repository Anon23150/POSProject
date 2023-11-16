import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAllBillsWithDetails } from '../../database/database';

const BillListScreen = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const allBills = await getAllBillsWithDetails();
        setBills(allBills);
      } catch (error) {
        console.log('Error fetching bills: ', error);
      }
    };

    fetchBills();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {bills.map((bill, index) => (
        <View key={index} style={styles.billContainer}>
          <Text style={styles.billHeader}>Bill ID: {bill.ID}</Text>
          <Text>Date: {bill.DateIssued}</Text>
          <Text>Time: {bill.TimeIssued}</Text>
          <Text>Total Amount: ฿{bill.TotalAmount.toFixed(2)}</Text>
          <View style={styles.productList}>
            {bill.Products.map((product, idx) => (
              <View key={idx} style={styles.productItem}>
                <Text>{product.Name}</Text>
                <Text>Quantity: {product.Quantity}</Text>
                <Text>Subtotal: ฿{product.Subtotal.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  billContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  billHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productList: {
    marginTop: 10,
  },
  productItem: {
    marginBottom: 5,
  },
});

export default BillListScreen;
