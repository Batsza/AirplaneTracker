import React from 'react';
import { Button, ImageBackground,  StyleSheet, View, PermissionsAndroid, Text  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';



function WelcomeScreen({ navigation }) {
  return (

      <View 
      >
            <LinearGradient
        // Background Linear Gradient
        colors={['#477fff', '#00b0fe', '#82d6ff']}
        style={styles.background}

      />
        <View style={styles.Title}><Text style={styles.TitleText}>Witaj w aplikcji do odnajdywania samolotów na niebie</Text></View>
        <View style={styles.startWidok}> 
        <Text style={styles.NormalText}>Aby znaleźć samolot na niebie przejdz do następnego ekranu i wybierz numer lotu, który chcesz odnaleźć.  </Text>
        <Text style={styles.NormalText}>{"\n"}Następnie kieruj telefonem zgodnie z sztrzłkami wyświetlanymi na ekranie </Text>

        <View style={styles.startButton}>
        <Button
          title="Wybór samolotu"
          color="#00750a"
          onPress={() =>
            navigation.push('Informacje')
            
          }
        />
     </View>
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