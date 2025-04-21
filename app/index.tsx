import { View, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../components/auth/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  withSequence 
} from 'react-native-reanimated';

const HAS_SEEN_ONBOARDING = 'hasSeenOnboarding';

export default function Index() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const { session, loading } = useAuth();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(HAS_SEEN_ONBOARDING);
        setHasSeenOnboarding(value === 'true');
        setHasCheckedOnboarding(true);
      } catch (error) {
        console.log('Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
        setHasCheckedOnboarding(true);
      }
    };

    checkOnboarding();
  }, []);

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

    // Wait for animation and checks to complete
    const timer = setTimeout(() => {
      if (!loading && hasCheckedOnboarding) {
        if (!hasSeenOnboarding) {
          router.replace('/(onboarding)/welcome');
        } else if (session) {
          router.replace('/(tab)');
        } else {
          router.replace('/(auth)/login');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, session, hasCheckedOnboarding, hasSeenOnboarding]);

  // If still loading or checking onboarding, show splash screen
  if (loading || !hasCheckedOnboarding) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, animatedStyles]}>
          <Image
            source={require('../assets/images/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text>Halo</Text>
        </Animated.View>
        <ActivityIndicator 
          size="large" 
          color="#007AFF" 
          style={styles.loader}
        />
      </View>
    );
  }

  // After loading, redirect based on onboarding and auth state
  if (!hasSeenOnboarding) {
    return <Redirect href="/(onboarding)/welcome" />;
  }
  
  return session ? (
    <Redirect href="/(tab)" />
  ) : (
    <Redirect href="/(auth)/login" />
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