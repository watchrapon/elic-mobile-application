import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Rank = () => {
  const [selectedGame, setSelectedGame] = useState('word'); // 'word' or 'match'
  const [scores, setScores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchScores = async () => {
    try {
      setRefreshing(true);
      const gamePath = selectedGame === 'word' ? 'wordgame/userScores' : 'matchgame/userScores';
      const scoresRef = ref(realtimeDb, gamePath);
      const snapshot = await get(scoresRef);
      const data = snapshot.val() || {};

      const sortedScores = Object.values(data)
        .filter(score => score.totalGames > 0) // Only include players who have played
        .sort((a, b) => b.highScore - a.highScore)
        .map((score, index) => ({
          ...score,
          rank: index + 1
        }));

      setScores(sortedScores);

      // Find current user's rank
      if (currentUser) {
        const userRank = sortedScores.findIndex(score => score.userId === currentUser.uid) + 1;
        setCurrentUserRank(userRank > 0 ? userRank : null); // Set to null if user hasn't played
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
    fetchScores();
  }, [selectedGame, currentUser]);

  const renderRankBadge = (rank) => {
    let badgeStyle = styles.rankBadge;
    let badgeTextStyle = styles.rankText;
    let icon = null;

    if (rank === 1) {
      badgeStyle = styles.firstPlace;
      icon = <MaterialCommunityIcons name="crown" size={20} color="#FFD700" />;
    } else if (rank === 2) {
      badgeStyle = styles.secondPlace;
      icon = <MaterialCommunityIcons name="crown" size={18} color="#C0C0C0" />;
    } else if (rank === 3) {
      badgeStyle = styles.thirdPlace;
      icon = <MaterialCommunityIcons name="crown" size={16} color="#CD7F32" />;
    }

    return (
      <View style={badgeStyle}>
        {icon}
        <Text style={badgeTextStyle}>{`#${rank}`}</Text>
      </View>
    );
  };

  const renderScoreItem = ({ item }) => {
    const isCurrentUser = currentUser && item.userId === currentUser.uid;
    return (
      <View style={styles.scoreItemWrapper}>
        <LinearGradient
          colors={isCurrentUser ? ['#FFF9C4', '#FFECB3'] : ['#ffffff', '#f8f8f8']}
          style={styles.gradientContainer}
        >
          <View style={[styles.scoreContent, isCurrentUser && styles.currentUserItem]}>
            {renderRankBadge(item.rank)}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.accountName || 'Anonymous Player'}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.highScore}>{item.highScore}</Text>
              <Text style={styles.gamesPlayed}>Games: {item.totalGames || 0}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.gradientWrapper}>
          <LinearGradient colors={['#F8EDE3', '#DFD3C3']} style={styles.gradientContent}>
            <View style={styles.contentWrapper}>
              <View style={styles.header}>
                <View style={styles.gameToggle}>
                  <TouchableOpacity
                    style={[styles.gameButton, selectedGame === 'word' && styles.selectedGame]}
                    onPress={() => setSelectedGame('word')}
                  >
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons 
                        name="book-alphabet" 
                        size={24} 
                        color={selectedGame === 'word' ? '#8D493A' : '#666'} 
                      />
                      <Text style={[
                        styles.gameButtonText, 
                        selectedGame === 'word' && styles.selectedGameText
                      ]}>
                        Word
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.gameButton, selectedGame === 'match' && styles.selectedGame]}
                    onPress={() => setSelectedGame('match')}
                  >
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons 
                        name="cards" 
                        size={24} 
                        color={selectedGame === 'match' ? '#8D493A' : '#666'} 
                      />
                      <Text style={[
                        styles.gameButtonText, 
                        selectedGame === 'match' && styles.selectedGameText
                      ]}>
                        Match
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.userRankCard}>
                <View style={styles.userStatsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Your Rank</Text>
                    <Text style={styles.userRankText}>
                      {currentUserRank ? `#${currentUserRank}` : '-'}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>High Score</Text>
                    <Text style={styles.highScoreText}>
                      {scores.find(s => s.userId === currentUser?.uid)?.highScore || 0}
                    </Text>
                  </View>
                </View>
                {!currentUserRank && (
                  <Text style={styles.noGamesText}>Play your first game to get ranked!</Text>
                )}
              </View>

              <FlatList
                style={styles.listContainer}
                contentContainerStyle={styles.listContentContainer}
                data={scores}
                renderItem={renderScoreItem}
                keyExtractor={(item) => `${selectedGame}-${item.userId}`}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={fetchScores} />
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="trophy-outline" size={48} color="#8D493A" />
                    <Text style={styles.emptyText}>No scores yet</Text>
                  </View>
                }
              />
            </View>
          </LinearGradient>
        </View>
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
    paddingTop: 20,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8D493A',
    marginBottom: 16,
  },
  gameToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  gameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    marginHorizontal: 4,
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
  scoreItem: {
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  highScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8D493A',
  },
  gamesPlayed: {
    fontSize: 12,
    color: '#666',
  },
  userRankCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  userRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8D493A',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    flex: 1,
  },
  scoreItemWrapper: {
    margin: 8,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientContainer: {
    borderRadius: 12,
    margin: 8,
    elevation: 2,
  },
  gradientWrapper: {
    flex: 1,
  },
  gradientContent: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
  },
  userStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#8D493A',
    marginBottom: 4,
    fontFamily: 'Comic Sans MS',
  },
  userRankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8D493A',
    fontFamily: 'Comic Sans MS',
  },
  highScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFB700',
    fontFamily: 'Comic Sans MS',
  },
  noGamesText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Rank;
