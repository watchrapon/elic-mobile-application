import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import axios from 'axios';
import { ref, set, get, push } from 'firebase/database';
import { realtimeDb, db } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';

const WordGame = () => {
  const [randomLetter, setRandomLetter] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [isChecking, setIsChecking] = useState(false); // สถานะใหม่
  const [modalVisible, setModalVisible] = useState(false);
  const [translationMessage, setTranslationMessage] = useState('');
  const [letterScale] = useState(new Animated.Value(1));
  const [sound, setSound] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showEndGameButton, setShowEndGameButton] = useState(false);
  const [showUsedWordsModal, setShowUsedWordsModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const generateRandomLetter = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwy';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    setRandomLetter(alphabet[randomIndex]);
  };

  useEffect(() => {
    generateRandomLetter();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(letterScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(letterScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  }, [randomLetter]);

  

  const playCorrectSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/ding.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchHighScore = async () => {
      if (!currentUser?.uid) return;
      try {
        const rtdbRef = ref(realtimeDb, `wordgame/userScores/${currentUser.uid}`);
        const snapshot = await get(rtdbRef);
        const userData = snapshot.val();
        if (userData && userData.highScore) {
          setHighScore(userData.highScore);
        }
      } catch (error) {
        console.error('Error fetching high score:', error);
      }
    };

    fetchHighScore();
  }, [currentUser]);

  const updatePlayerScore = async (newScore) => {
    if (!currentUser?.uid) return null;
  
    try {
      // Get user's profile data first
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      const rtdbRef = ref(realtimeDb, `wordgame/userScores/${currentUser.uid}`);
      const historyRef = ref(realtimeDb, `wordgame/history/${currentUser.uid}`);
      const rtdbSnapshot = await get(rtdbRef);
      const existingData = rtdbSnapshot.val() || {};
  
      // Create history entry
      const historyData = {
        score: newScore,
        timestamp: new Date().toISOString(),
        wordsUsed: usedWords
      };
  
      // Push new history entry
      const newHistoryRef = push(historyRef);
      await set(newHistoryRef, historyData);
  
      const scoreData = {
        userId: currentUser.uid,
        accountName: userData?.accountName || 'Anonymous Player',
        email: currentUser.email,
        highScore: Math.max(newScore, existingData.highScore || 0),
        lastScore: newScore,
        lastPlayed: new Date().toISOString(),
        totalGames: (existingData.totalGames || 0) + 1,
        wordsUsed: usedWords
      };
  
      if (!existingData.highScore || newScore > existingData.highScore) {
        await set(rtdbRef, scoreData);
        return {
          success: true,
          isNewHighScore: true,
          previousHighScore: existingData.highScore || 0
        };
      } else {
        await set(rtdbRef, {
          ...existingData,
          lastScore: newScore,
          lastPlayed: new Date().toISOString(),
          totalGames: scoreData.totalGames
        });
        return {
          success: true,
          isNewHighScore: false,
          previousHighScore: existingData.highScore
        };
      }
    } catch (error) {
      console.error('Error updating score:', error);
      return { success: false, error: error.message };
    }
  };
  

  const resetGame = () => {
    setScore(0);
    setUsedWords([]);
    setMessage('');
    setGameOver(false);
    setTranslationMessage('');
    setGameStarted(false);          // Add this line
    setShowEndGameButton(false);    // Add this line
    generateRandomLetter();
  };

