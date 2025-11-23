import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../contexts/AuthContext";
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from "../constants/theme";

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation for background
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleGoogleSignIn = async () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Error al iniciar sesión. Por favor intenta de nuevo.");
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />
      
      {/* Animated Background Gradient */}
      <Animated.View style={[styles.bgGradient, { transform: [{ rotate }] }]}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#0f0f1e']}
          style={styles.gradientFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}>
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>✨</Text>
          <Text style={styles.badgeText}>Bienvenido a Mini-Amazon</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Mini-Amazon</Text>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleGradient}
        >
          <Text style={styles.titleHighlight}>Tu tienda de confianza</Text>
        </LinearGradient>

        {/* Description */}
        <Text style={styles.description}>
          Descubre miles de productos premium con la mejor calidad, precios competitivos y envíos rápidos.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem icon="🛡️" title="Compra Segura" desc="Protección total" />
          <FeatureItem icon="⚡" title="Envío Express" desc="24-48 horas" />
          <FeatureItem icon="🏆" title="Calidad Premium" desc="Garantizado" />
        </View>

        {/* Google Sign-In Button */}
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4285F4', '#357AE8']}
              style={styles.googleButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statNumberGradient}
            >
              <Text style={styles.statNumber}>1K+</Text>
            </LinearGradient>
            <Text style={styles.statLabel}>CLIENTES FELICES</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statNumberGradient}
            >
              <Text style={styles.statNumber}>500+</Text>
            </LinearGradient>
            <Text style={styles.statLabel}>PRODUCTOS</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statNumberGradient}
            >
              <Text style={styles.statNumber}>4.9★</Text>
            </LinearGradient>
            <Text style={styles.statLabel}>CALIFICACIÓN</Text>
          </View>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          Al continuar, aceptas nuestros{'\n'}
          <Text style={styles.termsLink}>Términos de Servicio</Text> y{' '}
          <Text style={styles.termsLink}>Política de Privacidad</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const FeatureItem = ({ icon, title, desc }) => (
  <View style={styles.featureItem}>
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.featureIcon}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.featureIconText}>{icon}</Text>
    </LinearGradient>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  bgGradient: {
    position: 'absolute',
    top: -height * 0.5,
    left: -width * 0.5,
    width: width * 2,
    height: height * 2,
    opacity: 0.1,
  },
  gradientFill: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING['2xl'],
    paddingTop: SPACING['6xl'],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  badgeIcon: {
    fontSize: TYPOGRAPHY.base,
    marginRight: SPACING.xs,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.medium,
  },
  title: {
    fontSize: TYPOGRAPHY['5xl'],
    fontWeight: TYPOGRAPHY.black,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  titleGradient: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  titleHighlight: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.black,
    color: COLORS.white,
    textAlign: 'center',
  },
  description: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING['3xl'],
    paddingHorizontal: SPACING.xl,
    lineHeight: 26,
  },
  features: {
    width: '100%',
    marginBottom: SPACING['3xl'],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.md,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureIconText: {
    fontSize: TYPOGRAPHY['2xl'],
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: SPACING['3xl'],
  },
  googleButton: {
    width: '100%',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.purple,
  },
  googleButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING['2xl'],
  },
  googleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  googleIcon: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold,
    color: '#4285F4',
  },
  googleButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING['2xl'],
    marginBottom: SPACING['2xl'],
    ...SHADOWS.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumberGradient: {
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  statNumber: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.black,
    color: COLORS.white,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 2,
    height: '70%',
    alignSelf: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.5)',
  },
  termsText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textDark,
    textAlign: "center",
    paddingHorizontal: SPACING['2xl'],
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.purpleLight,
    fontWeight: TYPOGRAPHY.semibold,
  },
});
