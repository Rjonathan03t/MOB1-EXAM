import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import useAudioPlayer from '../../hooks/useAudioPlayer';

export default function HomeScreen() {
  const { playSound } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);

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

  return (
    <View>
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => playSound(item.uri)}>
            <Text>{item.filename}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
