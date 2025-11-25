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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { productsAPI } from "../services/api";
import { getImage } from '../public/images';
import { COLORS, SPACING, BORDER_RADIUS } from "../constants/theme";

const { width, height } = Dimensions.get("window");
const GAP = 15; 
const PADDING_HORIZONTAL = 48;
const CARD_WIDTH = (width - PADDING_HORIZONTAL - GAP) / 2;
const heroImage = require("../../assets/heroimage.jpg");

const HERO = {
  background: '#09090b', // Zinc-950
  card: 'rgba(39, 39, 42, 0.4)', // Zinc-800 glass
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#7828C8',
  primaryGradient: ['#7828C8', '#9333EA'],
  text: '#FAFAFA',
  textMuted: '#A1A1AA', // Zinc-400
  radius: 16,
};

export default function HomeScreen({ navigation }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadFeaturedProducts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
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
        <ActivityIndicator size="large" color={HERO.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: '#5b21b6' }]} /> 
        <View style={[styles.glowOrb, { top: height * 0.3, right: -100, backgroundColor: '#1e3a8a' }]} />
      </View>

      <FlatList
        data={featuredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={HERO.primary}
            colors={[HERO.primary]}
            progressViewOffset={40}
          />
        }
        ListHeaderComponent={
          <Animated.View style={{ opacity: fadeAnim }}>
            
            <View style={styles.heroContainer}>
              <View style={styles.topBar}>
                <View style={styles.pillBadge}>
                    <Text style={styles.pillText}>✨ Bienvenido</Text>
                </View>
                
                <View style={styles.topIcons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Profile")}>
                    <Text style={styles.iconText}>👤</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Cart")}>
                    <Text style={styles.iconText}>🛒</Text>
                    </TouchableOpacity>
                </View>
              </View>

              <View style={styles.heroContent}>
                <View style={styles.heroTextContainer}>
                    <Text style={styles.heroTitle}>
                        Tecnología <Text style={styles.heroTitleGradient}>Premium</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Selección exclusiva con envíos express y garantía total.
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("Products")}
                        style={styles.heroCtaWrapper}
                    >
                        <LinearGradient
                            colors={HERO.primaryGradient}
                            style={styles.heroButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.heroButtonText}>Explorar</Text>
                            <Text style={styles.heroButtonArrow}>→</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.heroImageContainer}>
                    <View style={styles.imageGlow} />
                    <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
                </View>
              </View>


              <View style={styles.glassStatsBar}>
                <StatItem number="100+" label="Productos" />
                <View style={styles.divider} />
                <StatItem number="24/7" label="Soporte" />
                <View style={styles.divider} />
                <StatItem number="48h" label="Envíos" />
              </View>
            </View>

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

const ProductCard = ({ item, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, delay: index * 100, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const imageUrl = item.imagenes && item.imagenes.length > 0 ? getImage(item.imagenes[0]) : null;

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      <TouchableOpacity style={styles.glassCard} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={{ fontSize: 30 }}>📦</Text>
            </View>
          )}
          {item.stock === 0 && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>Agotado</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.brandText} numberOfLines={1}>{item.marca}</Text>
          <Text style={styles.titleText} numberOfLines={2}>{item.titulo}</Text>
          <Text style={styles.priceText}>${item.precio.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const BottomNav = ({ navigation, activeRoute }) => {
  const navItems = [
    { name: "Home", icon: "🏠", label: "Inicio" },
    { name: "Products", icon: "📱", label: "Catálogo" },
    { name: "Cart", icon: "🛒", label: "Carrito" },
    { name: "Orders", icon: "📦", label: "Pedidos" },
  ];

  return (
    <View style={styles.navContainer}>
        <View style={styles.glassNav}>
        {navItems.map((item) => {
            const isActive = activeRoute === item.name;
            return (
                <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => navigation.navigate(item.name)}
                >
                <Text style={[styles.navIcon, isActive && styles.navIconActive]}>
                    {item.icon}
                </Text>
                {isActive && <View style={styles.activeDot} />}
                </TouchableOpacity>
            );
        })}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HERO.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: HERO.background,
  },
  ambientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowOrb: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    opacity: 0.15, // Sutil
  },

  heroContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: HERO.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D8B4FE',
  },
  topIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: HERO.card,
    borderWidth: 1,
    borderColor: HERO.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18 },
  
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  heroTextContainer: { flex: 1, paddingRight: 10 },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: HERO.text,
    lineHeight: 38,
    marginBottom: 8,
  },
  heroTitleGradient: { color: '#C084FC' },
  heroSubtitle: {
    fontSize: 14,
    color: HERO.textMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  heroCtaWrapper: {
    alignSelf: 'flex-start',
    shadowColor: HERO.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 99,
  },
  heroButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 6,
  },
  heroButtonArrow: { color: 'white', fontSize: 16 },
  
  heroImageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: HERO.primary,
    borderRadius: 50,
    opacity: 0.3,
    filter: 'blur(20px)',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  glassStatsBar: {
    flexDirection: 'row',
    backgroundColor: HERO.card,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: HERO.cardBorder,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center' },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: HERO.text,
  },
  statLabel: {
    fontSize: 11,
    color: HERO.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: HERO.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: HERO.textMuted,
  },
  seeAllText: {
    fontSize: 14,
    color: '#D8B4FE',
    fontWeight: '600',
  },
  productList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: HERO.textMuted,
  },

  cardWrapper: {
    width: CARD_WIDTH,
  },
  glassCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HERO.cardBorder,
    overflow: 'hidden',
  },
  imageContainer: {
    height: CARD_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: { width: '100%', height: '100%' },
  placeholderImage: { alignItems: 'center', justifyContent: 'center' },
  stockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  cardContent: { padding: 12 },
  brandText: {
    fontSize: 10,
    color: HERO.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 13,
    color: HERO.text,
    fontWeight: '600',
    marginBottom: 8,
    height: 36,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: HERO.text,
  },

  navContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  glassNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 24, 27, 0.85)', // Zinc-900 casi opaco
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  activeDot: {
    width: 4,
    height: 4,
    backgroundColor: HERO.primary,
    borderRadius: 2,
    marginTop: 4,
  },
});