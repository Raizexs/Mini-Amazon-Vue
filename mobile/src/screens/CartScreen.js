import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../contexts/CartContext';
import { getImage } from '../public/images';
// Mantengo tus imports, pero usaremos el tema HERO para el estilo visual
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// 🎨 HERO UI THEME (Local)
const HERO = {
  background: '#09090b', // Zinc-950
  glass: 'rgba(39, 39, 42, 0.4)', // Glass dark
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#7828C8',
  primaryGradient: ['#7828C8', '#9333EA'],
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  success: '#17C964',
  danger: '#F31260',
  radius: 16,
};

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Animación de entrada para los items
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [cart.length]); // Re-animar si cambia la longitud (opcional, mejor solo al montar)

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de continuar.");
      return;
    }
    
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('Checkout');
    });
  };

  const confirmClearCart = () => {
    Alert.alert(
      "Vaciar Carrito",
      "¿Estás seguro de que quieres eliminar todos los productos?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Vaciar", style: "destructive", onPress: clearCart }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <CartItem 
      item={item} 
      index={index} 
      updateQuantity={updateQuantity} 
      removeFromCart={removeFromCart} 
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. AMBIENT LIGHTING (Background Orbs) */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -50, left: -80, backgroundColor: '#4c1d95' }]} />
        <View style={[styles.glowOrb, { bottom: height * 0.2, right: -50, backgroundColor: '#1e3a8a' }]} />
      </View>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
           <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        {cart.length > 0 ? (
           <TouchableOpacity onPress={confirmClearCart} style={[styles.iconBtn, {backgroundColor: 'rgba(243, 18, 96, 0.1)', borderColor: 'rgba(243, 18, 96, 0.2)'}]}>
              <Text style={[styles.iconText, {fontSize: 14}]}>🗑</Text>
           </TouchableOpacity>
        ) : (
           <View style={{width: 40}} /> // Spacer
        )}
      </View>

      {/* CONTENT */}
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={{fontSize: 50}}>🛒</Text>
          </View>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>
            ¡Explora nuestros productos y encuentra lo que buscas!
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={HERO.primaryGradient}
              style={styles.gradientBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.btnText}>Ir a comprar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* SUMMARY CARD (Floating below header) */}
          <View style={styles.summaryContainer}>
             <View style={styles.glassSummary}>
                <View style={styles.summaryCol}>
                   <Text style={styles.summaryLabel}>Items</Text>
                   <Text style={styles.summaryValue}>{cart.length}</Text>
                </View>
                <View style={styles.dividerV} />
                <View style={styles.summaryCol}>
                   <Text style={styles.summaryLabel}>Total Estimado</Text>
                   <Text style={styles.summaryValue}>${getCartTotal().toLocaleString()}</Text>
                </View>
             </View>
          </View>

          <Animated.FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            style={{ opacity: listOpacity }}
          />

          {/* FOOTER CHECKOUT */}
          <View style={styles.footerContainer}>
             <View style={styles.glassFooter}>
                <View>
                   <Text style={styles.footerLabel}>Total a Pagar</Text>
                   <Text style={styles.footerTotal}>${getCartTotal().toLocaleString()}</Text>
                </View>

                <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
                  <TouchableOpacity 
                    onPress={handleCheckout}
                    activeOpacity={0.8}
                    style={styles.checkoutWrapper}
                  >
                    <LinearGradient
                      colors={HERO.primaryGradient}
                      style={styles.checkoutBtn}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.checkoutText}>Pagar</Text>
                      <Text style={styles.arrowText}>→</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
             </View>
          </View>
        </>
      )}
    </View>
  );
}

// 🎨 ITEM COMPONENT
const CartItem = ({ item, index, updateQuantity, removeFromCart }) => {
  // Animación de entrada staggered
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true
    }).start();
  }, []);

  const imageUrl = item.imagenes && item.imagenes.length > 0 ? getImage(item.imagenes[0]) : null;

  return (
    <Animated.View style={[
      styles.itemWrapper, 
      { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }
    ]}>
      <View style={styles.glassItem}>
        
        {/* Image */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.itemImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}><Text>📦</Text></View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
               <Text style={styles.itemBrand}>{item.marca || 'Genérico'}</Text>
               <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                  <Text style={{color: HERO.danger, fontSize: 12}}>✕</Text>
               </TouchableOpacity>
            </View>
            
            <Text style={styles.itemTitle} numberOfLines={1}>{item.titulo}</Text>
            <Text style={styles.itemPrice}>${item.precio.toLocaleString()}</Text>

            {/* Controls */}
            <View style={styles.controlsRow}>
               <View style={styles.qtyContainer}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>
                     <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtn}>
                     <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
               </View>
            </View>
        </View>

      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HERO.background,
  },
  
  /* --- AMBIENT --- */
  ambientContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  glowOrb: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    opacity: 0.12,
  },

  /* --- HEADER --- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    color: HERO.text,
    fontSize: 20,
    fontWeight: '700',
  },
  iconBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  iconText: { color: HERO.text, fontSize: 18 },

  /* --- SUMMARY CARD --- */
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  glassSummary: {
    flexDirection: 'row',
    backgroundColor: HERO.glass,
    borderRadius: HERO.radius,
    padding: 16,
    borderWidth: 1, borderColor: HERO.glassBorder,
    alignItems: 'center',
  },
  summaryCol: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: HERO.textMuted, fontSize: 12, marginBottom: 4 },
  summaryValue: { color: HERO.text, fontSize: 18, fontWeight: '700' },
  dividerV: { width: 1, height: 30, backgroundColor: HERO.glassBorder },

  /* --- LIST --- */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for footer
  },
  itemWrapper: { marginBottom: 16 },
  glassItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(39, 39, 42, 0.3)', // Slightly more transparent than card
    borderRadius: HERO.radius,
    padding: 12,
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  imageContainer: {
    width: 80, height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  itemImage: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  itemBrand: { color: HERO.textMuted, fontSize: 10, textTransform: 'uppercase', fontWeight: '700' },
  removeBtn: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(243, 18, 96, 0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  itemTitle: { color: HERO.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  itemPrice: { color: HERO.text, fontSize: 16, fontWeight: '700' },
  
  controlsRow: {
    flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8,
  },
  qtyContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1, borderColor: HERO.glassBorder,
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28, height: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { color: HERO.text, fontSize: 16 },
  qtyText: { color: HERO.text, fontSize: 14, fontWeight: '600', minWidth: 20, textAlign: 'center' },

  /* --- EMPTY STATE --- */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -50,
  },
  emptyIconCircle: {
    width: 100, height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: HERO.glassBorder,
    marginBottom: 20,
  },
  emptyTitle: { color: HERO.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: HERO.textMuted, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  shopButton: { width: '100%', height: 50, borderRadius: HERO.radius, overflow: 'hidden' },
  gradientBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },

  /* --- FOOTER --- */
  footerContainer: {
    position: 'absolute',
    bottom: 20, left: 20, right: 20,
  },
  glassFooter: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1, borderColor: HERO.glassBorder,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
    gap: 20,
  },
  footerLabel: { color: HERO.textMuted, fontSize: 12 },
  footerTotal: { color: HERO.text, fontSize: 20, fontWeight: '800' },
  
  checkoutWrapper: { flex: 1, height: 50, borderRadius: 14, overflow: 'hidden' },
  checkoutBtn: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
  },
  checkoutText: { color: 'white', fontSize: 16, fontWeight: '700' },
  arrowText: { color: 'white', fontSize: 20, fontWeight: '700', marginTop: -2 },
});