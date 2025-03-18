import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, useColorScheme } from 'react-native';

export default function ParameterScreen() {
  const colorScheme = useColorScheme();

  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isFavoriteOnly, setIsFavoriteOnly] = React.useState(false);
  const [isHighQuality, setIsHighQuality] = React.useState(true);

  const toggleSubscription = () => setIsSubscribed(prev => !prev);
  const toggleFavoriteOnly = () => setIsFavoriteOnly(prev => !prev);
  const toggleHighQuality = () => setIsHighQuality(prev => !prev);

  return (
    <View
      style={[
        styles.container,
        colorScheme === 'dark' ? darkStyles.background : lightStyles.background,
      ]}
    >
      <Text
        style={[styles.title, colorScheme === 'dark' ? darkStyles.text : lightStyles.text]}
      >
        Paramètres de Musique
      </Text>

      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, colorScheme === 'dark' ? darkStyles.text : lightStyles.text]}
        >
          Abonnement Premium
        </Text>
        <Switch
          value={isSubscribed}
          onValueChange={toggleSubscription}
          trackColor={{ false: '#767577', true: '#ff3131' }}
          thumbColor={isSubscribed ? 'black' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, colorScheme === 'dark' ? darkStyles.text : lightStyles.text]}
        >
          Voir uniquement favoris
        </Text>
        <Switch
          value={isFavoriteOnly}
          onValueChange={toggleFavoriteOnly}
          trackColor={{ false: '#767577', true: '#ff3131' }}
          thumbColor={isFavoriteOnly ? 'black' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, colorScheme === 'dark' ? darkStyles.text : lightStyles.text]}
        >
          Qualité de lecture haute
        </Text>
        <Switch
          value={isHighQuality}
          onValueChange={toggleHighQuality}
          trackColor={{ false: '#767577', true: '#ff3131' }}
          thumbColor={isHighQuality ? 'black' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colorScheme === 'dark' ? '#ff3131' : '#ff3131' },
        ]}
        onPress={() => {}}
      >
        <Text style={[styles.buttonText, colorScheme === 'dark' ? darkStyles.text : lightStyles.text]}>
          Retour
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const lightStyles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
  },
});

const darkStyles = StyleSheet.create({
  background: {
    backgroundColor: '#121212',
  },
  text: {
    color: 'white',
  },
});
