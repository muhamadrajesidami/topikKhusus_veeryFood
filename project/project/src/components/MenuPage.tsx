import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MenuPageProps {
  category: 'food' | 'drinks';
  onNavigate: (page: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ category, onNavigate }) => {
  const { dispatch } = useCart();
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:3000/menu')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data menu');
        return res.json();
      })
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Kategori backend: 'makanan' | 'minuman', frontend: 'food' | 'drinks'
  const backendCategory = category === 'food' ? 'makanan' : 'minuman';
  const items = menu.filter((item) => item.kategori === backendCategory);
  const title = category === 'food' ? 'Makanan' : 'Minuman';

  const getImageUrl = (item: any) => {
    if (!item.gambar) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (item.gambar.startsWith('http')) return item.gambar;
    return `http://localhost:3000/uploads/${item.gambar}`;
  };

  const handleAddToCart = (item: any) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, price: item.harga, image: getImageUrl(item), name: item.nama } });
    setAddedItems((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading menu...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{items.length} menu tersedia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isAdded = addedItems.has(item.id);
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] relative">
                <div className="relative">
                  <img
                    src={item.gambar ? (item.gambar.startsWith('http') ? item.gambar : `http://localhost:3000/uploads/${item.gambar}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={item.nama}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{item.rating ? item.rating : '-'}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{item.nama}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs mb-2 inline-block ${item.stok > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.stok > 0 ? 'Tersedia' : 'Habis'}</span>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.deskripsi || '-'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      Rp {item.harga?.toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isAdded}
                      className={`p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                      {isAdded ? (
                        <Check size={16} className="animate-pulse" />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                  </div>
                </div>
                {/* Success Message */}
                {isAdded && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center rounded-2xl animate-fade-in">
                    <div className="text-white text-center">
                      <Check size={32} className="mx-auto mb-2 animate-bounce" />
                      <p className="font-medium">Ditambahkan ke keranjang!</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Floating Cart Button */}
      <div className="fixed bottom-24 right-4 z-20">
        <button
          onClick={() => onNavigate('cart')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <div className="relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MenuPage;