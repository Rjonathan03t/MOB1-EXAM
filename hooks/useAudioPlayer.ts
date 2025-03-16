import { Audio } from "expo-av";
import { useState, useEffect } from "react";

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); 
  const [trackList, setTrackList] = useState<string[]>([]); 
  const [currentIndex, setCurrentIndex] = useState<number>(0); 

  useEffect(() => {
    // Configure l'audio pour jouer en arrière-plan
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

  const playSound = async (uri: string, resetPosition = false) => {
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
    } catch (error) {
      console.error("Erreur de lecture audio :", error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.positionMillis !== undefined) {
      setPosition(status.positionMillis); 
    }

    if (status.didJustFinish) {
      playNext(); 
    }
  };

  const playNext = () => {
    if (trackList.length > 0) {
      const nextIndex = (currentIndex + 1) % trackList.length; 
      setCurrentIndex(nextIndex);
      playSound(trackList[nextIndex], true);
    }
  };

  const playPrevious = () => {
    if (trackList.length > 0) {
      const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
      setCurrentIndex(prevIndex);
      playSound(trackList[prevIndex], true);
    }
  };

  const handleSelectTrack = (uri: string) => {
    const trackIndex = trackList.indexOf(uri);
    if (trackIndex !== currentIndex) {
      setCurrentIndex(trackIndex);
      playSound(uri, true);
    } else if (isPlaying) {
      pauseSound();
    } else {
      playSound(uri);
    }
  };

  const setTracks = (tracks: string[]) => {
    setTrackList(tracks);
    setCurrentIndex(0);
  };

  return { playSound, pauseSound, playNext, playPrevious, handleSelectTrack, setTracks, isPlaying, sound, position, currentIndex };
}
