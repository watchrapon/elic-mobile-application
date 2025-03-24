import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Image, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, ActivityIndicator, StatusBar } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const SignUpApp = () => {
  const [accountName, setAccountName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
 

  const fadeInValue = useSharedValue(500);
  const slideUpValue = useSharedValue(100);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(fadeInValue.value, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    }),
    transform: [{
      translateY: withTiming(slideUpValue.value, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      }),
    }],
  }));

  useEffect(() => {
    requestAnimationFrame(() => {
      fadeInValue.value = 1;
      slideUpValue.value = 0;
    });
  }, []);
 

  const handleSignUp = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      // Validation
      if (!accountName || !email || !password) {
        Alert.alert('Notice', 'Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Notice', 'Passwords do not match');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Notice', 'Password must be at least 6 characters');
        return;
      }

      console.log('Starting signup...', email.trim());

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Prepare data for Firestore
      const userData = {
        uid: user.uid,
        accountName: accountName.trim(),
        displayName: accountName.trim(),
        email: email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isAuthenticated: true,
        emailVerified: false // Add field to track email verification status
      };

      // Save data to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      // Sign out after registration to require login after email verification
      await auth.signOut();

      console.log('Signup successful:', user.uid);

      Alert.alert(
        'Success', 
        'Registration completed. Please check your email and click the verification link before logging in.\n\nPlease check both your inbox and spam folder.', 
        [{ text: 'OK', onPress: () => navigation.navigate('LoginApp') }]
      );

    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Notice', 'This email is already in use');
      } else {
        Alert.alert('Notice', 'Registration failed. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <View style={styles.view}>
            <Image source={require('../assets/elic.jpg')} resizeMode="stretch" style={styles.image2} />
          </View>

          <View style={styles.view2}>
            <Text style={styles.text}>Welcome to Study</Text>
          </View>

          <View style={styles.column}>
            <Image source={require('../assets/User.png')} resizeMode="stretch" style={styles.image3} />
            <TextInput
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Account Name"
              style={styles.input}
            />

            <View style={styles.column2}>
              <Image source={require('../assets/Email.png')} resizeMode="stretch" style={styles.image4} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                style={styles.input2}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.column3}>
                <Image source={require('../assets/Password Key.png')} resizeMode="stretch" style={styles.image5} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  style={styles.input2}
                />
                
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  secureTextEntry={!confirmPasswordVisible}
                  style={styles.input2}
                />
                
                <View style={styles.row}>
                  <View style={styles.signfrom}>
                    <TouchableOpacity 
                      style={[styles.button, isLoading && styles.buttonDisabled]} 
                      onPress={handleSignUp}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#303233" />
                      ) : (
                        <Text style={styles.text2}>Sign Up</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.Comment}>
                    <Text style={styles.text3}>
                      We are committed to keeping your personal information safe. The data you provide will be securely stored and will not be shared with third parties without your consent. We use advanced security measures to protect your information at every step of the process.
                    </Text>
                    <Text style={styles.verificationText}>
                    After registering, you will need to verify your email by clicking on a link sent to your email in order to log in.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 70,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF0CC',
    borderRadius: 50,
    marginTop: 10,
    marginLeft: '65%',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonImage: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginBottom: 40,
  },
  buttonImage2: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginLeft: 18,
  },
  column: {
    height: 640,
    backgroundColor: '#40260CCC',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    borderWidth: 1,
    paddingTop: 27,
    paddingBottom: 283,
  },
  column2: {
    height: 545,
    backgroundColor: '#41260C99',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    padding: 12,
    marginTop: 5
  },
  column3: {
    height: 468,
    backgroundColor: '#40260CCC',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    marginTop: 5
  },
  image2: {
    width: 70,
    height: 70,
  },
  image3: {
    width: 20,
    height: 20,
    marginBottom: 7,
    marginLeft: 50,
  },
  image4: {
    width: 20,
    height: 20,
    marginBottom: 5,
    marginLeft: 40,
  },
  image5: {
    width: 20,
    height: 20,
    marginTop: 20,
    marginLeft: 40,
  },
  input: {
    color: '#3B3030',
    fontSize: 14,
    marginBottom: 10,
    marginHorizontal: 40,
    marginLeft: 50,
    marginRight: 54,
    backgroundColor: '#EAE7DB',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    paddingLeft: 4,
    height: 40,
    paddingVertical: 8
  },
  input2: {
    color: '#3B3030',
    fontSize: 14,
    marginBottom: 10,
    marginHorizontal: 30,
    backgroundColor: '#EAE7DB',
    borderRadius: 8,
    paddingLeft: 4,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    marginLeft: 38,
    marginRight: 40,
    marginTop: 5,
    height: 40,
  },
  row: {
    height: 333,
    alignItems: 'flex-start',
    backgroundColor: '#2C1804',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    paddingLeft: 35,
    marginTop: 10
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FEF8E2',
  },
  text: {
    color: '#493816',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 39,
  },
  text2: {
    color: '#303233',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  view: {
    marginTop: '10%',
    height: 70,
    alignItems: 'center',
    backgroundColor: '#FFFFFF00',
    padding: 12,
    marginBottom: 30,
  },
  view2: {
    height: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF00',
    paddingHorizontal: 12,
  },
  signfrom: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  text3: {
    color: '#AAB396',
    margin: '8%',
    textAlign: 'center',
    fontSize: 15,
    paddingRight: '10%'
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  verificationText: {
    color: '#FAF0CC',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    paddingHorizontal: '10%'
  },
});

export default SignUpApp;
