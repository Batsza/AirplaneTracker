import React, { useState, useEffect } from 'react';
import { Button, ImageBackground,  StyleSheet, View, PermissionsAndroid, Text, TouchableOpacity  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';



const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "your location",
        message:
          "Potrzeba towjej lokalizacji" +
          "bo ja chce.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }

};

function WelcomeScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [SPLongitude, setSPLongitude] = useState(null);
  const [SPLatitude, setSPLatitude] = useState(null);
  
  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log("zlexd");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setSPLongitude(location.coords.longitude);
      setSPLatitude(location.coords.latitude);
    })();
  }, []);
  
  return (

      <View 
      >
            <LinearGradient
        // Background Linear Gradient
        colors={['#477fff', '#008ac7', '#2ba0d9']}
        style={styles.background}

      />
        <View style={styles.Title}><Text style={styles.TitleText}>Witaj w aplikcji do odnajdywania samolotów na niebie</Text></View>
        <View style={styles.startWidok}> 
        <Text style={styles.NormalText}>{"\n"}Aby znaleźć samolot na niebie:   </Text>
        <Text style={styles.NormalText}>{"\n"}1. przejdz do następnego ekranu i wybierz numer lotu, który chcesz odnaleźć</Text>
        <Text style={styles.NormalText}>{"\n"}2. kieruj telefonem zgodnie ze sztrzłkami wyświetlanymi na ekranie{"\n"} </Text>
        {SPLatitude!=null?(
        <TouchableOpacity
        onPress={() => navigation.navigate('Informacje', {SPLo: SPLongitude, SPLa: SPLatitude})}
        >
        <LinearGradient
        // Background Linear Gradient
        colors={['#ffc455', '#e08b00']}
        style={styles.planeViewC}
        >
        <View style={styles.startButton}>
        <Text style={styles.ButtonText}>Wybór samolotu </Text>
        </View>
        </LinearGradient>
        </TouchableOpacity>):(   <TouchableOpacity 
        disabled={true}
        onPress={() => navigation.navigate('Informacje', {SPLo: SPLongitude, SPLa: SPLatitude})}
        >
        <LinearGradient
        // Background Linear Gradient
        colors={['#6e6e6e', '#6e6e6e']}
        style={styles.planeViewC}
        >
        <View style={styles.startButton}>
        <Text style={styles.ButtonText}>Wybór samolotu </Text>
        </View>
        </LinearGradient>
        </TouchableOpacity>)}
        
        </View>
      </View>

  );
}
const styles = StyleSheet.create({
  background:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",

  },
  startWidok:{
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  startButton:{
    width: 250,
    height: 80,
    margin: 10,
 
  }, 
  TitleText:{
    fontSize: 33,
    fontWeight: "bold",
    color: "#ffffff" ,
    fontFamily: "sans-serif-medium",
    textAlign: "center",
    textShadowColor: "black",
    textShadowOffset: {width: 0, height: 3,},
    textShadowRadius: 8,
    
    
  },
  NormalText:{
    fontSize: 24,
    color: "#ffffff" ,
    fontFamily: "sans-serif-medium",
    textAlign: "center",
    textShadowColor: "black",
    textShadowRadius: 10,
    textShadowOffset: {width: 0, height: 3,},

  },
  ButtonText:{
    fontSize: 20,
    color: "#000000" ,
    fontFamily: "sans-serif-medium",
    textAlign: "center",
    marginTop: 25,  

}

})

export default WelcomeScreen;