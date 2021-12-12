import React from 'react';
import { Button, ImageBackground,  StyleSheet, View, PermissionsAndroid, Text  } from 'react-native';



function WelcomeScreen({ navigation }) {
  return (

      <ImageBackground 
        style={styles.background}
        source={require("../assets/samolot.jpg")}
      >
        <View style={styles.Title}><Text style={styles.TitleText}>Witaj w aplikcji do odnajdywania samolotów na niebie</Text></View>
        <View style={styles.startWidok}> 
        <Text style={styles.NormalText}>Aby znaleźć samolot na niebie przejdz do następnego ekranu i wybierz numer lotu, który chcesz odnaleźć.  </Text>
        <Text style={styles.NormalText}>{"\n"}Następnie kieruj telefonem zgodnie z sztrzłkami wyświetlanymi na ekranie </Text>

        <View style={styles.startButton}>
        <Button
          title="Wybór samolotu"
          color="#0008fa"
          onPress={() =>
            navigation.push('info')
            
          }
        />
         <Button
          title="test"
          color="#0008fa"
          onPress={() =>
            navigation.push('Test')
            
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
    justifyContent: 'flex-start',
  },
  startButton:{
    width: "90%",
    margin: 10,
  }, 
  TitleText:{
    fontSize: 25,
    fontWeight: "bold",
    color: "#000000" ,
    fontFamily: "serif",
    textAlign: "center",
  },
  NormalText:{
    fontSize: 20,
    color: "#000000" ,
    fontFamily: "serif",
    textAlign: "center",
  }

})

export default WelcomeScreen;