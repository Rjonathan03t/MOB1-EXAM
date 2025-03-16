import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import useAudioPlayer from '../../hooks/useAudioPlayer';

export default function HomeScreen() {
  const { handleSelectTrack, pauseSound, playNext, playPrevious, setTracks, isPlaying, currentIndex } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);
  const [isTrackSelected, setIsTrackSelected] = useState(false);

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
      setTracks(media.assets.map((item) => item.uri));
    };

    loadAudioFiles();
  }, []);

  const handleTrackSelection = (uri: string) => {
    handleSelectTrack(uri);
    setIsTrackSelected(true); 
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.sonsTitle}>Tous les sons</Text>
        
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.audioItem}
            onPress={() => handleTrackSelection(item.uri)}>
              <MaterialIcons name="music-note" size={30} color="#ff3131" style={styles.musicIcon} />
              <Text style={styles.audioText}>{item.filename}</Text>
            </TouchableOpacity>
          )}
        />

        {isTrackSelected && (
          <View style={styles.controls}>
            <TouchableOpacity onPress={playPrevious}>
              <MaterialIcons name="skip-previous" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={isPlaying ? pauseSound : () => handleSelectTrack(audioFiles[currentIndex]?.uri)}>
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={playNext}>
              <MaterialIcons name="skip-next" size={40} color="white" />
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
  audioText: {
    width:250,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor:'#ff3131',
    paddingVertical:15,
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
    elevation:2,
  },
  musicIcon: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderStyle: 'solid',
  },
});
