import React, { useState, useCallback, useEffect, useRef } from "react";
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

const VocabularyTable = ({ words }) => {
  // Render a beautified table-like display for vocabulary words
  try {
    if (!Array.isArray(words)) {
      return <Text style={styles.errorText}>Invalid vocabulary format</Text>;
    }
    
    return (
      <View style={styles.vocabularyContainer}>
        <View style={styles.vocabularyTitleContainer}>
          <FontAwesome5 name="book" size={16} color="#8D493A" />
          <Text style={styles.vocabularyTitle}>Vocabulary</Text>
        </View>
        
        <View style={styles.vocabularyHeader}>
          <Text style={[styles.vocabularyHeaderText, styles.englishColumn]}>English</Text>
          <Text style={[styles.vocabularyHeaderText, styles.thaiColumn]}>Thai</Text>
          <Text style={[styles.vocabularyHeaderText, styles.exampleColumn]}>Example</Text>
        </View>
        
        {words.map((item, index) => (
          <View key={index} style={[
            styles.vocabularyRow, 
            index % 2 === 0 ? styles.evenRow : styles.oddRow,
            index === words.length - 1 && styles.lastRow
          ]}>
            <View style={styles.englishColumn}>
              <Text style={styles.vocabularyWord}>{item.english}</Text>
            </View>
            <View style={styles.thaiColumn}>
              <Text style={styles.vocabularyTranslation}>{item.thai}</Text>
            </View>
            <View style={styles.exampleColumn}>
              <Text style={styles.vocabularyExample}>"{item.example}"</Text>
            </View>
          </View>
        ))}
      </View>
    );
  } catch (error) {
    console.error("Error rendering vocabulary:", error);
    return <Text style={styles.errorText}>Error displaying vocabulary</Text>;
  }
};

