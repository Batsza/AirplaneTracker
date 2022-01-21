import  React, {  useState, useEffect }from 'react';
import { Camera } from 'expo-camera';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Location from 'expo-location';
import {getDistance} from 'geolib';
import { DeviceMotion, Magnetometer } from 'expo-sensors';

function CameraScrean(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [planeData, setplaneData] = useState([]);
  const [location, setLocation] = useState(null);
  const [SPLongitude, setSPLongitude] = useState(props.route.params.SPLO);
  const [SPLatitude, setSPLatitude] = useState(props.route.params.SPLA);
  const [SPAltitude, setSPAltitude] = useState(props.route.params.SPA);
  const [degris, setDegris]= useState(null);
  const [angle, setAngle]= useState(0);
  const [gitStop, setGitStop]= useState(null);

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

    })();
  }, []);

  const [motioData, setMotionData] = useState({
    beta: 0,
  });
  const [motion, setMotion] = useState(null);
  useEffect(() => {
    _motion();
    return () => {_unnotion();};
  }, []);
  const _motion = () => {
    DeviceMotion.setUpdateInterval(1000);    
    setMotion(
      DeviceMotion.addListener(orientation=> {
        if(typeof(orientation.rotation)!=="undefined"){
        setMotionData(orientation.rotation);}
      })
    );
  };
  const _unnotion = () => {
    motion && motion.remove();
    DeviceMotion.removeAllListeners();
    setMotion(null);
  };

  const { beta } = motioData;
  
  const roll = Math.round(((beta * 180 / Math.PI) - 90)*(-1));// In degrees

  
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [magnetometer, setMagnetometer] = useState(0);

  useEffect(() => {
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscriptionData) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    
    setSubscriptionData(
      Magnetometer.addListener((data) => {
        setMagnetometer(_angle(data));
      })
    );
  };

  const _unsubscribe = () => {
    subscriptionData && subscriptionData.remove();
    setSubscriptionData(null);
  };

  const _angle = (magnetometer) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
        angle = (Math.atan2(z, x)*-1) * (180 / Math.PI);

    }
    return Math.round(angle);
  };

  const _degree = (magnetometer) => {
    return magnetometer  - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  const getFlight = async () => {
    const response = await fetch('https://opensky-network.org/api/states/all?icao24=' + props.route.params.PlanIco);
    const planes = await response.json();
    setplaneData(planes);
    let dis = getDistance(
      {latitude: SPLatitude, longitude: SPLongitude},
      {latitude: planes.states[0][6], longitude: planes.states[0][5]},
    );
      let wys = planes.states[0][13] -SPAltitude ;
      let kat = Math.atan(wys/dis) * 180 / Math.PI;

      setAngle(Math.round(kat)+5);
    const deltaLongitude =  planes.states[0][5] - SPLongitude ;
    const azimuthRad = Math.atan2(Math.sin(deltaLongitude)*Math.cos(planes.states[0][6]),
    (Math.cos(SPLatitude)*Math.sin(planes.states[0][6])-Math.sin(SPLatitude)*Math.cos(planes.states[0][6])*Math.cos(deltaLongitude)));
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
 
  
  const compasR =  _degree(magnetometer) ;
  useEffect(() => {
   getFlight();
}, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const renderUpDown=()=>{
    if(angle+3>roll&&angle-3<roll){
      return (
        <Text style={styles.text}> 
              <Icon name="target" size={300} color="red" /> 
      </Text>
      );
    }
    else if(angle-3>=roll){
      return (
        <Text style={styles.text}> 
          <Icon name="arrow-up" size={300} color="#00ff04" />
      </Text>
      );
    }
    else if(angle+3<=roll){
      return (
        <Text style={styles.text}> 
          <Icon name="arrow-down" size={300} color="#00ff04" />
      </Text>
      );
    }
  }

  const renderElement = ()=>{
    let newdegri=0;
    if(degris>180){
      newdegri =degris-180;
    }else {
      newdegri=degris+180;
      
    }
    if(gitStop!=null){
      renderUpDown();
      
    }
    else if (degris+5>compasR&&degris-5<compasR){
        setGitStop(compasR);
    }
    else if(compasR<=degris-5&&compasR>newdegri){
      return (
        <Text style={styles.text}> 
          <Icon name="arrow-right" size={300} color="#00ff04" />
      </Text>
      );
    }else if(compasR>=degris+5&&compasR<=newdegri) {
      return (
        <Text style={styles.text}> 
          <Icon name="arrow-left" size={300} color="#00ff04" />
      </Text>
      );
    }else if(degris>=180){
      if(compasR>=degris+5||compasR<=newdegri){
        return (
          <Text style={styles.text}> 
            <Icon name="arrow-left" size={300} color="#00ff04" />
        </Text>
        );
      }
    }else if(degris<180){
      if(compasR<=degris-5||compasR>newdegri){
        return (
          <Text style={styles.text}> 
            <Icon name="arrow-right" size={300} color="#00ff04" />
        </Text>
        );
      }

    }


  }

  return (
    <View style={styles.container}>
    <Camera style={styles.camera} type={type}>
      <View style={styles.infoView}>
      <Text style={styles.text} >Kierunek w którym patrzysz: {compasR} </Text>
      <Text style={styles.text} >Kierunek w który musisz patrzeć: {degris} </Text>
      <Text style={styles.text} >Kąt telefonu: {roll} </Text>
      <Text style={styles.text} >Kąt jaki muszisz ustawić: {angle} </Text>
      



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
          {renderUpDown()}
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