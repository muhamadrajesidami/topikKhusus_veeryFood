import React from 'react';
import { ArrowRight, Clock, Star, Utensils } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const categories = [
    {
      id: 'food',
      title: 'Makanan',
      description: 'Hidangan lezat dan bergizi',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'drinks',
      title: 'Minuman',
      description: 'Minuman segar dan sehat',
      image: 'https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  const popularItems = [
    {
      id: '1',
      name: 'Nasi Goreng Special',
      price: 15000,
      image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Ayam Bakar',
      price: 18000,
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7
    },
    {
      id: '3',
      name: 'Es Teh Manis',
      price: 5000,
      image: 'https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VeryFood</h1>
              <p className="text-gray-600 mt-1">Laparr?? Makanin aja Diveryfood</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <Clock className="w-4 h-4 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Waktu Tunggu</p>
            <p className="font-bold text-gray-900">15 Menit</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <Star className="w-4 h-4 text-yellow-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Rating</p>
            <p className="font-bold text-gray-900">4.8/5</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <Utensils className="w-4 h-4 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Menu</p>
            <p className="font-bold text-gray-900">50+ Item</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kategori Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onNavigate(category.id)}
              className="relative overflow-hidden rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-90`} />
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <h3 className="text-lg font-bold">{category.title}</h3>
                <p className="text-sm opacity-90">{category.description}</p>
                <ArrowRight className="w-5 h-5 mt-2 self-end" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Menu Populer</h2>
          <button
            onClick={() => onNavigate('menu')}
            className="text-blue-600 font-medium text-sm"
          >
            Lihat Semua
          </button>
        </div>
        <div className="space-y-3">
          {popularItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{item.rating}</span>
                </div>
                <p className="font-bold text-blue-600 mt-1">
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;