import React from 'react';
import { SafeAreaView, View, Image, TouchableOpacity, Text, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/elic.jpg')}
            resizeMode="stretch"
            style={styles.mainImage}
          />
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginApp')}
          >
            <Text style={styles.loginButtonText}>SignIn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('SignUpApp')}
          >
            <Text style={styles.signInButtonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FEF8E2",
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 33,
  },
  mainImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  bottomContainer: {
    backgroundColor: "#452A0D",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 50,
    paddingVertical: 30,
    height: 300,
  },
  loginButton: {
    height: 50,
    backgroundColor: "#E0DBC2",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#060606",
    marginVertical: 20,
    shadowColor: "#0B0B0B",
    shadowOpacity: 1,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 5,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#303233",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'FCQuantum',
  },
  signInButton: {
    height: 50,
    backgroundColor: "#AF9880",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOpacity: 1,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 5,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#303233",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'FCQuantum',
  },
  buttonImage: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    marginBottom: 20
  },
  buttonImage2: {
    width: 44,
    height: 44,
    marginHorizontal: 10,
    marginBottom: 20
  }
});

export default LoginScreen;
