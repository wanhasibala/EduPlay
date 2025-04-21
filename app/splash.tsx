import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/auth/AuthProvider';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const { session, loading } = useAuth();

  useEffect(() => {
    // Start animation
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );
    
    scale.value = withSequence(
      withTiming(1.1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );

    // Wait for animation and session check
    const timer = setTimeout(() => {
      if (!loading) {
        if (session) {
          router.replace('/(tab)');
        } else {
          router.replace('/(auth)/login');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyles]}>
        <Image
          source={require('../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
});