import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { vocabularyList } from '../option/random';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'; // Add this import
import { Audio } from 'expo-av'; // Add this import
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Add this import
import { ref, set, push, get } from 'firebase/database';
import { auth, realtimeDb } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore'; // Add this import
import { db } from '../../config/firebase'; // Add db to imports

const MatchGame = ({ }) => {
  const [words, setWords] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Changed to 60 seconds
  const [gameOver, setGameOver] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);
  const [timerWidth] = useState(new Animated.Value(100));
  const [sound, setSound] = useState();
  const [timerAnimation, setTimerAnimation] = useState(null);
  const animationRef = useRef(null);
  const [highScore, setHighScore] = useState(0);
  const [floatingScores, setFloatingScores] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [translationMessage, setTranslationMessage] = useState('');
  const [userHighScore, setUserHighScore] = useState(0);

  const generateGameSet = useCallback(() => {
    const allWords = vocabularyList();
    const gameWords = [];
    const usedIndices = new Set();

    // Select exactly 4 word pairs
    while (gameWords.length < 8) { // Changed to 8 since each pair is 2 words (4 pairs total)
      const randomIndex = Math.floor(Math.random() * allWords.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const word = allWords[randomIndex];
        gameWords.push(
          { id: `en_${randomIndex}`, value: word.en, type: 'en', matched: false },
          { id: `th_${randomIndex}`, value: word.th, type: 'th', matched: false }
        );
      }
    }

    return gameWords.sort(() => Math.random() - 0.5);
  }, []);

  // Add new function to check and generate new words
  const checkAndGenerateNewWords = useCallback(() => {
    if (matchedPairs.length === 8) { // Changed to 8 (4 pairs)
      setWords(generateGameSet());
      setMatchedPairs([]);
      setTotalMatches(prev => prev + 4); // Add 4 matches to total
    }
  }, [matchedPairs.length]);

  useEffect(() => {
    setWords(generateGameSet());
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      // ยกเลิก animation เก่า
      if (animationRef.current) {
        animationRef.current.stop();
      }

      // ตั้งค่าความกว้างตามเวลาที่เหลือ
      timerWidth.setValue((timeLeft / 60) * 100);

      // สร้าง animation ใหม่
      const animation = Animated.timing(timerWidth, {
        toValue: 0,
        duration: timeLeft * 1000,
        useNativeDriver: false,
      });

      // เก็บ reference ของ animation ปัจจุบัน
      animationRef.current = animation;
      animation.start();

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        animation.stop();
      };
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      updatePlayerScore(score).then(result => {
        setTranslationMessage(
          `Final Score: ${score}\n` +
          `${result?.success 
            ? (result.isNewHighScore 
                ? `🎉 New High Score! (Previous: ${result.previousHighScore}) 🏆` 
                : `👏 Good Try! (Best: ${result.previousHighScore})`)
            : 'Failed to save score'}`
        );
      });
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    checkAndGenerateNewWords();
  }, [matchedPairs]);

  // Add sound loading function
  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/click.mp3'),
      { positionMillis: 300 } // Start at 0.3 seconds
    );
    setSound(sound);
  };

  // Load sound when component mounts
  useEffect(() => {
    loadSound();
    return () => {
      sound?.unloadAsync();
    };
  }, []);

  const addFloatingScore = (x, y) => {
    const id = Date.now();
    setFloatingScores(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(score => score.id !== id));
    }, 1000);
  };

  const handleCardPress = async (card) => {
    if (selectedCards.length === 2 || card.matched || selectedCards.includes(card)) return;

    if (selectedCards.length === 1 && selectedCards[0].type === card.type) {
      // If the same type is clicked, reset the selection
      setSelectedCards([card]);
      return;
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (first.id.split('_')[1] === second.id.split('_')[1]) {
        // Match found - play sound here instead
        try {
          await sound?.replayAsync();
          addFloatingScore(first.x, first.y);
        } catch (error) {
          console.log('Error playing sound:', error);
        }
        setMatchedPairs([...matchedPairs, first.id, second.id]);
        setScore(prevScore => prevScore + 1);
        setSelectedCards([]);
      } else {
        // No match - shake both cards
        if (first.ref) first.ref.shake(800);
        if (second.ref) second.ref.shake(800);
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };

  const restartGame = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    timerWidth.setValue(100);
    setWords(generateGameSet());
    setSelectedCards([]);
    setMatchedPairs([]);
    setScore(0); // Reset score
    setTimeLeft(60); // Changed to 60 seconds
    setTotalMatches(0);
    setGameOver(false);
  };

  const renderCard = (card) => {
    const isSelected = selectedCards.includes(card);
    const isMatched = matchedPairs.includes(card.id);

    return (
      <Animatable.View
        animation={isMatched ? 'zoomOut' : 'bounceIn'}
        duration={500}
        ref={(ref) => card.ref = ref}
        key={card.id}
      >
        <TouchableOpacity
          onPress={() => handleCardPress(card)}
          disabled={isMatched}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={isSelected ? 
              ['#f0f0f0', '#e0e0e0'] : 
              ['#ffffff', '#f5f5f5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
              isMatched && styles.cardMatched,
            ]}
          >
            <Text style={[
              styles.cardText,
              isSelected && styles.cardTextSelected
            ]}>{card.value}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  useEffect(() => {
    if (gameOver) {
      // อัพเดท high score ถ้าคะแนนใหม่สูงกว่า
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [gameOver]);

  // Add useEffect to get current user
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

  // Add function to save game score
  const saveGameScore = async (finalScore) => {
    if (!currentUser) return false;

    try {
      // Create score data object
      const scoreData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        score: finalScore,
        timestamp: new Date().toISOString(),
        totalMatches,
        gameEndTime: new Date().toISOString()
      };

      // Save to scores collection
      const newScoreRef = push(ref(realtimeDb, 'matchgame/scores'));
      await set(newScoreRef, scoreData);

      // Update user's personal best if necessary
      const userGameRef = ref(realtimeDb, `users/${currentUser.uid}/matchgame`);
      const userGameSnapshot = await get(userGameRef);
      const currentStats = userGameSnapshot.val() || {};

      if (!currentStats.highScore || finalScore > currentStats.highScore) {
        await set(userGameRef, {
          highScore: finalScore,
          lastPlayed: new Date().toISOString(),
          totalGames: (currentStats.totalGames || 0) + 1,
          history: {
            ...(currentStats.history || {}),
            [newScoreRef.key]: scoreData
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving game score:', error);
      return false;
    }
  };

  const updatePlayerScore = async (newScore) => {
    if (!currentUser?.uid) return null;

    try {
      // Get user's profile data first
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const rtdbRef = ref(realtimeDb, `matchgame/userScores/${currentUser.uid}`);
      const historyRef = ref(realtimeDb, `matchgame/history/${currentUser.uid}`);
      const rtdbSnapshot = await get(rtdbRef);
      const existingData = rtdbSnapshot.val() || {};

      // Create history entry
      const historyData = {
        score: newScore,
        timestamp: new Date().toISOString(),
        totalMatches: totalMatches
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
        totalMatches: totalMatches
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

  // Add function to fetch user's high score
  const fetchUserHighScore = async () => {
    if (!currentUser?.uid) return;
    try {
      const rtdbRef = ref(realtimeDb, `matchgame/userScores/${currentUser.uid}`);
      const snapshot = await get(rtdbRef);
      const userData = snapshot.val();
      if (userData?.highScore) {
        setUserHighScore(userData.highScore);
      }
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
  };

  // Add useEffect to fetch high score when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchUserHighScore();
    }
  }, [currentUser]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.mainContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8f8f8']}
          style={styles.container}
        >
          <View style={styles.patternOverlay} />
          
          <View style={styles.header}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.headerGradient}
            >
              <View style={styles.timerWrapper}>
                <MaterialCommunityIcons name="timer-outline" size={22} color="#666" />
                <View style={styles.timerContainer}>
                  <Animated.View 
                    style={[
                      styles.timerBar,
                      {
                        width: timerWidth.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%']
                        })
                      }
                    ]} 
                  />
                </View>
              </View>
              <View style={styles.scoresContainer}>
                <View style={styles.scoreWrapper}>
                  <MaterialCommunityIcons name="star-outline" size={26} color="#FFD700" />
                  <Text style={styles.scoreText}>{score}</Text>
                </View>
                <View style={styles.highScoreWrapper}>
                  <MaterialCommunityIcons name="crown" size={20} color="#FFB700" />
                  <Text style={styles.highScoreText}>{userHighScore}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.gameBoard}>
            <View style={styles.column}>
              {words.filter(card => card.type === 'en').map(card => renderCard(card))}
            </View>
            <View style={styles.column}>
              {words.filter(card => card.type === 'th').map(card => renderCard(card))}
            </View>
          </View>

          {gameOver && (
            <Animatable.View 
              animation="fadeIn" 
              duration={500} 
              style={styles.gameOverContainer}
            >
              <View style={styles.modalOverlay}>
                <Animatable.View 
                  animation="zoomIn" 
                  duration={600} 
                  delay={200} 
                  style={styles.modalCard}
                >
                  <LinearGradient
                    colors={['#fff', '#f8f8f8']}
                    style={styles.modalContent}
                  >
                    <Animatable.View 
                      animation="bounceIn"
                      delay={800}
                      style={styles.trophyContainer}
                    >
                      <MaterialCommunityIcons name="timer-off-outline" size={50} color="#FF6B6B" />
                    </Animatable.View>

                    <Animatable.Text 
                      animation="fadeInUp"
                      delay={1000}
                      style={styles.timeUpText}
                    >
                      Time's Up!
                    </Animatable.Text>

                    <View style={styles.scoreDetails}>
                      <Animatable.View 
                        animation="fadeInLeft"
                        delay={1200}
                        style={styles.scoreItem}
                      >
                        <Text style={styles.scoreLabel}>Score</Text>
                        <Text style={styles.scoreBig}>{score}</Text>
                      </Animatable.View>

                      <Animatable.View 
                        animation="fadeInRight"
                        delay={1200}
                        style={styles.scoreItem}
                      >
                        <Text style={styles.scoreLabel}>Matches</Text>
                        <Text style={styles.scoreBig}>{totalMatches}</Text>
                      </Animatable.View>
                    </View>

                    {translationMessage && (
                      <Animatable.Text 
                        animation="fadeInUp"
                        delay={1400}
                        style={styles.messageText}
                      >
                        {translationMessage}
                      </Animatable.Text>
                    )}

                    <Animatable.View 
                      animation="fadeInUp"
                      delay={1600}
                      style={styles.buttonContainer}
                    >
                      <TouchableOpacity
                        style={styles.playAgainButton}
                        onPress={restartGame}
                      >
                        <LinearGradient
                          colors={['#4ECDC4', '#45B7AF']}
                          style={styles.buttonGradient}
                        >
                          <MaterialCommunityIcons name="reload" size={24} color="#fff" />
                          <Text style={styles.buttonText}>Play Again</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animatable.View>
                  </LinearGradient>
                </Animatable.View>
              </View>
            </Animatable.View>
          )}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10, // reduced from 16
    backgroundColor: '#fff',
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
    backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    opacity: 0.1,
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
  },
  timerContainer: {
    width: '80%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginLeft: 12,
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#666',
    borderRadius: 3,
  },
  scoresContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  highScoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  highScoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFB700',
    marginLeft: 4,
    fontFamily: 'Comic Sans MS',
  },
  gameBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 60, // Add this line to create space below header
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: 140,
    height: 80, // reduced from 100
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4, // reduced from 6
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardSelected: {
    transform: [{ scale: 0.98 }],
    borderColor: '#666',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
    color: '#444',
    fontWeight: '600',
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  cardTextSelected: {
    color: '#222',
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  cardMatched: {
    opacity: 0,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 36,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  finalScoreText: {
    fontSize: 30,
    color: 'white',
    marginBottom: 30,
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  restartButton: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#266A66',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#5DDBCF',
    transform: [{ perspective: 1000 }],
  },
  restartButtonPressed: {
    transform: [
      { perspective: 1000 },
      { scale: 0.95 },
      { translateY: 2 }
    ],
    elevation: 5,
  },
  timerContainer: {
    width: '50%',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  resultItem: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minWidth: 120,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  resultValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    transform: [
      { perspective: 1000 }
    ],
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  newHighScore: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
  newHighScoreText: {
    color: '#FF6B6B',
  },
  newRecordText: {
    fontSize: 20,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Comic Sans MS', // Change to Comic Sans MS
  },
  translationMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Comic Sans MS',
  },
  modalWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    maxWidth: 360,
  },
  modalGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  trophyContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,107,107,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeUpText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    fontFamily: 'Comic Sans MS',
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  scoreItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    minWidth: 120,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Comic Sans MS',
  },
  scoreBig: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Comic Sans MS',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Comic Sans MS',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playAgainButton: {
    width: '80%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Comic Sans MS',
  },
});

export default MatchGame;
