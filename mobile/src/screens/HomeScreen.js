import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { productsAPI, API_URL } from "../services/api";
import { getImage } from '../public/images';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from "../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;
const heroImage = require("../../assets/hero-image.png");

export default function HomeScreen({ navigation }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadFeaturedProducts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const products = await productsAPI.getFeaturedProducts();
      setFeaturedProducts((products || []).slice(0, 4));
    } catch (error) {
      console.error("Error loading featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedProducts();
    setRefreshing(false);
  };

  const renderProduct = ({ item, index }) => (
    <ProductCard
      item={item}
      index={index}
      onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
    />
  );

  const StatItem = ({ number, label }) => (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.purpleStart} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />

      <FlatList
        data={featuredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.purpleStart}
            colors={[COLORS.purpleStart]}
          />
        }
        ListHeaderComponent={
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* HERO */}
            <LinearGradient
              colors={["rgba(102,126,234,0.35)", "rgba(118,75,162,0.35)"]}
              style={styles.hero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Top row */}
              <View style={styles.heroTopRow}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.iconText}>👤</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => navigation.navigate("Cart")}
                >
                  <Text style={styles.iconText}>🛒</Text>
                </TouchableOpacity>
              </View>

              {/* Text + image */}
              <View style={styles.heroContent}>
                <Text style={styles.heroEyebrow}>Bienvenido</Text>
                <Text style={styles.heroTitle}>La mejor tecnología a tu alcance</Text>
                <Text style={styles.heroSubtitle}>
                  Descubre productos seleccionados especialmente para ti, con envíos rápidos y
                  soporte dedicado.
                </Text>

                <TouchableOpacity
                  style={styles.heroButton}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate("Products")}
                >
                  <LinearGradient
                    colors={[COLORS.purpleStart, COLORS.purpleEnd]}
                    style={styles.heroButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.heroButtonText}>Explorar catálogo</Text>
                    <Text style={styles.heroButtonArrow}>→</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* IMAGEN CIRCULAR */}
                <View style={styles.heroImageWrapper}>
                  <View style={styles.heroImageCircle}>
                    <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* CARD DE STATS FUERA DEL HERO */}
            <View style={styles.heroStatsWrapper}>
              <View style={styles.heroStatsCard}>
                <StatItem number="100+" label="PRODUCTOS" />
                <View style={styles.statDivider} />
                <StatItem number="24/7" label="SOPORTE" />
                <View style={styles.statDivider} />
                <StatItem number="48h" label="ENVÍOS" />
              </View>
            </View>

            {/* Sección destacados */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Destacados</Text>
                <Text style={styles.sectionSubtitle}>Lo mejor de la semana</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Products")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay productos destacados</Text>
          </View>
        }
      />

      <BottomNav navigation={navigation} activeRoute="Home" />
    </View>
  );
}

/* PRODUCT CARD */

const ProductCard = ({ item, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 80,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 220,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const imageUrl =
    item.imagenes && item.imagenes.length > 0 ? getImage(item.imagenes[0]) : null;

  return (
    <Animated.View
      style={[
        styles.productCardWrapper,
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      ]}
    >
      <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.productImageContainer}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.productImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={["rgba(15,23,42,0.9)", "rgba(30,64,175,0.7)"]}
              style={styles.productImageGradient}
            >
              <Text style={styles.productImageText}>📦</Text>
            </LinearGradient>
          )}

          {item.stock === 0 && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Sin stock</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.productBrand} numberOfLines={1}>
            {item.marca}
          </Text>

          <Text style={styles.productPrice}>${item.precio.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

/* BOTTOM NAV */

const BottomNav = ({ navigation, activeRoute }) => {
  const navItems = [
    { name: "Home", icon: "🏠", label: "Inicio" },
    { name: "Products", icon: "📱", label: "Productos" },
    { name: "Cart", icon: "🛒", label: "Carrito" },
    { name: "Orders", icon: "📦", label: "Pedidos" },
    { name: "Favorites", icon: "❤️", label: "Favoritos" },
    { name: "Profile", icon: "👤", label: "Perfil" },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navButton}
          onPress={() => navigation.navigate(item.name)}
        >
          <Text
            style={[
              styles.navIcon,
              activeRoute === item.name && styles.navIconActive,
            ]}
          >
            {item.icon}
          </Text>
          <Text
            style={[
              styles.navText,
              activeRoute === item.name && styles.navTextActive,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.darkBg,
  },

  /* HERO */
  hero: {
  paddingTop: 60,
  paddingBottom: SPACING['2xl'],  // o SPACING.xl si prefieres menos alto
  paddingHorizontal: SPACING.xl,
  borderBottomLeftRadius: 32,
  borderBottomRightRadius: 32,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(148,163,184,0.35)",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.75)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
  },
  iconText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
  },
  heroContent: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  heroEyebrow: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.purpleLight,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: TYPOGRAPHY["2xl"],
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 30,
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  heroButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
    ...SHADOWS.purple,
  },
  heroButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  heroButtonText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    fontSize: TYPOGRAPHY.sm,
    marginRight: SPACING.xs,
  },
  heroButtonArrow: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
  },

  /* IMAGEN CIRCULAR */
  heroImageWrapper: {
    marginTop: SPACING.lg,
  },
  heroImageCircle: {
    width: 140,
    height: 140,
    borderRadius: 9999,
    backgroundColor: "rgba(15,23,42,0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
  },

  /* CARD STATS FUERA DEL HERO */
  heroStatsWrapper: {
    marginTop: SPACING.lg, 
    alignItems: 'center',
    marginBottom: SPACING.lg, 
  },
  heroStatsCard: {
    width: width * 0.9,                
    borderRadius: BORDER_RADIUS["2xl"],
    backgroundColor: "rgba(15,23,42,0.98)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.45)",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(148,163,184,0.4)",
  },

  /* SECTION HEADER + GRID */
  sectionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: SPACING.lg,
  marginTop: 0,            
  marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.purpleLight,
    fontWeight: TYPOGRAPHY.medium,
  },
  productList: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 110,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  productCardWrapper: {
    width: CARD_WIDTH,
  },
  productCard: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
  },
  productImageContainer: {
    height: CARD_WIDTH,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productImageGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImageText: {
    fontSize: 40,
  },
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  outOfStockText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  productInfo: {
    padding: SPACING.md,
  },
  productTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
    minHeight: 36,
  },
  productBrand: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "bold",
    color: COLORS.white,
  },

  emptyContainer: {
    padding: SPACING["4xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textMuted,
  },

  /* BOTTOM NAV */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 15, 30, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 5,
  },
  navButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 1,
  },
  navText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  navTextActive: {
    fontSize: 10,
    color: COLORS.purpleLight,
    fontWeight: "bold",
  },
});
