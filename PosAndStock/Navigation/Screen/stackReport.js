import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReportScreen from './ReportScreen';
import BillListScreen from './Bill_ListScreen';

const Stack = createStackNavigator();

const StackReport = () => {
  return (
    <Stack.Navigator initialRouteName="Report">
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="BillList" component={BillListScreen} />
    </Stack.Navigator>
  );
};

export default StackReport;