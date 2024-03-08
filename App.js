import { StatusBar } from "expo-status-bar";
import { Camera, CameraType } from "expo-camera";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

export default function App() {
  const [type, setType] = React.useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = React.useRef(null);
  const [image, setImage] = React.useState();
  const [preview, setPreview] = React.useState(false);

  React.useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>No permission</Text>
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  const takePicture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      if (cameraRef.current) {
        const options = { quality: 0.5, skipProcessing: true };
        const photo = await cameraRef.current.takePictureAsync(options);
        console.log("photo", photo);
        setImage(photo);
        setPreview(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {preview && image ? (
        <View style={styles.container}>
          <Image
            source={{ uri: image.uri }}
            style={{ width: "100%", height: "100%" }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPreview(false);
              setImage(null);
            }}
          >
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Camera ratio="4:2" style={styles.camera} ref={cameraRef} type={type}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    bottom: 0,
  },
  button: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderRadius: 40,
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
