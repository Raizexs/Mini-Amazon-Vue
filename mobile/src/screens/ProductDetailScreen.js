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
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../contexts/CartContext';
import { productsAPI } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

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
      console.log("Fetching product details for ID:", productId);
      const data = await productsAPI.getProductById(productId);
      console.log("Product details loaded:", data ? "Success" : "Empty");
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
    
    // Simulate feedback
    setTimeout(() => {
      setAdding(false);
      alert("¡Agregado al carrito!");
    }, 500);
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.purpleStart} />
      </View>
    );
  }

  const images = product.imagenes && product.imagenes.length > 0 
    ? product.imagenes 
    : ['https://via.placeholder.com/400'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header Transparent/Solid on Scroll */}
      <Animated.View 
        style={[
          styles.header,
          {
            backgroundColor: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: ['transparent', 'rgba(15, 15, 30, 0.95)'],
              extrapolate: 'clamp'
            }),
            borderBottomColor: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: ['transparent', 'rgba(255, 255, 255, 0.1)'],
              extrapolate: 'clamp'
            }),
            borderBottomWidth: 1,
          }
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>🛒</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
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
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.image} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
          
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  activeImage === index && styles.activeDot
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.brand}>{product.marca}</Text>
          
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.titulo}</Text>
            <Text style={styles.price}>${product.precio.toLocaleString()}</Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.ratingCount}>4.9 (120 reseñas)</Text>
            </View>
            <View style={[
              styles.stockBadge, 
              { 
                backgroundColor: product.stock > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                borderColor: product.stock > 0 ? '#10B981' : '#EF4444' 
              }
            ]}>
              <Text style={[
                styles.stockText,
                { color: product.stock > 0 ? '#10B981' : '#EF4444' }
              ]}>
                {product.stock > 0 ? 'En Stock' : 'Agotado'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{product.descripcion}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Especificaciones</Text>
          <View style={styles.specsContainer}>
            {product.specs && Object.entries(product.specs).map(([key, value], index) => (
              <View key={key} style={[styles.specRow, index === Object.keys(product.specs).length - 1 && styles.lastSpecRow]}>
                <Text style={styles.specKey}>{key}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>
          
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.addToCartBtn, product.stock === 0 && styles.disabledBtn]}
          onPress={handleAddToCart}
          disabled={product.stock === 0 || adding}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={product.stock > 0 ? [COLORS.purpleStart, COLORS.purpleEnd] : ['#555', '#444']}
            style={styles.addToCartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {adding ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.addToCartText}>
                {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkBg,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  galleryContainer: {
    height: 450,
    backgroundColor: '#fff', // White background for product images usually looks better
    position: 'relative',
  },
  imageWrapper: {
    width: width,
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  activeDot: {
    backgroundColor: COLORS.purpleStart,
    width: 24,
  },
  contentContainer: {
    padding: SPACING.xl,
    backgroundColor: COLORS.darkBg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    minHeight: 500,
    ...SHADOWS.lg,
  },
  brand: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.purpleLight,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    lineHeight: 32,
    flex: 1,
  },
  price: {
    fontSize: TYPOGRAPHY['2xl'],
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    lineHeight: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  stars: {
    fontSize: 16,
    marginRight: 6,
  },
  ratingCount: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  stockBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  stockText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  specsContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  lastSpecRow: {
    borderBottomWidth: 0,
  },
  specKey: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sm,
    flex: 1,
  },
  specValue: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.darkBg,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  qtyBtn: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  qtyBtnText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  qtyValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: SPACING.md,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    height: 50,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  addToCartGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
  },
});
