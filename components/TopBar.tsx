import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard, ViewStyle } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface TopBarProps {
  style?: ViewStyle; 
}

export default function TopBar({ style }: TopBarProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log('Recherche:', searchText);
    Keyboard.dismiss();
  };

  return (
      <SafeAreaView>
        <View style={[styles.topView, style]}>
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
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginTop: 6,
  },
  topView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderStyle: 'dotted',
    height: 70,
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    width: 200,
    paddingLeft: 12,
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    borderRadius: 20,
    borderStyle: 'solid',
    borderColor: '#ff3131',
    borderWidth: 1,
  },
  rightTopBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginRight: 10,
  },
  audioFiles: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
});
