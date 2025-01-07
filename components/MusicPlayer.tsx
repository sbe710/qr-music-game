import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Track } from "@/types/Track";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av"; // Убедитесь, что вы установили react-native-vector-icons

type MusicPlayerProps = {
  track: Track;
};
export const MusicPlayer: React.FC<MusicPlayerProps> = ({ track }) => {
  const { artist, title, year, mp3 } = track;
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);

    playAudioFromBase64(mp3);
  };

  const playAudioFromBase64 = async (base64: string) => {
    if (sound) {
      return isPlaying ? sound.pauseAsync() : sound.playAsync();
    }

    if (!sound) {
      setLoading(true);
      try {
        // Создаём временный путь для сохранения аудио файла
        const fileUri = FileSystem.documentDirectory + "audio.mp3";

        // Сохраняем base64 данные в файл
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Загружаем и воспроизводим аудиофайл
        const { sound } = await Audio.Sound.createAsync(
          { uri: fileUri },
          { shouldPlay: true },
        );
        setSound(sound);

        // После воспроизведения аудио
        sound.setOnPlaybackStatusUpdate((status) => {
          // @ts-ignore
          if (status.didJustFinish) {
            console.log("Audio finished");
            setSound(null);
          }
        });
      } catch (error) {
        console.error("Error playing audio:", error);
        alert("Failed to play audio from base64.");
      } finally {
        setLoading(false);
      }
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
    marginBottom: 50,
  },
  year: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
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
