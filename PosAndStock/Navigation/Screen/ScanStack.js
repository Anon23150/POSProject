// ScanStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScanScreen from './ScanQRScreen';
import BillScreen from './BillScreen';

const ScanStack = createStackNavigator();

const ScanStackNavigator = () => {
  return (
    <ScanStack.Navigator>
      <ScanStack.Screen name="Scan" component={ScanScreen} />
      <ScanStack.Screen name="Bill" component={BillScreen} />
    </ScanStack.Navigator>
  );
};

export default ScanStackNavigator;
