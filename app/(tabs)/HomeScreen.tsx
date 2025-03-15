import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import useAudioPlayer from '../../hooks/useAudioPlayer';

export default function HomeScreen() {
  const { playSound, pauseSound, isPlaying, sound, position } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrack, setCurrentTrack] = useState('');

  useEffect(() => {
    const loadAudioFiles = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée');
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 50,
      });

      setAudioFiles(media.assets);
    };

    loadAudioFiles();
  }, []);


  const handlePlayPause = (uri: string) => {
    if (isPlaying && currentTrack === uri) {
      pauseSound(); 
    } else {
      if (currentTrack !== uri) {
        setCurrentTrack(uri); 
        playSound(uri, true); 
      } else {
        playSound(uri); 
      }
    }
  };

 
  const handleSelectTrack = (uri: string) => {
    if (currentTrack !== uri) {
      setCurrentTrack(uri); 
      playSound(uri, true); 
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.sonsTitle}>Tous les sons</Text>
        </View>

        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.audioItem}
              onPress={() => handleSelectTrack(item.uri)}
            >
              <MaterialIcons name="music-note" size={30} color="#ff3131" style={styles.musicIcon} />
              <Text style={styles.audioText}>{item.filename}</Text>
            </TouchableOpacity>
          )}
        />

        {currentTrack && (
          <View style={styles.playPauseButtonContainer}>
            <TouchableOpacity
              onPress={() => handlePlayPause(currentTrack)}
              style={styles.playPauseButton}
            >
              <MaterialIcons
                name={isPlaying && currentTrack === sound?.uri ? 'pause' : 'play-arrow'}
                size={40}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
  },
  sonsTitle: {
    fontSize: 30,
    color: 'black',
    paddingLeft: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: 'black',
  },
  audioItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  audioText: {
    width: 250,
  },
  musicIcon: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderStyle: 'solid',
  },
  playPauseButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playPauseButton: {
    backgroundColor: '#ff3131',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
