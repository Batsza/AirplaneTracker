import React from 'react';
import { Button, ImageBackground,  StyleSheet, View, PermissionsAndroid  } from 'react-native';



function WelcomeScreen({ navigation }) {
  return (

      <ImageBackground 
        style={styles.background}
        source={require("../assets/samolot.jpg")}
      >
        <View style={styles.startWidok}> 
        <View style={styles.startButton}>
        <Button
          title="Learn XD More"
          color="#0008fa"
          onPress={() =>
            navigation.push('Profile')
            
          }
        /></View>
        </View>
      </ImageBackground>

  );
}
const styles = StyleSheet.create({
  background:{
    flex:1
  },
  startWidok:{
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton:{
    width: "90%",
    margin: 10,
  },

})

export default WelcomeScreen;