import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AudioItem = ({ item, onSelect, colorScheme }) => {
  const dynamicStyles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const darkMode = colorScheme === 'dark' ? 'white' : 'black';

  return (
    <TouchableOpacity style={[styles.audioItem, dynamicStyles.audioItem]} onPress={() => onSelect(item.uri)}>
      <MaterialIcons name="music-note" size={30} color="#ff3131" style={styles.musicIcon} />
      <Text style={[styles.audioText, dynamicStyles.text]}>{item.filename}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  audioItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  audioText: {
    width: 250,
  },
  musicIcon: {
    marginRight: 10,
  },
});

const lightStyles = StyleSheet.create({
  audioItem: {
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
  },
});

const darkStyles = StyleSheet.create({
  audioItem: {
    backgroundColor: '#1f1f1f',
  },
  text: {
    color: 'white',
  },
});

export default AudioItem;
