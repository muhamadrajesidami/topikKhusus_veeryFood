import React, { useState } from 'react';
import { ShoppingCart, Home, UtensilsCrossed, Coffee, UserCheck } from 'lucide-react';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import KasirLoginPage from './components/KasirLoginPage';
import KasirDashboard from './components/KasirDashboard';
import { CartProvider } from './context/CartContext';

type Page = 'home' | 'menu' | 'food' | 'drinks' | 'cart' | 'checkout' | 'kasir-login' | 'kasir-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isKasirLoggedIn, setIsKasirLoggedIn] = useState(false);

  const navigationItems = [
    { id: 'home' as Page, icon: Home, label: 'Beranda' },
    { id: 'menu' as Page, icon: UtensilsCrossed, label: 'Makanan' },
    { id: 'drinks' as Page, icon: Coffee, label: 'Minuman' },
    { id: 'cart' as Page, icon: ShoppingCart, label: 'Keranjang' },
  ];

  const handleKasirLogin = () => {
    setIsKasirLoggedIn(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'menu':
      case 'food':
        return <MenuPage category="food" onNavigate={setCurrentPage} />;
      case 'drinks':
        return <MenuPage category="drinks" onNavigate={setCurrentPage} />;
      case 'cart':
        return <CartPage onNavigate={setCurrentPage} />;
      case 'checkout':
        return <CheckoutPage onNavigate={setCurrentPage} />;
      case 'kasir-login':
        return <KasirLoginPage onNavigate={setCurrentPage} onLoginSuccess={handleKasirLogin} />;
      case 'kasir-dashboard':
        return <KasirDashboard onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  // Don't show bottom navigation for kasir pages
  const showBottomNav = !['kasir-login', 'kasir-dashboard'].includes(currentPage);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className={showBottomNav ? "pb-20" : ""}>
          {renderPage()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex items-center justify-around max-w-md mx-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Floating Kasir Button */}
        {currentPage === 'home' && (
          <div className="fixed top-6 right-6 z-50">
            <button
              onClick={() => setCurrentPage('kasir-login')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-300"
              title="Login Kasir"
            >
              <UserCheck size={20} />
            </button>
          </div>
        )}
      </div>
    </CartProvider>
  );
}

export default App;