import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { globalColors } from "../../constants/colors";
import ConfettiCannon from "react-native-confetti-cannon";

export default function ThankYou({ navigation }) {
  const confettiRefLeft = React.useRef(null);
  const confettiRefRight = React.useRef(null);

  useEffect(() => {
    if (confettiRefLeft.current) {
      confettiRefLeft.current.start();
    }
    if (confettiRefRight.current) {
      confettiRefRight.current.start();
    }
  }, []);

  function returnToHomepage() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  }

  return (
    <View style={styles.outerContainer}>
      <ConfettiCannon
        ref={confettiRefLeft}
        count={100}
        origin={{ x: 0, y: 0 }}
      />

      <ConfettiCannon
        ref={confettiRefRight}
        count={100}
        origin={{ x: 400, y: 0 }}
      />
      <Text style={styles.text}>Thank you for your Application!</Text>
      <Text style={styles.text}>We will review your application</Text>
      <Text style={styles.text}>and reach you back in 24 hours!</Text>
      <TouchableOpacity style={styles.btn} onPress={returnToHomepage}>
        <Text style={styles.btnText}>Return to Homepage</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.lavender,
  },
  text: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
    color: globalColors.wildBlue,
    textAlign: "center",
  },
  btn: {
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 16,
  },
  btnText: {
    color: "white",
    fontSize: 16,
  },
});
