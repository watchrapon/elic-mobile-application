import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Scoreboard = () => {
  const [selectedGame, setSelectedGame] = useState('word');
  const [gameHistory, setGameHistory] = useState([]);
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    highScore: 0,
    highRounds: 0  // Add highRounds to state
  });

  useEffect(() => {
    fetchUserHistory();
  }, [selectedGame]);

  const fetchUserHistory = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      let gamePath;
      if (selectedGame === 'word') {
        gamePath = 'wordgame/history';
      } else if (selectedGame === 'match') {
        gamePath = 'matchgame/history';
      } else {
        gamePath = 'translategame/history';
      }
      
      const historyRef = ref(realtimeDb, `${gamePath}/${user.uid}`);
      const statsRef = ref(realtimeDb, `${selectedGame === 'word' ? 'wordgame' : selectedGame === 'match' ? 'matchgame' : 'translategame'}/userScores/${user.uid}`);

      const [historySnap, statsSnap] = await Promise.all([
        get(historyRef),
        get(statsRef)
      ]);

      const historyData = historySnap.val() || {};
      const statsData = statsSnap.val() || {};

      // Convert history object to array and sort by date
      const historyArray = Object.entries(historyData).map(([key, value]) => ({
        id: key,
        ...value,
        date: new Date(value.timestamp)
      })).sort((a, b) => b.date - a.date);

      // Find high score based on game type
      let highScore = 0;
      let highRounds = 0;
      if (selectedGame === 'translate') {
        // Calculate weighted score for each entry
        // Weight formula: score + (roundsPlayed * 10)
        // This means 20% difference in score can overcome 2 rounds difference
        const weightedScores = historyArray.map(item => ({
          ...item,
          weightedScore: (item.score || 0) + ((item.roundsPlayed || 0) * 10)
        }));

        // Find entry with highest weighted score
        const bestEntry = weightedScores.reduce((best, current) => {
          return current.weightedScore > best.weightedScore ? current : best;
        }, weightedScores[0] || { score: 0 });

        highScore = bestEntry.score || 0;
        // Fix: Check if historyArray is not empty before calculating highRounds
        highRounds = historyArray.length > 0 
          ? Math.max(...historyArray.map(item => item.roundsPlayed || 0))
          : 0;
      } else {
        highScore = statsData.highScore || 0;
      }

      setGameHistory(historyArray);
      setUserStats({
        totalGames: statsData.totalGames || 0,
        highScore: highScore,
        highRounds: highRounds
      });
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.gradientContainer}
      >
        <View style={styles.historyContent}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {item.date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text style={styles.timeText}>
              {item.date.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            {item.category && (
              <Text style={styles.categoryText}>Category: {item.category}</Text>
            )}
            {item.roundsPlayed && (
              <Text style={styles.roundText}>Rounds: {item.roundsPlayed}</Text>
            )}
            {item.difficulty && (
              <Text style={styles.difficultyText}>Level: {item.difficulty}</Text>
            )}
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {item.score}{selectedGame === 'translate' ? '%' : ''}
            </Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F8EDE3', '#DFD3C3']} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.gameToggle}>
            <TouchableOpacity
              style={[styles.gameButton, selectedGame === 'word' && styles.selectedGame]}
              onPress={() => setSelectedGame('word')}
            >
              <MaterialCommunityIcons 
                name="book-alphabet" 
                size={24} 
                color={selectedGame === 'word' ? '#8D493A' : '#666'} 
              />
              <Text style={[styles.gameButtonText, selectedGame === 'word' && styles.selectedGameText]}>
                Word
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gameButton, selectedGame === 'translate' && styles.selectedGame]}
              onPress={() => setSelectedGame('translate')}
            >
              <MaterialCommunityIcons 
                name="translate" 
                size={24} 
                color={selectedGame === 'translate' ? '#8D493A' : '#666'} 
              />
              <Text style={[styles.gameButtonText, selectedGame === 'translate' && styles.selectedGameText]}>
                Translate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gameButton, selectedGame === 'match' && styles.selectedGame]}
              onPress={() => setSelectedGame('match')}
            >
              <MaterialCommunityIcons 
                name="cards" 
                size={24} 
                color={selectedGame === 'match' ? '#8D493A' : '#666'} 
              />
              <Text style={[styles.gameButtonText, selectedGame === 'match' && styles.selectedGameText]}>
                Match
              </Text>
            </TouchableOpacity>

            
          </View>

          <View style={styles.statsCard}>
            {selectedGame === 'translate' ? (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Games</Text>
                  <Text style={styles.statValue}>{userStats.totalGames}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>High Score</Text>
                  <Text style={styles.statValue2}>{userStats.highScore}%</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>High Rounds</Text>
                  <Text style={styles.statValue}>{userStats.highRounds}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Games</Text>
                  <Text style={styles.statValue}>{userStats.totalGames}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>High Score</Text>
                  <Text style={styles.statValue2}>
                    {userStats.highScore}{selectedGame === 'translate' ? '%' : ''}
                  </Text>
                </View>
              </>
            )}
          </View>

        </View>

        <FlatList
          data={gameHistory}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={48} color="#8D493A" />
              <Text style={styles.emptyText}>No game history</Text>
            </View>
          }
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  gameToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  gameButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 16,
  },
  selectedGame: {
    backgroundColor: '#F8EDE3',
  },
  gameButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  selectedGameText: {
    color: '#8D493A',
    fontWeight: 'bold',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#8D493A',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8D493A',
  },
  statValue2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFB700',
  },
  historyItem: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  gradientContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  roundText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  difficultyText: {
    fontSize: 14,
    color: '#8D493A',
    marginTop: 2,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8D493A',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  categoryText: {
    fontSize: 14,
    color: '#8D493A',
    marginTop: 4,
    fontStyle: 'italic'
  },
});

export default Scoreboard;
