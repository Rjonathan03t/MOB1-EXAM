import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import useAudioPlayer from "../../hooks/useAudioPlayer";
import PlayerControl from "@/components/PlayerControl";
import SongInfo from "@/components/SongInfo";

export default function PlaylistScreen() {
  const { handleSelectTrack, pauseSound, playNext, playPrevious, setTracks, isPlaying, currentIndex, sound } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [createdPlaylist, setCreatedPlaylist] = useState([]);
  const [isPlaylistView, setIsPlaylistView] = useState(false);
  const [songInfo, setSongInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    const loadAudioFiles = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission refusée");
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({ mediaType: "audio", first: 50 });
      setAudioFiles(media.assets);
    };

    loadAudioFiles();
  }, []);

  const splitArtistAndTitle = (filename) => {
    const match = filename.match(/^(.+?)\s*-\s*(.+?)\.[a-zA-Z0-9]+$/);
    if (match) {
      return { artist: match[1], title: match[2] };
    }
    return { artist: "Inconnu", title: filename };
  };

  const getSongInfo = async (uri) => {
    const asset = audioFiles.find(item => item.uri === uri);
    if (asset) {
      const { filename } = asset;
      const { artist, title } = splitArtistAndTitle(filename);
      setSongInfo({
        title: title || "Inconnu",
        artist: artist || "Inconnu",
      });
    }
  };

  const toggleTrackSelection = (track) => {
    setSelectedTracks((prevSelected) =>
      prevSelected.includes(track) ? prevSelected.filter((t) => t !== track) : [...prevSelected, track]
    );
  };

  const handleCreatePlaylist = () => {
    if (playlistName.trim() === "" || selectedTracks.length === 0) return;
    setCreatedPlaylist(selectedTracks);
    setTracks(selectedTracks.map(track => track.uri));
    setIsPlaylistView(true);
    setPlaylistName("");
    setSelectedTracks([]);
  };

  const handleSelectPlaylistTrack = (track) => {
    handleSelectTrack(track.uri);
    getSongInfo(track.uri);
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

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "white" }]}>
      {!isPlaylistView ? (
        <>
          <View style={{marginHorizontal:15}}>
            <Text style={[styles.title, { color: isDarkMode ? "white" : "black" }]}>Créer une Playlist</Text>
            <TextInput
              style={[styles.input, { color: isDarkMode ? "white" : "black", borderColor: isDarkMode ? "white" : "black" }]}
              placeholder="Nom de la playlist"
              placeholderTextColor={isDarkMode ? "white" : "black"}
              value={playlistName}
              onChangeText={setPlaylistName}
            />
          </View>
          <FlatList
            data={audioFiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.audioItem, selectedTracks.includes(item) && styles.selectedItem]}
                onPress={() => toggleTrackSelection(item)}
              >
                <MaterialIcons name="music-note" size={30} color="#ff3131" />
                <Text style={[styles.audioText, { color: isDarkMode ? "white" : "black" }]}>{item.filename}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.createButton} onPress={handleCreatePlaylist}>
            <Text style={styles.createButtonText}>Créer Playlist</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.title, { color: isDarkMode ? "white" : "black" ,marginLeft:15}]}>Playlist : {playlistName}</Text>
          <FlatList
            data={createdPlaylist}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.audioItem]} onPress={() => handleSelectPlaylistTrack(item)}>
                <MaterialIcons name="music-note" size={30} color="#ff3131" />
                <Text style={[styles.audioText, { color: isDarkMode ? "white" : "black" }]}>{item.filename}</Text>
              </TouchableOpacity>
            )}
          />

          <SongInfo songInfo={songInfo} colorScheme={colorScheme} />

          <PlayerControl
            isPlaying={isPlaying}
            currentPosition={currentPosition}
            duration={duration}
            onSeek={(value) => sound && sound.setPositionAsync(value)}
            onPlayPause={isPlaying ? pauseSound : () => handleSelectPlaylistTrack(createdPlaylist[currentIndex])}
            onPrevious={playPrevious}
            onNext={playNext}
            colorScheme={colorScheme}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { height: 40, borderWidth: .5, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  audioItem: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8, marginVertical: 5, marginHorizontal: 16 },
  audioText: { width: 250 },
  selectedItem: { backgroundColor: "#ff3131" },
  createButton: { backgroundColor: "#ff3131", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  createButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
