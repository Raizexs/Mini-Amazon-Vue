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
  Image
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { productsAPI, categoriesAPI, API_URL } from "../services/api";
import { getImage } from '../public/images';
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from "../constants/theme";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

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

  const selectedCategoryObj = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)
    : null;
  const selectedCategoryName = selectedCategoryObj?.name || "Todas";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />
      
      {/* HERO HEADER */}
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.35)', 'rgba(118, 75, 162, 0.35)']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.iconText}>🛒</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroTextWrapper}>
          <Text style={styles.headerEyebrow}>Explora</Text>
          <Text style={styles.headerTitle}>Catálogo</Text>
          <Text style={styles.headerSubtitle}>
            Encuentra el producto perfecto para ti
          </Text>
        </View>

        {/* Search in hero */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIconText}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              placeholderTextColor={COLORS.textMuted}
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

        {/* Hero meta */}
        <View style={styles.heroMetaCard}>
          <View style={styles.heroMetaItem}>
            <Text style={styles.heroMetaLabel}>Resultados</Text>
            <Text style={styles.heroMetaValue}>{products.length}</Text>
          </View>

          <View style={styles.heroMetaDivider} />

          <View style={styles.heroMetaItem}>
            <Text style={styles.heroMetaLabel}>Categoría</Text>
            <Text
              style={styles.heroMetaValue}
              numberOfLines={1}
            >
              {selectedCategoryName}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, name: "Todos" }, ...categories]}
          keyExtractor={(item) => item.id?.toString() || "all"}
          renderItem={({ item, index }) => (
            <CategoryChip
              item={item}
              index={index}
              isSelected={selectedCategory === item.id}
              onPress={() => filterByCategory(item.id)}
            />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.purpleStart} />
        </View>
      ) : (
        <FlatList
          data={products}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No se encontraron productos</Text>
              <TouchableOpacity style={styles.resetButton} onPress={onRefresh}>
                <Text style={styles.resetButtonText}>Reiniciar búsqueda</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Products")}>
          <Text style={styles.navIconActive}>📱</Text>
          <Text style={styles.navTextActive}>Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navText}>Carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Orders")}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Favorites")}>
          <Text style={styles.navIcon}>❤️</Text>
          <Text style={styles.navText}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* CATEGORY CHIP */

const CategoryChip = ({ item, index, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={
            isSelected
              ? [COLORS.purpleStart, COLORS.purpleEnd]
              : ['rgba(15,15,30,0.95)', 'rgba(15,23,42,0.95)']
          }
          style={styles.categoryChipGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
            {item.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

/* PRODUCT CARD */

const ProductCard = ({ item, index, onPress }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const isFav = isFavorite(item.id);

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
      })
    ]).start();
  }, []);

  const isOutOfStock = item.stock === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(item, 1);
    }
  };

  const imageUrl = item.imagenes && item.imagenes.length > 0 
    ? getImage(item.imagenes[0]) 
    : null;

  return (
    <Animated.View
      style={[
        styles.productCardWrapper,
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
      ]}
    >
      <TouchableOpacity
        style={styles.productCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.productImagePlaceholder}>
          {imageUrl ? (
            <Image
              source={imageUrl}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={['rgba(15,23,42,0.9)', 'rgba(30,64,175,0.7)']}
              style={styles.productImageGradient}
            >
              <Text style={styles.productImageText}>📦</Text>
            </LinearGradient>
          )}

          {/* Stock Badge */}
          <View style={[styles.stockBadge, isOutOfStock ? styles.stockBadgeOut : styles.stockBadgeIn]}>
            <Text style={styles.stockBadgeText}>
              {isOutOfStock ? 'Sin stock' : 'En stock'}
            </Text>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.favoriteIcon, isFav && styles.favoriteIconActive]}>
              {isFav ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productBrand} numberOfLines={1}>{item.marca}</Text>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          
          <Text style={styles.productPrice}>
            ${item.precio.toLocaleString()}
          </Text>

          <TouchableOpacity 
            style={[styles.addToCartButton, isOutOfStock && styles.disabledButton]}
            onPress={handleAddToCart}
            disabled={isOutOfStock}
          >
            <Text style={[styles.addToCartText, isOutOfStock && styles.addToCartTextDisabled]}>
              {isOutOfStock ? 'Agotado' : 'Agregar'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
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

  /* HERO HEADER */
  header: {
    paddingTop: 60,
    paddingBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.35)',
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
    backgroundColor: 'rgba(15,23,42,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)',
  },
  iconText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
  },
  heroTextWrapper: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  headerEyebrow: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.purpleLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  headerSubtitle: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  /* Search inside hero */
  searchContainer: {
    marginTop: SPACING.xl,
    alignSelf: 'center',
    width: width * 0.9,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
  },
  searchIconText: {
    fontSize: TYPOGRAPHY.xl,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.white,
    paddingVertical: SPACING.xs,
  },
  clearIcon: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textMuted,
    padding: SPACING.xs,
  },

  /* Hero meta */
  heroMetaCard: {
    marginTop: SPACING.lg,
    alignSelf: 'center',
    width: width * 0.9,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMetaItem: {
    flex: 1,
  },
  heroMetaLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  heroMetaValue: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  heroMetaDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(148,163,184,0.35)',
    marginHorizontal: SPACING.lg,
  },

  /* Categories */
  categoriesContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
  categoryChip: {
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
  },
  categoryChipGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  categoryChipActive: {
    borderColor: COLORS.purpleLight,
  },
  categoryChipText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.medium,
  },
  categoryChipTextActive: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
  },

  /* Products grid */
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
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
  },
  productImagePlaceholder: {
    height: CARD_WIDTH,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageText: {
    fontSize: 40,
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stockBadgeIn: {
    backgroundColor: 'rgba(16,185,129,0.18)',
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  stockBadgeOut: {
    backgroundColor: 'rgba(239,68,68,0.18)',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  stockBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  favoriteIcon: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
  favoriteIconActive: {
    opacity: 1,
    textShadowColor: 'rgba(236, 72, 153, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  productInfo: {
    padding: SPACING.md,
  },
  productBrand: {
    fontSize: 10,
    color: COLORS.purpleLight,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
    minHeight: 36,
  },
  productPrice: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  addToCartText: {
    color: COLORS.darkBg,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  addToCartTextDisabled: {
    color: COLORS.textMuted,
  },

  /* Empty state */
  emptyContainer: {
    padding: SPACING['4xl'],
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: COLORS.purpleStart,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
  },

  /* Bottom nav */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: 'rgba(15, 15, 30, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