const SpellingCorrection = ({ correction }) => {
  console.log("Rendering spelling correction:", JSON.stringify(correction));
  
  if (!correction) {
    console.log("No correction data provided");
    return null;
  }
  
  // Check if we have errors array or direct original/corrected properties
  const hasErrorsArray = correction.errors && Array.isArray(correction.errors) && correction.errors.length > 0;
  const hasDirectProperties = correction.original && correction.corrected;
  
  if (!hasErrorsArray && !hasDirectProperties) {
    console.log("No valid correction format found");
    return null;
  }
  
  return (
    <View style={styles.spellingCorrectionContainer}>
      <View style={styles.spellingHeaderRow}>
        <FontAwesome5 name="spell-check" size={14} color="#8D493A" />
        <Text style={styles.spellingHeaderText}>English Correction</Text>
      </View>
      
      {/* Show individual word corrections if available */}
      {hasErrorsArray && (
        <View style={styles.correctionsSection}>
          {correction.errors.map((error, index) => (
            <View key={index} style={styles.spellingItem}>
              <View style={styles.spellingContentRow}>
                <Text style={styles.spellingLabel}>Original:</Text>
                <Text style={styles.spellingIncorrect}>{error.original}</Text>
              </View>
              
              <View style={styles.spellingContentRow}>
                <Text style={styles.spellingLabel}>Correct:</Text>
                <Text style={styles.spellingCorrect}>{error.corrected}</Text>
              </View>
              
              {error.explanation && (
                <Text style={styles.errorExplanation}>{error.explanation}</Text>
              )}
            </View>
          ))}
        </View>
      )}
      
      {/* For backward compatibility with the old format */}
      {hasDirectProperties && !hasErrorsArray && (
        <View style={styles.spellingItem}>
          <View style={styles.spellingContentRow}>
            <Text style={styles.spellingLabel}>Original:</Text>
            <Text style={styles.spellingIncorrect}>{correction.original}</Text>
          </View>
          
          <View style={styles.spellingContentRow}>
            <Text style={styles.spellingLabel}>Correct:</Text>
            <Text style={styles.spellingCorrect}>{correction.corrected}</Text>
          </View>
          
          {correction.explanation && (
            <Text style={styles.errorExplanation}>{correction.explanation}</Text>
          )}
        </View>
      )}
      
      {/* Better phrase suggestion section */}
      {correction.betterPhrase && correction.betterPhrase.trim() !== "" && (
        <View style={styles.betterPhraseSection}>
          <View style={styles.betterPhraseHeaderRow}>
            <FontAwesome5 name="lightbulb" size={14} color="#8D493A" />
            <Text style={styles.betterPhraseHeaderText}>Better Expression</Text>
          </View>
          <Text style={styles.betterPhraseText}>{correction.betterPhrase}</Text>
        </View>
      )}
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
  const scrollViewRef = useRef(null);

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

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatHistory.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory]);

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
      
      // Check if the message is primarily in Thai
      const thaiCharCount = (userMessage.match(/[\u0E00-\u0E7F]/g) || []).length;
      const isMainlyThai = thaiCharCount > userMessage.length * 0.3; // If 30% or more characters are Thai
      
      // Expanded check for vocabulary request in both Thai and English
      const thaiVocabPhrases = ["คำศัพท์", "ศัพท์", "วงศัพท์", "เรียนรู้คำศัพท์"];
      const englishVocabPhrases = ["vocabulary", "words", "vocab"];
      
      const isVocabularyRequest = 
        thaiVocabPhrases.some(phrase => userMessage.toLowerCase().includes(phrase)) ||
        englishVocabPhrases.some(phrase => userMessage.toLowerCase().includes(phrase));
      
      const parts = [
        { text: getRolePrompt(chatbotRole) },
        { text: 'Answer only according to the personality, characteristics and scope of the given role. Use role-appropriate language, such as jargon or appropriate expressions.' },
        { text: "Previous conversation:\n" + conversationHistory },
        { text: `Difficulty level: ${difficulty}` },
        { text: "Stay in character and keep responses brief." },
        { text: "Maximum 4 sentences per response." }
      ];
      
      // Add format instructions if this is a vocabulary request
      if (isVocabularyRequest) {
        parts.push({ 
          text: `The user is asking about vocabulary ${isMainlyThai ? "in Thai" : "in English"}. 
          You MUST respond with VALID JSON format with this EXACT structure:
          {
            "type": "vocabulary",
            "words": [
              {
                "english": "word in English",
                "thai": "คำแปลภาษาไทย",
                "example": "example sentence in English"
              }
            ]
          }
          IMPORTANT: 
          - Make sure your entire response is valid parseable JSON. No explanations before or after the JSON.
          - Include 3-5 relevant vocabulary words related to: "${userMessage}"
          - If the user's message is in Thai, focus on vocabulary words related to the Thai topic mentioned.
          - Always write examples in English regardless of the user's input language.`
        });
      } else {
        // Modified instructions for message responses with spelling correction - English only
        parts.push({
          text: `Check if the user's message has any SERIOUS spelling, grammar, or usage errors IN ENGLISH WORDS ONLY. 
          DO NOT check or correct Thai language text.
          DO NOT correct minor typos, British/American spelling variations, or stylistic choices.
          ONLY correct actual errors that change meaning or would cause confusion.
          
          Your response should follow this format:
  
          1. If there are SIGNIFICANT errors in ENGLISH words or phrases:
             Return a valid JSON object with two separate parts:
             {
               "type": "message",
               "content": "Your regular conversation response without mentioning the errors.",
               "spelling_correction": {
                 "errors": [
                   {
                     "original": "misspelled or incorrect English word/phrase exactly as written by user",
                     "corrected": "correct English version",
                     "explanation": "brief explanation in Thai about why this is an error"
                   }
                 ],
                 "betterPhrase": "A better way to express the entire sentence in English (if applicable)"
               }
             }
  
          2. If there are NO SIGNIFICANT English errors or if the message uses only Thai language:
             Return this simpler JSON:
             {
               "type": "message",
               "content": "Your regular conversation response."
             }
          
          IMPORTANT: 
          - Only flag SERIOUS errors, not minor variations or stylistic differences.
          - Only check for errors in English words. Completely ignore any Thai text.
          - If a message is fully in Thai, don't provide any spelling corrections at all.
          - If unsure if something is an error, DO NOT correct it.`
        });
      }
      
      parts.push({ text: `User's latest message: "${userMessage}"` });

      console.log(`Sending request: ${isVocabularyRequest ? 'vocabulary request' : 'normal message'}`);

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCBmjgmL0EmlMH18RoRc4nb8zKQKbCDucw`,
        method: "post",
        data: {
          contents: [{
            parts: parts
          }],
        },
      });

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble right now. Let's try a different topic!";
      
      // Try to parse as JSON, with additional cleanup for common formatting issues
      try {
        // Clean the response text to handle common JSON formatting issues
        let cleanedText = responseText;
        
        // Remove markdown code blocks if present
        if (cleanedText.includes("```json")) {
          cleanedText = cleanedText.replace(/```json/g, "").replace(/```/g, "").trim();
        }
        
        // Remove any non-JSON text before the opening brace or after the closing brace
        cleanedText = cleanedText.substring(
          cleanedText.indexOf('{'),
          cleanedText.lastIndexOf('}') + 1
        );
        
        console.log("Cleaned JSON:", cleanedText);
        
        const parsedResponse = JSON.parse(cleanedText);
        
        // Debug log to check what we received
        console.log(`Parsed response type: ${parsedResponse.type}`);
        if (parsedResponse.type === "vocabulary") {
          console.log(`Found ${parsedResponse.words?.length || 0} vocabulary words`);
        }
        
        // If we have spelling_correction but it's empty or malformed, remove it
        if (parsedResponse.spelling_correction) {
          const hasValidErrors = parsedResponse.spelling_correction.errors && 
                                Array.isArray(parsedResponse.spelling_correction.errors) && 
                                parsedResponse.spelling_correction.errors.length > 0;
                                
          const hasValidLegacyFormat = parsedResponse.spelling_correction.original && 
                                     parsedResponse.spelling_correction.corrected;
                                     
          if (!hasValidErrors && !hasValidLegacyFormat) {
            console.log("Removing empty spelling correction");
            delete parsedResponse.spelling_correction;
          } else {
            console.log("Valid spelling correction found:", JSON.stringify(parsedResponse.spelling_correction));
          }
        }
        
        return parsedResponse;
      } catch (e) {
        console.log("Response not in valid JSON format, returning as regular message:", e.message);
        console.log("Original response:", responseText);
        return { type: "message", content: responseText };
      }
    } catch (error) {
      console.error("Error generating response:", error);
      return { type: "message", content: "I'm having trouble right now. Let's try a different topic!" };
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
  
    // Scroll to bottom after the user's message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
  
    try {
      const aiResponse = await generateResponse(inputMessage);
      
      // Debug the response we got
      console.log(`Response type: ${aiResponse.type}`);
      console.log("Full AI response:", JSON.stringify(aiResponse));
      
      // Handle vocabulary response
      if (aiResponse.type === 'vocabulary' && Array.isArray(aiResponse.words)) {
        console.log("Processing vocabulary response with", aiResponse.words.length, "words");
        const aiMessage = {
          type: 'vocabulary',
          words: aiResponse.words,
          isUser: false,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, aiMessage]);
      } 
      // Handle regular message response
      else if (aiResponse.type === 'message') {
        console.log("Processing regular message response");
        
        // First add the regular message
        const messageChunks = splitLongMessage(aiResponse.content);
        for (let i = 0; i < messageChunks.length; i++) {
          const aiMessage = {
            text: messageChunks[i],
            type: 'message',
            content: messageChunks[i],
            isUser: false,
            timestamp: new Date()
          };
          setTimeout(() => {
            setChatHistory(prev => [...prev, aiMessage]);
          }, i * 500);
        }
        
        // Check for spelling correction and filter to English only
        if (aiResponse.spelling_correction) {
          // Filter errors to only include English words if using the errors array
          if (Array.isArray(aiResponse.spelling_correction.errors)) {
            const filteredErrors = filterEnglishErrors(aiResponse.spelling_correction.errors);
            aiResponse.spelling_correction.errors = filteredErrors;
            
            // Only show spelling correction if we have valid errors after filtering
            const hasSpellingCorrection = filteredErrors.length > 0 || 
              (aiResponse.spelling_correction.original && 
               aiResponse.spelling_correction.original !== aiResponse.spelling_correction.corrected);
            
            if (hasSpellingCorrection) {
              console.log("Adding English spelling correction:", JSON.stringify(aiResponse.spelling_correction));
              setTimeout(() => {
                const spellingCorrectionMessage = {
                  type: 'spelling_correction',
                  correction: aiResponse.spelling_correction,
                  isUser: false,
                  timestamp: new Date()
                };
                setChatHistory(prev => [...prev, spellingCorrectionMessage]);
              }, messageChunks.length * 500 + 300); // Add after main message with a small delay
            }
          }
        }
      }
      // Fallback for unexpected response format
      else {
        console.log("Fallback: Unknown response format");
        setChatHistory(prev => [...prev, {
          text: typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse),
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      setChatHistory(prev => [...prev, {
        text: "Sorry, I encountered an error processing your request.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setGeneratingAnswer(false);
      // Scroll again when answer finishes generating
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [inputMessage, chatHistory, difficulty, chatbotRole]);

  // Add this function to help filter only English errors
  const filterEnglishErrors = (errors) => {
    if (!Array.isArray(errors) || errors.length === 0) return [];
    
    // Simple regex to detect if text contains Thai characters
    const containsThai = (text) => /[\u0E00-\u0E7F]/.test(text);
    
    return errors.filter(error => {
      // Skip if original or corrected is empty
      if (!error.original || !error.corrected) return false;
      
      // Skip if original and corrected are the same (no real error)
      if (error.original.toLowerCase().trim() === error.corrected.toLowerCase().trim()) return false;
      
      // Skip if original contains Thai characters
      if (containsThai(error.original)) return false;
      
      // Skip minor punctuation differences
      if (error.original.replace(/[.,!?;:]/g, '').trim().toLowerCase() === 
          error.corrected.replace(/[.,!?;:]/g, '').trim().toLowerCase()) return false;
      
      return true;
    });
  };

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
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
      >
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
              {!message.isUser && message.type === 'vocabulary' && (
                <Text style={styles.vocabularyBadge}>
                  <FontAwesome5 name="book" size={10} color="#F8EDE3" /> Vocabulary
                </Text>
              )}
              {!message.isUser && message.type === 'spelling_correction' && (
                <Text style={styles.spellingBadge}>
                  <FontAwesome5 name="spell-check" size={10} color="#6C4E31" /> Spelling
                </Text>
              )}
            </View>
            
            {message.type === 'vocabulary' && message.words ? (
              // Render vocabulary table outside of message bubble
              <View style={styles.vocabularyTableContainer}>
                <VocabularyTable words={message.words} />
                <Text style={[styles.timestamp, styles.aiTimestamp, styles.vocabularyTimestamp]}>
                  {message.timestamp?.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            ) : message.type === 'spelling_correction' && message.correction ? (
              // Render spelling correction
              <View style={styles.spellingCorrectionWrapper}>
                <SpellingCorrection correction={message.correction} />
                <Text style={[styles.timestamp, styles.aiTimestamp]}>
                  {message.timestamp?.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            ) : (
              // Render regular message in bubble
              <View
                style={[
                  styles.message,
                  message.isUser ? styles.userMessage : styles.aiMessage
                ]}
              >
                {message.isUser ? (
                  <Text>{message.text}</Text>
                ) : (
                  <Text>{message.content || message.text}</Text>
                )}
                
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
                    onPress={() => handleTranslate(message.content || message.text)}
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
            )}
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
  vocabularyContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0D5C1',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  vocabularyTableContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  
  vocabularyBadge: {
    backgroundColor: '#8D493A',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    overflow: 'hidden',
  },
  
  vocabularyContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0D5C1',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  vocabularyTimestamp: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginRight: 8,
  },
  
  vocabularyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F4EA',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C1',
  },
  vocabularyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8D493A',
    marginLeft: 8,
  },
  vocabularyHeader: {
    flexDirection: 'row',
    backgroundColor: '#AF8F6F',
    padding: 10,
  },
  vocabularyHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  vocabularyRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0D5C1',
  },
  evenRow: {
    backgroundColor: '#F8F4EA',
  },
  oddRow: {
    backgroundColor: '#FFFFFF',
  },
  lastRow: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  englishColumn: {
    flex: 1,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#E0D5C1',
  },
  thaiColumn: {
    flex: 1,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#E0D5C1',
  },
  exampleColumn: {
    flex: 1.5,
    paddingHorizontal: 5,
  },
  vocabularyWord: {
    fontWeight: 'bold',
    color: '#8D493A',
    fontSize: 14,
  },
  vocabularyTranslation: {
    color: '#333',
    fontSize: 14,
  },
  vocabularyExample: {
    color: '#666',
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  vocabularyMessage: {
    maxWidth: '95%', // Make vocabulary messages wider
  },
  spellingCorrectionWrapper: {
    width: '100%',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingRight: 40,
  },
  
  spellingCorrectionContainer: {
    backgroundColor: '#FFF9C4', // Light yellow background
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D', // Deeper yellow accent
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  
  spellingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  spellingHeaderText: {
    fontWeight: 'bold',
    color: '#8D493A',
    fontSize: 14,
    marginLeft: 6,
  },
  
  spellingContentRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  
  spellingLabel: {
    fontWeight: '500',
    color: '#666',
    fontSize: 13,
    width: 70,
  },
  
  spellingIncorrect: {
    color: '#D32F2F', // Red for incorrect spelling
    fontSize: 13,
    textDecorationLine: 'line-through',
    flex: 1,
  },
  
  spellingCorrect: {
    color: '#388E3C', // Green for correct spelling
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  
  spellingExplanationRow: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  
  spellingExplanation: {
    color: '#555',
    fontSize: 12,
    fontStyle: 'italic',
  },
  
  spellingBadge: {
    backgroundColor: '#FDD835', // Yellow badge for spelling
    color: '#6C4E31', // Darker text for contrast
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    overflow: 'hidden',
  },
  spellingItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E68C',
    marginBottom: 8,
  },
  
  errorExplanation: {
    color: '#555',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 70,
  },
  
  correctionsSection: {
    marginBottom: 8,
  },
  
  betterPhraseSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0E68C',
  },
  
  betterPhraseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  betterPhraseHeaderText: {
    fontWeight: 'bold',
    color: '#8D493A',
    fontSize: 14,
    marginLeft: 6,
  },
  
  betterPhraseText: {
    color: '#388E3C',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default ChatScreen;





