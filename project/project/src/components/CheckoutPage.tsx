import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, CheckCircle, User, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { state, dispatch } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [isOrdered, setIsOrdered] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    tableNumber: ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'cash', name: 'Tunai', icon: Wallet, description: 'Bayar di tempat' },
    { id: 'card', name: 'Kartu Debit/Kredit', icon: CreditCard, description: 'Visa, Mastercard' },
    { id: 'ewallet', name: 'E-Wallet', icon: Smartphone, description: 'GoPay, OVO, DANA' },
  ];

  const subtotal = state.total;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleOrder = async () => {
    if (!customerInfo.name || !customerInfo.tableNumber) {
      setErrorMsg('Mohon lengkapi informasi pelanggan');
      return;
    }
    setErrorMsg(null);
    try {
      // Debug: cek isi keranjang
      console.log(state.items);
      // Mapping payment method
      let metode_pembayaran = 'Cash';
      if (selectedPayment === 'ewallet' || selectedPayment === 'card') metode_pembayaran = 'QRIS';
      // Kirim pesanan ke backend
      await axios.post('http://localhost:3000/pesanan', {
        nama_pelanggan: customerInfo.name,
        nomor_meja: customerInfo.tableNumber,
        metode_pembayaran,
        status_pembayaran: 'Unpaid',
        items: state.items.map(item => ({
          menu_id: parseInt(item.id),
          nama: item.name,
          harga: item.price,
          jumlah: item.quantity
        }))
      });
      setIsOrdered(true);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_CART' });
        onNavigate('home');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h2>
          <p className="text-gray-600 mb-2">Terima kasih atas pesanan Anda</p>
          <p className="text-sm text-gray-500 mb-2">Pelanggan: {customerInfo.name}</p>
          <p className="text-sm text-gray-500 mb-4">Meja: {customerInfo.tableNumber}</p>
          <p className="text-sm text-gray-500">Anda akan dialihkan ke beranda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
          
          <div className="space-y-3 mb-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.quantity}x Rp {(item.price ?? 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <span className="font-medium text-gray-900">
                  Rp {((item.price ?? 0) * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">Rp {(subtotal ?? 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pajak (10%)</span>
                <span className="text-gray-900">Rp {(tax ?? 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">Rp {(total ?? 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-bold text-gray-900 mb-4">Informasi Pelanggan</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Nama Pelanggan
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Masukkan nama pelanggan"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Nomor Meja
              </label>
              <input
                type="text"
                value={customerInfo.tableNumber}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, tableNumber: e.target.value }))}
                placeholder="Masukkan nomor meja"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Metode Pembayaran</h3>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedPayment === method.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon size={20} className={
                        selectedPayment === method.id ? 'text-blue-600' : 'text-gray-600'
                      } />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPayment === method.id && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{errorMsg}</div>
          )}

          <button
            onClick={handleOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg mt-6 transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Konfirmasi Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;