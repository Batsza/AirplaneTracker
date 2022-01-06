import React, { useState, useEffect } from 'react';
import { Button, ImageBackground,  StyleSheet, View, Text, PermissionsAndroid, FlatList, RefreshControl,  ScrollView,TouchableOpacity} from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';



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

function InfoScreean({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [SPLongitude, setSPLongitude] = useState(null);
  const [SPLatitude, setSPLatitude] = useState(null);
  const [SPAltitude, setSPAltitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [SPLongitudeW1, setSPLongitudeW1] = useState(route.params.SPLo+1);
  const [SPLongitudeM1, setSPLongitudeM1] = useState(route.params.SPLo-1);
  const [SPLatitudeW1, setSPLatitudeW1] = useState(route.params.SPLa+0.5);
  const [SPLatitudeM1, setSPLatitudeM1] = useState(route.params.SPLa-0.5);
  const [planeData, setplaneData] = useState([]);


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
      setSPAltitude(location.coords.altitude);
      setSPLongitudeM1(location.coords.longitude-1);
      setSPLongitudeW1(location.coords.longitude+1);
      setSPLatitudeW1(location.coords.latitude+0.5);//+0.5?
      setSPLatitudeM1(location.coords.latitude-0.5);
    })();
  }, []);
  const getFlight = async () => {

    //const response = await fetch('https://opensky-network.org/api/states/all?lamin=50.1107&lomin=19.4215&lamax=51.2032&lomax=21.52108');
    const response = await fetch('https://opensky-network.org/api/states/all?lamin='+SPLatitudeM1+'&lomin='+SPLongitudeM1+'&lamax='+SPLatitudeW1+'&lomax='+SPLongitudeW1);
    const planes = await response.json();
    setplaneData(planes);
}

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify("szerokosc " + SPLongitude + " dlugosć " + SPLatitude);
  }


    
  useEffect(() => {
       // setInterval(() => getFlight(), (1000))

      getFlight();
    //console.log(planeData)
  }, []);
 
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFlight();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  


  return (
      
    <View 
      style={styles.background}
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
          {planeData.states==null? ( <LinearGradient colors={['#ffc455', '#e08b00']}style={styles.planeViewC}><View style={styles.planeViewC}
          ><Text style={styles.InViewText}>Nie ma samolotów w zasięgu</Text></View></LinearGradient>):
          (planeData.states.map((item)=>{
              return(
                <TouchableOpacity
                    onPress={() =>navigation.navigate('Namierz samolot', {PlanIco: item[0], SPLO: SPLongitude, SPLA: SPLatitude, SPA: SPAltitude})}
                >
                          <LinearGradient
        // Background Linear Gradient
        colors={['#ffc455', '#e08b00']}
        style={styles.planeViewC}
        > 
                <View  key={item.key}><Text style={styles.InViewText} >Numer lotu:  {item[1]}</Text><Text style={styles.InText}>Kraj lini lotniczych: {item[2]} </Text></View>
                  </LinearGradient>
                </TouchableOpacity>
                  )
              }
          ))}
        </ScrollView>
      </View>     
        
    </View>
      
  );
}
const styles = StyleSheet.create({
  background:{
    flex:1,
    backgroundColor: '#008ac7' ,

  },
  Title:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 15,
  },
  TitleText:{
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffa200" ,
    fontFamily: "serif",
  },
  InViewText:{
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 20,
  },
  InText:{
    textAlign: 'center',
    fontSize: 15,
    margin: 10,
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
    width: '97%',
    height: 100,
    //backgroundColor: "#808080",
    borderTopColor: "black",
    borderBottomColor: "white",
    borderRadius: 5,
    margin: 5,
    

  },

})

export default InfoScreean;