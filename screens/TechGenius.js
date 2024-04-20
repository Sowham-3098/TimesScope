import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  
} from 'react-native';
import { API_KEY } from '@env';
import { SpeakerWaveIcon, SpeakerXWaveIcon, PaperAirplaneIcon, ArrowLeftCircleIcon } from 'react-native-heroicons/solid';
import Tts from 'react-native-tts'; // Import react-native-tts
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatBubble from './ChatBubble';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const Techgenius = () => {
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handleUserInput = async () => {
    if (!selectedMonth || !selectedYear) {
      Alert.alert('Please select a month and year to get all historical events');
      return;
    }

    const userInput = `${selectedMonth} ${selectedYear}`;

    let modifiedUserInput =
      'Give me all the historical events in a well-organized way with dates of ' +
      userInput +
      ' being more specific with these keywords';

    selectedCategories.forEach((category) => {
      modifiedUserInput += ` ${category},`;
    });

    let updatedChat = [...chat, { role: 'user', parts: [{ text: userInput }] }];
    setLoading(true);
    setChat(updatedChat);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        maxTokens: 2000,
        temperature: 1,
        topP: 1.0,
        topK: 40,
        presencePenalty: 0.0,
        frequencyPenalty: 0.0,
        bestOf: 1,
        n: 1,
        stop: ['\n', ':', '.', '?', '!'],
        user: 'user',
        modelPrompt: 'Hey, please enter a correct month and year to get all historical events.',
      });
      const prompt = modifiedUserInput;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const modelResponse = text;
      if (modelResponse) {
        const updatedChatWithModel = [...updatedChat, { role: 'model', parts: [{ text: modelResponse }] }];
        setChat(updatedChatWithModel);
      }
    } catch (error) {
      console.error('Error', error);
      setError('An error occurred, please try again later');
    } finally {
      setLoading(false);
      setSelectedCategories([]);
      scrollToBottom();
    }
  };

  const handleSpeech = (text) => {
    if (isSpeaking) {
      Tts.stop();
      setIsSpeaking(false);
    } else {
      Tts.speak(text);
      setIsSpeaking(true);
    }
  };

  const renderChatItem = ({ item }) => {
    return <ChatBubble role={item.role} text={item.parts[0].text} onSpeech={() => handleSpeech(item.parts[0].text)} />;
  };

  const scrollToBottom = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  const handleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const renderCategoryButton = (category) => {
    const isSelected = selectedCategories.includes(category);

    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryButton, isSelected && styles.selectedCategoryButton]}
        onPress={() => handleCategorySelection(category)}
      >
        <Text style={[styles.categoryButtonText, isSelected && styles.selectedCategoryButtonText]}>{category}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#27272a' }}>
      <StatusBar barStyle="light-content" backgroundColor="#a46c54" />
      <View style={{ flex: 1 }}>
        <View style={styles.titleBar}>
          <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
            <ArrowLeftCircleIcon name="arrow-left-circle" size={40} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>TimesScope</Text>
            <Text style={styles.tagline}>Get All Historical Events</Text>
          </View>
        </View>
        <FlatList
          ref={flatListRef}
          data={chat}
          renderItem={renderChatItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.inputContainer}>
            {/* Month Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="January" value="January" />
                <Picker.Item label="February" value="February" />
                <Picker.Item label="March" value="March" />
                <Picker.Item label="April" value="April" />
                <Picker.Item label="May" value="May" />
                <Picker.Item label="June" value="June" />
                <Picker.Item label="July" value="July" />
                <Picker.Item label="August" value="August" />
                <Picker.Item label="September" value="September" />
                <Picker.Item label="October" value="October" />
                <Picker.Item label="November" value="November" />
                <Picker.Item label="December" value="December" />
              </Picker>
            </View>
            {/* Year Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.picker}
              >
                {[...Array(2024 - 1900).keys()].map((index) => {
                  const year = 2024 - index;
                  return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                })}
              </Picker>
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
              <PaperAirplaneIcon name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryContainer}>
            {renderCategoryButton('Tech')}
            {renderCategoryButton('Sports')}
            {renderCategoryButton('India')}
            {renderCategoryButton('World')}
            {renderCategoryButton('Finance')}
            {renderCategoryButton('Science')}
            {renderCategoryButton('Entertainment')}
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: 'row',
    backgroundColor: '#a46c54',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    height: height * 0.13,

    borderBottomRightRadius: 100,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 110,
  },
  tagline: {
    fontSize: 20,
    color: 'white',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 10,
    
    height: 50,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  picker: {
    height:10,
    borderRadius : 20,
    color: 'white',
  },
  sendButton: {
    marginLeft: 12,
    borderRadius: 20,
    backgroundColor: '#a46c54',
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#a46c54',
    marginVertical: 6,
    marginHorizontal: 6,
  },
  selectedCategoryButton: {
    backgroundColor: '#e4ccab',
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedCategoryButtonText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Techgenius;
