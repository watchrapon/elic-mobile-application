import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WordGame from './game/WordGame';
import TranslationGame from './game/Translation';
import MatchGame from './game/Match';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Animatable from 'react-native-animatable';
import Rank from './game/Rank';
import Scoreboard from './game/Scoreboard'; // Add this import

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

function GameCard({ icon, title, description, onPress, colors, iconType }) {
  const scaleValue = new Animated.Value(1);
  const darkenValue = new Animated.Value(0);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(darkenValue, {
        toValue: 0.2,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(darkenValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      onPressIn={onPressIn} 
      onPressOut={onPressOut}
      activeOpacity={1}
    >
      <Animated.View style={[
        { transform: [{ scale: scaleValue }] },
        styles.cardContainer
      ]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gameCard, styles.cardShadow]}
        >
          <Animated.View style={[StyleSheet.absoluteFill, {
            backgroundColor: 'black',
            opacity: darkenValue,
            borderRadius: 25,
          }]} />
          <View style={styles.iconContainer}>
            {iconType === 'material' ? (
              <MaterialCommunityIcons name={icon} size={48} color="#FFFFFF" />
            ) : (
              <Ionicons name={icon} size={48} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{title}</Text>
            <Text style={styles.gameDescription}>{description}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

function GameMenuScreen({ navigation }) {
  const games = [
    {
      icon: "book-alphabet",
      iconType: 'material',
      title: "Word",
      description: "A word game where players fill in the blanks with the correct words based on randomly selected prefixes to earn points.",
      navigate: "WordGame",
      colors: ['#FF6B6B', '#FF8E8E'],
    },
    {
      icon: "language-outline",
      iconType: 'ionicon',
      title: "Translate",
      description: "The randomly generated sentences can be adjusted for difficulty and topic.",
      navigate: "TranslationGame",
      colors: ['#4ECDC4', '#45B7AF'],
    },
    {
      icon: "cards",
      iconType: 'material',
      title: "Match",
      description: "Match words to test memory. Match vocabulary words within 1 minute.",
      navigate: "MatchGame",
      colors: ['#FFD700', '#FFA500'],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, styles.yellowButton]}
            onPress={() => navigation.navigate('Rank')}
          >
            <MaterialCommunityIcons 
              name="trophy" 
              size={24} 
              color="#8D493A" 
            />
            <Text style={styles.buttonText}>Rank</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.whiteButton]}
            onPress={() => navigation.navigate('Scoreboard')}
          >
            <MaterialCommunityIcons 
              name="history" 
              size={24} 
              color="#8D493A" 
            />
            <Text style={styles.buttonText}>Scorebord</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {games.map((game, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={index * 200}
            duration={800}
          >
            <GameCard {...game} onPress={() => navigation.navigate(game.navigate)} />
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );
}

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { 
          backgroundColor: '#AF8F6F',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitleVisible: false,
        headerTitle: getHeaderTitle(route),
        headerLeft: () => (
          route.name !== 'GameMenu' && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeftButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )
        ),
        headerRight: null, // Remove header right button
      })}
    >
      <Stack.Screen name="GameMenu" component={GameMenuScreen} />
      <Stack.Screen name="WordGame" component={WordGame} />
      <Stack.Screen name="TranslationGame" component={TranslationGame} />
      <Stack.Screen name="MatchGame" component={MatchGame} />
      <Stack.Screen 
        name="Rank" 
        component={Rank}
        options={{
          title: 'Ranking',
          headerStyle: {
            backgroundColor: '#8D493A',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen 
        name="Scoreboard" 
        component={Scoreboard}
        options={{
          title: 'Scoreboard',
          headerStyle: {
            backgroundColor: '#8D493A',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.name;

  switch (routeName) {
    case 'GameMenu':
      return 'Game';
    case 'WordGame':
      return 'WordGame';
    case 'WordCategory':
      return 'Word Category';
    case 'TranslationGame':
      return 'TranslateGame';
    case 'MatchGame':
      return 'MatchGame';
    case 'Scoreboard':
      return 'Scoreboard';
    default:
      return 'Rank';
  }
}

export default function App({ route }) {
  const isNestedNavigation = route?.params?.nested;

  if (isNestedNavigation) {
    return (
      <NavigationContainer independent={true}>
        <AppNavigator />
      </NavigationContainer>
    );
  }

  return <AppNavigator />;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8EDE3',
    paddingTop: 20,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  welcomeText: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontWeight: '300',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
   
    
    marginBottom: 10,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8D493A',
  },
  cardContainer: {
    marginBottom: 25,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  gameCard: {
    borderRadius: 25,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    width: cardWidth,
    alignSelf: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 15,
  },
  gameInfo: {
    marginLeft: 20,
    flex: 1,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
  },
  headerLeftButton: {
    marginLeft: 15,
  },
  rankButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8EDE3',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 5,
  },
  yellowButton: {
    backgroundColor: '#FFD700',
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#8D493A',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 10,
  },
});
