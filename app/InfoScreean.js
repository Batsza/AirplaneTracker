import React, { useState, useEffect } from 'react';
import { Button, ImageBackground,  StyleSheet, View, Text, PermissionsAndroid} from 'react-native';
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


function InfoScreean({ navigation }) {
  const [location, setLocation] = useState(null);
  const [SPLongitude, setSPLongitude] = useState(null);
  const [SPLatitude, setSPLatitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setSPLongitude(location.coords.longitude);
      setSPLatitude(location.coords.latitude);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    console.log("XD")
    console.log(SPLongitude)

    text = JSON.stringify("szerokosc " + SPLongitude + " dlugosć " + SPLatitude);

  }
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getMovies = async () => {
    try {
      const response = await fetch('http://api.aviationstack.com/v1/flights?access_key=b55117a19845ef9d484b97d6d4f13eba&limit=1');
      const planes = await response.json();
      setData(planes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    //getMovies();
    console.log(data)
  }, []);




  return (

      <ImageBackground 
        style={styles.background}
        source={require("../assets/lenar_stone.png")}
      >
        <View style={styles.Title}><Text style={styles.TitleText}>Wybierz samolot</Text></View>
        <View style={styles.startWidok}> 
        <View style={styles.planeViewA}>
        <Text> tu będa informacje o  samolotach </Text>
        </View>
        <View style={styles.planeViewB}> 
        <Text>{text}</Text>
        </View>
        <View style={styles.startButton}>
        <Button
          title="Learn XD2 More"
          color="#0008fa"
          onPress={requestLocationPermission} 
          
        /></View>
        
        </View>
      </ImageBackground>

  );
}
const styles = StyleSheet.create({
  background:{
    flex:1
  },
  Title:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    textAlign: 'center',
  },
  TitleText:{
    fontSize: 20,
    fontWeight: "bold",
    color: "blue" ,
    fontFamily: "serif",
  },

  startWidok:{
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
  },
  planeViewA:{
    width: '100%',
    height: '10%',
    backgroundColor: "red",

  },
  planeViewB:{
    width: '100%',
    height: '10%',
    backgroundColor: "green",
  },
  startButton:{
    width: "90%",
    margin: 10,
  },

})

export default InfoScreean;