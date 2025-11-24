import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Dimensions,
  Animated,
  StatusBar,
  Image,
  Platform
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { productsAPI, categoriesAPI } from "../services/api";
import { getImage } from '../public/images';
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";

const { width, height } = Dimensions.get('window');

// 🎨 HERO UI THEME (Definición Local para consistencia exacta)
const HERO = {
  background: '#09090b', // Zinc-950
  card: 'rgba(39, 39, 42, 0.4)', // Glass bg
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#7828C8',
  primaryGradient: ['#7828C8', '#9333EA'],
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  success: '#17C964',
  danger: '#F31260',
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 }
};

// Cálculo preciso para Grid con hueco central
const GAP = 12;
const PADDING_H = 20;
const CARD_WIDTH = (width - (PADDING_H * 2) - GAP) / 2;

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getProducts({ limit: 50 }),
        categoriesAPI.getCategories(),
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialData();
      return;
    }
    try {
      setLoading(true);
      const results = await productsAPI.searchProducts(searchQuery);
      setProducts(results);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      setLoading(true);
      const category = categories.find(cat => cat.id === categoryId);
      const params = category ? { categoria: category.name } : {};
      const results = await productsAPI.getProducts(params);
      setProducts(results);
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchQuery("");
    setSelectedCategory(null);
    await loadInitialData();
    setRefreshing(false);
  };

  const renderProduct = ({ item, index }) => (
    <ProductCard
      item={item}
      index={index}
      onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. AMBIENT LIGHTING (Orbs de fondo) */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -80, left: -50, backgroundColor: '#4c1d95' }]} />
        <View style={[styles.glowOrb, { top: height * 0.2, right: -80, backgroundColor: '#1e3a8a' }]} />
        <View style={[styles.glowOrb, { bottom: 0, left: width * 0.2, backgroundColor: '#312e81', opacity: 0.1 }]} />
      </View>

      <View style={styles.safeArea}>
        {/* HEADER FLOTANTE MINIMALISTA */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerSubtitle}>Explora</Text>
              <Text style={styles.headerTitle}>Catálogo</Text>
            </View>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.iconText}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("Cart")}>
                    <Text style={styles.iconText}>🛒</Text>
                </TouchableOpacity>
            </View>
          </View>

          {/* SEARCH BAR (Glass Capsule) */}
          <View style={styles.searchWrapper}>
            <View style={styles.glassSearch}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar productos..."
                    placeholderTextColor={HERO.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
          </View>

          {/* CATEGORIES (Clean Tabs) */}
          <View style={styles.categoriesWrapper}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[{ id: null, name: "Todo" }, ...categories]}
              keyExtractor={(item) => item.id?.toString() || "all"}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    selectedCategory === item.id && styles.categoryTabActive
                  ]}
                  onPress={() => filterByCategory(item.id)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === item.id && styles.categoryTextActive
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: PADDING_H, gap: 8 }}
            />
          </View>
        </View>

        {/* PRODUCTS GRID */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={HERO.primary} />
          </View>
        ) : (
          <FlatList
            data={products}
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
                progressViewOffset={20}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🕵️</Text>
                <Text style={styles.emptyText}>No encontramos resultados</Text>
                <TouchableOpacity style={styles.resetBtn} onPress={onRefresh}>
                    <Text style={styles.resetText}>Ver todo</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

      {/* FLOATING BOTTOM DOCK */}
      <BottomDock navigation={navigation} activeRoute="Products" />
    </View>
  );
}

/* 🎨 PRODUCT CARD (Glassmorphism) */
const ProductCard = ({ item, index, onPress }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(item.id);
  const isOutOfStock = item.stock === 0;

  // Animación de entrada sutil
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true
    }).start();
  }, []);

  const handleAddToCart = () => {
    if (!isOutOfStock) addToCart(item, 1);
  };

  const imageUrl = item.imagenes && item.imagenes.length > 0 ? getImage(item.imagenes[0]) : null;

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: opacityAnim }]}>
      <TouchableOpacity style={styles.glassCard} onPress={onPress} activeOpacity={0.85}>
        
        {/* IMAGE AREA */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderBg}><Text>📦</Text></View>
          )}
          
          {/* Status Badge */}
          {isOutOfStock && (
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>AGOTADO</Text>
            </View>
          )}

          {/* Fav Button (Floating) */}
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(item)}>
             <Text style={{ fontSize: 14 }}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* DETAILS AREA */}
        <View style={styles.details}>
          <Text style={styles.brand} numberOfLines={1}>{item.marca}</Text>
          <Text style={styles.title} numberOfLines={2}>{item.titulo}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.precio.toLocaleString()}</Text>
            
            {/* Add Button (Mini Gradient) */}
            <TouchableOpacity 
                disabled={isOutOfStock}
                onPress={handleAddToCart}
                style={[styles.addBtn, isOutOfStock && { opacity: 0.5 }]}
            >
                <LinearGradient
                    colors={HERO.primaryGradient}
                    style={styles.addBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.addBtnText}>+</Text>
                </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

