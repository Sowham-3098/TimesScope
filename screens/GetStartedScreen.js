// screens/GetStartedScreen.js

import React from 'react';
import { View, Text, Button,Image, TouchableOpacity,StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const GetStartedScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1,justifyContent:'center',  alignItems: 'center',backgroundColor: "#27272a"}}>
      <StatusBar style="light" backgroundColor={'#27272a'} />
      <Text style={{color: "#e4ccab",fontSize: 50 ,marginTop:20}}>Welcome</Text>
      <Text style={{color: "#e4ccab",fontSize: 30}}>to</Text>
      <Image source={require('../assets/timescope_logo.png')} style={{ width: 400, height: 400 }} />
      <Text style={{color: "#e4ccab",fontSize: 20, textAlign:'center' , marginHorizontal:20}}>Get all historical events as per given month and year </Text>
      <TouchableOpacity style={{backgroundColor:"#e4ccab", marginVertical: 20, padding:20, paddingHorizontal:width*0.2, borderRadius:20}}onPress={() => navigation.navigate('Techgenius')}>
        <Text style={{color: "#27272a",fontSize:25, fontWeight: "bold"}}>Let's go to past</Text>
      </TouchableOpacity>
      <Text style={{color: "gray",fontSize: 11, textAlign:'center' , marginHorizontal:20,marginVertical:10}}>Developed by: Sowham Bhuin</Text>
    </View>
  );
};

export default GetStartedScreen;
