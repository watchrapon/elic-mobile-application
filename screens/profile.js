import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db, realtimeDb } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, update, get } from 'firebase/database';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    accountName: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [showNameSection, setShowNameSection] = useState(false);
  const [showNameConfirmModal, setShowNameConfirmModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [highScores, setHighScores] = useState({
    wordGame: 0,
    translateGame: 0,
    matchGame: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLocalData();
    fetchUserData();
    fetchHighScores();
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  const saveUserDataToStorage = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data to storage:', error);
    }
  };

  const loadLocalData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('userData');
      const cachedScores = await AsyncStorage.getItem('highScores');
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setUserData(parsed);
        setNewName(parsed.accountName || '');
      }
      
      if (cachedScores) {
        setHighScores(JSON.parse(cachedScores));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading local data:', error);
      setIsLoading(false);
    }
  };

  const saveHighScores = async (scores) => {
    try {
      await AsyncStorage.setItem('highScores', JSON.stringify(scores));
    } catch (error) {
      console.error('Error saving high scores:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No stored user data');
      }

      const { uid } = JSON.parse(storedUser);
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const userData = {
          accountName: data.accountName || '',
          email: data.email || ''
        };
        
        setUserData(userData);
        setNewName(data.accountName || '');
        saveUserDataToStorage(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }]
      });
    }
  };

  const fetchHighScores = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const wordGameRef = ref(realtimeDb, `wordgame/userScores/${user.uid}`);
      const translateGameRef = ref(realtimeDb, `translategame/userScores/${user.uid}`);
      const matchGameRef = ref(realtimeDb, `matchgame/userScores/${user.uid}`);

      const [wordSnap, translateSnap, matchSnap] = await Promise.all([
        get(wordGameRef),
        get(translateGameRef),
        get(matchGameRef)
      ]);

      const newScores = {
        wordGame: wordSnap.val()?.highScore || 0,
        translateGame: translateSnap.val()?.highScore || 0,
        matchGame: matchSnap.val()?.highScore || 0
      };

      setHighScores(newScores);
      saveHighScores(newScores);
    } catch (error) {
      console.error('Error fetching high scores:', error);
    }
  };

  const handleEditProfile = async () => {
    setShowNameConfirmModal(false);
    
    if (!newName.trim()) {
      setNameError('Name cannot be empty');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        accountName: newName
      });

      const wordGameRef = ref(realtimeDb, `wordgame/userScores/${auth.currentUser.uid}`);
      const wordGameSnapshot = await get(wordGameRef);
      if (wordGameSnapshot.exists()) {
        await update(wordGameRef, { accountName: newName });
      }

      const matchGameRef = ref(realtimeDb, `matchgame/userScores/${auth.currentUser.uid}`);
      const matchGameSnapshot = await get(matchGameRef);
      if (matchGameSnapshot.exists()) {
        await update(matchGameRef, { accountName: newName });
      }

      const updatedData = {
        ...userData,
        accountName: newName
      };
      setUserData(updatedData);
      saveUserDataToStorage(updatedData);
      setShowNameSection(false);
      setAlertMessage('Profile updated successfully');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlertMessage('Cannot update profile. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleChangePassword = async () => {
    setShowPasswordConfirmModal(false);
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      
      setAlertMessage('Password updated successfully');
      setShowSuccessModal(true);
      setShowPasswordSection(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setAlertMessage('Current password is incorrect');
      setShowErrorModal(true);
    }
  };

  const handlePasswordSaveButtonPress = () => {
    if (!passwordData.currentPassword.trim()) {
      setPasswordError('Please enter current password');
      return;
    }
    if (!passwordData.newPassword.trim()) {
      setPasswordError('Please enter new password');
      return;
    }
    if (!passwordData.confirmPassword.trim()) {
      setPasswordError('Please confirm new password');
      return;
    }
    setPasswordError('');
    setShowPasswordConfirmModal(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }]
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Cannot logout.');
    }
    setShowLogoutModal(false);
  };

  const handleNameSectionToggle = () => {
    if (!showNameSection) {
      setNewName('');
    }
    setShowNameSection(!showNameSection);
  };

  const handleSaveButtonPress = () => {
    if (!newName.trim()) {
      setNameError('Name cannot be empty');
      return;
    }
    setNameError('');
    setShowNameConfirmModal(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A3E2B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{userData.accountName}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.highScoresContainer}>
            <View style={styles.scoresGrid}>
              <View style={[styles.scoreCard, { backgroundColor: '#FF6B6B' }]}>
                <MaterialCommunityIcons name="book-alphabet" size={32} color="#FFFFFF" />
                <Text style={styles.gameTitle}>Word</Text>
                <Text style={styles.scoreText}>{highScores.wordGame}</Text>
              </View>
              <View style={[styles.scoreCard, { backgroundColor: '#4ECDC4' }]}>
                <MaterialCommunityIcons name="translate" size={32} color="#FFFFFF" />
                <Text style={styles.gameTitle}>Translate</Text>
                <Text style={styles.scoreText}>{highScores.translateGame}%</Text>
              </View>
              <View style={[styles.scoreCard, { backgroundColor: '#FFD700' }]}>
                <MaterialCommunityIcons name="cards" size={32} color="#FFFFFF" />
                <Text style={styles.gameTitle}>Match</Text>
                <Text style={styles.scoreText}>{highScores.matchGame}</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.infoItem} 
              onPress={handleNameSectionToggle}
            >
              <Ionicons name="person-outline" size={24} color="#5A3E2B" />
              <Text style={[styles.infoText, styles.lText]}>Change Name</Text>
            </TouchableOpacity>

            {showNameSection && (
              <View style={styles.inputSection}>
                {nameError ? (
                  <Text style={styles.errorText}>{nameError}</Text>
                ) : null}
                <TextInput
                  style={styles.input}
                  value={newName}
                  onChangeText={(text) => {
                    setNewName(text);
                    setNameError('');
                  }}
                  placeholder="Enter new name"
                  placeholderTextColor="#666"
                />
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveButtonPress}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity 
              style={styles.infoItem} 
              onPress={() => setShowPasswordSection(!showPasswordSection)}
            >
              <Ionicons name="key-outline" size={24} color="#5A3E2B" />
              <Text style={[styles.infoText, styles.lText]}>Change Password</Text>
            </TouchableOpacity>

            {showPasswordSection && (
              <View style={styles.inputSection}>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  secureTextEntry
                  value={passwordData.currentPassword}
                  onChangeText={(text) => {
                    setPasswordData({...passwordData, currentPassword: text});
                    setPasswordError('');
                  }}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={passwordData.newPassword}
                  onChangeText={(text) => {
                    setPasswordData({...passwordData, newPassword: text});
                    setPasswordError('');
                  }}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => {
                    setPasswordData({...passwordData, confirmPassword: text});
                    setPasswordError('');
                  }}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handlePasswordSaveButtonPress}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={[styles.infoItem, styles.logoutItem]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FF6B6B"  />
              <Text style={[styles.infoText, styles.lText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <Ionicons name="log-out-outline" size={90} color="#FF6B6B" style={styles.modalIcon} />
           
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowLogoutModal(false)}
              >
                <Ionicons name="close-outline" size={20} color="#5A3E2B" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButton]} 
                onPress={confirmLogout}
              >
                <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showNameConfirmModal}
        onRequestClose={() => setShowNameConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="person" size={90} color="#5A3E2B" style={styles.modalIcon} />
            <Text style={styles.modalText}>Are you sure you want to change your name?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowNameConfirmModal(false)}
              >
                <Ionicons name="close-outline" size={20} color="#5A3E2B" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleEditProfile}
              >
                <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showPasswordConfirmModal}
        onRequestClose={() => setShowPasswordConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="key" size={90} color="#5A3E2B" style={styles.modalIcon} />
            <Text style={styles.modalText}>Are you sure you want to change your password?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowPasswordConfirmModal(false)}
              >
                <Ionicons name="close-outline" size={20} color="#5A3E2B" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleChangePassword}
              >
                <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.successModalContent]}>
            <Ionicons name="checkmark-circle" size={90} color="#4CAF50" style={styles.modalIcon} />
            <Text style={[styles.modalText, styles.successText]}>{alertMessage}</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showErrorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.errorModalContent]}>
            <Ionicons name="alert-circle" size={90} color="#FF6B6B" style={styles.modalIcon} />
            <Text style={[styles.modalText, styles.errorModalText]}>{alertMessage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF8E2',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 25,
    paddingTop: 40,
    backgroundColor: '#5A3E2B',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    margin: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    backgroundColor: 'rgba(223, 211, 195, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
  },
  email: {
    fontSize: 16,
    color: '#DFD3C3',
  },
  infoContainer: {
    padding: 20,
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAD6',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: -10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DFD3C3',
  },
  saveButton: {
    backgroundColor: '#5A3E2B',
    padding: 12,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A3E2B',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#5A3E2B',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#DFD3C3',
  },
  confirmButton: {
    backgroundColor: '#5A3E2B',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#5A3E2B',
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: 5,
  },
  modalIcon: {
    marginBottom: 15,
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 10,
    textAlign: 'center',
  },
  lText: {
    fontSize: 15,
    marginLeft: 10,
    
  },
  successModalContent: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    maxWidth: 300,
    padding: 25,
  },
  errorModalContent: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    maxWidth: 300,
    padding: 25,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorModalText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  errorButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  highScoresContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A3E2B',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  scoresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  scoreCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  gameTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
