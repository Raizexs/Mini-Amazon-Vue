import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

import LOCALIDADES_DATA from '../public/data/localidades.json';

export default function CheckoutScreen({ navigation }) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [shippingMethod, setShippingMethod] = useState('domicilio');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === 'domicilio' ? 4990 : 0;
  const total = subtotal + shippingCost;

  /* ========== HELPERS DE INPUT / VALIDACIÓN ========== */

const handleInputChange = (field, value) => {
  // TELÉFONO
  if (field === 'phone') {
    // Deja solo dígitos
    let digits = value.replace(/[^\d]/g, '');

    // Máx 14 dígitos
    if (digits.length > 11) {
      digits = digits.slice(0, 11);
    }

    // Si no hay dígitos, deja vacío para poder borrar todo
    const newValue = digits ? `+${digits}` : '';

    setFormData(prev => ({ ...prev, phone: newValue }));
    return;
  }

  // CAMPOS CON LIMITE 30
  if (['firstName', 'lastName', 'address', 'email'].includes(field)) {
    const newValue = value.slice(0, 30);
    setFormData(prev => ({ ...prev, [field]: newValue }));
    return;
  }

  // Resto de campos (por si acaso)
  setFormData(prev => ({ ...prev, [field]: value }));
};


  const validateForm = () => {
    // Nombre / apellido / dirección / teléfono obligatorios
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.phone) {
      Alert.alert('Error', 'Nombre, apellido, dirección y teléfono son obligatorios.');
      return false;
    }

    // Teléfono: + y 7–14 dígitos
    const phoneRegex = /^\+\d{7,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert(
        'Error',
        'Ingresa un teléfono válido. Debe comenzar con "+" y tener entre 7 y 14 dígitos.'
      );
      return false;
    }

    // Email opcional pero si está, que sea válido y <= 30 chars
    if (formData.email) {
      if (formData.email.length > 30) {
        Alert.alert('Error', 'El correo no puede tener más de 30 caracteres.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'Ingresa un correo electrónico válido.');
        return false;
      }
    }

    // Región / ciudad obligatorias
    if (!formData.region || !formData.city) {
      Alert.alert('Error', 'Selecciona una región y una ciudad.');
      return false;
    }

    return true;
  };

  const handleOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.precio,
          title: item.titulo,
        })),
        shipping_address: formData.address,
        total,
        status: 'pending',
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        customer_details: formData,
      };

      await ordersAPI.createOrder(orderData);
      await clearCart();

      Alert.alert(
        '¡Pedido Confirmado!',
        'Tu pedido ha sido procesado exitosamente.',
        [{ text: 'Ver mis pedidos', onPress: () => navigation.replace('Orders') }],
      );
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Hubo un problema al procesar tu pedido.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default') => {
    const max30Fields = ['firstName', 'lastName', 'address', 'email'];
    const maxLength = field === 'phone'
      ? 15
      : max30Fields.includes(field)
      ? 30
      : undefined;

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDark}
          value={formData[field]}
          onChangeText={text => handleInputChange(field, text)}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
        />
      </View>
    );
  };

  /* ========== DROPDOWN REGIÓN / CIUDAD (LOCALIDADES JSON) ========== */

  const renderRegionDropdown = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Región</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => {
          setRegionDropdownOpen(prev => !prev);
          setCityDropdownOpen(false);
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dropdownText,
            !formData.region && styles.dropdownPlaceholder,
          ]}
        >
          {formData.region || 'Selecciona una región'}
        </Text>
        <Text style={styles.dropdownArrow}>▾</Text>
      </TouchableOpacity>

      {regionDropdownOpen && (
        <View style={styles.dropdownList}>
          {LOCALIDADES_DATA.map(item => (
            <TouchableOpacity
              key={item.region}
              style={styles.dropdownItem}
              onPress={() => {
                setFormData(prev => ({
                  ...prev,
                  region: item.region,
                  city: '', // reset ciudad al cambiar región
                }));
                setRegionDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item.region}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderCityDropdown = () => {
    const selectedRegionObj = LOCALIDADES_DATA.find(
      r => r.region === formData.region
    );
    const cityOptions = selectedRegionObj ? selectedRegionObj.cities : [];
    const disabled = !selectedRegionObj;

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ciudad</Text>
        <TouchableOpacity
          style={[styles.dropdownButton, disabled && styles.dropdownDisabled]}
          onPress={() => {
            if (!disabled) {
              setCityDropdownOpen(prev => !prev);
              setRegionDropdownOpen(false);
            }
          }}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Text
            style={[
              styles.dropdownText,
              !formData.city && styles.dropdownPlaceholder,
            ]}
          >
            {formData.city ||
              (disabled ? 'Selecciona una región primero' : 'Selecciona una ciudad')}
          </Text>
          <Text style={styles.dropdownArrow}>▾</Text>
        </TouchableOpacity>

        {cityDropdownOpen && !disabled && (
          <View style={styles.dropdownList}>
            {cityOptions.map(city => (
              <TouchableOpacity
                key={city}
                style={styles.dropdownItem}
                onPress={() => {
                  setFormData(prev => ({ ...prev, city }));
                  setCityDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  /* ========== UI ========== */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* HERO */}
      <LinearGradient
        colors={['rgba(102,126,234,0.35)', 'rgba(118,75,162,0.35)']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircle}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerStepText}>Paso 2 de 2</Text>

          <View style={styles.iconCirclePlaceholder} />
        </View>

        <View style={styles.heroTextWrapper}>
          <Text style={styles.heroEyebrow}>Checkout</Text>
          <Text style={styles.heroTitle}>Confirma tu pedido</Text>
          <Text style={styles.heroSubtitle}>
            Completa tus datos de envío, elige el método de pago y revisa el resumen antes de
            finalizar.
          </Text>
        </View>

        {/* Stepper simple */}
        <View style={styles.stepperRow}>
          <View style={styles.stepItem}>
            <View style={styles.stepCircleDone}>
              <Text style={styles.stepNumberDone}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Carrito</Text>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepItem}>
            <View style={styles.stepCircleActive}>
              <Text style={styles.stepNumberActive}>2</Text>
            </View>
            <Text style={styles.stepLabelActive}>Pago</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CONTENIDO */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Card resumen flotando debajo del hero */}
        <View style={styles.heroSummaryWrapper}>
          <View style={styles.heroSummaryCard}>
            <View style={styles.heroSummaryCol}>
              <Text style={styles.heroSummaryLabel}>Productos</Text>
              <Text style={styles.heroSummaryValue}>{cart.length}</Text>
            </View>

            <View style={styles.heroSummaryDivider} />

            <View style={styles.heroSummaryCol}>
              <Text style={styles.heroSummaryLabel}>Subtotal</Text>
              <Text style={styles.heroSummaryValue}>${subtotal.toLocaleString()}</Text>
            </View>

            <View style={styles.heroSummaryDivider} />

            <View style={styles.heroSummaryCol}>
              <Text style={styles.heroSummaryLabel}>Total</Text>
              <Text style={styles.heroSummaryTotal}>${total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* 1. Método de envío */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Método de envío</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                shippingMethod === 'domicilio' && styles.selectedOption,
              ]}
              onPress={() => setShippingMethod('domicilio')}
            >
              <View>
                <Text style={styles.optionTitle}>Despacho a domicilio</Text>
                <Text style={styles.optionSubtitle}>Llega en 48h hábiles</Text>
              </View>
              <Text style={styles.optionPrice}>$4.990</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                shippingMethod === 'retiro' && styles.selectedOption,
              ]}
              onPress={() => setShippingMethod('retiro')}
            >
              <View>
                <Text style={styles.optionTitle}>Retiro en tienda</Text>
                <Text style={styles.optionSubtitle}>Disponible en sucursal</Text>
              </View>
              <Text style={styles.optionPrice}>Gratis</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Datos de envío */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Datos de envío</Text>
          {renderInput('Nombre', 'firstName', 'Juan')}
          {renderInput('Apellido', 'lastName', 'Pérez')}
          {renderInput('Email', 'email', 'juan@ejemplo.com', 'email-address')}
          {renderInput('Teléfono', 'phone', '+569...', 'phone-pad')}
          {renderInput('Dirección', 'address', 'Av. Principal 123')}
          <View style={styles.row}>
            <View style={styles.rowCol}>{renderRegionDropdown()}</View>
            <View style={styles.rowCol}>{renderCityDropdown()}</View>
          </View>
        </View>

        {/* 3. Método de pago */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Método de pago</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === 'card' && styles.selectedOption,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <View>
                <Text style={styles.optionTitle}>Tarjeta crédito/débito</Text>
                <Text style={styles.optionSubtitle}>Pago rápido y seguro</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === 'transfer' && styles.selectedOption,
              ]}
              onPress={() => setPaymentMethod('transfer')}
            >
              <View>
                <Text style={styles.optionTitle}>Transferencia</Text>
                <Text style={styles.optionSubtitle}>Datos bancarios al confirmar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resumen final */}
        <View style={[styles.sectionCard, styles.summaryCard]}>
          <Text style={styles.sectionTitle}>Resumen</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>${shippingCost.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo abajo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleOrder}
          disabled={loading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.confirmGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.confirmText}>Confirmar pedido</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ========== STYLES ========== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },

  /* HERO */
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
    backgroundColor: 'rgba(15,23,42,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
  },
  iconCirclePlaceholder: {
    width: 40,
    height: 40,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.xl,
    color: COLORS.white,
    marginTop: -2,
  },
  headerStepText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
  },
  heroTextWrapper: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  heroEyebrow: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.purpleLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
    textAlign: 'center',
  },
  heroSubtitle: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  /* STEPPER */
  stepperRow: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircleDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.purpleLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.purpleLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  stepNumberDone: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
    fontSize: TYPOGRAPHY.sm,
  },
  stepNumberActive: {
    color: COLORS.purpleLight,
    fontWeight: TYPOGRAPHY.bold,
    fontSize: TYPOGRAPHY.sm,
  },
  stepLabel: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  stepLabelActive: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.purpleLight,
  },
  stepLine: {
    width: 50,
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.6)',
    marginHorizontal: SPACING.sm,
  },

  /* CONTENT */
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120,
  },

  /* CARD RESUMEN */
  heroSummaryWrapper: {
    marginTop: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroSummaryCard: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: 'rgba(15,23,42,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroSummaryCol: {
    flex: 1,
  },
  heroSummaryLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  heroSummaryValue: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.white,
  },
  heroSummaryTotal: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.purpleLight,
  },
  heroSummaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginHorizontal: SPACING.md,
  },

  /* SECCIONES */
  sectionCard: {
    backgroundColor: 'rgba(15,23,42,0.98)',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionCard: {
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: COLORS.purpleLight,
    backgroundColor: 'rgba(102,126,234,0.1)',
  },
  optionTitle: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
  },
  optionSubtitle: {
    marginTop: 2,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.xs,
  },
  optionPrice: {
    color: COLORS.purpleLight,
    fontWeight: TYPOGRAPHY.bold,
    fontSize: TYPOGRAPHY.base,
  },

  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sm,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  row: {
    flexDirection: 'row',
  },
  rowCol: {
    flex: 1,
    marginHorizontal: 4,
  },

  /* DROPDOWNS */
  dropdownButton: {
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: COLORS.textMuted,
  },
  dropdownArrow: {
    marginLeft: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.base,
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: 'rgba(15,23,42,0.98)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    maxHeight: 180,
  },
  dropdownItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  dropdownItemText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sm,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },

  /* RESUMEN FINAL */
  summaryCard: {
    marginBottom: SPACING['2xl'],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.base,
  },
  summaryValue: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.35)',
    marginVertical: SPACING.md,
  },
  totalLabel: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
  },
  totalValue: {
    color: COLORS.purpleLight,
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.extrabold,
  },

  /* FOOTER */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15,15,30,0.98)',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.35)',
  },
  confirmButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  confirmText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
  },
});
