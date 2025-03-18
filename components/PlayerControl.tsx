import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const PlayerControl = ({ isPlaying, currentPosition, duration, onSeek, onPlayPause, onPrevious, onNext, colorScheme }) => {
  const dynamicStyles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const darkMode = colorScheme === 'dark' ? '#ff3131' : 'black';

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <View>
      <View>
        {duration > 0 && (
          <View style={styles.progressContainer}>
            <Text style={[{ color: darkMode ,paddingLeft:15,paddingTop:12},dynamicStyles.controls]}>
              {`${formatTime(currentPosition)} / ${formatTime(duration)}`}
            </Text>
            <Slider
              style={[styles.progressBar,dynamicStyles.controls]}
              minimumValue={0}
              maximumValue={duration}
              value={currentPosition}
              onSlidingComplete={onSeek}
              thumbTintColor={darkMode}
              minimumTrackTintColor={darkMode}
              maximumTrackTintColor="black"
            />
          </View>
        )}
      </View>
      <View style={[styles.controls, dynamicStyles.controls]}>
        <TouchableOpacity onPress={onPrevious}>
          <MaterialIcons name="skip-previous" size={40} color={darkMode} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPlayPause}>
          <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={40} color={darkMode} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onNext}>
          <MaterialIcons name="skip-next" size={40} color={darkMode} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
  },
});

const lightStyles = StyleSheet.create({
  controls: {
    backgroundColor: '#ff3131',
  },
});

const darkStyles = StyleSheet.create({
  controls: {
    backgroundColor: '#1f1f1f',
  },
});

export default PlayerControl;
