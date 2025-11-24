import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Animated,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../contexts/CartContext';
import { productsAPI } from '../services/api';
import { getImage } from '../public/images';

// Mantengo tus imports, pero usaremos el tema HERO para el estilo visual
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// 🎨 HERO UI THEME (Local)
const HERO = {
  background: '#09090b', // Zinc-950
  glass: 'rgba(24, 24, 27, 0.75)', // Glass dark
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#7828C8',
  primaryGradient: ['#7828C8', '#9333EA'],
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  success: '#17C964',
  danger: '#F31260',
  radius: 24,
};

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Error al cargar el producto");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setAdding(false);
      alert("¡Agregado al carrito!");
    }, 500);
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={HERO.primary} />
      </View>
    );
  }

  const images = product.imagenes && product.imagenes.length > 0 
    ? product.imagenes.map(img => getImage(img)).filter(Boolean)
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. AMBIENT LIGHTING (Background Orbs) */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: '#4c1d95' }]} />
        <View style={[styles.glowOrb, { top: height * 0.4, right: -80, backgroundColor: '#1e3a8a' }]} />
      </View>

      {/* Header Glass Animation */}
      <Animated.View 
        style={[
          styles.header,
          {
            backgroundColor: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: ['transparent', 'rgba(9, 9, 11, 0.9)'], // Zinc-950 blur
              extrapolate: 'clamp'
            }),
            borderBottomWidth: 1,
            borderBottomColor: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: ['transparent', HERO.glassBorder],
              extrapolate: 'clamp'
            }),
          }
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.glassBtn}>
          <Text style={styles.glassBtnText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.glassBtn}>
          <Text style={styles.glassBtnText}>🛒</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }} // Espacio para el footer flotante
      >
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImage(newIndex);
            }}
          >
            {images.length > 0 ? images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={img} style={styles.image} resizeMode="contain" />
              </View>
            )) : (
              <View style={styles.imageWrapper}>
                <View style={styles.placeholderContainer}>
                  <Text style={{ fontSize: 60 }}>📦</Text>
                </View>
              </View>
            )}
          </ScrollView>
          
          {/* Pagination Dots (Minimal) */}
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.dot, 
                  activeImage === index && styles.activeDot
                ]} 
              />
            ))}
          </View>
        </View>

        {/* GLASS SHEET CONTENT */}
        <View style={styles.glassSheet}>
          {/* Handle bar visual */}
          <View style={styles.sheetHandle} />

          <View style={styles.headerRow}>
             <View style={{flex: 1}}>
                <Text style={styles.brand}>{product.marca}</Text>
                <Text style={styles.title}>{product.titulo}</Text>
             </View>
             <Text style={styles.price}>${product.precio.toLocaleString()}</Text>
          </View>

          {/* Rating & Stock */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Text style={{fontSize: 12}}>⭐ 4.9</Text>
            </View>
            
            <View style={[
              styles.stockBadge, 
              { borderColor: product.stock > 0 ? HERO.success : HERO.danger }
            ]}>
              <View style={[
                  styles.stockDot,
                  { backgroundColor: product.stock > 0 ? HERO.success : HERO.danger }
              ]} />
              <Text style={[
                styles.stockText,
                { color: product.stock > 0 ? HERO.success : HERO.danger }
              ]}>
                {product.stock > 0 ? 'Disponible' : 'Agotado'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{product.descripcion}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Especificaciones</Text>
          <View style={styles.specsGlass}>
            {product.specs && Object.entries(product.specs).map(([key, value], index) => (
              <View key={key} style={[styles.specRow, index !== Object.keys(product.specs).length - 1 && styles.specDivider]}>
                <Text style={styles.specKey}>{key}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FLOATING GLASS FOOTER */}
      <View style={styles.footerContainer}>
        <View style={styles.glassFooter}>
            {/* Quantity Stepper */}
            <View style={styles.qtyControl}>
                <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
                    <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(Math.min(product.stock, quantity + 1))} style={styles.qtyBtn}>
                    <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Add Button */}
            <TouchableOpacity 
                style={styles.addBtnWrapper}
                onPress={handleAddToCart}
                disabled={product.stock === 0 || adding}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={product.stock > 0 ? HERO.primaryGradient : ['#3f3f46', '#27272a']}
                    style={styles.addBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    {adding ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.addBtnText}>
                            {product.stock > 0 ? 'Agregar' : 'Agotado'}
                        </Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HERO.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HERO.background,
  },
  
  /* --- AMBIENT --- */
  ambientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowOrb: {
    position: 'absolute',
    width: width * 1,
    height: width * 1,
    borderRadius: width,
    opacity: 0.15,
  },

  /* --- HEADER --- */
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  glassBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)', // Glassy
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: HERO.glassBorder,
    backdropFilter: 'blur(10px)',
  },
  glassBtnText: { color: 'white', fontSize: 20 },

  /* --- GALLERY --- */
  galleryContainer: {
    height: 420,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  imageWrapper: {
    width: width,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: '85%', height: '100%' },
  placeholderContainer: {
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center', alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    gap: 8,
  },
  dot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    backgroundColor: HERO.primary,
    width: 20,
  },

  /* --- GLASS SHEET (Content) --- */
  glassSheet: {
    backgroundColor: HERO.glass, // Zinc-900 con opacidad
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: 600,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: HERO.glassBorder,
    marginTop: -20, // Overlap effect
  },
  sheetHandle: {
    width: 40, height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  brand: {
    color: '#D8B4FE', // Violeta claro
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: HERO.text,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    marginRight: 10,
  },
  price: {
    color: HERO.text,
    fontSize: 24,
    fontWeight: '700',
  },
  
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  stockBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    gap: 6,
  },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontSize: 12, fontWeight: '600' },

  divider: {
    height: 1,
    backgroundColor: HERO.glassBorder,
    marginVertical: 24,
  },
  sectionTitle: {
    color: HERO.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: HERO.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },

  /* --- SPECS GLASS TABLE --- */
  specsGlass: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: HERO.glassBorder,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  specDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  specKey: { color: HERO.textMuted, fontSize: 14 },
  specValue: { color: HERO.text, fontSize: 14, fontWeight: '600' },

  /* --- FOOTER --- */
  footerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  glassFooter: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 24, 27, 0.9)', // Footer más opaco para contraste
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: HERO.glassBorder,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 4,
    height: 50,
    borderWidth: 1,
    borderColor: HERO.glassBorder,
  },
  qtyBtn: {
    width: 40, height: '100%',
    justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { color: 'white', fontSize: 20, fontWeight: '500' },
  qtyValue: { color: 'white', fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },

  addBtnWrapper: { flex: 1, height: 50, borderRadius: 18, overflow: 'hidden' },
  addBtnGradient: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: {
    color: 'white', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5,
  },
});