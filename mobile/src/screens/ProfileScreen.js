import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Image,
  Dimensions,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
// Mantengo tus imports
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from "../constants/theme";

const { width, height } = Dimensions.get('window');

// 🎨 HERO UI THEME
const HERO = {
  background: '#09090b', // Zinc-950
  glass: 'rgba(39, 39, 42, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#7828C8',
  primaryGradient: ['#7828C8', '#9333EA'],
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  danger: '#F31260',
  radius: 20,
};

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert("Error", "No se pudo cerrar sesión");
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, title, subtitle, onPress, isDestructive }) => (
    <TouchableOpacity 
      style={styles.menuItemWrapper} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={[styles.menuItemGlass, isDestructive && { borderColor: 'rgba(243,18,96,0.2)', backgroundColor: 'rgba(243,18,96,0.05)' }]}>
        <View style={[styles.iconContainer, isDestructive && { backgroundColor: 'rgba(243,18,96,0.1)' }]}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, isDestructive && { color: HERO.danger }]}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.arrowContainer}>
           <Text style={{ color: isDestructive ? HERO.danger : HERO.textMuted, fontSize: 18 }}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const StatBadge = ({ label, value }) => (
    <View style={styles.statBadge}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const displayName = user?.full_name || user?.name || user?.email?.split("@")[0] || "Usuario";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. AMBIENT LIGHTING */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -80, right: -50, backgroundColor: '#4c1d95' }]} />
        <View style={[styles.glowOrb, { top: height * 0.3, left: -80, backgroundColor: '#1e3a8a' }]} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER PROFILE */}
        <View style={styles.headerContainer}>
           {/* Top Bar */}
           <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.glassIconBtn}>
                 <Text style={{fontSize: 18}}>🏠</Text>
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Mi Perfil</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.glassIconBtn}>
                 <Text style={{fontSize: 18}}>🛒</Text>
              </TouchableOpacity>
           </View>

           {/* Avatar & Info */}
           <View style={styles.profileInfo}>
              <View style={styles.avatarRing}>
                 {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                 ) : (
                    <View style={styles.avatarPlaceholder}>
                       <Text style={styles.avatarInitial}>{displayName?.[0]?.toUpperCase()}</Text>
                    </View>
                 )}
                 <View style={styles.editBadge}>
                    <Text style={{fontSize: 10}}>✏️</Text>
                 </View>
              </View>
              
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              
              <View style={styles.membershipTag}>
                 <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.membershipGradient}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                 >
                    <Text style={styles.membershipText}>MIEMBRO GOLD ✨</Text>
                 </LinearGradient>
              </View>
           </View>

           {/* Stats Card Floating */}
           <View style={styles.statsFloating}>
              <StatBadge label="Nivel" value="Gold" />
              <View style={styles.vDivider} />
              <StatBadge label="Seguridad" value="Alta" />
              <View style={styles.vDivider} />
              <StatBadge label="Soporte" value="24/7" />
           </View>
        </View>

        {/* SECTIONS */}
        <View style={styles.sectionContainer}>
           <Text style={styles.sectionTitle}>Mis Compras</Text>
           <MenuItem 
              icon="📦" 
              title="Mis Pedidos" 
              subtitle="Rastrea tus envíos recientes" 
              onPress={() => navigation.navigate("Orders")} 
           />
           <MenuItem 
              icon="❤️" 
              title="Favoritos" 
              subtitle="Productos que te encantan" 
              onPress={() => navigation.navigate("Favorites")} 
           />
        </View>

        <View style={styles.sectionContainer}>
           <Text style={styles.sectionTitle}>Configuración</Text>
           <MenuItem 
              icon="📍" 
              title="Direcciones" 
              subtitle="Gestiona tus lugares de entrega" 
              onPress={() => Alert.alert("Próximamente")} 
           />
           <MenuItem 
              icon="💳" 
              title="Métodos de Pago" 
              subtitle="Tarjetas y cuentas vinculadas" 
              onPress={() => Alert.alert("Próximamente")} 
           />
           <MenuItem 
              icon="🛡️" 
              title="Seguridad" 
              subtitle="Contraseña y autenticación" 
              onPress={() => Alert.alert("Próximamente")} 
           />
        </View>

        {/* SIGN OUT */}
        <View style={[styles.sectionContainer, { marginBottom: 40 }]}>
           <MenuItem 
              icon="🚪" 
              title="Cerrar Sesión" 
              subtitle="Salir de tu cuenta actual" 
              onPress={handleSignOut}
              isDestructive
           />
        </View>

        <Text style={styles.versionText}>Mini Amazon v2.0.0 • Hero UI</Text>
        <View style={{height: 100}} /> 
      </ScrollView>

      {/* BOTTOM DOCK */}
      <BottomDock navigation={navigation} activeRoute="Profile" />
    </View>
  );
}

/* 🚤 FLOATING DOCK */
const BottomDock = ({ navigation, activeRoute }) => {
    const items = [
        { name: "Home", icon: "🏠" },
        { name: "Products", icon: "📱" },
        { name: "Cart", icon: "🛒" },
        { name: "Profile", icon: "👤" },
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
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  glassIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  screenTitle: { color: HERO.text, fontSize: 16, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },

  profileInfo: { alignItems: 'center', marginBottom: 30 },
  avatarRing: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    padding: 4, marginBottom: 16,
    position: 'relative',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  avatarPlaceholder: {
    width: '100%', height: '100%', borderRadius: 50,
    backgroundColor: 'rgba(120, 40, 200, 0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { fontSize: 40, color: 'white', fontWeight: 'bold' },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: HERO.background,
    padding: 6, borderRadius: 20,
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  userName: { color: HERO.text, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  userEmail: { color: HERO.textMuted, fontSize: 14, marginBottom: 16 },
  membershipTag: { borderRadius: 12, overflow: 'hidden' },
  membershipGradient: { paddingHorizontal: 12, paddingVertical: 4 },
  membershipText: { color: 'black', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

  /* --- STATS FLOATING --- */
  statsFloating: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 24, 27, 0.6)', // Semi-transparent black
    borderRadius: 20,
    padding: 16,
    borderWidth: 1, borderColor: HERO.glassBorder,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBadge: { alignItems: 'center' },
  statValue: { color: HERO.text, fontSize: 16, fontWeight: '700' },
  statLabel: { color: HERO.textMuted, fontSize: 11, textTransform: 'uppercase', marginTop: 2 },
  vDivider: { width: 1, height: 24, backgroundColor: HERO.glassBorder },

  /* --- SECTIONS & MENU --- */
  sectionContainer: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { color: HERO.text, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  
  menuItemWrapper: { marginBottom: 12 },
  menuItemGlass: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  iconContainer: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { color: HERO.text, fontSize: 15, fontWeight: '600', marginBottom: 2 },
  menuSubtitle: { color: HERO.textMuted, fontSize: 12 },
  arrowContainer: { opacity: 0.5 },

  versionText: { textAlign: 'center', color: HERO.textMuted, fontSize: 12, opacity: 0.5 },

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