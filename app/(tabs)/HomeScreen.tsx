import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import {StyleSheet, Text, Platform, View, TouchableOpacity, FlatList, TextInput, Keyboard } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


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
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => playSound(item.uri)}>
              <Text>{item.filename}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
