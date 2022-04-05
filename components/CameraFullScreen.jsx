import React, { } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Camera } from 'expo-camera';

export function CameraFullScreen (props) {
  const { cameraStyle, contentStyle } = useFullScreenCameraStyle();

  return (
    <Camera style={[styles.cover, cameraStyle]} {...props}>
      <View style={[styles.cover, contentStyle]}>
        {props.children}
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  cover: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

/**
 * Calculate the width and height of a full screen camera.
 * This approach emulates a `cover` resize mode.
 * Because the `<Camera>` is also a wrapping element, 
 * we also need to calculate the offset back for the content.
 * 
 * @see https://reactnative.dev/docs/image#resizemode
 * @see https://github.com/react-native-camera/react-native-camera/issues/1267#issuecomment-376937499
 */
function useFullScreenCameraStyle (ratio = 3 / 4) {
  const window = useWindowDimensions();
  const isPortrait = window.height >= window.width;
  let cameraStyle, contentStyle;

  if (isPortrait) {
    // If the device is in portrait mode, we need to increase the width and move it out of the screen
    const widthByRatio = window.height * ratio;
    const widthOffsetByRatio = -((widthByRatio - window.width) / 2);

    // The camera is scaled up to "cover" the full screen, while maintainin ratio
    cameraStyle = { left: widthOffsetByRatio, right: widthOffsetByRatio };
    // But because the camera is also a wrapping element, we need to reverse this offset to align the content
    contentStyle = { left: -widthOffsetByRatio, right: -widthOffsetByRatio };
  } else {
    // If the device is in landscape mode, we need to increase the height and move it out of the screen
    const heightByRatio = window.width * ratio;
    const heightOffsetByRatio = -((heightByRatio - window.height) / 2);

    // See portrait comments
    cameraStyle = { top: heightOffsetByRatio, bottom: heightOffsetByRatio };
    contentStyle = { top: -heightOffsetByRatio, bottom: -heightOffsetByRatio };
  }

  return { cameraStyle, contentStyle };
}