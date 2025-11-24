import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../contexts/FavoritesContext';
import { getImage } from '../public/images';
// Mantenemos tus imports, pero usaremos el tema HERO para el estilo visual
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');
// Cálculo preciso para Grid con hueco central (igual que en ProductsScreen)
const GAP = 12;
const PADDING_H = 20;
const CARD_WIDTH = (width - (PADDING_H * 2) - GAP) / 2;

// 🎨 HERO UI THEME (Local)
const HERO = {
  background: '#09090b', // Zinc-950
  glass: 'rgba(39, 39, 42, 0.4)', // Glass dark
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#7828C8',
  primaryGradient: ['#7828C8', '#9333EA'],
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  danger: '#F31260',
  radius: 16,
};

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

  const renderItem = ({ item, index }) => {
    const product = item.product || item; 
    return (
      <FavoriteCard 
        item={product} 
        index={index} 
        onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
        onRemove={() => removeFavorite(item.id)} // Pasamos el ID correcto para eliminar
      />
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Text style={{ fontSize: 50 }}>❤️</Text>
      </View>
      <Text style={styles.emptyTitle}>Sin favoritos</Text>
      <Text style={styles.emptyText}>
        Guarda los productos que más te gusten para encontrarlos fácilmente.
      </Text>
      <TouchableOpacity
        style={styles.shopBtn}
        onPress={() => navigation.navigate("Products")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={HERO.primaryGradient}
          style={styles.btnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.btnText}>Explorar productos</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. AMBIENT LIGHTING */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -50, left: -50, backgroundColor: '#4c1d95' }]} />
        <View style={[styles.glowOrb, { bottom: height * 0.3, right: -80, backgroundColor: '#1e3a8a' }]} />
      </View>

      {/* HEADER */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Text style={styles.iconText}>←</Text>
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Favoritos</Text>
         <View style={{width: 40}} /> 
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={HERO.primary} />
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
              tintColor={HERO.primary}
              colors={[HERO.primary]}
              progressViewOffset={20}
            />
          }
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* BOTTOM DOCK */}
      <BottomDock navigation={navigation} activeRoute="Favorites" />
    </View>
  );
}

// 🎨 FAVORITE CARD COMPONENT
const FavoriteCard = ({ item, index, onPress, onRemove }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: index * 80,
      useNativeDriver: true
    }).start();
  }, []);

  const imageUrl = item.imagenes && item.imagenes.length > 0 ? getImage(item.imagenes[0]) : null;

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: anim, transform: [{ scale: anim }] }]}>
      <TouchableOpacity style={styles.glassCard} onPress={onPress} activeOpacity={0.85}>
        
        {/* Image Area */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.itemImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}><Text>📦</Text></View>
          )}
          
          {/* Remove Button (Glass Floating) */}
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
             <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.cardContent}>
           <Text style={styles.itemTitle} numberOfLines={2}>{item.titulo}</Text>
           <Text style={styles.itemPrice}>${item.precio?.toLocaleString()}</Text>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

/* 🚤 FLOATING DOCK */
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
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
    marginBottom: 20,
  },
  headerTitle: { color: HERO.text, fontSize: 20, fontWeight: '700' },
  iconBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  iconText: { color: HERO.text, fontSize: 18 },

  /* --- LIST --- */
  listContent: {
    paddingHorizontal: PADDING_H,
    paddingBottom: 120, // Space for Dock
  },
  row: { justifyContent: 'space-between', marginBottom: GAP },
  
  /* --- CARD --- */
  cardWrapper: { width: CARD_WIDTH },
  glassCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.3)',
    borderRadius: HERO.radius,
    borderWidth: 1, borderColor: HERO.glassBorder,
    overflow: 'hidden',
  },
  imageContainer: {
    height: CARD_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'relative',
  },
  itemImage: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  removeBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(243, 18, 96, 0.8)', // Danger color with opacity
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
  },

  cardContent: { padding: 12 },
  itemTitle: { 
    color: HERO.text, 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 6, 
    height: 36 // 2 lines approx
  },
  itemPrice: { color: '#D8B4FE', fontSize: 15, fontWeight: '700' },

  /* --- EMPTY STATE --- */
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: HERO.glassBorder,
    marginBottom: 20,
  },
  emptyTitle: { color: HERO.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: HERO.textMuted, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  shopBtn: { width: '100%', height: 50, borderRadius: HERO.radius, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },

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