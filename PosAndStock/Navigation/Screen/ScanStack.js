import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScanScreen from './ScanQRScreen';
import BillScreen from './BillScreen';
import BillListScreen from './Bill_ListScreen'; // นำเข้า BillListScreen

const ScanStack = createStackNavigator();

const ScanStackNavigator = () => {
  return (
    <ScanStack.Navigator>
      <ScanStack.Screen name="Scan" component={ScanScreen} />
      <ScanStack.Screen name="Bill" component={BillScreen} />
      <ScanStack.Screen name="BillList" component={BillListScreen} /> 
    </ScanStack.Navigator>
  );
};

export default ScanStackNavigator;
