
import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { MenuPreview } from './components/MenuPreview';
import { OrderDashboard } from './components/OrderDashboard';
import { RestaurantData, ViewMode, Order, OrderItem, OrderStatus } from './types';
import { Layout, Eye, QrCode, Coffee, BarChart3, Plus, Trash2, Download, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const INITIAL_DATA: RestaurantData = {
  name: { uz: "Lumière Bistro", ru: "Бистро Люмьер", en: "Lumière Bistro" },
  description: { uz: "Sifatli va mazali taomlar", ru: "Качественная и вкусная еда", en: "Quality and delicious food" },
  items: [
    {
      id: "1",
      name: { uz: "Klassik Avokado Toast", ru: "Классический тост с авокадо", en: "Classic Avocado Toast" },
      description: { uz: "Avokado va tuxumli mazali nonushta", ru: "Вкусный завтрак с авокадо и яйцом", en: "Delicious breakfast with avocado and egg" },
      price: 45000,
      category: "breakfast",
      isAvailable: true,
      prepTimeMinutes: 15,
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400"
    }
  ],
  categories: [
    { id: "breakfast", name: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" } },
    { id: "lunch", name: { uz: "Tushlik", ru: "Обед", en: "Lunch" } }
  ],
  theme: { primaryColor: "#4f46e5", accentColor: "#f59e0b", fontFamily: "sans", layout: "list" },
  tables: ["1", "2", "3"]
};

const App: React.FC = () => {
  const [data, setData] = useState<RestaurantData>(() => {
    const saved = localStorage.getItem('qr-menu-v3-full');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('qr-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EDITOR);
  const [selectedTable, setSelectedTable] = useState("1");
  const [activeCustomerOrder, setActiveCustomerOrder] = useState<Order | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [newTableNum, setNewTableNum] = useState("");
  const [isCustomerMode, setIsCustomerMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      setSelectedTable(table);
      setViewMode(ViewMode.PREVIEW);
      setIsCustomerMode(true);
      const savedOrders = JSON.parse(localStorage.getItem('qr-orders') || '[]');
      const lastOrder = savedOrders.find((o: Order) => o.tableId === table && o.status !== 'served' && o.status !== 'cancelled');
      if (lastOrder) setActiveCustomerOrder(lastOrder);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('qr-menu-v3-full', JSON.stringify(data));
    localStorage.setItem('qr-orders', JSON.stringify(orders));
  }, [data, orders]);

  const handlePlaceOrder = (cart: OrderItem[]) => {
    const maxPrepTime = cart.reduce((max, item) => {
      const menuItem = data.items.find(i => i.id === item.menuItemId);
      return Math.max(max, menuItem?.prepTimeMinutes || 15);
    }, 0);
    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      tableId: selectedTable,
      items: cart,
      status: 'pending',
      createdAt: Date.now(),
      estimatedArrivalAt: Date.now() + (maxPrepTime * 60 * 1000),
      totalPrice: total
    };
    setOrders(prev => [newOrder, ...prev]);
    setActiveCustomerOrder(newOrder);
  };

  const handleAddTable = () => {
    if (newTableNum && !data.tables.includes(newTableNum)) {
      setData({ ...data, tables: [...data.tables, newTableNum].sort((a,b) => parseInt(a) - parseInt(b)) });
      setSelectedTable(newTableNum);
      setNewTableNum("");
    }
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}?table=${selectedTable}`;

  if (isCustomerMode) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MenuPreview 
          data={data} 
          tableId={selectedTable} 
          onPlaceOrder={handlePlaceOrder} 
          activeOrder={activeCustomerOrder}
          standalone={true} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg"><Coffee className="text-white w-4 h-4" /></div>
          <span className="font-black text-xl tracking-tight">RestoFlow</span>
        </div>

        <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode(ViewMode.EDITOR)} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === ViewMode.EDITOR ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>
            <Layout className="w-4 h-4 inline mr-2" /> Menyu
          </button>
          <button onClick={() => setViewMode(ViewMode.DASHBOARD)} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === ViewMode.DASHBOARD ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>
            <BarChart3 className="w-4 h-4 inline mr-2" /> Buyurtmalar
          </button>
          <button onClick={() => setViewMode(ViewMode.QR_SHARE)} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === ViewMode.QR_SHARE ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>
            <QrCode className="w-4 h-4 inline mr-2" /> QR Kodlar
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setViewMode(ViewMode.PREVIEW)} className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"><Eye className="w-5 h-5" /></button>
          <button onClick={() => { localStorage.setItem('qr-menu-v3-full', JSON.stringify(data)); setShowToast(true); setTimeout(() => setShowToast(false), 2000); }} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black">SAQLASH</button>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {viewMode === ViewMode.EDITOR && <div className="flex-1 overflow-y-auto p-8"><div className="max-w-4xl mx-auto"><Editor data={data} onChange={setData} /></div></div>}
        {viewMode === ViewMode.DASHBOARD && <div className="flex-1"><OrderDashboard orders={orders} onUpdateStatus={(id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))} currentLang="uz" /></div>}
        
        {viewMode === ViewMode.QR_SHARE && (
          <div className="flex-1 p-12 bg-indigo-50/30 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-black text-slate-900">QR Kodlar Markazi</h1>
                <p className="text-slate-500 font-medium">Stol menyusini ulashish uchun QR kodlar.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {data.tables.map(num => (
                    <button key={num} onClick={() => setSelectedTable(num)} className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${selectedTable === num ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}>{num}</button>
                  ))}
                  <div className="flex gap-1">
                    <input type="number" placeholder="+" className="w-12 h-12 rounded-xl border border-slate-200 text-center text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={newTableNum} onChange={e => setNewTableNum(e.target.value)} />
                    <button onClick={handleAddTable} className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center space-y-8">
                <div className="bg-slate-50 p-6 rounded-[2rem] inline-block border-2 border-dashed border-slate-200">
                  <QRCodeSVG id="qr-svg" value={shareUrl} size={250} level="H" includeMargin />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black">{data.name.uz} - Stol #{selectedTable}</h2>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest bg-indigo-50 inline-block px-3 py-1 rounded-full">{shareUrl}</p>
                </div>
                <div className="flex gap-4 max-w-sm mx-auto">
                  <button onClick={() => {
                    const svg = document.getElementById("qr-svg");
                    if (svg) {
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      const img = new Image();
                      img.onload = () => { canvas.width = 1000; canvas.height = 1000; ctx?.drawImage(img, 0, 0, 1000, 1000); const link = document.createElement("a"); link.download = `stol-${selectedTable}-qr.png`; link.href = canvas.toDataURL("image/png"); link.click(); };
                      img.src = "data:image/svg+xml;base64," + btoa(svgData);
                    }
                  }} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"><Download className="w-4 h-4" /> PNG YUKLASH</button>
                  <button onClick={() => window.open(shareUrl, '_blank')} className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all"><ExternalLink className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === ViewMode.PREVIEW && (
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-100">
             <MenuPreview data={data} tableId={selectedTable} onPlaceOrder={handlePlaceOrder} activeOrder={activeCustomerOrder} />
          </div>
        )}
      </main>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-8 py-3 rounded-full shadow-2xl font-bold animate-in fade-in slide-in-from-bottom-4">O'zgarishlar saqlandi!</div>
      )}
    </div>
  );
};

export default App;
