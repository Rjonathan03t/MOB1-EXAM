import { Audio } from "expo-av";
import { useState } from "react";

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async (uri: string) => {
    try {
      console.log("Lecture du fichier :", uri);

      // Vérifier et demander la permission pour l'audio
      await Audio.requestPermissionsAsync();

      // Arrêter et décharger l'ancien son s'il existe
      if (sound) {
        console.log("Arrêt du son en cours...");
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Créer un nouveau son
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      console.log("Lecture en cours...");
    } catch (error) {
      console.error("Erreur de lecture audio :", error);
    }
  };

  return { playSound };
}
