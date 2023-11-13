import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// นำเข้าฟังก์ชันสำหรับลบและอัปเดตข้อมูลจาก 'database.js'

const SettingsScreen = ({ route }) => {
  const { product } = route.params;

  const handleDelete = () => {
    // โค้ดสำหรับลบข้อมูลผลิตภัณฑ์จากฐานข้อมูล
  };

  const handleUpdate = () => {
    // โค้ดสำหรับอัปเดตข้อมูลผลิตภัณฑ์ในฐานข้อมูล
  };

  return (
    <View style={styles.container}>
      <Text>Product Settings</Text>
      <Text>{product.Name}</Text>
      <Button title="Delete Product" onPress={handleDelete} />
      <Button title="Update Product" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // สไตล์อื่นๆ ที่คุณต้องการ
  },
  // สไตล์อื่นๆ ที่คุณต้องการ
});

export default SettingsScreen;
