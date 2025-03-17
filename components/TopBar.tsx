import React, { useState } from 'react';
import { Image, TextInput, View, TouchableOpacity, Keyboard } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TopBarProps {
  isDarkMode: boolean;
}

export default function TopBar({ isDarkMode }: TopBarProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log('Recherche:', searchText);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView>
      <View style={{
        borderBottomColor: isDarkMode ? '#fff' : 'black', backgroundColor: isDarkMode ? '#222' : '#fff', display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderStyle: 'dotted',
        height: 70,
      }}>
        <Image
          style={[
            styles.logo,
            { tintColor: isDarkMode ? '#ff3131' : 'black' }
          ]}
          source={require('@/assets/images/vazo-logo.png')}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
          marginRight: 10,
        }}>
          <View style={{
            backgroundColor: isDarkMode ? '#444' : 'white', borderColor: '#ff3131',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderRadius: 20,
            borderWidth: 1,
          }}>
            <TextInput
              style={{ color: isDarkMode ? '#fff' : '#000', width: 200, paddingLeft: 12 }}
              placeholder="Chercher un son..."
              placeholderTextColor={isDarkMode ? '#ccc' : '#333'}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity>
              <EvilIcons name="search" size={30} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          <MaterialIcons name={isDarkMode ? "dark-mode" : "light-mode"} size={30} color={isDarkMode ? '#ff3131' : '#000'} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  logo: {
    width: 100,
    height: 100,
    marginTop: 6,
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
    borderRadius: 20,
    borderWidth: 1,
  },
  audioFiles: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
};
