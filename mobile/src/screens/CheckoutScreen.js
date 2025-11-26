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
  Dimensions,
  StatusBar,
  LayoutAnimation, // Importamos LayoutAnimation para suavizar el empuje
  UIManager
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';
import LOCALIDADES_DATA from '../public/data/localidades.json';

const { width, height } = Dimensions.get('window');

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🎨 HERO UI THEME
const HERO = {
  background: '#09090b', // Zinc-950
  glass: 'rgba(39, 39, 42, 0.4)',
  glassInput: 'rgba(0, 0, 0, 0.3)',
  border: 'rgba(255, 255, 255, 0.08)',
  activeBorder: '#7828C8',
  activeBg: 'rgba(120, 40, 200, 0.1)',
  primaryGradient: ['#7828C8', '#9333EA'],
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  radius: 16,
};

export default function CheckoutScreen({ navigation }) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [shippingMethod, setShippingMethod] = useState('domicilio');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', region: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === 'domicilio' ? 4990 : 0;
  const total = subtotal + shippingCost;

  /* ========== LOGIC ========== */

  // Función para manejar la apertura con animación
  const toggleRegion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRegionDropdownOpen(!regionDropdownOpen);
    setCityDropdownOpen(false);
  };

  const toggleCity = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCityDropdownOpen(!cityDropdownOpen);
    setRegionDropdownOpen(false);
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      let digits = value.replace(/[^\d]/g, '');
      if (digits.length > 11) digits = digits.slice(0, 11);
      const newValue = digits ? `+${digits}` : '';
      setFormData(prev => ({ ...prev, phone: newValue }));
      return;
    }
    if (['firstName', 'lastName', 'address', 'email'].includes(field)) {
      const newValue = value.slice(0, 30);
      setFormData(prev => ({ ...prev, [field]: newValue }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.phone) {
      Alert.alert('Error', 'Nombre, apellido, dirección y teléfono son obligatorios.');
      return false;
    }
    const phoneRegex = /^\+\d{7,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert('Error', 'Ingresa un teléfono válido (+569...)');
      return false;
    }
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'Email inválido.');
        return false;
      }
    }
    if (!formData.region || !formData.city) {
      Alert.alert('Error', 'Selecciona región y ciudad.');
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
          image: item.imagenes && item.imagenes.length > 0 ? item.imagenes[0] : null
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

      Alert.alert('¡Pedido Confirmado!', 'Procesado exitosamente.', [
        { text: 'Ver mis pedidos', onPress: () => navigation.replace('Orders') }
      ]);
    } catch (error) {
      console.error("Order Error:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Hubo un problema al procesar tu pedido.";
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ========== RENDER COMPONENTS ========== */

  const renderInput = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.glassInputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={formData[field]}
          onChangeText={text => handleInputChange(field, text)}
          keyboardType={keyboardType}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
        />
      </View>
    </View>
  );

  const renderDropdowns = () => {
    const selectedRegionObj = LOCALIDADES_DATA.find(r => r.region === formData.region);
    const cityOptions = selectedRegionObj ? selectedRegionObj.cities : [];
    
    // NOTA: Eliminamos la lógica de zIndex porque ahora el contenido se empuja
    return (
      <View style={[styles.row, { alignItems: 'flex-start' }]}>
        {/* Region Column */}
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Región</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={toggleRegion}
            activeOpacity={0.8}
          >
            <Text 
              style={[styles.dropdownText, !formData.region && { color: 'rgba(255,255,255,0.3)' }]}
              numberOfLines={1}
            >
              {formData.region || 'Seleccionar'}
            </Text>
            <Text style={{ color: HERO.textMuted }}>▾</Text>
          </TouchableOpacity>
          
          {regionDropdownOpen && (
            <View style={styles.dropdownList}>
              {/* Quitamos max height fijo o lo hacemos muy grande para que se vea todo */}
              <ScrollView nestedScrollEnabled style={{ maxHeight: 250 }}> 
                {LOCALIDADES_DATA.map(item => (
                  <TouchableOpacity
                    key={item.region}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, region: item.region, city: '' }));
                      toggleRegion();
                    }}
                  >
                    <Text style={styles.itemText}>{item.region}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* City Column */}
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>Ciudad</Text>
          <TouchableOpacity
            style={[styles.dropdownBtn, !selectedRegionObj && { opacity: 0.5 }]}
            onPress={() => { if (selectedRegionObj) toggleCity(); }}
            activeOpacity={selectedRegionObj ? 0.8 : 1}
          >
             <Text 
                style={[styles.dropdownText, !formData.city && { color: 'rgba(255,255,255,0.3)' }]} 
                numberOfLines={1}
             >
              {formData.city || 'Seleccionar'}
            </Text>
            <Text style={{ color: HERO.textMuted }}>▾</Text>
          </TouchableOpacity>

          {cityDropdownOpen && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 250 }}>
                {cityOptions.map(city => (
                  <TouchableOpacity
                    key={city}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, city }));
                      toggleCity();
                    }}
                  >
                    <Text style={styles.itemText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderOptionCard = (title, subtitle, price, isSelected, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.optionCard,
        isSelected && styles.optionCardActive
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.optionTitle, isSelected && { color: '#D8B4FE' }]}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      {price && <Text style={styles.optionPrice}>{price}</Text>}
      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
        {isSelected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* AMBIENT LIGHTING */}
      <View style={styles.ambientContainer}>
        <View style={[styles.glowOrb, { top: -50, left: -50, backgroundColor: '#4c1d95' }]} />
        <View style={[styles.glowOrb, { bottom: height * 0.3, right: -80, backgroundColor: '#1e3a8a' }]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Text style={styles.iconText}>←</Text>
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Checkout</Text>
           <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* STEPPER VISUAL */}
            <View style={styles.stepperContainer}>
                <View style={[styles.stepDot, { backgroundColor: HERO.primaryGradient[0] }]} />
                <View style={[styles.stepLine, { backgroundColor: HERO.primaryGradient[0] }]} />
                <View style={[styles.stepDot, { backgroundColor: 'white', borderColor: HERO.primaryGradient[0], borderWidth: 2 }]} />
            </View>
            <Text style={styles.stepText}>Paso 2: Confirmación y Pago</Text>

            {/* SECTION 1: SHIPPING METHOD */}
            <Text style={styles.sectionHeader}>Método de Envío</Text>
            <View style={styles.sectionContainer}>
                {renderOptionCard(
                    'Despacho a Domicilio', 'Llega en 48h hábiles', '$4.990', 
                    shippingMethod === 'domicilio', () => setShippingMethod('domicilio')
                )}
                {renderOptionCard(
                    'Retiro en Tienda', 'Disponible inmediato', 'Gratis', 
                    shippingMethod === 'retiro', () => setShippingMethod('retiro')
                )}
            </View>

            {/* SECTION 2: PERSONAL DATA */}
            <Text style={styles.sectionHeader}>Datos de Contacto</Text>
            {/* Eliminamos zIndex aquí también */}
            <View style={styles.sectionContainer}>
                {renderInput('Nombre', 'firstName', 'Ej: Juan')}
                {renderInput('Apellido', 'lastName', 'Ej: Pérez')}
                {renderInput('Email', 'email', 'juan@mail.com', 'email-address')}
                {renderInput('Teléfono', 'phone', '+569...', 'phone-pad')}
                <View style={styles.divider} />
                {renderInput('Dirección', 'address', 'Av. Siempre Viva 123')}
                
                {renderDropdowns()}
            </View>

            {/* SECTION 3: PAYMENT */}
            <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Pago</Text>
            <View style={styles.sectionContainer}>
                {renderOptionCard(
                    'Tarjeta Crédito / Débito', 'WebPay / MercadoPago', null,
                    paymentMethod === 'card', () => setPaymentMethod('card')
                )}
                {renderOptionCard(
                    'Transferencia', 'Datos al confirmar', null,
                    paymentMethod === 'transfer', () => setPaymentMethod('transfer')
                )}
            </View>

            {/* SUMMARY */}
            <View style={styles.summaryCard}>
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
                    <Text style={styles.totalLabel}>Total a Pagar</Text>
                    <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
                </View>
            </View>

        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
            <TouchableOpacity 
                style={styles.confirmBtn} 
                onPress={handleOrder}
                disabled={loading}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={HERO.primaryGradient}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.btnText}>Confirmar Pedido (${total.toLocaleString()})</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: { color: HERO.text, fontSize: 18, fontWeight: '700' },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: HERO.border,
  },
  iconText: { color: HERO.text, fontSize: 18 },

  /* --- SCROLL CONTENT --- */
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  /* --- STEPPER --- */
  stepperContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 40, height: 2, marginHorizontal: 4 },
  stepText: {
    textAlign: 'center', color: HERO.textMuted, fontSize: 12, marginBottom: 24,
  },

  /* --- SECTIONS --- */
  sectionHeader: {
    color: HERO.text, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 12,
  },
  sectionContainer: {
    backgroundColor: HERO.glass,
    borderRadius: HERO.radius,
    borderWidth: 1, borderColor: HERO.border,
    padding: 16, gap: 12,
  },
  
  /* --- OPTIONS CARDS --- */
  optionCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1, borderColor: 'transparent',
  },
  optionCardActive: {
    backgroundColor: HERO.activeBg,
    borderColor: HERO.activeBorder,
  },
  optionTitle: { color: HERO.text, fontSize: 14, fontWeight: '600' },
  optionSubtitle: { color: HERO.textMuted, fontSize: 12, marginTop: 2 },
  optionPrice: { color: '#D8B4FE', fontWeight: 'bold', fontSize: 14, marginRight: 10 },
  
  radioCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: HERO.textMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  radioCircleActive: { borderColor: '#D8B4FE' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D8B4FE' },

  /* --- INPUTS --- */
  inputWrapper: { marginBottom: 12 },
  label: { color: HERO.textMuted, fontSize: 12, marginBottom: 6, paddingLeft: 4 },
  glassInputContainer: {
    backgroundColor: HERO.glassInput,
    borderRadius: 12,
    borderWidth: 1, borderColor: HERO.border,
    height: 48, justifyContent: 'center',
  },
  input: {
    color: HERO.text, paddingHorizontal: 16, fontSize: 14, flex: 1,
  },
  row: { flexDirection: 'row' },
  divider: { height: 1, backgroundColor: HERO.border, marginVertical: 12 },

  /* --- DROPDOWNS --- */
  dropdownBtn: {
    height: 48,
    backgroundColor: HERO.glassInput,
    borderRadius: 12,
    borderWidth: 1, borderColor: HERO.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dropdownText: { color: HERO.text, fontSize: 14, flex: 1 },
  
  // 🔥 CAMBIO CLAVE: Posición relativa (no absolute) para empujar contenido
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#18181b', // Fondo sólido
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: HERO.border,
    // Sin position: absolute, sin zIndex, sin elevation
    padding: 4,
  },
  dropdownItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  itemText: { color: HERO.textMuted, fontSize: 14 },

  /* --- SUMMARY --- */
  summaryCard: {
    marginTop: 24,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderRadius: HERO.radius,
    borderWidth: 1, borderColor: HERO.border,
    padding: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: HERO.textMuted, fontSize: 14 },
  summaryValue: { color: HERO.text, fontSize: 14, fontWeight: '600' },
  totalLabel: { color: HERO.text, fontSize: 16, fontWeight: '700' },
  totalValue: { color: '#D8B4FE', fontSize: 20, fontWeight: '800' },

  /* --- FOOTER --- */
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
    paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20,
    borderTopWidth: 1, borderTopColor: HERO.border,
    zIndex: 10
  },
  confirmBtn: {
    height: 56, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#7828C8', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.4, shadowRadius: 10,
    elevation: 8,
  },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});