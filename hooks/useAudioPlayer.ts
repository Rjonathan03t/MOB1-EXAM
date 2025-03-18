import { Audio } from "expo-av";
import { useState, useEffect, useCallback } from "react";

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackList, setTrackList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [playlists, setPlaylists] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const configureAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };

    configureAudio();
  }, []);

  const playSound = useCallback(
    async (uri: string, resetPosition = false) => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );

        if (resetPosition) {
          await newSound.setPositionAsync(0);
        } else {
          await newSound.setPositionAsync(position);
        }

        newSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);

        setSound(newSound);
        setIsPlaying(true);
        setIsLoaded(true);
      } catch (error) {
        console.error("Erreur de lecture audio :", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [sound, position, isProcessing]
  );

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.positionMillis !== undefined) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    }

    if (status.didJustFinish) {
      playNext();
    }

    if (status.isPlaying !== undefined) {
      setIsPlaying(status.isPlaying);
    }
  };

  const playNext = useCallback(async () => {
    if (trackList.length > 0 && !isProcessing && isLoaded) {
      const nextIndex = (currentIndex + 1) % trackList.length;
      setCurrentIndex(nextIndex);
      await playSound(trackList[nextIndex], true);
    }
  }, [currentIndex, trackList, playSound, isProcessing, isLoaded]);

  const playPrevious = async () => {
    if (trackList.length > 0 && !isProcessing && isLoaded) {
      const prevIndex =
        (currentIndex - 1 + trackList.length) % trackList.length;
      setCurrentIndex(prevIndex);
      await playSound(trackList[prevIndex], true);
    }
  };

  const handleSelectTrack = (uri: string) => {
    if (isProcessing) return;
    const trackIndex = trackList.indexOf(uri);
    if (trackIndex === -1) return;

    if (trackIndex !== currentIndex) {
      setCurrentIndex(trackIndex);
      playSound(uri, true);
    } else if (isPlaying) {
      pauseSound();
    } else {
      resumeSound();
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };
  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const setTracks = (tracks: string[]) => {
    setTrackList(tracks);
    setCurrentIndex(0);
  };

  const createPlaylist = (name: string) => {
    setPlaylists((prev) => ({ ...prev, [name]: [] }));
  };

  const deletePlaylist = (name: string) => {
    setPlaylists((prev) => {
      const newPlaylists = { ...prev };
      delete newPlaylists[name];
      return newPlaylists;
    });
  };

  const addTrackToPlaylist = (playlistName: string, track: string) => {
    setPlaylists((prev) => ({
      ...prev,
      [playlistName]: [...(prev[playlistName] || []), track],
    }));
  };

  const removeTrackFromPlaylist = (playlistName: string, track: string) => {
    setPlaylists((prev) => ({
      ...prev,
      [playlistName]: prev[playlistName].filter((t) => t !== track),
    }));
  };

  const playPlaylist = async (playlistName: string) => {
    if (playlists[playlistName] && playlists[playlistName].length > 0) {
      setTracks(playlists[playlistName]);
      await playSound(playlists[playlistName][0], true);
    }
  };

  return {
    playSound,
    pauseSound,
    playNext,
    playPrevious,
    handleSelectTrack,
    setTracks,
    isPlaying,
    sound,
    position,
    duration,
    currentIndex,
    isLoaded,
    playlists,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    playPlaylist,
  };
}
