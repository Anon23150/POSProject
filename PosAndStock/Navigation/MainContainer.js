import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  Ionicons from 'react-native-vector-icons/Ionicons';
import { initProductDB } from '../database/database';
import  { useEffect } from 'react';
import { initStockDB ,insertStock} from '../database/StockDatabase';
import { initBillDB } from '../database/Billdatabase';





//import screen 
import HomeScreen from './Screen/HomeScreen';
import WithdrawScreen from './Screen/WithdrawScreen';
import ReportScreen from './Screen/ReportScreen';
import ScanQRScreen from './Screen/ScanQRScreen';
import StockScreen from './Screen/StockScreen';
import ScanStackNavigator from './Screen/ScanStack';

//Set name Screen 
const homeName = "Home";
const withdrawName = "Withdraw";
const reportName = "Report"
const stockName = "Stock"
const scanQRName = "ScanQR"





//Tab navigater 
const Tab = createBottomTabNavigator();

export default function MainContainer() {
    useEffect(() => {
        const setupDatabase = async () => {
          try {
            await initProductDB();
            await initStockDB();
            //await initBillDB()
          } catch (error) {
            console.error('Database setup failed', error);
          }
        };
    
        setupDatabase();
      }, []);
    
    
    
    return(
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? "home" : "home-outline";
                    } else if (rn === withdrawName) {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (rn === reportName) {
                        iconName = focused ? 'document' : 'document-outline';
                    } else if (rn === stockName) {
                        iconName = focused ? 'storefront-outline' : 'storefront-outline';
                    } else if (rn === scanQRName) {
                        iconName = focused ? 'scan' : 'scan-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',    // สีของไอคอนเมื่อเลือก
                    tabBarInactiveTintColor: 'gray',    // สีของไอคอนเมื่อไม่ได้เลือก
                    tabBarShowLabel: true,              // แสดงชื่อแท็บหรือไม่
                    tabBarStyle: [{ display: 'flex' }]  // สไตล์ของแท็บบาร์
                })}
                >
            
                <Tab.Screen name={homeName} component={HomeScreen} />
                <Tab.Screen name={withdrawName} component={WithdrawScreen} />
                <Tab.Screen name={scanQRName} component={ScanStackNavigator}  />
                <Tab.Screen name={reportName} component={ReportScreen} />
                <Tab.Screen name={stockName} component={StockScreen} />
            </Tab.Navigator>


        </NavigationContainer>
    );
}