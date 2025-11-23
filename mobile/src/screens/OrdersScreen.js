import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { ordersAPI } from "../services/api";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";

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
      case "pending":
        return COLORS.warning;
      case "confirmed":
        return COLORS.info;
      case "shipped":
        return COLORS.purpleLight;
      case "delivered":
        return COLORS.success;
      case "cancelled":
        return COLORS.error;
      default:
        return COLORS.textMuted;
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

  /* ====== CARD DE PEDIDO ====== */

  const renderOrder = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("OrderDetail", { orderId: item.id })
        }
        style={styles.orderCardWrapper}
      >
        <LinearGradient
          colors={["rgba(15,23,42,0.98)", "rgba(15,23,42,0.95)"]}
          style={styles.orderCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* franja de estado a la izquierda */}
          <View
            style={[styles.statusStripe, { backgroundColor: statusColor }]}
          />

          <View style={styles.orderContent}>
            {/* header: número + fecha */}
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>
                  Pedido #{item.order_number}
                </Text>
                <Text style={styles.orderDate}>
                  {new Date(item.created_at).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* fila de productos + total (sin estado) */}
            <View style={styles.orderDetailsRow}>
              <View style={styles.infoBlockLeft}>
                <Text style={styles.infoLabel}>Productos</Text>
                <Text style={styles.infoValue}>
                  {item.items.length} producto
                  {item.items.length !== 1 ? "s" : ""}
                </Text>
              </View>

              <View style={styles.infoBlockRight}>
                <Text style={styles.infoLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${item.total.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* fila inferior: dirección + ESTADO (a la misma altura) */}
            {item.shipping_address ? (
              <View style={styles.bottomRow}>
                <View style={styles.addressContainer}>
                  <Text style={styles.addressIcon}>📍</Text>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {item.shipping_address}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadgeBottom,
                    { backgroundColor: `${statusColor}22` },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDotBottom,
                      { backgroundColor: statusColor },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusTextBottom,
                      { color: statusColor },
                    ]}
                    numberOfLines={1}
                  >
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  /* ====== HEADER (HERO) ====== */

  const renderHeader = () => (
    <View>
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
            <Text style={styles.iconText}>🏠</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mis pedidos</Text>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroTextWrapper}>
          <Text style={styles.heroSubtitle}>
            Revisa el estado y el historial de tus compras.
          </Text>
        </View>

        <View style={styles.heroStepRow}>
          <Text style={styles.heroStepText}>Historial de compras</Text>
        </View>
      </LinearGradient>

      {/* resumen bajo el hero */}
      <View style={styles.summaryWrapper}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Pedidos</Text>
            <Text style={styles.summaryValue}>{totalOrders}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Pendientes</Text>
            <Text style={styles.summaryValue}>{pendingOrders}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Gastado</Text>
            <Text style={styles.summaryHighlight}>
              ${totalSpent.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* título de sección */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Últimos pedidos</Text>
        {totalOrders > 0 && (
          <Text style={styles.sectionSubtitle}>
            Arrastra hacia abajo para actualizar
          </Text>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View className="circle">
        <View style={styles.emptyIconCircle}>
          <Text style={styles.emptyIcon}>📦</Text>
        </View>
      </View>
      <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
      <Text style={styles.emptyText}>
        Cuando realices una compra, podrás ver el estado de tus pedidos aquí.
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
          <Text style={styles.shopButtonText}>Ir al catálogo</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.purpleStart} />
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
              tintColor={COLORS.purpleStart}
              colors={[COLORS.purpleStart]}
            />
          }
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* bottom nav */}
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
          <Text style={styles.navIconActive}>📦</Text>
          <Text style={styles.navTextActive}>Pedidos</Text>
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
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================== STYLES ================== */

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
  iconText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY["2xl"],
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  heroTextWrapper: {
    marginTop: SPACING.md,
  },
  heroSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  heroStepRow: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  heroStepText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.purpleLight,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  /* RESUMEN */
  summaryWrapper: {
    marginTop: SPACING.md,             // ya NO solapado, más aire
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING["2xl"],      // espacio grande antes de "Últimos pedidos"
  },
  summaryCard: {
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
  summaryColumn: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  summaryHighlight: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.purpleLight,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(148,163,184,0.4)",
  },

  /* SECCIÓN LISTA */
  sectionHeader: {
    paddingHorizontal: SPACING.xl,
    marginTop: 0,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  /* LISTA / CARDS */
  listContent: {
    paddingBottom: 110,
  },
  orderCardWrapper: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  orderCard: {
    flexDirection: "row",
    borderRadius: BORDER_RADIUS["2xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
  },
  statusStripe: {
    width: 4,
  },
  orderContent: {
    flex: 1,
    padding: SPACING.md,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  orderNumber: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
  },
  orderDate: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(148,163,184,0.35)",
    marginVertical: SPACING.sm,
  },
  orderDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  infoBlockLeft: {
    flex: 1,
  },
  infoBlockRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.medium,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.purpleLight,
    fontWeight: TYPOGRAPHY.bold,
  },

  /* FILA INFERIOR: DIRECCIÓN + ESTADO */
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  addressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.9)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
  },
  addressIcon: {
    fontSize: 12,
    marginRight: SPACING.xs,
  },
  addressText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    flex: 1,
  },
  statusBadgeBottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  statusDotBottom: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusTextBottom: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: "uppercase",
  },

  /* EMPTY */
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: SPACING["2xl"],
    paddingTop: SPACING["4xl"],
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
    fontSize: TYPOGRAPHY["2xl"],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING["2xl"],
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
