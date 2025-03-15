import { Audio } from "expo-av";
import { useState } from "react";

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); 

  const playSound = async (uri: string, resetPosition = false) => {
    try {
      console.log("Lecture du fichier :", uri);

      await Audio.requestPermissionsAsync();

      if (sound) {
        console.log("Arrêt du son en cours...");
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
      console.log("Lecture en cours...");
    } catch (error) {
      console.error("Erreur de lecture audio :", error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      console.log("Son mis en pause");
    }
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.positionMillis !== undefined) {
      setPosition(status.positionMillis); 
    }
  };

  return { playSound, pauseSound, isPlaying, sound, position };
}
