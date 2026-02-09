
import React from 'react';
import { Order, OrderStatus, Language } from '../types';
import { Check, Clock, Utensils, AlertCircle } from 'lucide-react';

interface OrderDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  currentLang: Language;
}

export const OrderDashboard: React.FC<OrderDashboardProps> = ({ orders, onUpdateStatus, currentLang }) => {
  const t = (obj: any) => obj[currentLang] || obj['en'] || '';

  const columns: { id: OrderStatus; label: string; color: string }[] = [
    { id: 'pending', label: 'Yangi', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { id: 'preparing', label: 'Tayyorlanmoqda', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { id: 'served', label: 'Yetkazilgan', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden p-6">
      {columns.map(col => (
        <div key={col.id} className="flex flex-col h-full bg-slate-50/50 rounded-3xl border border-slate-200 overflow-hidden">
          <div className={`px-6 py-4 border-b border-slate-200 flex items-center justify-between ${col.color}`}>
            <h2 className="font-black uppercase tracking-widest text-sm">{col.label}</h2>
            <span className="bg-white/50 px-3 py-0.5 rounded-full text-xs font-black">
              {orders.filter(o => o.status === col.id).length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {orders.filter(o => o.status === col.id).map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Stol raqami</span>
                    <h3 className="text-xl font-black text-slate-900">#{order.tableId}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Vaxti</span>
                    <p className="text-sm font-bold text-slate-600">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">
                        <span className="font-black text-slate-900 mr-2">{item.quantity}x</span> 
                        {t(item.name)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-50 flex gap-2">
                  {col.id === 'pending' && (
                    <button 
                      onClick={() => onUpdateStatus(order.id, 'preparing')}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all"
                    >
                      Boshlash
                    </button>
                  )}
                  {col.id === 'preparing' && (
                    <button 
                      onClick={() => onUpdateStatus(order.id, 'served')}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all"
                    >
                      Tayyor
                    </button>
                  )}
                  {col.id !== 'served' && (
                    <button 
                      onClick={() => onUpdateStatus(order.id, 'cancelled')}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
