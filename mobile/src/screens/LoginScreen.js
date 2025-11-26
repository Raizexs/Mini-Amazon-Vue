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
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get('window');

// 🎨 Hero UI Theme: Definición local para asegurar el estilo exacto
const HERO = {
  background: '#09090b', // Zinc-950 (Fondo profundo)
  surface: 'rgba(39, 39, 42, 0.4)', // Zinc-800 con transparencia (Glass)
  border: 'rgba(255, 255, 255, 0.08)', // Borde sutil
  primaryGradient: ['#7828C8', '#9333EA'], // Violeta Hero
  text: '#FAFAFA', // Blanco tiza
  textMuted: '#A1A1AA', // Gris Zinc-400
  radius: 16,
};

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();
  
  // Animaciones (Simplificadas para reducir ruido visual)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Error al iniciar sesión.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. Iluminación Ambiental (Orbs) */}
      {/* Reemplaza la rotación compleja por luces estáticas suaves */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -80, left: -50, backgroundColor: '#5b21b6' }]} /> 
        <View style={[styles.glowOrb, { top: height * 0.4, right: -100, backgroundColor: '#1e3a8a' }]} />
      </View>

      <Animated.View style={[
        styles.content,
        { 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
        }
      ]}>
        
        {/* HEADER: Minimalista y centrado */}
        <View style={styles.headerSection}>
          <View style={styles.pillBadge}>
            <Text style={styles.pillText}>✨ Nueva Experiencia</Text>
          </View>

          <Text style={styles.title}>
            Mini <Text style={styles.titleGradient}>Amazon</Text>
          </Text>
          
          <Text style={styles.subtitle}>
            Calidad premium y envíos rápidos en tu bolsillo.
          </Text>
        </View>

        {/* FEATURES: Diseño Glassmorphism Horizontal (Ahorra espacio) */}
        <View style={styles.glassRow}>
          <GlassFeature icon="🛡️" label="Seguro" />
          <View style={styles.divider} />
          <GlassFeature icon="⚡" label="Rápido" />
          <View style={styles.divider} />
          <GlassFeature icon="💎" label="Premium" />
        </View>

        {/* ACTION: Botón moderno y términos */}
        <View style={styles.actionSection}>
          <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
              activeOpacity={0.9}
              style={styles.shadowWrapper}
            >
              <LinearGradient
                colors={HERO.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <View style={styles.iconBox}>
                      <Text style={styles.googleG}>G</Text>
                    </View>
                    <Text style={styles.btnText}>Continuar con Google</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.termsText}>
            Al entrar aceptas nuestros <Text style={styles.link}>Términos</Text> y <Text style={styles.link}>Privacidad</Text>.
          </Text>
        </View>

      </Animated.View>

      {/* LOADING OVERLAY: Animación premium cuando está autenticando */}
      {loading && (
        <Animated.View 
          style={[
            styles.loadingOverlay,
            { 
              opacity: fadeAnim,
            }
          ]}
        >
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#9333EA" />
            <Text style={styles.loadingText}>Autenticando...</Text>
            <Text style={styles.loadingSubtext}>Conectando con Google</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// Componente auxiliar para las features
const GlassFeature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HERO.background,
    justifyContent: 'center', // Centrado vertical perfecto
  },
  // --- Ambient Background ---
  ambientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowOrb: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    opacity: 0.12, // Muy sutil
  },
  // --- Main Content ---
  content: {
    paddingHorizontal: 24,
    width: '100%',
    gap: 32, // Espaciado consistente entre bloques
  },
  
  // --- Header ---
  headerSection: {
    alignItems: 'center',
  },
  pillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: HERO.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 16,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D8B4FE', // Violeta claro
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: HERO.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  titleGradient: {
    color: '#C084FC',
  },
  subtitle: {
    fontSize: 15,
    color: HERO.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
  },

  // --- Glass Row (Features) ---
  glassRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: HERO.surface, // Fondo Glass
    borderRadius: HERO.radius,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: HERO.border, // Borde sutil
  },
  featureItem: {
    alignItems: 'center',
    width: '25%',
  },
  featureIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  featureLabel: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // --- Actions ---
  actionSection: {
    alignItems: 'center',
    width: '100%',
  },
  shadowWrapper: {
    width: '100%',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    width: '100%',
  },
  iconBox: {
    width: 26,
    height: 26,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleG: {
    color: '#7828C8',
    fontWeight: '900',
    fontSize: 16,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  termsText: {
    marginTop: 24,
    fontSize: 12,
    color: '#52525B', // Gris oscuro para no distraer
    textAlign: 'center',
  },
  link: {
    color: '#A1A1AA',
    fontWeight: '600',
  },

  // --- Loading Overlay ---
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.95)', // Fondo oscuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingCard: {
    backgroundColor: HERO.surface,
    borderRadius: HERO.radius,
    borderWidth: 1,
    borderColor: HERO.border,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: HERO.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  loadingSubtext: {
    color: HERO.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
});