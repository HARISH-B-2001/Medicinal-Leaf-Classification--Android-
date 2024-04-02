import React, { useState, useEffect } from 'react';
import { View, TextInput,Image, Text,TouchableOpacity,ImageBackground, StatusBar, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import backgroundImage from '../assets/background.jpg'; // Import your background image
import logoImage from '../assets/title.png';

const Login = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [storedUsers, setStoredUsers] = useState([]);

  useEffect(() => {
    const fetchStoredUsers = async () => {
      try {
        const users = await AsyncStorage.getItem('users');
        if (users) {
          setStoredUsers(JSON.parse(users));
        }
      } catch (error) {
        console.error('Error fetching stored users:', error);
      }
    };

    fetchStoredUsers();
  }, []);

  const handleLogin = () => {


    const foundUser = storedUsers.find(user => user.username === username && user.password === password);
    if (foundUser) {
      console.log('Login successful!');
      navigation.navigate('Index');
    } else {
      console.log('Invalid Credentials');
      alert("Invalid Credentials");
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Image source={logoImage} style={styles.logo} />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.inputbutton}>
                        <Text style={styles.ButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  inputbutton: {
    backgroundColor: '#307B51',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    },
  ButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
  },
  logo: {
    width: 240, // Set the width of the logo image
    height: 140, // Set the height of the logo image
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
},
});

export default Login;
