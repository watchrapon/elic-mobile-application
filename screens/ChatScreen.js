import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, FlatList, SafeAreaView, StatusBar, Platform, Animated, Easing, Modal } from "react-native";
import axios from "axios";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';  // เพิ่ม FontAwesome5
import Menu from './menu.js';
import Settings from './option/Settings.js';
import ProfileScreen from './profile.js';
import { Keyboard } from 'react-native';
import getRolePrompt from './option/getRolePrompt';
import { CHATBOT_ROLES } from './option/Settings';

const GridLoader = () => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const gridItems = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 3x3 grid

  return (
    <View style={styles.gridContainer}>
      {gridItems.map((item, index) => (
        <Animated.View
          key={index}
          style={[
            styles.gridItem,
            {
              opacity: animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.5, 1, 0.5],
                extrapolate: "clamp"
              }),
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1, 0.8],
                    extrapolate: "clamp"
                  })
                }
              ]
            }
          ]}
        />
      ))}
    </View>
  );
};

const LoadingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialIcons name="translate" size={16} color="white" />
      <Text style={{ color: 'white', fontSize: 12, marginLeft: 4 }}>
        Loading{dots}
      </Text>
    </View>
  );
};

const ChatScreen = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [chatbotRole, setChatbotRole] = useState('new_friend');
  const [translationModalVisible, setTranslationModalVisible] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const games = [
    { id: 'chat', title: 'Chat', component: null },
    { id: 'game', title: 'Game', component: Menu },  // changed from menu to game
    { id: 'profile', title: 'Profile', component: ProfileScreen },
  ];

  useEffect(() => {
    sendInitialGreeting();
  }, []);

  useEffect(() => {
    resetChat();
  }, [chatbotRole]);

  const formatChatHistory = (history) => {
    return history.map(msg => `${msg.isUser ? 'User' : 'Elic'}: ${msg.text}`).join('\n');
  };

  const sendInitialGreeting = async () => {
    setGeneratingAnswer(true);
    try {
      const trainerPrompts = [
        { text: getRolePrompt(chatbotRole) },
        { text: "If there is an unclear or only one word, repeat what it means. and If the user writes incorrectly, please explain - Correct spelling - Wrong point - Suggestions for improvement - Please write a concise and easy -to-understand description." },
        { text: "Keep your introduction brief and friendly, maximum 2 sentences." },
        { text: "List 2-3 main areas you can help with." },
        { text: "Ask one specific question to start the conversation." },
        { text: "Maximum response length: 3-4 sentences." }
      ];

      const parts = !chatbotRole ? getDefaultPrompt() : trainerPrompts;

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAQvuS3bA_iGlXQ-Ev6ti2wL4uLmePJYBM`,
        method: "post",
        data: {
          contents: [{
            parts: parts
          }],
        },
      });

      const aiMessageText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || randomHi();
      const messageChunks = splitLongMessage(aiMessageText);
      
      // ส่งแต่ละข้อความเป็นกล่องแยกกัน
      for (let i = 0; i < messageChunks.length; i++) {
        const aiMessage = {
          text: messageChunks[i],
          isUser: false,
          timestamp: new Date()
        };
        setTimeout(() => {
          setChatHistory(prev => i === 0 ? [aiMessage] : [...prev, aiMessage]);
        }, i * 500);
      }
    } catch (error) {
      console.error("Error generating initial greeting:", error);
      setChatHistory([{ text: "Hello! I'm Elic, your English language trainer. How can I help you improve your English today?", isUser: false }]);
    } finally {
      setGeneratingAnswer(false);
    }
  };

  const resetChat = () => {
    setChatHistory([]);
    sendInitialGreeting();
  };

  const handleSettingsChange = (newDifficulty, newChatbotRole) => {
    if (newChatbotRole !== chatbotRole) {
      setChatbotRole(newChatbotRole);
    }
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
    }
  };

  const generateResponse = async (userMessage) => {
    try {
      const conversationHistory = formatChatHistory(chatHistory);
      const parts = [
        { text: getRolePrompt(chatbotRole) },
        { text: 'Answer only according to the personality, characteristics and scope of the given role. Use role-appropriate language, such as jargon or appropriate expressions.' },
        { text: "If there is an unclear or only one word, repeat what it means. and If the user writes incorrectly, please explain - Correct spelling - Wrong point - Suggestions for improvement - Please write a concise and easy -to-understand description." },
        { text: "Previous conversation:\n" + conversationHistory },
        { text: `Difficulty level: ${difficulty}` },
        { text: "Stay in character and keep responses brief." },
        { text: "Maximum 4 sentences per response." },
        { text: `User's latest message: ${userMessage}` }
      ];

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCBmjgmL0EmlMH18RoRc4nb8zKQKbCDucw`,
        method: "post",
        data: {
          contents: [{
            parts: parts
          }],
        },
      });

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble right now. Let's try a different topic!";
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm having trouble right now. Let's try a different topic!";
    }
  };

  const splitLongMessage = (message) => {
    // แยกข้อความเป็นกล่องใหม่ทุก 8 บรรทัด
    const lines = message.split('\n');
    const messages = [];
    let currentMessage = '';
    let lineCount = 0;
  
    for (let line of lines) {
      if (lineCount >= 10) {
        // เมื่อครบ 8 บรรทัด บันทึกข้อความเก่าและเริ่มข้อความใหม่
        messages.push(currentMessage.trim());
        currentMessage = line;
        lineCount = 1;
      } else {
        // ถ้ายังไม่ครบ 8 บรรทัด เพิ่มบรรทัดใหม่
        currentMessage += (currentMessage ? '\n' : '') + line;
        lineCount++;
      }
    }
  
    // เพิ่มข้อความที่เหลือ
    if (currentMessage) {
      messages.push(currentMessage.trim());
    }
  
    // ถ้าไม่มีการแบ่ง ส่งคืนข้อความเดิม
    return messages.length ? messages : [message];
  };

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
  
    const userMessage = { 
      text: inputMessage, 
      isUser: true,
      timestamp: new Date() 
    };
  
    setChatHistory(prev => [...prev, userMessage]);
    setInputMessage("");
    setGeneratingAnswer(true);
  
    try {
      const aiMessageText = await generateResponse(inputMessage);
      const messageChunks = splitLongMessage(aiMessageText);
      
      // ส่งแต่ละข้อความเป็นกล่องแยกกัน
      for (let i = 0; i < messageChunks.length; i++) {
        const aiMessage = {
          text: messageChunks[i],
          isUser: false,
          timestamp: new Date()
        };
        // ใช้ setTimeout เพื่อให้มีการดีเลย์ระหว่างข้อความ
        setTimeout(() => {
          setChatHistory(prev => [...prev, aiMessage]);
        }, i * 500);
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
    } finally {
      setGeneratingAnswer(false);
    }
  }, [inputMessage, chatHistory, difficulty, chatbotRole]);

  

  const translateWithGemini = async (text) => {
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCOqvOEwENqbjr18V4MaKP3F3peXZkeUgs`,
        method: "post",
        data: {
          contents: [{
            parts: [
              { text: `Translate this English text to Thai: "${text}"` },
              { text: `หางเสียงใช้ครับอย่างเดียว` },
              { text: "Return the translation only." },
   
              
            ]
          }],
        },
      });
      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  const handleTranslate = async (text) => {
    setIsTranslating(true);
    try {
      const translated = await translateWithGemini(text);
      setTranslatedText(translated);
      setTranslationModalVisible(true);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderMiniMenu = () => (
    <FlatList
      data={games}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.miniMenuContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.miniMenuItem, currentScreen === item.id && styles.miniMenuItemActive]}
          onPress={() => setCurrentScreen(item.id)}
        >
          <Ionicons name={getIconName(item.id)} size={24} color={currentScreen === item.id ? "#8D493A" : "white"} />
          <Text style={[styles.miniMenuText, currentScreen === item.id && styles.miniMenuTextActive]}>{item.title}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  );

  const renderCurrentScreen = () => {
    const renderHeader = () => {
      const currentRoleLabel = CHATBOT_ROLES?.find(role => role.value === chatbotRole)?.label || 'Select Role';
      
      return (
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>
              {currentScreen === 'chat' ? 'Chat' : currentScreen === 'profile' ? 'Profile' : currentScreen}
            </Text>
            {currentScreen === 'chat' && (
              <Text style={styles.roleStatus}>{currentRoleLabel}</Text>
            )}
          </View>
          {currentScreen === 'chat' && (
            <TouchableOpacity 
              onPress={() => setCurrentScreen('settings')} 
              style={styles.settingsButton}
            >
              <View style={styles.settingsIconContainer}>
                <Ionicons name="settings-outline" size={22} color="white" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    };

    switch (currentScreen) {
      case 'chat':
        return (
          <>
            {renderHeader()}
            {renderChatScreen()}
          </>
        );
      case 'game':
        return (
          <>
            {Menu ? <Menu /> : <Text>Menu component is loading...</Text>}
          </>
        );
      case 'profile':
        return (
          <>
            {renderHeader()}
            <ProfileScreen />
          </>
        );
      case 'settings':
        return (
          <Settings 
            difficulty={difficulty}
            setDifficulty={(newDifficulty) => handleSettingsChange(newDifficulty, chatbotRole)}
            chatbotRole={chatbotRole}
            setChatbotRole={(newChatbotRole) => handleSettingsChange(difficulty, newChatbotRole)}
          />
        );
      default:
        return renderChatScreen();
    }
  };

  const renderChatScreen = () => (
    <>
      <ScrollView style={styles.chatArea}>
        {chatHistory.map((message, index) => (
          <View key={index}>
            <View style={[
              styles.statusBar,
              message.isUser ? styles.userStatusBar : styles.aiStatusBar
            ]}>
              <FontAwesome5 
                name={message.isUser ? "user-circle" : "robot"} 
                size={16} 
                color={message.isUser ? "#8D493A" : "#6C4E31"} 
              />
              <Text style={[
                styles.statusText,
                message.isUser ? styles.userStatusText : styles.aiStatusText
              ]}>
                {message.isUser ? "You" : "AI Elic"}
              </Text>
            </View>
            <View
              style={[
                styles.message,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text>{message.text}</Text>
              <Text style={[
                styles.timestamp,
                message.isUser ? styles.userTimestamp : styles.aiTimestamp
              ]}>
                {message.timestamp?.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </Text>
              {!message.isUser && (
                <TouchableOpacity 
                  onPress={() => handleTranslate(message.text)}
                  style={[styles.translateButton, isTranslating && styles.translateButtonDisabled]}
                  disabled={isTranslating}
                >
                  {isTranslating ? (
                    <LoadingDots />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialIcons name="translate" size={16} color="white" />
                      <Text style={[styles.translateButtonText, { marginLeft: 4 }]}>Translate</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        {generatingAnswer && (
          <View style={styles.loadingContainer}>
            <GridLoader />
          </View>
        )}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message"
          style={styles.input}
          editable={!generatingAnswer}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={styles.button}
          disabled={generatingAnswer}
        >
          <Ionicons name="paper-plane" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={translationModalVisible}
        onRequestClose={() => setTranslationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: '90%' }]}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="translate" size={24} color="#8D493A" />
              <Text style={styles.modalHeaderText}>Thai</Text>
            </View>
            <Text style={styles.modalText}>{translatedText}</Text>
            <TouchableOpacity 
              onPress={() => setTranslationModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );

  const getIconName = (id) => {
    switch (id) {
      case 'chat': return 'chatbubble-outline';
      case 'profile': return 'person-outline';
      case 'settings': return 'settings-outline';
      case 'game': return 'game-controller-outline';  // changed icon for game
      default: return 'game-controller-outline';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#AF8F6F" />
      <View style={styles.footer}>
        {renderCurrentScreen()}
      </View>
      {!isKeyboardVisible && (
        <View style={styles.chatContainer}>
          {renderMiniMenu()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8D493A',
    paddingTop: Platform.OS === 'android' ? 0 : StatusBar.currentHeight,
  },
  chatContainer: {
    flex: 0.1,
    backgroundColor: '#F8EDE3',
  },
  footer: {
    flex: 1,
    backgroundColor: '#F8EDE3',
  },
  miniMenuContent: {
    flexGrow: 1,
    backgroundColor: '#AF8F6F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  miniMenuItem: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniMenuItemActive: {
    backgroundColor: '#DFD3C3',
  },
  miniMenuText: {
    color: 'white',
    fontSize: 13,
    marginTop: 5,
  },
  miniMenuTextActive: {
    color: '#8D493A',
    fontSize: 13,
  },
  chatArea: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 16, // เพิ่มระยะห่างระหว่างข้อความ
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DFD3C3',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    marginEnd: 10,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#8D493A',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  gridContainer: {
    width: 60,
    height: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    size: 'small',
  },
  gridItem: {
    width: 16,
    height: 16,
    backgroundColor: '#6C4E31',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#AF8F6F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#8D493A',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  settingsButton: {
    padding: 8,
    alignSelf: 'center',
    alignItems: 'center',
  },
  settingsIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  translateButton: {
    marginTop: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#8D493A',
    borderRadius: 15,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  translateButtonText: {
    color: 'white',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: '100%',
    justifyContent: 'center',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8D493A',
    marginLeft: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#8D493A',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  translateButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#A67B5B',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: '#8D493A80',
  },
  aiTimestamp: {
    color: '#00000050',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 4,
  },
  userStatusBar: {
    alignSelf: 'flex-end',
    marginRight: 8,
  },
  aiStatusBar: {
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  userStatusText: {
    color: '#8D493A',
  },
  aiStatusText: {
    color: '#6C4E31',
  },
  roleStatus: {
    color: '#F8EDE3',
    fontSize: 14,
    marginTop: 2,
    opacity: 0.8,
  },
});

export default ChatScreen;





