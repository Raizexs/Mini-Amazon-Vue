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
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../contexts/CartContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getImage } from '../public/images';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const buttonScale = useRef(new Animated.Value(1)).current;

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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />
      
      {/* HERO */}
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.1)']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircle}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {cart.length > 0 ? (
            <TouchableOpacity onPress={confirmClearCart} style={styles.iconCircle}>
              <Text style={styles.clearIconText}>🗑</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.iconCirclePlaceholder} />
          )}
        </View>

        <View style={styles.heroTextWrapper}>
          <Text style={styles.headerTitle}>Mi carrito</Text>
          <Text style={styles.headerSubtitle}>
            {cart.length > 0
              ? 'Revisa tus productos antes de pagar'
              : 'Aún no has agregado productos a tu carrito'}
          </Text>
        </View>

        {cart.length > 0 && (
          <View style={styles.heroSummaryCard}>
            <View style={styles.heroSummaryColumn}>
              <Text style={styles.heroSummaryLabel}>Productos</Text>
              <Text style={styles.heroSummaryValue}>{cart.length}</Text>
            </View>

            <View style={styles.heroSummaryDivider} />

            <View style={styles.heroSummaryColumn}>
              <Text style={styles.heroSummaryLabel}>Total estimado</Text>
              <Text style={styles.heroSummaryValue}>
                ${getCartTotal().toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
          </View>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>
            ¡Explora nuestros productos y encuentra lo que buscas!
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <LinearGradient
              colors={[COLORS.purpleStart, COLORS.purpleEnd]}
              style={styles.shopButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.shopButtonText}>Ir a comprar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.totalCard}>
              <View>
                <Text style={styles.totalLabel}>Total a pagar</Text>
                <Text style={styles.totalAmount}>${getCartTotal().toLocaleString()}</Text>
              </View>
              <View style={styles.totalTag}>
                <Text style={styles.totalTagText}>{cart.length} ítem(s)</Text>
              </View>
            </View>
            
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={handleCheckout}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[COLORS.purpleStart, COLORS.purpleEnd]}
                  style={styles.checkoutGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.checkoutText}>Proceder al pago</Text>
                  <Text style={styles.checkoutArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
}

const CartItem = ({ item, index, updateQuantity, removeFromCart }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 80,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 220,
        delay: index * 80,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const imageUrl = item.imagenes && item.imagenes.length > 0 
    ? getImage(item.imagenes[0]) 
    : null;

  return (
    <Animated.View style={{ 
      transform: [{ scale: scaleAnim }],
      opacity: opacityAnim,
      width: CARD_WIDTH,
      alignSelf: 'center',
    }}>
      <View style={styles.cartItem}>
        <View style={styles.cartItemTopRow}>
          <View style={styles.itemImageContainer}>
            {imageUrl ? (
              <Image 
                source={imageUrl} 
                style={styles.itemImage} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>

          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.titulo}</Text>
            <Text style={styles.itemBrand}>{item.marca || 'Marca'}</Text>
          </View>

          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.removeButtonIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cartItemBottomRow}>
          <Text style={styles.itemPrice}>${item.precio.toLocaleString()}</Text>
          
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.qtyText}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },

  /* HERO */
  header: {
    paddingTop: 60,
    paddingBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconCirclePlaceholder: {
    width: 40,
    height: 40,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.xl,
    color: COLORS.white,
    marginTop: -2,
  },
  clearIconText: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.white,
  },
  heroTextWrapper: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  heroSummaryCard: {
    marginTop: SPACING.xl,
    alignSelf: 'center',
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS['2xl'],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.purple,
  },
  heroSummaryColumn: {
    flex: 1,
  },
  heroSummaryLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  heroSummaryValue: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  heroSummaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(148, 163, 184, 0.35)',
    marginHorizontal: SPACING.lg,
  },

  /* LISTA */
  listContent: {
    paddingTop: SPACING.xl,
    paddingBottom: 160,
    alignItems: 'center',
  },
  cartItem: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  cartItemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemBottomRow: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.45)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  itemDetails: {
    flex: 1,
    marginLeft: SPACING.md,
    paddingRight: SPACING.md,
  },
  itemTitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.extrabold,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: BORDER_RADIUS.full,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  qtyButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(15, 23, 42, 1)',
  },
  qtyButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.bold,
    marginTop: -2,
  },
  qtyText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    paddingHorizontal: SPACING.md,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 26,
    height: 26,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonIcon: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -1,
  },

  /* FOOTER / CHECKOUT */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 15, 30, 0.98)',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['2xl'],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.3)',
  },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  totalAmount: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.extrabold,
  },
  totalTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  totalTagText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  checkoutButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  checkoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    marginRight: SPACING.sm,
  },
  checkoutArrow: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold,
  },

  /* EMPTY STATE */
  emptyContainer: {
    flex: 1,
    paddingTop: SPACING['2xl'],
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyIcon: {
    fontSize: 50,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
    lineHeight: 24,
  },
  shopButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    width: '80%',
  },
  shopButtonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
  },
});
