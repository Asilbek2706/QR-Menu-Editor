
import React, { useState, useMemo, useEffect } from 'react';
import { RestaurantData, MenuItem, Language, OrderItem, Order } from '../types';
import { ShoppingBag, Plus, Minus, Utensils, ClipboardList, Clock, CheckCircle2, Timer, BellRing, ChevronRight } from 'lucide-react';

interface MenuPreviewProps {
  data: RestaurantData;
  standalone?: boolean;
  onPlaceOrder?: (cart: OrderItem[]) => void;
  tableId?: string;
  activeOrder?: Order | null;
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ data, standalone = false, onPlaceOrder, tableId = "1", activeOrder }) => {
  const [currentLang, setCurrentLang] = useState<Language>('uz');
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [activeCategory, setActiveCategory] = useState<string>(data.categories[0]?.id || '');
  const [cart, setCart] = useState<Record<string, number>>({});
  
  const { theme } = data;
  const t = (obj: any) => obj[currentLang] || obj['en'] || '';

  const addToCart = (item: MenuItem) => {
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeFromCart = (item: MenuItem) => {
    setCart(prev => {
      const newCart = { ...prev };
      const count = newCart[item.id];
      if (typeof count === 'number' && count > 1) {
        newCart[item.id] = count - 1;
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  };

  const cartItemsCount = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);
  const cartTotal = useMemo(() => {
    return data.items.reduce((acc, item) => acc + (item.price * (cart[item.id] || 0)), 0);
  }, [cart, data.items]);

  const handleCheckout = () => {
    const orderItems: OrderItem[] = data.items
      .filter(i => cart[i.id])
      .map(i => ({
        id: Math.random().toString(36).substr(2, 9),
        menuItemId: i.id,
        name: i.name,
        quantity: cart[i.id],
        price: i.price
      }));
    onPlaceOrder?.(orderItems);
    setCart({});
    setActiveTab('orders');
  };

  const [timeLeft, setTimeLeft] = useState<number>(0);
  useEffect(() => {
    if (!activeOrder) return;
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((activeOrder.estimatedArrivalAt - now) / 1000));
      setTimeLeft(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeOrder]);

  const containerClass = standalone 
    ? "w-full max-w-[500px] mx-auto min-h-screen bg-white relative flex flex-col shadow-2xl" 
    : "w-full max-w-[420px] mx-auto h-[800px] bg-white shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-slate-900 relative flex flex-col";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="relative h-48 flex-shrink-0 bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="restaurant cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div className="space-y-1">
            <span className="inline-block px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest mb-1">
              Stol #{tableId}
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">{t(data.name)}</h1>
            <p className="text-white/70 text-[10px] font-medium">{t(data.description)}</p>
          </div>
          <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
            {(['uz', 'ru', 'en'] as Language[]).map(l => (
              <button 
                key={l} 
                onClick={() => setCurrentLang(l)} 
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${currentLang === l ? 'bg-white text-slate-900' : 'text-white'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'menu' ? (
          <>
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-4 flex gap-2 overflow-x-auto border-b border-slate-100 no-scrollbar">
              {data.categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all ${activeCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                >
                  {t(cat.name)}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              {data.items.filter(i => i.category === activeCategory).map(item => (
                <div key={item.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                  <img src={item.image} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm leading-tight">{t(item.name)}</h3>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{t(item.description)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-slate-900 text-sm">{item.price.toLocaleString()} so'm</span>
                      {cart[item.id] ? (
                        <div className="flex items-center bg-slate-900 text-white rounded-lg overflow-hidden">
                          <button onClick={() => removeFromCart(item)} className="p-1.5"><Minus className="w-3 h-3" /></button>
                          <span className="w-6 text-center text-xs font-black">{cart[item.id]}</span>
                          <button onClick={() => addToCart(item)} className="p-1.5"><Plus className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {activeOrder ? (
              <>
                <div className="text-center p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                   <div className="flex justify-center mb-4"><Timer className="w-8 h-8 text-indigo-600 animate-pulse" /></div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Taomlar tayyorlanmoqda</p>
                   <h2 className="text-5xl font-black text-slate-900 my-2 tabular-nums">
                     {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                   </h2>
                   <p className="text-xs font-bold text-indigo-600">Buyurtma #{activeOrder.id}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Buyurtma Tarkibi</h3>
                  {activeOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">{item.quantity}</div>
                         <span className="font-bold text-slate-800 text-sm">{t(item.name)}</span>
                       </div>
                       <span className="text-[10px] font-black text-emerald-500 uppercase">Oshxonada</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                  <BellRing className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-[10px] font-bold text-amber-800 leading-relaxed">
                    Yordam kerak bo'lsa yoki taomlar kechiksa ofitsiantni chaqiring.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <ClipboardList className="w-10 h-10" />
                </div>
                <h3 className="font-black text-slate-800">Buyurtmalar yo'q</h3>
                <p className="text-xs text-slate-500">Hozircha hech narsa tanlamadingiz.</p>
                <button onClick={() => setActiveTab('menu')} className="text-indigo-600 font-black text-sm uppercase flex items-center gap-1 mx-auto">Menyuga qaytish <ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistent Bottom Tabs */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-1.5 flex gap-1 relative overflow-hidden">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'menu' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            <Utensils className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Menyu</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Zakaz</span>
            {activeOrder && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>}
          </button>
        </div>
      </div>

      {/* Floating Checkout Button */}
      {activeTab === 'menu' && cartItemsCount > 0 && (
        <div className="absolute bottom-24 left-6 right-6 animate-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={handleCheckout}
            className="w-full bg-indigo-600 text-white rounded-xl p-4 flex items-center justify-between shadow-xl shadow-indigo-200"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">{cartItemsCount}</span>
              <span className="font-black text-sm">{cartTotal.toLocaleString()} so'm</span>
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2">Tasdiqlash <ShoppingBag className="w-4 h-4" /></span>
          </button>
        </div>
      )}
    </div>
  );
};
