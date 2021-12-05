import React, { useState, useEffect } from 'react';
import { Button, ImageBackground,  StyleSheet, View, Text, PermissionsAndroid, FlatList} from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Feather';
import { Gyroscope } from 'expo-sensors';

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
  const [data2, setData2] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    Gyroscope.setUpdateInterval(1000);
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData2(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

 /* useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);*/

  const { x, y, z } = data2;
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
   // console.log("XD")
  //  console.log(SPLongitude)

    text = JSON.stringify("szerokosc " + SPLongitude + " dlugosć " + SPLatitude);
 
  }
  const [planeData, setplaneData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getMovies = async () => {
      const response = await fetch('https://opensky-network.org/api/states/all?lamin=50.1107&lomin=19.4215&lamax=51.2032&lomax=21.52108');
      const planes = await response.json();
      setplaneData(planes);
      console.log(planeData)
  }
  let pr = SPLongitude + 1;
    
  useEffect(() => {
       // setInterval(() => getMovies(), (1000))

    getMovies();
    //console.log(planeData)
  }, []);
  let flightnumber = 'Waiting..';
  let planeLatitude = 'Waiting..';
  let planeLongitude = 'Waiting..';
  if(Object.keys(planeData).length == 0){
        console.log("pusto")
  }
  else{
    if(planeData.states.length>0){
      flightnumber = JSON.stringify("numer lotu " + planeData.states[0][1]);
      planeLatitude = JSON.stringify("szerkość  " + planeData.states[0][6]);
      planeLongitude = JSON.stringify("długość " + planeData.states[0][5]);
      }

  }

  return (
    
      <ImageBackground 
        style={styles.background}
        source={require("../assets/ekran2.jpg")}
      >
        <View style={styles.Title}><Text style={styles.TitleText}>Wybierz samolot</Text></View>
        <View style={styles.startWidok}> 
        <View style={styles.planeViewA}>
        <Text>        <FlatList
        data={[
          {key: 'jeden'},
          {key: 'Dwa'},

        ]}
        renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
      /> </Text>
        <Text>{flightnumber}</Text>
        <Text>{planeLatitude}</Text>
        <Text>{planeLongitude}</Text>
        <Text>{pr}</Text>

        </View>
        <View style={styles.planeViewB}> 
        <Text>{text}</Text>
        <Text >Gyroscope:</Text>
      <Text >
        x: {x} y: {y} z: {z}
      </Text>
 
        </View>
        <View style={styles.startButton}>
        <Button
          title="Learn XD2 More"
          color="#0008fa"
          onPress={requestLocationPermission} 
          
        />
        <Button
          title="Do kamery"
          color="#0008fa"
          onPress={() =>
            navigation.push('Camera')
            
          }
        /></View>
        <Text>
        <Icon name="arrow-down-left" size={60} color="#00ff04" />
        <Icon name="arrow-down-right" size={30} color="#00ff04" />
        <Icon name="arrow-up-left" size={30} color="#00ff04" />
        <Icon name="arrow-up-right" size={30} color="#00ff04" />
        <Icon name="arrow-down" size={30} color="#00ff04" />
        <Icon name="arrow-right" size={30} color="#00ff04" />
        <Icon name="arrow-left" size={30} color="#00ff04" />
        <Icon name="arrow-up" size={30} color="#00ff04" />
        <Icon name="target" size={30} color="red" />
        </Text>
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
    color: "#00ed1c" ,
    fontFamily: "serif",
  },

  startWidok:{
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
  },
  planeViewA:{
    width: '100%',
    height: '20%',
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