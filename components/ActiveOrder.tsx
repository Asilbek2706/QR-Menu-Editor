
import React, { useState, useEffect } from 'react';
import { Order, Language } from '../types';
import { Clock, CheckCircle2, Timer, ChevronLeft, UtensilsCrossed, ChefHat, BellRing } from 'lucide-react';

interface ActiveOrderProps {
  order: Order;
  currentLang: Language;
  onClose: () => void;
}

export const ActiveOrder: React.FC<ActiveOrderProps> = ({ order, currentLang, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((order.estimatedArrivalAt - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [order.estimatedArrivalAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const t = (obj: any) => obj[currentLang] || obj['en'] || '';

  const getStatusInfo = () => {
    switch (order.status) {
      case 'pending': 
        return {
          text: currentLang === 'uz' ? 'Buyurtma qabul qilindi' : 'Заказ принят',
          sub: currentLang === 'uz' ? 'Tez orada oshpaz ishga kirishadi' : 'Повар скоро приступит к работе',
          icon: <BellRing className="w-8 h-8" />,
          color: 'bg-blue-500',
          progress: 25
        };
      case 'preparing': 
        return {
          text: currentLang === 'uz' ? 'Oshpaz tayyorlamoqda' : 'Повар готовит',
          sub: currentLang === 'uz' ? 'Sizning taomingiz olovda' : 'Ваше блюдо на огне',
          icon: <ChefHat className="w-8 h-8" />,
          color: 'bg-amber-500',
          progress: 60
        };
      case 'served': 
        return {
          text: currentLang === 'uz' ? 'Yoqimli ishtaha!' : 'Приятного аппетита!',
          sub: currentLang === 'uz' ? 'Taom stolingizga yetkazildi' : 'Блюдо доставлено на ваш стол',
          icon: <UtensilsCrossed className="w-8 h-8" />,
          color: 'bg-emerald-500',
          progress: 100
        };
      default: 
        return {
          text: 'Holat noma’lum',
          sub: '',
          icon: <Clock className="w-8 h-8" />,
          color: 'bg-slate-500',
          progress: 0
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="w-full max-w-[420px] mx-auto h-[800px] bg-white shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-slate-900 relative flex flex-col">
      {/* Header */}
      <div className={`${status.color} p-8 text-white transition-colors duration-500`}>
        <div className="flex justify-between items-start mb-6">
          <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Stol raqami</p>
            <p className="text-2xl font-black">#{order.tableId}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            {status.icon}
          </div>
          <div>
            <h1 className="text-xl font-black">{status.text}</h1>
            <p className="text-xs font-medium opacity-80">{status.sub}</p>
          </div>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
             <span>Jarayon</span>
             <span>{status.progress}%</span>
           </div>
           <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
             <div 
               className="h-full bg-white transition-all duration-1000" 
               style={{ width: `${status.progress}%` }}
             />
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar -mt-6 bg-white rounded-t-[2.5rem] shadow-inner">
        {order.status !== 'served' && (
          <div className="text-center py-4 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tayyor bo'lishiga</span>
            </div>
            <div className="text-6xl font-black tracking-tighter text-slate-900 tabular-nums">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-sm font-bold text-slate-400 mt-2">daqiqa qoldi</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Buyurtma tarkibi</h3>
            <span className="text-[10px] font-black text-slate-400">ID: {order.id}</span>
          </div>
          
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                     {item.quantity}
                   </div>
                   <div className="flex flex-col">
                     <span className="font-bold text-slate-800 leading-none">{t(item.name)}</span>
                     <span className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-tight">Tayyorlanmoqda</span>
                   </div>
                 </div>
                 <span className="text-sm font-black text-slate-900">{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
           <div className="bg-white p-3 rounded-2xl text-indigo-600">
             <BellRing className="w-5 h-5" />
           </div>
           <div className="space-y-1">
             <p className="font-bold text-indigo-900 text-sm">Ofitsiantni chaqirish?</p>
             <p className="text-xs text-indigo-700/70 font-medium">Agar biror narsa kerak bo'lsa, tugmani bosing.</p>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-slate-50 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Umumiy hisob</p>
            <p className="text-2xl font-black text-slate-900">{order.totalPrice.toLocaleString()} so'm</p>
          </div>
          <div className="flex flex-col items-end">
             <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
               <CheckCircle2 className="w-3.5 h-3.5" /> To'lov kutilmoqda
             </span>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200 uppercase"
        >
          Yana taom qo'shish
        </button>
      </div>
    </div>
  );
};
