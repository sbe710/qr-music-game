// @ts-nocheck
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider"; // Убедитесь, что вы установили эту библиотеку
import Icon from "react-native-vector-icons/Ionicons"; // Убедитесь, что вы установили react-native-vector-icons
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export const MusicPlayer = ({ track }) => {
  const { artist, title, year, mp3 } = track;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(200); // Общая продолжительность песни в секундах

  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime < duration) {
            return prevTime + 1;
          } else {
            clearInterval(interval);
            setIsPlaying(false);
            return prevTime;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlayPause = () => {
    if (loading) return;

    if (sound) {
      if (isPlaying) {
        sound.pauseAsync();
        setIsPlaying(false);
      } else {
        sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      playAudioFromBase64(mp3);
    }
  };

  const playAudioFromBase64 = async (base64) => {
    setLoading(true);
    try {
      const fileUri = FileSystem.documentDirectory + "audio.mp3";
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true },
        (playbackStatus) => {
          if (playbackStatus.isLoaded) {
            setCurrentTime(Math.floor(playbackStatus.positionMillis / 1000));
            setDuration(Math.floor(playbackStatus.durationMillis / 1000));

            if (playbackStatus.didJustFinish) {
              setIsPlaying(false);
              setSound(null);
            }
          }
        },
      );

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      alert("Failed to play audio from base64.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/150" }} // Замените на URL вашей обложки
        style={styles.cover}
      />
      <Text style={styles.songTitle}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
      <Text style={styles.year}>{year}</Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onSlidingComplete={(value) => {
          if (sound) {
            sound.setPositionAsync(value * 1000);
            setCurrentTime(value);
          }
        }}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1DB954"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      <TouchableOpacity
        onPress={togglePlayPause}
        style={styles.playPauseButton}
      >
        <Icon name={isPlaying ? "pause" : "play"} size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#121212",
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cover: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  artist: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
  },
  year: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  time: {
    color: "#fff",
    fontSize: 14,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    backgroundColor: "#1DB954",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
