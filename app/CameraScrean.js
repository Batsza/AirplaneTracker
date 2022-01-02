import React, { useState, useEffect }from 'react';
import { Camera } from 'expo-camera';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Location from 'expo-location';
import {getDistance, getPreciseDistance} from 'geolib';


function CameraScrean(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [planeData, setplaneData] = useState([]);
  const [compass, setCompass] = useState(null);
  const [location, setLocation] = useState(null);
  const [SPLongitude, setSPLongitude] = useState(props.route.params.SPLO);
  const [SPLatitude, setSPLatitude] = useState(props.route.params.SPLA);
  const [SPAltitude, setSPAltitude] = useState(props.route.params.SPA);
  const [degris, setDegris]= useState(null);
  const [angle, setAngle]= useState(0);
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
      //console.log(location);
      setSPLongitude(location.coords.longitude);
      setSPLatitude(location.coords.latitude);
      setSPAltitude(location.coords.altitude);
    })();
  }, []);
  const getFlight = async () => {
    const response = await fetch('https://opensky-network.org/api/states/all?icao24=' + props.route.params.PlanIco);
    const planes = await response.json();
    setplaneData(planes);
    //console.log(planes);
    let dis = getDistance(
      {latitude: SPLatitude, longitude: SPLongitude},
      {latitude: planes.states[0][6], longitude: planes.states[0][5]},
    );
      let wys = planes.states[0][13] -SPAltitude ;
      let kat = Math.atan(dis/wys)* 180 / Math.PI;

      setAngle(Math.round(kat));
    const deltaLongitude =  planes.states[0][5] - SPLongitude ;
    const azimuthRad = Math.atan2(Math.sin(deltaLongitude)*Math.cos(planes.states[0][6]),
    (Math.cos(SPLatitude)*Math.sin(planes.states[0][6])-Math.sin(SPLatitude)*Math.cos(planes.states[0][6])*Math.cos(deltaLongitude)));
    //console.log(azimuthRad);
    const degr = azimuthRad * 180 / Math.PI;
    if(degr>0){
    setDegris(Math.round(degr));
    } else{
      setDegris(Math.round(360 + degr))
    }

}
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const getCompassData = async () =>{

    let kompas = await Location.getHeadingAsync();
    setCompass(kompas.trueHeading);
  }
  const compasR =  Math.floor(compass) ;
    useEffect(() => {
    setInterval(() => getCompassData(), (500));
    getCompassData();
  }, []);
  useEffect(() => {
    // setInterval(() => getFlight(), (1000))
   getFlight();
}, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const renderElement = ()=>{
    let newdegri=0;
    if(degris>180){
      newdegri =degris-180;
    }else {
      newdegri=degris+180;
    }
    console.log(degris);
    if(degris+10>compasR&&degris-10<compasR){
      return (
        <Text style={styles.text}> 
              <Icon name="target" size={300} color="red" /> 
      </Text>
      );
    }else if(compasR<degris-10&&compasR>newdegri){
      return (
        <Text style={styles.text}> 
          <Icon name="arrow-right" size={300} color="#00ff04" />
      </Text>
      );
    }else if(compasR>degris+10) {
      return (
        <Text style={styles.text}> 
          <Icon name="arrow-left" size={300} color="#00ff04" />
      </Text>
      );
    }else if(compasR<=newdegri){
      return (
        <Text style={styles.text}> 
          <Icon name="arrow-left" size={300} color="#00ff04" />
      </Text>
      );
    }
  }

  return (
    <View style={styles.container}>
    <Camera style={styles.camera} type={type}>
      <View style={styles.infoView}>
      <Text style={styles.text} >Kompas: {compasR} </Text>
      <Text style={styles.text} >ile ma być : {degris} </Text>
      <Text style={styles.text} >jak w góre  : {angle} </Text>

      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>
      
        </TouchableOpacity>
          {renderElement()}
      </View>
    </Camera>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',

  },
  text: {
    marginLeft: 20,
    color: 'white',   
    alignSelf: 'flex-end',
    alignItems: 'center',
    textAlign: 'center',
  },
  textinfo:{
    color: 'white',   
  },
  infoView:{
    flex: 1,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    alignItems: 'center',
    textAlign: 'center',

    margin: 20,
  },
})
export default CameraScrean;