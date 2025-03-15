import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import { Image, StyleSheet, Text, Platform, View, TouchableOpacity, FlatList, TextInput, Keyboard } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



export default function HomeScreen(this: any) {
  const { playSound } = useAudioPlayer();
  const [audioFiles, setAudioFiles] = useState([]);
  const [searchText, setSearchText] = useState('');


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

  const handleSearch = () => {
    console.log('Recherche:', searchText);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView >
        <View style={styles.topView}>
          <Image
            style={styles.logo}
            source={require('@/assets/images/vazo-logo.png')}
          />
          <View style={styles.rightTopBar}>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.input}
                placeholder="Chercher un son..."
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                autoFocus
              />
              <TouchableOpacity>
                <EvilIcons name="search" size={30} />
              </TouchableOpacity>
            </View>
            <MaterialIcons name="light-mode" size={30} color="black" />
          </View>
        </View>
        <View>
          <FlatList
            style={styles.audioFiles}
            data={audioFiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => playSound(item.uri)}>
                <Text>{item.filename}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginTop: 6
  },
  topView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth:1,
    borderBottomColor:'black',
    borderStyle:'solid',
    height:70
  },
  searchBar: {
    display:'flex',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    backgroundColor:'white',
    borderRadius: 20,
    borderStyle:'solid',
    borderColor:'#ff3131',
    borderWidth:1
  },
  rightTopBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginRight: 10
  },
  audioFiles: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    width: 200,
    paddingLeft: 12
  },
});
