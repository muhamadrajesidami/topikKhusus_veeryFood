import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Filter
} from 'lucide-react';
import axios from 'axios';

interface KasirDashboardProps {
  onNavigate: (page: string) => void;
}

const KasirDashboard: React.FC<KasirDashboardProps> = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('orderan-baru');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMenu, setNewMenu] = useState({ nama: '', harga: '', kategori: '', stok: '' });
  const [newMenuImage, setNewMenuImage] = useState<File | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMenu, setEditMenu] = useState<any | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const orderDetailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => console.error(err));
    axios.get('http://localhost:3000/laporan/transaksi')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
    // Fetch orderan baru
    axios.get('http://localhost:3000/pesanan')
      .then(res => setNewOrders(res.data.filter((p: any) => p.status_pembayaran === 'Unpaid')))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchMenu = () => {
      axios.get('http://localhost:3000/menu')
        .then(res => setMenuItems(res.data))
        .catch(err => console.error(err));
    };
    fetchMenu();
    const interval = setInterval(fetchMenu, 5000); // refresh setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const handleAddMenu = async () => {
    setAddError(null);
    try {
      const hargaNumber = parseInt((newMenu.harga + '').replace(/\./g, ''));
      const stokNumber = parseInt(newMenu.stok as any);
      const resMenu = await axios.post('http://localhost:3000/menu', {
        ...newMenu,
        harga: hargaNumber,
        stok: stokNumber,
        kategori: newMenu.kategori
      });
      if (newMenuImage && resMenu.data.id) {
        const formData = new FormData();
        formData.append('gambar', newMenuImage);
        await axios.post(`http://localhost:3000/menu/${resMenu.data.id}/gambar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      const res = await axios.get('http://localhost:3000/menu');
      setMenuItems(res.data);
      setShowAddModal(false);
      setNewMenu({ nama: '', harga: '', kategori: '', stok: '' });
      setNewMenuImage(null);
    } catch (err: any) {
      setAddError(err.response?.data?.error || 'Gagal menambah menu');
    }
  };

  const handleEditMenu = (menu: any) => {
    setEditMenu({ ...menu });
    setShowEditModal(true);
    setEditError(null);
  };

  const handleUpdateMenu = async () => {
    setEditError(null);
    try {
      await axios.put(`http://localhost:3000/menu/${editMenu.id}`,
        {
          ...editMenu,
          harga: parseInt(editMenu.harga),
          stok: parseInt(editMenu.stok),
          ketersediaan: parseInt(editMenu.ketersediaan)
        }
      );
      const res = await axios.get('http://localhost:3000/menu');
      setMenuItems(res.data);
      setShowEditModal(false);
      setEditMenu(null);
    } catch (err: any) {
      setEditError(err.response?.data?.error || 'Gagal update menu');
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus menu ini?')) return;
    setDeleteError(null);
    try {
      await axios.delete(`http://localhost:3000/menu/${id}`);
      const res = await axios.get('http://localhost:3000/menu');
      setMenuItems(res.data);
    } catch (err: any) {
      setDeleteError(err.response?.data?.error || 'Gagal hapus menu');
    }
  };

  const handlePrint = () => {
    if (orderDetailRef.current) {
      const printContents = orderDetailRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // reload agar UI kembali normal
    }
  };

  const handleBayarPesanan = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(`http://localhost:3000/pesanan/${selectedOrder.id}/bayar`);
      // Refresh orderan baru
      const res = await axios.get('http://localhost:3000/pesanan');
      setNewOrders(res.data.filter((p: any) => p.status_pembayaran === 'Unpaid'));
      // Refresh riwayat transaksi
      const resTransaksi = await axios.get('http://localhost:3000/laporan/transaksi');
      setTransactions(resTransaksi.data);
      setSelectedOrder(null);
    } catch (err) {
      alert('Gagal membayar pesanan');
    }
  };

  const sidebarItems = [
    { id: 'orderan-baru', icon: Package, label: 'Orderan Baru' },
    { id: 'riwayat-transaksi', icon: FileText, label: 'Riwayat Transaksi' },
    { id: 'manajemen-menu', icon: BarChart3, label: 'Manajemen Menu' },
  ];

  const renderOrderDetails = () => {
    if (!selectedOrder) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 text-gray-400 text-center">
          Pilih order untuk melihat detail
        </div>
      );
    }
    return (
      <div ref={orderDetailRef} className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">#{selectedOrder.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pelanggan:</span>
            <span className="font-medium">{selectedOrder.nama_pelanggan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Meja:</span>
            <span className="font-medium">{selectedOrder.nomor_meja}</span>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Pesanan:</h4>
            <div className="space-y-2">
              {selectedOrder.PesananItems && selectedOrder.PesananItems.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.nama} x{item.jumlah}</span>
                  <span>Rp {item.harga.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Metode Pembayaran</h4>
            <div className="flex space-x-2">
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm">{selectedOrder.metode_pembayaran}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium" onClick={handleBayarPesanan}>
              Bayar Sekarang
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg" onClick={handlePrint}>Print Struk</button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'orderan-baru':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Orderan Baru</h2>
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {newOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedOrder(order)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-semibold">#{order.id}</span>
                            <span className="text-gray-600">{order.nama_pelanggan}</span>
                            <span className="text-gray-500">Meja: {order.nomor_meja}</span>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(order.waktu_pesanan).toLocaleTimeString('id-ID')}</span>
                        </div>
                        <div className="space-y-1 mb-3">
                          {order.PesananItems && order.PesananItems.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.nama} x{item.jumlah}</span>
                              <span>Rp {item.harga.toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total: Rp {order.total.toLocaleString('id-ID')}</span>
                          <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">{order.status_pembayaran}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Order Details */}
            <div className="lg:col-span-1">
              {renderOrderDetails()}
            </div>
          </div>
        );

      case 'manajemen-menu':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Manajemen Menu</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
                    <Plus size={16} />
                    <span>Add New Item</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Nama</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Kategori</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Harga</th>
                    <th className="py-3 px-6 text-left">Stok</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{item.nama}</td>
                      <td className="py-4 px-6 text-gray-600">{item.kategori}</td>
                      <td className="py-4 px-6">Rp {item.harga.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-6">{item.stok}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.stok > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.stok > 0 ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleEditMenu(item)}><Edit3 size={16} /></button>
                        <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleDeleteMenu(item.id)}><Trash2 size={16} className="text-red-600" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'riwayat-transaksi':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Riwayat Transaksi</h2>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Nama Pelanggan</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Meja</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Tanggal & Waktu</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Jumlah Total</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Metode Pembayaran</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{transaction.id}</td>
                      <td className="py-4 px-6">{transaction.nama_pelanggan}</td>
                      <td className="py-4 px-6">{transaction.nomor_meja}</td>
                      <td className="py-4 px-6">{new Date(transaction.waktu_pesanan).toLocaleString('id-ID')}</td>
                      <td className="py-4 px-6">Rp {transaction.total.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-6">{transaction.metode_pembayaran}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status_pembayaran === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status_pembayaran}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>Content for {activeMenu}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">VeryFood</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeMenu === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Tambah Menu Baru</h3>
            <input type="text" placeholder="Nama Menu" className="w-full mb-2 px-3 py-2 border rounded" value={newMenu.nama} onChange={e => setNewMenu({ ...newMenu, nama: e.target.value })} />
            <input type="number" placeholder="Harga" className="w-full mb-2 px-3 py-2 border rounded" value={newMenu.harga} onChange={e => setNewMenu({ ...newMenu, harga: e.target.value })} />
            <input type="number" placeholder="Stok" className="w-full mb-2 px-3 py-2 border rounded" value={newMenu.stok ?? ''} onChange={e => setNewMenu({ ...newMenu, stok: e.target.value })} />
            <select className="w-full mb-2 px-3 py-2 border rounded" value={newMenu.kategori} onChange={e => setNewMenu({ ...newMenu, kategori: e.target.value })}>
              <option value="">Pilih Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
            <input type="file" accept="image/*" className="w-full mb-2" onChange={e => setNewMenuImage(e.target.files?.[0] || null)} />
            {addError && <div className="text-red-600 text-sm mb-2">{addError}</div>}
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowAddModal(false); setNewMenuImage(null); }}>Batal</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddMenu}>Tambah</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Edit Menu</h3>
            <input type="text" placeholder="Nama Menu" className="w-full mb-2 px-3 py-2 border rounded" value={editMenu.nama} onChange={e => setEditMenu({ ...editMenu, nama: e.target.value })} />
            <input type="number" placeholder="Harga" className="w-full mb-2 px-3 py-2 border rounded" value={editMenu.harga} onChange={e => setEditMenu({ ...editMenu, harga: e.target.value })} />
            <input type="number" placeholder="Stok" className="w-full mb-2 px-3 py-2 border rounded" value={editMenu.stok ?? ''} onChange={e => setEditMenu({ ...editMenu, stok: e.target.value })} />
            <select className="w-full mb-2 px-3 py-2 border rounded" value={editMenu.kategori} onChange={e => setEditMenu({ ...editMenu, kategori: e.target.value })}>
              <option value="">Pilih Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
            <select className="w-full mb-2 px-3 py-2 border rounded" value={editMenu.ketersediaan} onChange={e => setEditMenu({ ...editMenu, ketersediaan: e.target.value })}>
              <option value={1}>Tersedia</option>
              <option value={0}>Habis</option>
            </select>
            {editError && <div className="text-red-600 text-sm mb-2">{editError}</div>}
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowEditModal(false)}>Batal</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdateMenu}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
    </div>
  );
};

export default KasirDashboard;