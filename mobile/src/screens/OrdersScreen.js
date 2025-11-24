import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { ordersAPI } from "../services/api";
// Mantenemos tus imports, pero usaremos el tema HERO para el estilo visual
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from "../constants/theme";

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
  warning: '#F5A524',
  danger: '#F31260',
  info: '#006FEE',
  radius: 16,
};

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await ordersAPI.getUserOrders();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return HERO.warning;
      case "confirmed": return HERO.info;
      case "shipped": return '#D8B4FE'; // Violeta claro
      case "delivered": return HERO.success;
      case "cancelled": return HERO.danger;
      default: return HERO.textMuted;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalSpent = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  /* ====== CARD DE PEDIDO (Hero UI) ====== */
  const renderOrder = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
        style={styles.cardWrapper}
      >
        <View style={styles.glassCard}>
          {/* Top Row: ID & Date */}
          <View style={styles.cardHeader}>
             <View>
                <Text style={styles.orderId}>#{item.order_number}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.created_at).toLocaleDateString("es-CL", { month: "short", day: "numeric" })}
                </Text>
             </View>
             <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, borderColor: `${statusColor}40` }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                   {getStatusText(item.status)}
                </Text>
             </View>
          </View>

          <View style={styles.divider} />

          {/* Middle Row: Details */}
          <View style={styles.cardBody}>
             <View>
                <Text style={styles.label}>Items</Text>
                <Text style={styles.value}>{item.items.length} producto(s)</Text>
             </View>
             <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.label}>Total</Text>
                <Text style={styles.totalValue}>${item.total.toLocaleString()}</Text>
             </View>
          </View>

          {/* Bottom Row: Address (Optional) */}
          {item.shipping_address && (
             <View style={styles.addressContainer}>
                <Text style={{fontSize: 12}}>📍</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                   {item.shipping_address}
                </Text>
             </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /* ====== HEADER SUMMARY ====== */
  const renderHeader = () => (
    <View>
       {/* Summary Card Floating */}
       <View style={styles.summaryContainer}>
          <View style={styles.glassSummary}>
             <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValue}>{totalOrders}</Text>
             </View>
             <View style={styles.vDivider} />
             <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Pendientes</Text>
                <Text style={styles.summaryValue}>{pendingOrders}</Text>
             </View>
             <View style={styles.vDivider} />
             <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Gastado</Text>
                <Text style={[styles.summaryValue, {color: '#D8B4FE'}]}>
                   ${(totalSpent/1000).toFixed(0)}k
                </Text>
             </View>
          </View>
       </View>

       <Text style={styles.sectionTitle}>Historial</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCircle}>
        <Text style={{fontSize: 40}}>📦</Text>
      </View>
      <Text style={styles.emptyTitle}>Sin pedidos</Text>
      <Text style={styles.emptyText}>Aún no has realizado ninguna compra.</Text>
      <TouchableOpacity
        style={styles.shopBtn}
        onPress={() => navigation.navigate("Products")}
      >
         <LinearGradient
            colors={HERO.primaryGradient}
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
         >
            <Text style={styles.btnText}>Ir a comprar</Text>
         </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. AMBIENT LIGHTING */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -50, right: -50, backgroundColor: '#4c1d95' }]} />
        <View style={[styles.glowOrb, { bottom: height * 0.2, left: -80, backgroundColor: '#1e3a8a' }]} />
      </View>

      {/* APP BAR */}
      <View style={styles.appBar}>
         <Text style={styles.appBarTitle}>Mis Pedidos</Text>
         <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate("Profile")}>
            <Text style={{fontSize: 18}}>👤</Text>
         </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={HERO.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
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
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* BOTTOM DOCK */}
      <BottomDock navigation={navigation} activeRoute="Orders" />
    </View>
  );
}

/* 🚤 FLOATING DOCK */
const BottomDock = ({ navigation, activeRoute }) => {
    const items = [
        { name: "Home", icon: "🏠" },
        { name: "Products", icon: "📱" },
        { name: "Cart", icon: "🛒" },
        { name: "Orders", icon: "📦" },
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

  /* --- APP BAR --- */
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  appBarTitle: {
    color: HERO.text,
    fontSize: 28,
    fontWeight: '800',
  },
  profileBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: HERO.glassBorder,
  },

  /* --- SUMMARY --- */
  summaryContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  glassSummary: {
    flexDirection: 'row',
    backgroundColor: HERO.glass,
    borderRadius: HERO.radius,
    padding: 16,
    borderWidth: 1, borderColor: HERO.glassBorder,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: { alignItems: 'center' },
  summaryLabel: { color: HERO.textMuted, fontSize: 12, marginBottom: 4 },
  summaryValue: { color: HERO.text, fontSize: 16, fontWeight: '700' },
  vDivider: { width: 1, height: 24, backgroundColor: HERO.glassBorder },

  sectionTitle: {
    paddingHorizontal: 24,
    color: HERO.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  /* --- LIST --- */
  listContent: {
    paddingBottom: 120, // Space for Dock
  },
  cardWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  glassCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.3)',
    borderRadius: HERO.radius,
    padding: 16,
    borderWidth: 1, borderColor: HERO.glassBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: { color: HERO.text, fontSize: 16, fontWeight: '700' },
  orderDate: { color: HERO.textMuted, fontSize: 12, marginTop: 2 },
  
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  divider: { height: 1, backgroundColor: HERO.glassBorder, marginVertical: 12 },

  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: { color: HERO.textMuted, fontSize: 11, textTransform: 'uppercase', marginBottom: 2 },
  value: { color: HERO.text, fontSize: 14 },
  totalValue: { color: '#D8B4FE', fontSize: 16, fontWeight: '700' },

  addressContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8, borderRadius: 8,
    gap: 6,
  },
  addressText: { color: HERO.textMuted, fontSize: 12, flex: 1 },

  /* --- EMPTY STATE --- */
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 40 },
  emptyCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, borderWidth: 1, borderColor: HERO.glassBorder
  },
  emptyTitle: { color: HERO.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: HERO.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  shopBtn: { width: '100%', height: 48, borderRadius: HERO.radius, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700' },

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