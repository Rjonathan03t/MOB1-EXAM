import React, { useEffect, useState, useRef } from 'react';
import Slider from '@react-native-community/slider';  // Mise à jour de l'importation
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import { debounce } from 'lodash';  // Ajout de lodash pour le debounce

export default function HomeScreen() {
  const { handleSelectTrack, pauseSound, playNext, playPrevious, setTracks, isPlaying, currentIndex, sound } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);
  const [songInfo, setSongInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);  // Position actuelle de la chanson
  const [duration, setDuration] = useState(0);  // Durée totale de la chanson
  const currentPositionRef = useRef(currentPosition); // Utilisation de useRef pour éviter un re-rendu
  const updatePositionRef = useRef(false); // Pour suivre si le debounce est activé

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

  // Fonction pour récupérer les informations sur la chanson
  const getSongInfo = async (uri) => {
    const asset = audioFiles.find(item => item.uri === uri);
    if (asset) {
      const { filename, artist, album } = asset;
      setSongInfo({
        title: filename || 'Inconnu',
        artist: artist || 'Artiste inconnu',
        album: album || 'Album inconnu',
      });
    }
  };

  const handleTrackSelection = (uri) => {
    handleSelectTrack(uri);
    getSongInfo(uri);
  };

  // Mettre à jour la position actuelle et la durée de la chanson
  useEffect(() => {
    if (sound) {
      const updatePosition = async () => {
        const status = await sound.getStatusAsync();
        setCurrentPosition(status.positionMillis);
        setDuration(status.durationMillis);
      };

      const interval = setInterval(updatePosition, 1000); // Mettre à jour toutes les secondes
      return () => clearInterval(interval); // Nettoyer l'intervalle lors de la fermeture de la chanson
    }
  }, [sound]);

  // Fonction pour changer la position de la chanson via la barre de progression
  const handleSeek = debounce(async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  }, 200); // Limite à un appel tous les 200ms

  // Mettre à jour les infos de la chanson à chaque changement de chanson
  useEffect(() => {
    if (audioFiles.length > 0 && currentIndex !== null) {
      const currentTrackUri = audioFiles[currentIndex]?.uri;
      getSongInfo(currentTrackUri); // Mettre à jour les informations de la chanson actuelle
    }
  }, [currentIndex, audioFiles]);

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

        {/* Affichage des informations de la chanson actuelle, seulement si une chanson est en cours de lecture */}
        {isPlaying && songInfo && (
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{songInfo.title}</Text>
            <Text style={styles.songArtist}>{songInfo.artist}</Text>
            <Text style={styles.songAlbum}>{songInfo.album}</Text>
          </View>
        )}

        {/* Affichage des boutons de contrôle */}
        {audioFiles.length > 0 && (
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

        {/* Affichage de la barre de progression */}
        {duration > 0 && (
          <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {Math.floor(currentPosition / 1000)}s / {Math.floor(duration / 1000)}s
          </Text>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={duration}
              value={currentPosition}
              onSlidingComplete={handleSeek} // Utilisation de onSlidingComplete au lieu de onValueChange
              thumbTintColor="#ff3131"
              minimumTrackTintColor="#ff3131"
              maximumTrackTintColor="#d3d3d3"
            />
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
    width: 250,
  },
  songInfo: {
    padding: 15,
    backgroundColor: '#ff3131',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  songTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  songArtist: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  songAlbum: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ff3131',
    paddingVertical: 15,
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
    elevation: 2,
  },
  musicIcon: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderStyle: 'solid',
  },
  progressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
  },
});
