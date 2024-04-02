import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native'; // Import SafeAreaView
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Login from './src/Login'; // Import your login component
import Index from './src/Index'; // Import your index component
import SignUp from './src/SignUp'; // Import your signup component
import History from './src/History';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const SplashScreen = () => (
  <SafeAreaView style={styles.splashContainer}>
     <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
     <Image
       source={require('./assets/splash.png')} // Ensure this path is correct
       style={styles.splashImage}
     />
  </SafeAreaView>
 );

function TabNavigator() 
{
  return (
    <Tab.Navigator initialRouteName='Index1' 
    activeColor="black"
    inactiveColor="#ffffff"
    barStyle={{ backgroundColor: '#307B51' ,borderRadius: 200, overflow: 'hidden',position: 'absolute',opacity: 0.7,bottom:0,height:70}}
    >
      <Tab.Screen name='Index1' component={Index} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }} /> 
      <Tab.Screen name='History'component={History} options={{
          replace: true,
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" color={color} size={26} />
          ),
        }} />
    </Tab.Navigator>
  )
}

function StackNavigator() {
  return (
    
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: true }} // Hide the header for the login screen
        />
        <Stack.Screen
          name="Index"
          component={TabNavigator}
          options={{ headerShown: false }} // Hide the header for the index screen
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: true, title: 'Sign Up' }} // Show the header for the signup screen with a custom title
        />
      </Stack.Navigator>
    
  );
};

export default function App () {

  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
      setTimeout(() => {
        setSplashVisible(false);
      }, 3000); // 3 seconds delay before transitioning from splash screen
  }, []);

  return splashVisible ? <SplashScreen /> : (
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
  },
  splashImage: {
     width: '100%',
     height: '100%',
     resizeMode: 'cover', // Ensures the image covers the entire screen without distortion
  },
 });
