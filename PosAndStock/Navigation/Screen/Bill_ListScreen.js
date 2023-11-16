import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchBillList, fetchBillItems, getProducts } from '../../database/database';

const BillListScreen = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchAndMergeData = async () => {
      try {
        const allBills = await fetchBillList();
        const allBillItems = await fetchBillItems();
        const allProducts = await getProducts();
        console.log(allBillItems)
        console.log(allProducts)

        // ผสานข้อมูลรายการในบิลกับข้อมูลบิล
        const mergedBills = allBills.map(bill => {
          // กรองรายการในบิลที่ตรงกับ BillID
          const items = allBillItems.filter(item => item.BillID === bill.ID).map(item => {
            // ค้นหาผลิตภัณฑ์ที่ตรงกับบาร์โค้ดของรายการ
            const product = allProducts.find(product => product.BarCode == item.ProductBarcode);
            return {
              ...item,
              ProductName: product ? product.Name : 'Unknown Product', // ถ้าไม่พบผลิตภัณฑ์ ใช้ 'Unknown Product'
            };
          });
          return {
            ...bill,
            Items: items,
          };
        });

        setBills(mergedBills);
      } catch (error) {
        console.log('Error fetching and merging bills: ', error);
      }
    };

    fetchAndMergeData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {bills.map((bill, index) => (
        <View key={index} style={styles.billContainer}>
          <Text style={styles.billHeader}>Bill ID: {bill.ID}</Text>
          <Text style={styles.itemText}>Date: {bill.DateIssued}</Text>
          <Text style={styles.itemText}>Time: {bill.TimeIssued}</Text>
          <Text style={styles.totalPrice}>Total Amount: ฿{bill.TotalAmount.toFixed(2)}</Text>
          {bill.Items.map((item, idx) => (
            <View key={idx} style={styles.itemContainer}>
              <Text style={styles.itemText}>Product Name: {item.ProductName}</Text>
              <Text style={styles.itemText}>Product ID: {item.ProductBarcode}</Text>
              <Text style={styles.itemText}>Quantity: {item.Quantity}</Text>
              <Text style={styles.itemText}>Subtotal: ฿{item.Subtotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  billContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  itemContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#ced4da',
  },
  itemText: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 8,
  }
});

export default BillListScreen;