const checkWord = async () => {
    if (isChecking) return;
    setIsChecking(true);

    // Show end game button after first word submission
    if (!gameStarted) {
      setGameStarted(true);
      setShowEndGameButton(true);
    }

    if (userInput.length <= 1) {
      setMessage("Please enter a word with at least 2 letters.");
      setIsChecking(false);
      return;
    }

    const currentWord = userInput.toLowerCase().trim();
    
    // Check for exact matches first
    if (usedWords.includes(currentWord)) {
      setWarningMessage(`The word "${currentWord}" has already been used. Try another word.`);
      setMessage("This word has already been used. Try another word.");
      setShowUsedWordsModal(true); // Automatically show the modal for duplicate words
      setIsChecking(false);
      return;
    }
    
    // Check for word variations (words that contain or are contained in previously used words)
    const isVariation = usedWords.some(word => {
      // Check if either word contains the other
      if (word.includes(currentWord) || currentWord.includes(word)) {
        return true;
      }
      
      // Check for plural forms, -ing forms, -ed forms
      const wordRoot = word.replace(/s$|ing$|ed$/, '');
      const currentRoot = currentWord.replace(/s$|ing$|ed$/, '');
      
      // If roots match and they're at least 3 characters, consider them variations
      if (wordRoot === currentRoot && wordRoot.length >= 3) {
        return true;
      }
      
      return false;
    });
    
    if (isVariation) {
      setWarningMessage("This word appears to be a variation of a word you've already used.");
      setMessage("Word variation detected. Try a completely different word.");
      setShowUsedWordsModal(true); // Automatically show the modal for word variations
      setIsChecking(false);
      return;
    }

    if (!currentWord.includes(randomLetter)) {
      setMessage(`The word must contain the letter "${randomLetter}"`);
      setIsChecking(false);
      return;
    }

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD0SsGfLw7fIM36oHhlJ-0rVpJRUaLuzAc`,
        method: "post",
        data: {
          contents: [{ 
            parts: [{ 
              text: `Verify if "${currentWord}" is a valid English word with meaning:
              Rules:
              1. Must be found in Oxford or Cambridge dictionary
              2. Must have a clear, specific meaning (not just a sound or expression)
              3. No proper nouns, abbreviations, or technical jargon
              4. Must be able to provide a clear Thai translation
              
              Format your response exactly like this:
              <yes/no>|<thai meaning>|<english meaning >|<root word>

              Examples:
              For "book": yes|หนังสือ|an object made of pages with text|book
              For "xyz": no||not a real word|
              For "lol": no||abbreviation, not a proper word|
              For "books": yes|หนังสือ (พหูพจน์)|multiple objects made of pages with text|book`
            }] 
          }],
        },
      });

      // Add error checking for API response
      if (!response?.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response');
      }

      const aiResponse = response.data.candidates[0].content.parts[0].text.toLowerCase().trim();
      const [isValid, thaiMeaning, englishMeaning, rootWord = ''] = aiResponse.split('|');
      
      // Check if this word's root form has been used before
      if (rootWord && usedWords.some(word => word === rootWord || word.startsWith(rootWord + ' '))) {
        setWarningMessage(`The word "${currentWord}" is related to a word you've already used.`);
        setMessage("This word is related to one you've already used. Try something different.");
        setShowUsedWordsModal(true); // Automatically show the modal for related words
        setIsChecking(false);
        return;
      }

      if (isValid === 'yes' && thaiMeaning && englishMeaning) {
        // Clear any warning messages for future attempts
        setWarningMessage('');
        
        await playCorrectSound();
        // Store the word with its root form if available
        const wordToStore = rootWord && rootWord !== currentWord ? 
          `${currentWord} (${rootWord})` : currentWord;
        setUsedWords([wordToStore, ...usedWords]);
        setScore(prevScore => prevScore + 1);
        setMessage('Correct! This is a real word.');
        setTranslationMessage(`คำแปล: ${thaiMeaning.trim()}`);
        
        // Only show the success modal
        setModalVisible(true);
        generateRandomLetter();
        
      } else {
        setGameOver(true);
        const scoreResult = await updatePlayerScore(score);
        
        setMessage(`Game Over! Your score: ${score}`);
        setModalVisible(true);
        setTranslationMessage(
          `Final Score: ${score}\n` +
          `${scoreResult?.success 
            ? (scoreResult.isNewHighScore 
                ? `🎉 New High Score! (Previous: ${scoreResult.previousHighScore}) 🏆` 
                : `👏 Good Try! (Best: ${scoreResult.previousHighScore})`)
            : 'Failed to save score'}`
        );
      }
    } catch (error) {
      console.error("Error checking word:", error);
      setMessage("Please try again.");
      setIsChecking(false);
      setUserInput('');
      return;
    }

    setIsChecking(false);
    setUserInput('');
};

  const endGame = async () => {
    setShowEndGameButton(false); // Hide button when pressed
    setGameOver(true);
    const scoreResult = await updatePlayerScore(score);
    setMessage(`Game Over! Your score: ${score}`);
    setModalVisible(true);
    setTranslationMessage(
      `Final Score: ${score}\n` +
      `${scoreResult?.success 
        ? (scoreResult.isNewHighScore 
            ? `🎉 New High Score! (Previous: ${scoreResult.previousHighScore}) 🏆` 
            : `👏 Good Try! (Best: ${scoreResult.previousHighScore})`)
        : 'Failed to save score'}`
    );
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={['#F8EDE3', '#DFD3C3']} style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="book-alphabet" size={32} color="#8D493A" />
          <Text style={styles.title}>Word Game</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreItem}>
            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            <Text style={styles.score}>{score}</Text>
          </View>
          <View style={styles.scoreItem}>
            <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.score}>{highScore}</Text>
          </View>
        </View>

        <Animated.View style={[styles.letterContainer, { transform: [{ scale: letterScale }] }]}>
          <Text style={styles.letter}>{randomLetter.toUpperCase()}</Text>
        </Animated.View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type a word..."
            placeholderTextColor="#8D493A80"
            editable={!isChecking}
          />
          <TouchableOpacity
            style={[styles.button, isChecking && styles.buttonDisabled]}
            onPress={checkWord}
            disabled={isChecking}
          >
            <MaterialCommunityIcons name="send" size={24} color="#F8EDE3" />
          </TouchableOpacity>
        </View>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.historyTitle}>Used Words:</Text>
            <TouchableOpacity 
              style={styles.expandButton} 
              onPress={() => {
                setWarningMessage(''); // Clear warning when manually opening
                setShowUsedWordsModal(true);
              }}
            >
              <MaterialCommunityIcons name="magnify-plus-outline" size={26} color="#8D493A" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.wordList}>
            {usedWords.map((word, index) => (
              <Text key={index} style={styles.usedWord}>• {word}</Text>
            ))}
          </ScrollView>
        </View>

        {showEndGameButton && (
          <View style={styles.buttonWrapperLower}>
            <TouchableOpacity 
              style={styles.endGameButton} 
              onPress={endGame}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#8D493A', '#6B3529']}
                style={styles.endGameGradient}
              >
                <MaterialCommunityIcons name="flag-checkered" size={24} color="#F8EDE3" />
                <Text style={styles.endGameText}>Stop</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Used Words Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showUsedWordsModal}
          onRequestClose={() => {
            setShowUsedWordsModal(false);
            // Clear warning message when closing the modal
            if (warningMessage) {
              setWarningMessage('');
            }
          }}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#F8EDE3', '#DFD3C3']}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {warningMessage ? 'Word Already Used' : 'Your Word Collection'}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => {
                    setShowUsedWordsModal(false);
                    // Clear warning message when closing the modal
                    if (warningMessage) {
                      setWarningMessage('');
                    }
                  }}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#8D493A" />
                </TouchableOpacity>
              </View>
              
              {warningMessage ? (
                <View style={styles.warningContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={22} color="#D84315" />
                  <Text style={styles.warningText}>{warningMessage}</Text>
                </View>
              ) : (
                <View style={styles.successContainer}>
                  <MaterialCommunityIcons name="book-check" size={22} color="#388E3C" />
                  <Text style={styles.successText}>
                    You have used {usedWords.length} word{usedWords.length !== 1 ? 's' : ''}!
                    {usedWords.length > 0 ? ' Current streak: ' + score : ''}
                  </Text>
                </View>
              )}
              
              <ScrollView style={styles.modalWordList}>
                {usedWords.length > 0 ? (
                  usedWords.map((word, index) => (
                    <View key={index} style={styles.modalWordItem}>
                      <Text style={styles.modalWordNumber}>{index + 1}.</Text>
                      <Text style={styles.modalUsedWord}>{word}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.noWordsContainer}>
                    <MaterialCommunityIcons name="book-open-variant" size={40} color="#8D493A80" />
                    <Text style={styles.noWordsText}>No words used yet.</Text>
                    <Text style={styles.noWordsSubtext}>Start by entering a word containing "{randomLetter}"</Text>
                  </View>
                )}
              </ScrollView>
              
              <TouchableOpacity
                style={[styles.modalButton, !warningMessage && styles.modalButtonSuccess]}
                onPress={() => {
                  setShowUsedWordsModal(false);
                  // Clear warning message when closing the modal
                  if (warningMessage) {
                    setWarningMessage('');
                  }
                }}
              >
                <Text style={styles.modalButtonText}>
                  {warningMessage ? 'Try Again' : 'Continue Playing'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>

        {/* Game Over/Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            if (gameOver) {
              setGameOver(false);
              generateRandomLetter();
            }
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#F8EDE3', '#DFD3C3']}
              style={styles.modalContent}
            >
              <MaterialCommunityIcons 
                name={gameOver ? "trophy" : "check-circle"} 
                size={50} 
                color="#8D493A" 
              />
              <Text style={styles.modalTitle}>
                {gameOver ? 'Game Over! 🎮' : 'Excellent! 🎉'}
              </Text>
              <Text style={styles.modalText}>{translationMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (gameOver) {
                    resetGame();
                  }
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>
                  {gameOver ? 'Play Again' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8EDE3',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8D493A',
    marginLeft: 10,
  },
  endGameButton: {
    alignSelf: 'center',
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 25,
    overflow: 'hidden',
  },
  endGameGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  endGameText: {
    color: '#F8EDE3',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
    gap: 30,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8D493A',
    marginLeft: 10,
  },
  letterContainer: {
    backgroundColor: '#8D493A',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  letter: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#F8EDE3',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F8EDE3',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#8D493A',
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    backgroundColor: '#8D493A',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  message: {
    fontSize: 16,
    color: '#8D493A',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#F8EDE380',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10, // Add space for the button below
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8D493A',
    marginBottom: 10,
  },
  wordList: {
    flex: 1,
  },
  usedWord: {
    fontSize: 16,
    color: '#8D493A',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8D493A',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#8D493A',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#8D493A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalButtonText: {
    color: '#F8EDE3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  expandButton: {
    padding: 5, 
    backgroundColor: '#F8EDE3',
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  
  buttonWrapperLower: {
    width: '100%',
    paddingVertical: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
    position: 'relative', // Changed from absolute to relative
    bottom: 0, // Position at the bottom
    zIndex: 1,
  },
  
  // Modal styles
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECB3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#D84315',
    width: '100%',
  },
  
  warningText: {
    flex: 1,
    fontSize: 16,
    color: '#D84315',
    marginLeft: 10,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DFD3C3',
  },
  
  closeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#F8EDE3',
  },
  
  modalWordList: {
    maxHeight: 350, // Taller list
    width: '100%',
    marginBottom: 15,
  },
  
  modalWordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DFD3C380',
  },
  
  modalWordNumber: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8D493A',
  },
  
  modalUsedWord: {
    flex: 1,
    fontSize: 18,
    color: '#8D493A',
  },
  
  noWordsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  
  noWordsText: {
    fontSize: 18,
    color: '#8D493A',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  
  noWordsSubtext: {
    fontSize: 14,
    color: '#8D493A80',
    marginTop: 5,
    textAlign: 'center',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
    width: '100%',
  },
  
  successText: {
    flex: 1,
    fontSize: 16,
    color: '#388E3C',
    marginLeft: 10,
  },
  
  modalButtonSuccess: {
    backgroundColor: '#388E3C',
  },
  
});

export default WordGame;
