import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SongInfo = ({ songInfo, colorScheme }) => {
  const dynamicStyles = colorScheme === 'dark' ? darkStyles : lightStyles;

  if (!songInfo) return null;

  return (
    <View style={dynamicStyles.container}>
      <Text style={[dynamicStyles.text, styles.title]}>Titre: {songInfo.title}</Text>
      <Text style={[dynamicStyles.text, styles.artist]}>Artiste: {songInfo.artist}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  artist: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'left',
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderTopColor:'black',
    borderTopWidth:.3
  },
  text: {
    color: 'black',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    borderTopColor:'white',
    borderTopWidth:.3
  },
  text: {
    color: 'white',
  },
});

export default SongInfo;
