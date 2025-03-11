import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { auth, db } from '../config/firebase'; // Import Firebase auth and db
import { sendPasswordResetEmail } from 'firebase/auth'; // Import the password reset function
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import for querying user data

const ForgotPassword = ({}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Add state setter for step

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
  }, []);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Alert', 'Please enter your email');
      return;
    }
    
    setIsLoading(true);
   
    try {
      // Check if the email exists in Firestore first
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // No user found with this email
        Alert.alert("Error", "No account exists with this email address.");
        setIsLoading(false);
        return;
      }

      let userData = null;
      querySnapshot.forEach(doc => {
        userData = doc.data();
      });
      
      // Check if email is verified (if your app requires verification before password reset)
      if (userData && userData.hasOwnProperty('emailVerified') && !userData.emailVerified) {
        Alert.alert(
          "Email Not Verified", 
          "Please verify your email first by clicking on the verification link sent during registration.",
          [
            { text: "OK" }
          ]
        );
        setIsLoading(false);
        return;
      }

      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email.trim());
      
      // If successful, move to step 2
      setStep(2);
      Alert.alert(
        "Email Sent",
        "Password reset link has been sent to your email address. Please check your inbox and spam folder."
      );
    } catch (error) {
      console.error("Password reset error:", error);
      
      // Handle different Firebase error codes
      let errorMessage = "Failed to send reset email. Please try again.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account exists with this email address.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection.";
          break;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Image source={require('../assets/Email.png')} resizeMode="stretch" style={styles.image3} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#303233" />
              ) : (
                <Text style={styles.text2}>Send Code</Text>
              )}
            </TouchableOpacity>
          </>
        );
      case 2:
        return (
          <>
            <Image source={require('../assets/paper plane.png')} resizeMode="contain" style={styles.successImage} />
            <Text style={styles.successText}>Email Sent Successfully</Text>
            
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <View style={styles.view}>
          <Image source={require('../assets/elic.jpg')} resizeMode="stretch" style={styles.image2} />
        </View>

        <View style={styles.view2}>
          <Text style={styles.text}>
            {step === 1 ? 'Forgot Password' : 
             step === 2 ? 'Forgot Password' : 
             'Reset Password'}
          </Text>
        </View>

        <View style={styles.column}>
          {renderStepContent()}

          <View style={styles.row}>
            <View style={styles.Comment}>
              <Text style={styles.text3}>
                {step === 1 ? 'Please enter your email to receive a verification code' : 
                 step === 2 ? 'We have sent a password reset link to your email address. Please check your inbox.' : 
                 'Create a strong new password for your account'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginRight: '100%' }}>
              <Image source={require('../assets/email labtop.png')} resizeMode="stretch" style={styles.image10} />
            </View>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF8E2'
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
    marginTop: 4,
    marginEnd: 4,
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
    height: '120%',
    alignItems: 'flex-start',
    backgroundColor: '#2C1804',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    paddingLeft: 35,
    marginTop:15
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
    submit: {
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
  successImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 20,
  },
  successText: {
    color: '#FAF0CC',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ForgotPassword;
