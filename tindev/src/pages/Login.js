import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';


import api from '../services/api';
import logo from '../assets/logo.png';
import empty from '../assets/empty.png';

export default function Login({ navigation }) {
  const [user, setUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        navigation.navigate('Main', { user })
      }
    })
  }, []);

  async function handleLogin() {
  const response = await api.post('/devs', { username: user });
  
  const { _id, avatar} = response.data;
     
  await AsyncStorage.setItem('user', _id);

    navigation.navigate('Page', { user: _id});

  await AsyncStorage.setItem('avatar', avatar);

  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS == 'ios'}
      style={styles.container}>
      <Image style={styles.emptyImage} source={empty} />
      <Image source={logo} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Add your guithub user"
        placeholderTextColor="#999"
        style={styles.Input}
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity onPress={ handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  Input: {
    height: 46,
    width: 300,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    marginTop: 20,
    paddingHorizontal: 70,
  },
  button: {
    height: 46,
    width: 300,
    alignSelf: 'stretch',
    backgroundColor: '#DF4723',
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyImage: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#FFF',
    marginBottom: 20
  }
});
