
import React, { useState } from 'react';
import { RestaurantData, MenuItem, Category, Language, Translatable } from '../types';
import { Plus, Trash2, Sparkles, Globe, ChevronRight, LayoutGrid } from 'lucide-react';
import { generateItemDescription } from '../services/geminiService';

interface EditorProps {
  data: RestaurantData;
  onChange: (newData: RestaurantData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [editLang, setEditLang] = useState<Language>('uz');
  const [loadingAi, setLoadingAi] = useState<string | null>(null);

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    const newItems = data.items.map(item => item.id === id ? { ...item, ...updates } : item);
    onChange({ ...data, items: newItems });
  };

  const addItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: { uz: 'Yangi taom', ru: 'Новое блюдо', en: 'New Dish' },
      description: { uz: 'Tavsif...', ru: 'Описание...', en: 'Description...' },
      // Fix: Use number for price as per MenuItem type definition
      price: 0,
      category: categoryId,
      isAvailable: true,
      image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200`
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const addCategory = () => {
    const name = prompt("Kategoriya nomi (O'zbekcha):");
    if (name) {
      const newCat: Category = { 
        id: name.toLowerCase().replace(/\s/g, '-'), 
        name: { uz: name, ru: name, en: name } 
      };
      onChange({ ...data, categories: [...data.categories, newCat] });
    }
  };

  const handleAiDescription = async (item: MenuItem) => {
    setLoadingAi(`${item.id}-${editLang}`);
    const categoryName = data.categories.find(c => c.id === item.category)?.name[editLang] || "";
    const desc = await generateItemDescription(item.name[editLang], categoryName, editLang);
    if (desc) {
      updateItem(item.id, { 
        description: { ...item.description, [editLang]: desc } 
      });
    }
    setLoadingAi(null);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Language Toggle for Editor */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Tahrirlash tili</h3>
            <p className="text-xs text-slate-500">Hozirgi til: {editLang.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['uz', 'ru', 'en'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setEditLang(l)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${editLang === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-indigo-500" />
          Restoran ma'lumotlari
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Nomi ({editLang})</label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
              value={data.name[editLang]}
              onChange={e => onChange({ ...data, name: { ...data.name, [editLang]: e.target.value } })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Tavsif ({editLang})</label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
              value={data.description[editLang]}
              onChange={e => onChange({ ...data, description: { ...data.description, [editLang]: e.target.value } })}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800">Menyu tarkibi</h2>
          <button onClick={addCategory} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Kategoriya qo'shish
          </button>
        </div>

        {data.categories.map(category => (
          <div key={category.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
              <input 
                className="font-black text-slate-800 bg-transparent border-none focus:ring-0 p-0"
                value={category.name[editLang]}
                onChange={e => {
                  const newCats = data.categories.map(c => c.id === category.id ? { ...c, name: { ...c.name, [editLang]: e.target.value } } : c);
                  onChange({ ...data, categories: newCats });
                }}
              />
              <button onClick={() => addItem(category.id)} className="text-indigo-600 font-bold text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Taom qo'shish
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {data.items.filter(i => i.category === category.id).map(item => (
                <div key={item.id} className="p-6 flex gap-6 group hover:bg-slate-50/50 transition-all">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden relative border border-slate-200 shadow-inner">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                      <input 
                        className="flex-1 text-lg font-bold bg-transparent border-b border-transparent focus:border-indigo-200 outline-none"
                        value={item.name[editLang]}
                        onChange={e => updateItem(item.id, { name: { ...item.name, [editLang]: e.target.value } })}
                      />
                      <input 
                        className="w-20 text-right font-black text-slate-900 bg-transparent border-b border-transparent focus:border-indigo-200 outline-none"
                        value={item.price}
                        // Fix: Parse price input as a number to match MenuItem type
                        onChange={e => updateItem(item.id, { price: Number(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="relative group/desc">
                      <textarea 
                        className="w-full text-sm text-slate-500 bg-transparent border-none outline-none resize-none h-12 leading-relaxed"
                        value={item.description[editLang]}
                        onChange={e => updateItem(item.id, { description: { ...item.description, [editLang]: e.target.value } })}
                      />
                      <button 
                        onClick={() => handleAiDescription(item)}
                        disabled={loadingAi === `${item.id}-${editLang}`}
                        className="absolute bottom-0 right-0 flex items-center gap-1.5 text-[10px] font-black text-indigo-500 bg-white border border-indigo-100 px-3 py-1 rounded-full shadow-sm opacity-0 group-hover/desc:opacity-100 transition-all"
                      >
                        {loadingAi === `${item.id}-${editLang}` ? <div className="w-2 h-2 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full"></div> : <Sparkles className="w-3 h-3" />}
                        AI TAVSIF
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => onChange({ ...data, items: data.items.filter(i => i.id !== item.id) })}
                    className="self-start p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
