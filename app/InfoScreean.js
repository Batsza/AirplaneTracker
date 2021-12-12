import React, { useState, useEffect } from 'react';
import { Button, ImageBackground,  StyleSheet, View, Text, PermissionsAndroid, FlatList, RefreshControl, SafeAreaView, ScrollView,TouchableOpacity} from 'react-native';
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
  else if(planeData.states===null){
    console.log("pusto2")
  }
  else{
    if(planeData.states.length>0){
      flightnumber = JSON.stringify("numer lotu " + planeData.states[0][1]);
      planeLatitude = JSON.stringify("szerkość  " + planeData.states[0][6]);
      planeLongitude = JSON.stringify("długość " + planeData.states[0][5]);
      }

  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMovies();
    wait(2000).then(() => setRefreshing(false));
  }, []);


  return (
      
    <ImageBackground 
      style={styles.background}
      source={require("../assets/ekran2.jpg")}
    >
      <View style={styles.Title}><Text style={styles.TitleText}>Wybierz samolot</Text></View>
      <View style={styles.startWidok}> 
        <ScrollView style={styles.scrollView} 
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
        }>
          {planeData.states==null? (<View style={styles.planeViewC}><Text>brak</Text></View>):
          (planeData.states.map((item)=>{
              return(
                <TouchableOpacity
                    onPress={() =>navigation.push('Camera')}
                >
                  <View style={styles.planeViewC} key={item.key}><Text >{item[1]}</Text></View>
                </TouchableOpacity>
                  )
              }
          ))}
          <View style={styles.planeViewA}>
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
              <View style={styles.planeViewB}> 
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
                <Text>{text}</Text>
                <Text >Gyroscope:</Text>
                <Text >
                  x: {x} y: {y} z: {z}
                </Text>
                <View style={styles.startButton}>
                  <Button
                    title="Learn XD2 More"
                    color="#0008fa"
                    onPress={requestLocationPermission} 
                  />
                  <Button
                    title="odświerz"
                    color="#0008fa"
                    onPress={onRefresh} 
                  />
                  <Button
                    title="Do kamery"
                    color="#0008fa"
                    onPress={() =>navigation.push('Camera')}
                  />
                </View>
              </View>
        </ScrollView>
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
  item:{
    marginTop: 24,
    padding: 30,
    backgroundColor: 'pink',
    fontSize: 24,
  },

  scrollView: {
  },
  text: {
    fontSize: 42,
  },
  planeViewA:{
    width: '100%',
    backgroundColor: "red",

  },
  startWidok:{
    width: '100%',
    height: '100%',
    flex: 1,
    flexGrow: 1,
  },
  planeViewB:{
    width: '100%',
    backgroundColor: "green",
  },
  startButton:{
    width: "90%",
    margin: 10,
  },
  planeViewC:{
    width: '100%',
    height: 100,
    backgroundColor: "#808080",
    borderTopColor: "black",
    borderBottomColor: "white",
    borderRadius: 5,
    borderWidth: 2,
    

  },

})

export default InfoScreean;