/* 🚤 FLOATING BOTTOM DOCK */
const BottomDock = ({ navigation, activeRoute }) => {
    const items = [
        { name: "Home", icon: "🏠" },
        { name: "Products", icon: "📱" },
        { name: "Cart", icon: "🛒" },
        { name: "Favorites", icon: "❤️" },
    ];

    return (
        <View style={styles.dockContainer}>
            <View style={styles.glassDock}>
                {items.map((item) => {
                    const isActive = activeRoute === item.name;
                    return (
                        <TouchableOpacity 
                            key={item.name} 
                            style={styles.dockItem}
                            onPress={() => navigation.navigate(item.name)}
                        >
                            <Text style={[styles.dockIcon, isActive && styles.dockIconActive]}>
                                {item.icon}
                            </Text>
                            {isActive && <View style={styles.dockDot} />}
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
  ambientContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  glowOrb: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width,
    opacity: 0.15,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
  },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* --- HEADER --- */
  header: { marginBottom: 10 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING_H,
    marginBottom: 16,
  },
  headerSubtitle: { color: HERO.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  headerTitle: { color: HERO.text, fontSize: 28, fontWeight: '800' },
  headerActions: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: HERO.card, borderWidth: 1, borderColor: HERO.cardBorder,
    alignItems: 'center', justifyContent: 'center'
  },
  iconText: { color: HERO.text, fontSize: 16 },

  /* --- SEARCH --- */
  searchWrapper: { paddingHorizontal: PADDING_H, marginBottom: 16 },
  glassSearch: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: HERO.radius.full,
    borderWidth: 1, borderColor: HERO.cardBorder,
    paddingHorizontal: 16, height: 46,
  },
  searchIcon: { marginRight: 10, opacity: 0.5 },
  searchInput: { flex: 1, color: HERO.text, fontSize: 15 },
  clearIcon: { color: HERO.textMuted, fontSize: 16 },

  /* --- CATEGORIES --- */
  categoriesWrapper: { marginBottom: 10 },
  categoryTab: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: HERO.radius.full,
    borderWidth: 1, borderColor: 'transparent',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(120, 40, 200, 0.15)',
    borderColor: HERO.primary,
  },
  categoryText: { color: HERO.textMuted, fontWeight: '600' },
  categoryTextActive: { color: '#D8B4FE', fontWeight: '700' },

  /* --- LIST & GRID --- */
  productList: {
    paddingHorizontal: PADDING_H,
    paddingTop: 10,
    paddingBottom: 100, // Space for Dock
  },
  row: { justifyContent: 'space-between', marginBottom: GAP },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: HERO.textMuted, fontSize: 16 },
  resetBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: HERO.card, borderRadius: 20 },
  resetText: { color: HERO.text },

  /* --- PRODUCT CARD --- */
  cardWrapper: { width: CARD_WIDTH },
  glassCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.4)',
    borderRadius: HERO.radius.lg,
    borderWidth: 1, borderColor: HERO.cardBorder,
    overflow: 'hidden',
  },
  imageContainer: {
    height: CARD_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'relative',
  },
  productImage: { width: '100%', height: '100%' },
  placeholderBg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  statusBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4
  },
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  favBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)' // Web only, fallback is bg color
  },

  details: { padding: 12 },
  brand: { fontSize: 10, color: HERO.textMuted, fontWeight: '700', marginBottom: 2, textTransform: 'uppercase' },
  title: { fontSize: 13, color: HERO.text, fontWeight: '600', height: 36, marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 15, color: HERO.text, fontWeight: '700' },
  
  addBtn: { width: 28, height: 28, borderRadius: 14, overflow: 'hidden' },
  addBtnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: 'white', fontSize: 16, fontWeight: '500', marginTop: -2 },

  /* --- DOCK --- */
  dockContainer: {
    position: 'absolute', bottom: 20, left: 0, right: 0,
    alignItems: 'center',
  },
  glassDock: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    borderRadius: 24,
    paddingHorizontal: 24, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
    gap: 32
  },
  dockItem: { alignItems: 'center', justifyContent: 'center' },
  dockIcon: { fontSize: 22, opacity: 0.5 },
  dockIconActive: { opacity: 1, transform: [{ scale: 1.1 }] },
  dockDot: { width: 4, height: 4, backgroundColor: HERO.primary, borderRadius: 2, position: 'absolute', bottom: -6 }
});