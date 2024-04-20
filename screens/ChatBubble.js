import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from 'react-native-heroicons/solid';
import Tts from 'react-native-tts'; // Import react-native-tts

const ChatBubble = ({ role, text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeech = () => {
    if (isSpeaking) {
      Tts.stop(); // Use Tts.stop() instead of stop()
      setIsSpeaking(false);
    } else {
      Tts.speak(text, { language: 'en' }); // Use Tts.speak() instead of speak()
      setIsSpeaking(true);
    }
  };

  return (
    <View
      style={[
        styles.chatItem,
        role === 'user' ? styles.userBubble : styles.modelBubble,
      ]}
    >
      <Text selectable={true} style={styles.text}>{text}</Text>
      {role === 'model' && (
        <TouchableOpacity
          onPress={handleSpeech}
          style={styles.speakerIcon}
          activeOpacity={0.7}
        >
          {isSpeaking ? (
            <SpeakerXMarkIcon
              name="SpeakerXMark"
              size={24}
              color="white"
            />
          ) : (
            <SpeakerWaveIcon
              name="SpeakerWave"
              size={24}
              color="white"
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '80%',
    borderRadius: 10,
    position: 'relative',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#e4ccab',
  },
  modelBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#de9c63',
    borderBottomRightRadius: 0,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  speakerIcon: {
    position: 'absolute',
    top: 5,
    right: -30,
  },
});

export default ChatBubble;
