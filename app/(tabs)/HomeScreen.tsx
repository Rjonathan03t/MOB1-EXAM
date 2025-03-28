import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import * as MediaLibrary from 'expo-media-library';
import AudioItem from '@/components/AudioItem';
import PlayerControl from '@/components/PlayerControl';
import SongInfo from '@/components/SongInfo';

export default function HomeScreen() {
  const { handleSelectTrack, pauseSound, playNext, playPrevious, setTracks, isPlaying, currentIndex, sound } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);
  const [songInfo, setSongInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const handleTrackSelection = async (uri) => {
    // If sound is not initialized yet, handle selection and initialize the sound
    if (!sound) {
      handleSelectTrack(uri); // initialize the sound
    } else {
      handleSelectTrack(uri); // Proceed to select the track
    }
    getSongInfo(uri);
  };

  const handleNext = () => {
    playNext();
    const nextTrackUri = audioFiles[(currentIndex + 1) % audioFiles.length]?.uri;
    getSongInfo(nextTrackUri);
  };

  const handlePrevious = () => {
    playPrevious();
    const prevTrackUri = audioFiles[(currentIndex - 1 + audioFiles.length) % audioFiles.length]?.uri;
    getSongInfo(prevTrackUri);
  };

  return (
    <SafeAreaView style={[styles.container, colorScheme === 'dark' ? darkStyles.background : lightStyles.background]}>
      <Text style={[styles.songTitle, colorScheme === 'dark' ? darkStyles.text : lightStyles.text]}>Tous les sons</Text>
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AudioItem item={item} onSelect={handleTrackSelection} colorScheme={colorScheme} />
        )}
      />
      <SongInfo songInfo={songInfo} colorScheme={colorScheme} />
      
      {/* Show PlayerControl only if a sound is selected */}
      {currentIndex !== null && sound && (
        <PlayerControl
          isPlaying={isPlaying}
          currentPosition={currentPosition}
          duration={duration}
          onSeek={(value) => sound && sound.setPositionAsync(value)}
          onPlayPause={isPlaying ? pauseSound : () => handleSelectTrack(audioFiles[currentIndex]?.uri)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          colorScheme={colorScheme}
        />
      )}
    </SafeAreaView>
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
});

const lightStyles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
  },
});

const darkStyles = StyleSheet.create({
  background: {
    backgroundColor: '#121212',
  },
  text: {
    color: 'white',
  },
});
