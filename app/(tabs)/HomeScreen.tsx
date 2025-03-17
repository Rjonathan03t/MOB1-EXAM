import React, { useEffect, useState, useRef } from 'react';
import Slider from '@react-native-community/slider';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import { debounce } from 'lodash';

export default function HomeScreen() {
  const { handleSelectTrack, pauseSound, playNext, playPrevious, setTracks, isPlaying, currentIndex, sound } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);
  const [songInfo, setSongInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const currentPositionRef = useRef(currentPosition);
  const updatePositionRef = useRef(false);

  const colorScheme = useColorScheme();

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

  const splitArtistAndTitle = (filename) => {
    const match = filename.match(/^(.+?)\s*-\s*(.+?)\.[a-zA-Z0-9]+$/);
    if (match) {
      return { artist: match[1], title: match[2] };
    }
    return { artist: 'Inconnu', title: filename };
  };

  const getSongInfo = async (uri) => {
    const asset = audioFiles.find(item => item.uri === uri);
    if (asset) {
      const { filename } = asset;
      const { artist, title } = splitArtistAndTitle(filename);
      setSongInfo({
        title: title || 'Inconnu',
        artist: artist || 'Inconnu',
      });
    }
  };

  const handleTrackSelection = (uri) => {
    handleSelectTrack(uri);
    getSongInfo(uri);
  };

  useEffect(() => {
    if (sound) {
      const updatePosition = async () => {
        const status = await sound.getStatusAsync();
        setCurrentPosition(status.positionMillis);
        setDuration(status.durationMillis);
      };

      const interval = setInterval(updatePosition, 1000);
      return () => clearInterval(interval);
    }
  }, [sound]);

  const handleSeek = debounce(async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  }, 200);

  useEffect(() => {
    if (audioFiles.length > 0 && currentIndex !== null) {
      const currentTrackUri = audioFiles[currentIndex]?.uri;
      getSongInfo(currentTrackUri);
    }
  }, [currentIndex, audioFiles]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const isDarkMode = colorScheme === 'dark';
  const dynamicStyles = isDarkMode ? darkStyles : lightStyles;
  const darkMode = isDarkMode ? 'white' : 'black';

  const isControlsVisible = currentIndex !== null && songInfo !== null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, dynamicStyles.background]}>
        <Text style={[styles.songTitle, dynamicStyles.text, { borderBottomColor: darkMode }]}>Tous les sons</Text>

        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.audioItem, dynamicStyles.audioItem]}
              onPress={() => handleTrackSelection(item.uri)}>
              <MaterialIcons name="music-note" size={30} color="#ff3131" style={styles.musicIcon} />
              <Text style={[styles.audioText, dynamicStyles.text]}>{item.filename}</Text>
            </TouchableOpacity>
          )}
        />

        {songInfo && (
          <View style={{backgroundColor:'#ff3131'}}>
            <Text style={[styles.songInfo, { color: darkMode }]}>Titre : {songInfo.title}</Text>
            <Text style={[styles.artistInfo, { color: darkMode }]}>Artiste : {songInfo.artist}</Text>
          </View>
        )}

        {duration > 0 && isControlsVisible && (
          <View style={styles.progressContainer}>
            <Text style={{ color: darkMode,paddingLeft:12}}>
              {formatTime(currentPosition)} / {formatTime(duration)}
            </Text>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={duration}
              value={currentPosition}
              onSlidingComplete={handleSeek}
              thumbTintColor={darkMode}
              minimumTrackTintColor={darkMode}
              maximumTrackTintColor="black"
            />
          </View>
        )}

        {isControlsVisible && (
          <View style={styles.controls}>
            <TouchableOpacity onPress={playPrevious}>
              <MaterialIcons name="skip-previous" size={40} color={darkMode} />
            </TouchableOpacity>

            <TouchableOpacity onPress={isPlaying ? pauseSound : () => handleSelectTrack(audioFiles[currentIndex]?.uri)}>
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={40} color={darkMode} />
            </TouchableOpacity>

            <TouchableOpacity onPress={playNext}>
              <MaterialIcons name="skip-next" size={40} color={darkMode} />
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
  songTitle: {
    fontSize: 30,
    paddingLeft: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  songInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  artistInfo: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 5,
  },
  audioText: {
    width: 250,
  },
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#ff3131'
  },
  progressContainer: {
    backgroundColor: '#ff3131'
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#ff3131'
  },
});

const lightStyles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
  },
  audioItem: {
    backgroundColor: 'white',
  },
});

const darkStyles = StyleSheet.create({
  background: {
    backgroundColor: '#121212',
  },
  text: {
    color: 'white',
  },
  audioItem: {
    backgroundColor: '#1f1f1f',
  },
});
