import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { getBaseUrl } from '../../constants/ipConfig';
import { globalColors } from '../../constants/colors';
import axios from 'axios';

const SendIcon = () => (
  <View style={styles.sendIcon}>
    <View style={styles.sendIconTriangle} />
  </View>
);
const MessageCircleIcon = () => (
  <View style={styles.messageCircleIcon}>
    <View style={styles.messageCircleInner} />
  </View>
);

const DriverChatBot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && chatHistory.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = { text: message, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${getBaseUrl()}chat`, { message });
      setChatHistory([
        ...newChatHistory,
        { 
          text: response.data.reply, 
          sender: 'bot', 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        },
      ]);
    } catch (error) {
      console.error('Error sending message to the backend', error);
      setChatHistory([
        ...newChatHistory,
        { 
          text: "Sorry, I couldn't process your request right now. Please try again later.", 
          sender: 'bot', 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChatBubble = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.botMessage,
      item.isError && styles.errorMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.botMessageText
      ]}>{item.text}</Text>
      <Text style={[
        styles.timestamp,
        item.sender === 'user' ? styles.userTimestamp : styles.botTimestamp
      ]}>{item.timestamp}</Text>
    </View>
  );

  const renderEmptyChat = () => (
    <View style={styles.emptyChatContainer}>
      <MessageCircleIcon />
      <Text style={styles.emptyChatText}>Start a conversation</Text>
      <Text style={styles.emptyChatSubtext}>Ask anything to get started!</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={chatHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderChatBubble}
        contentContainerStyle={styles.chatContainer}
        ListEmptyComponent={renderEmptyChat}
        onContentSizeChange={() => 
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={globalColors.cornFlower} />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor={globalColors.wildBlue}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.disabledButton]} 
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <SendIcon />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.lavender,
  },
  header: {
    backgroundColor: globalColors.violetBlue,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: globalColors.cornFlower,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  errorMessage: {
    backgroundColor: '#ffdddd',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  botTimestamp: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: globalColors.lightSteelBlue,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: globalColors.lavender,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  sendButton: {
    backgroundColor: globalColors.violetBlue,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: globalColors.lightSteelBlue,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: globalColors.wildBlue,
    fontSize: 14,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyChatText: {
    fontSize: 20,
    fontWeight: '600',
    color: globalColors.violetBlue,
    marginTop: 16,
  },
  emptyChatSubtext: {
    fontSize: 16,
    color: globalColors.wildBlue,
    marginTop: 8,
  },
  // Custom icons styles
  sendIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIconTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'white',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    transform: [{ rotate: '0deg' }]
  },
  messageCircleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: globalColors.lightSteelBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: globalColors.lavender,
  }
});

export default DriverChatBot;