import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, ScrollView, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, reload } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginApp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fadeInValue = useSharedValue(50);
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
    checkPersistedLogin();
  }, []);

  const checkPersistedLogin = async () => {
    try {
      const [offlineUser, firebaseUser] = await Promise.all([
        AsyncStorage.getItem('offlineUser'),
        AsyncStorage.getItem('user')
      ]);

      if (offlineUser || firebaseUser) {
        const userData = JSON.parse(offlineUser || firebaseUser);
        // Check if the user is authenticated AND has verified their email
        if (userData && userData.isAuthenticated) {
          // Check current email verification status
          const currentUser = auth.currentUser;
          if (currentUser && !currentUser.emailVerified) {
            // Email not verified, don't auto-navigate
            return;
          }
          navigation.reset({
            index: 0,
            routes: [{ name: 'ChatScreen' }]
          });
        }
      }
    } catch (error) {
      console.error('Error checking persisted login:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text) => {
    // ทำความสะอาดข้อมูลทันทีที่มีการพิมพ์
    setEmail(text.replace(/\s+/g, '').trim());
  };

  const handlePasswordChange = (text) => {
    setPassword(text.trim());
  };

  const handleEmailSubmit = () => {
    // ทำความสะอาดข้อมูลอีกครั้งเมื่อกด submit
    setEmail(prev => prev.replace(/\s+/g, '').trim());
  };

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // ตรวจสอบข้อมูล
      if (!email || !password) {
        Alert.alert('Alert', 'Please enter your email and password');
        setIsLoading(false);
        return;
        }
        
        if (!validateEmail(email)) {
        Alert.alert('Alert', 'Invalid email format');
        setIsLoading(false);
        return;
      }

      // เข้าสู่ระบบ
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // ตรวจสอบสถานะการยืนยันอีเมล - force reload user data to get latest verification status
      await reload(user);
      if (!user.emailVerified) {
        Alert.alert(
          'Email not verified',
          'Please verify your email before logging in by clicking the link sent to your email',
          [
            
            { text: 'Ok', style: 'cancel' }
          ]
        );
        // Sign out to prevent partial authentication
        await auth.signOut();
        setIsLoading(false);
        return;
      }

      // Email is verified, update user data
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Update the Firestore document to match verification status
          await updateDoc(userDocRef, {
            lastLoginAt: serverTimestamp(),
            emailVerified: true
          });

          // Save the verified user to AsyncStorage
          const userData = {
            ...userDoc.data(),
            isAuthenticated: true,
            emailVerified: true
          };
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          // Navigate to the ChatScreen
          navigation.reset({
            index: 0,
            routes: [{ name: 'ChatScreen' }]
          });
        }
      } catch (error) {
        console.error('Error updating user data:', error);
        Alert.alert('Please try again.', 'There was an error while logging');
      }

    } catch (error) {
      console.error('Login error:', error);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error) => {
    let errorMessage = 'Please try again.';

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Email format is invalid.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-login-credentials':
        errorMessage = 'Email or password is incorrect.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'There were too many login attempts. Please wait.';
        break;
    }

    Alert.alert('Please try again', errorMessage);
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
            <Image source={require('../assets/Email.png')} resizeMode="stretch" style={styles.image3} />
            <TextInput
              value={email}
              onChangeText={handleEmailChange}
              onSubmitEditing={handleEmailSubmit}
              onEndEditing={handleEmailSubmit}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
              style={styles.input}
            />

            <View style={styles.column2}>
              <Image source={require('../assets/Password Key.png')} resize Mode="stretch" style={styles.image5} />
              <TextInput
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                style={styles.input2}
              />
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.textForgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <View style={styles.signfrom}>
                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#303233" />
                    ) : (
                      <Text style={styles.text2}>SignIn</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.Comment}>
                  <Text style={styles.text3}>
                    Welcome to ELIC! Learn English in a fun and easy way
                    with our AI chatbot and exciting games.
                    Whether you're just starting or looking
                    to improve, ELIC makes learning enjoyable.
                    Chat with the AI to practice real conversations,
                    and play games that make learning feel like fun.
                    Join us, and turn your English journey into an
                    exciting adventure!
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', marginRight: '100%' }}>
                  <Image source={require('../assets/talk.png')} resizeMode="stretch" style={styles.image10} />
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
    marginLeft: '65%',
    width: 70,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF0CC',
    borderRadius: 50,
    marginTop: 6,
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
    marginLeft: 10,
  },
  column: {
    marginTop: '20%',
    backgroundColor: '#40260CCC',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    borderWidth: 1,
    paddingTop: 27,
    paddingBottom: 283,
  },
  column2: {
    backgroundColor: '#41260C99',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    padding: 12,
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
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 12,
    textAlign: 'left',
  },
  input2: {
    color: '#3B3030',
    fontSize: 14,
    marginBottom: 20,
    marginHorizontal: 30,

    backgroundColor: '#EAE7DB',
    borderRadius: 8,
    paddingLeft: 4,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    marginLeft: 38,
    marginRight: 41,
    marginTop: 8,
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 12,
    textAlign: 'left',
  },
  row: {
    height: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#2C1804',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    paddingLeft: 35,
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
  Comment: {
    marginTop: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
    paddingRight: 40
  },
  text3: {
    color: '#AAB396',
    textAlign: 'center',
    fontSize: 15,
  },
  signfrom: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  textForgotPassword: {
    color: '#AAB396',
    textAlign: 'right',
    fontSize: 15,
    marginBottom: 10,
    marginRight: 60,
  },
  image10: {
    width: 300,
    height: 300,
    marginTop: '3%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
});

export default LoginApp;
