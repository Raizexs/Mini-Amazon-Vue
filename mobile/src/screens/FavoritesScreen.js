import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../contexts/FavoritesContext';
import { API_URL } from '../services/api';
import { getImage } from '../public/images';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite, loadFavorites, loading } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const removeFavorite = (item) => {
    toggleFavorite(item);
  };

  const renderItem = ({ item }) => {
    // The API might return the product object nested or directly
    // Adjust based on your actual API response structure for favorites
    // Assuming item structure: { id: 1, product: { ... } } or similar
    // If the API returns a list of products directly, use item
    const product = item.product || item; 
    
    const imageUrl = product.imagenes && product.imagenes.length > 0 
      ? getImage(product.imagenes[0]) 
      : null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFavorite(item.id)}
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>{product.titulo}</Text>
          <Text style={styles.price}>${product.precio?.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Text style={styles.emptyIcon}>❤️</Text>
      </View>
      <Text style={styles.emptyTitle}>Sin favoritos</Text>
      <Text style={styles.emptyText}>
        Guarda los productos que más te gusten para encontrarlos fácilmente.
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate("Products")}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.purpleStart, COLORS.purpleEnd]}
          style={styles.shopButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.shopButtonText}>Explorar productos</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />
      
      <LinearGradient
        colors={['rgba(102,126,234,0.35)', 'rgba(118,75,162,0.35)']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircle}>
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favoritos</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </LinearGradient>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.purpleStart} />
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.purpleStart}
              colors={[COLORS.purpleStart]}
            />
          }
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Products")}>
          <Text style={styles.navIcon}>📱</Text>
          <Text style={styles.navText}>Productos</Text>
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
          <Text style={styles.navIconActive}>❤️</Text>
          <Text style={styles.navTextActive}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.35)',
    marginBottom: SPACING.md,
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
    backgroundColor: 'rgba(15,23,42,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
  },
  iconText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  imageContainer: {
    height: CARD_WIDTH,
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: 4,
    height: 36,
  },
  price: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.purpleLight,
    fontWeight: TYPOGRAPHY.bold,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['4xl'],
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(148,163,184,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING['2xl'],
    textAlign: "center",
    lineHeight: 20,
  },
  shopButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
    minWidth: 200,
  },
  shopButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
  },
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
