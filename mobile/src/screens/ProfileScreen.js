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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";

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

  const MenuItem = ({ icon, title, onPress, subtitle }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.02)"]}
        style={styles.menuItemGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.menuIconContainer}>
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <Text style={styles.menuArrow}>→</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const StatItem = ({ label, value }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const displayName =
    user?.full_name || user?.name || user?.email?.split("@")[0] || "Usuario";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <LinearGradient
          colors={["rgba(102,126,234,0.35)", "rgba(118,75,162,0.35)"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.iconEmoji}>🏠</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.navigate("Cart")}
            >
              <Text style={styles.iconEmoji}>🛒</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {displayName?.[0]?.toUpperCase() || "👤"}
                  </Text>
                )}
              </View>
            </View>

            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Miembro Gold</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.9}
              onPress={() =>
                Alert.alert("Próximamente", "Edición de perfil en desarrollo")
              }
            >
              <LinearGradient
                colors={[COLORS.purpleStart, COLORS.purpleEnd]}
                style={styles.editButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.editButtonText}>Editar perfil</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* CARD DE STATS BAJO EL HERO */}
        <View style={styles.statsWrapper}>
          <View style={styles.statsCard}>
            <StatItem label="Nivel" value="Gold" />
            <View style={styles.statDivider} />
            <StatItem label="Seguridad" value="Protegido" />
            <View style={styles.statDivider} />
            <StatItem label="Soporte" value="24/7" />
          </View>
        </View>

        {/* SECCIONES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis compras</Text>
          <MenuItem
            icon="📦"
            title="Mis pedidos"
            subtitle="Rastrea y revisa tu historial"
            onPress={() => navigation.navigate("Orders")}
          />
          <MenuItem
            icon="❤️"
            title="Favoritos"
            subtitle="Productos guardados"
            onPress={() => navigation.navigate("Favorites")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <MenuItem
            icon="📍"
            title="Direcciones"
            subtitle="Gestiona tus direcciones de envío"
            onPress={() =>
              Alert.alert("Próximamente", "Función en desarrollo")
            }
          />
          <MenuItem
            icon="💳"
            title="Métodos de pago"
            subtitle="Tarjetas y otros métodos"
            onPress={() =>
              Alert.alert("Próximamente", "Función en desarrollo")
            }
          />
          <MenuItem
            icon="⚙️"
            title="Preferencias"
            subtitle="Notificaciones y privacidad"
            onPress={() =>
              Alert.alert("Próximamente", "Función en desarrollo")
            }
          />
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["rgba(239,68,68,0.15)", "rgba(239,68,68,0.05)"]}
            style={styles.signOutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Mini Amazon v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={styles.navIcon}>📱</Text>
          <Text style={styles.navText}>Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navText}>Carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Orders")}
        >
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Text style={styles.navIcon}>❤️</Text>
          <Text style={styles.navText}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.navIconActive}>👤</Text>
          <Text style={styles.navTextActive}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ========== STYLES ========== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  /* HERO */
  header: {
    paddingTop: 60,
    paddingBottom: SPACING["2xl"],
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.35)",
  },
  headerTopRow: {
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
  iconEmoji: {
    fontSize: TYPOGRAPHY.lg,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  avatarWrapper: {
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(15,23,42,0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 40,
    color: COLORS.white,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  userName: {
    fontSize: TYPOGRAPHY["2xl"],
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
    marginTop: 2,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.sm,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  badgeText: {
    color: "#FFD700",
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  editButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
  },
  editButtonGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    textAlign: "center",
  },

  /* STATS CARD */
  statsWrapper: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING["3xl"],
  },
  statsCard: {
    borderRadius: BORDER_RADIUS["2xl"],
    backgroundColor: "rgba(15,23,42,0.98)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.45)",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: 2,
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(148,163,184,0.4)",
  },

  /* SECCIONES Y MENÚS */
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING["2xl"],
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  menuItem: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
  },
  menuItemGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.medium,
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 18,
    color: COLORS.textDark,
  },

  /* SIGN OUT */
  signOutButton: {
    marginHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
    marginBottom: SPACING.lg,
  },
  signOutGradient: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  signOutButtonText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
  },

  versionContainer: {
    alignItems: "center",
    marginBottom: SPACING["2xl"],
  },
  versionText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textDark,
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
