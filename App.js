import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginScreen from './screens/LoginScreen';
import LoginApp from './screens/LoginApp';
import SignUpApp from './screens/SignUpApp';
import ChatScreen from './screens/ChatScreen';
import ForgotPassword from './screens/ForgotPassword';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offlineUser, setOfflineUser] = useState(null);

  const setupAuthAndOfflineSupport = async () => {
    try {
      // Check both offline and Firebase stored user data
      const [offlineUser, firebaseUser] = await Promise.all([
        AsyncStorage.getItem('offlineUser'),
        AsyncStorage.getItem('user')
      ]);

      if (offlineUser || firebaseUser) {
        const userData = JSON.parse(offlineUser || firebaseUser);
        setOfflineUser(userData);
        setIsAuthenticated(true);
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              lastLoginAt: new Date().toISOString(),
              isAuthenticated: true
            };
            
            // Store user data in both storages
            await Promise.all([
              AsyncStorage.setItem('offlineUser', JSON.stringify(userData)),
              AsyncStorage.setItem('user', JSON.stringify(userData))
            ]);
            
            setOfflineUser(userData);
            setIsAuthenticated(true);
          } else {
            await Promise.all([
              AsyncStorage.removeItem('offlineUser'),
              AsyncStorage.removeItem('user')
            ]);
            setOfflineUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error managing auth state:', error);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error in setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setupAuthAndOfflineSupport();
  }, []);

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "ChatScreen" : "LoginScreen"}>
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LoginApp" 
          component={LoginApp} 
          options={{ 
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen 
          name="SignUpApp"  
          component={SignUpApp}  
          options={{ 
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen // Add this Screen component
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ForgotPassword"  
          component={ForgotPassword}  
          options={{ 
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
