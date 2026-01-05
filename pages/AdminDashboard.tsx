
import React, { useState, useMemo } from 'react';
import { Collection, AdminTab, Product, Order, LookbookItem } from '../types';
import { 
  Settings, 
  Package, 
  Truck, 
  BarChart3, 
  Plus, 
  X, 
  Trash2, 
  Download, 
  Copy, 
  Image as ImageIcon,
  Save,
  LogOut,
  ChevronDown,
  ArrowUpDown,
  Upload,
  FileText,
  Key
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  collections: Collection[];
  adminConfig: any;
  onUpdateAdminConfig: (cfg: any) => void;
  onUpdateCollection: (c: Collection) => void;
  onAddCollection: (c: Collection) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ collections, adminConfig, onUpdateAdminConfig, onUpdateCollection, onAddCollection, onLogout }) => {
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('Settings');
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const activeCollection = useMemo(() => collections.find(c => c.id === activeCollectionId), [collections, activeCollectionId]);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleCreateCollection = () => {
    if (!newColName) return;
    const newCol: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      name: newColName,
      accessCodes: [],
      descriptionTitle: '',
      descriptionBody: '',
      lookbook: [],
      products: [],
      orders: []
    };
    onAddCollection(newCol);
    setActiveCollectionId(newCol.id);
    setIsCreating(false);
    setNewColName('');
    showMsg('Collection created successfully');
  };

  if (!activeCollectionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white shadow-sm p-12 space-y-12">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-light tracking-[0.2em] uppercase italic">nuuanu ADMIN</h1>
            <button onClick={onLogout} className="text-[10px] uppercase tracking-widest"><LogOut size={16}/></button>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] border-b pb-4">Select Collection</h2>
            <div className="grid grid-cols-1 gap-2">
              {collections.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveCollectionId(c.id)}
                  className="w-full text-left p-6 border border-gray-100 hover:border-black transition-colors flex justify-between items-center group"
                >
                  <span className="text-sm font-medium uppercase tracking-widest">{c.name}</span>
                  <span className="text-[10px] text-gray-400 group-hover:text-black">{c.orders.length} orders</span>
                </button>
              ))}
            </div>
            
            {!isCreating ? (
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 p-6 border border-dashed border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors"
              >
                <Plus size={16} />
                <span className="text-xs uppercase tracking-widest">Create New Collection</span>
              </button>
            ) : (
              <div className="p-6 border border-black space-y-4">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Collection Name (e.g. 25FW)"
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                  className="w-full border-b py-2 focus:outline-none text-sm uppercase tracking-widest"
                />
                <div className="flex gap-2">
                  <button onClick={handleCreateCollection} className="flex-1 bg-black text-white py-3 text-[10px] uppercase tracking-widest">Create</button>
                  <button onClick={() => setIsCreating(false)} className="px-6 border py-3 text-[10px] uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0">
        <div className="p-8 border-b border-gray-100 flex flex-col items-center">
          <h1 className="text-sm font-light tracking-[0.2em] uppercase italic mb-1">nuuanu</h1>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <TabButton active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} icon={<Settings size={18}/>} label="Basic Settings" />
          <TabButton active={activeTab === 'Products'} onClick={() => setActiveTab('Products')} icon={<Package size={18}/>} label="Products" />
          <TabButton active={activeTab === 'Shipping'} onClick={() => setActiveTab('Shipping')} icon={<Truck size={18}/>} label="Delivery" />
          <TabButton active={activeTab === 'Report'} onClick={() => setActiveTab('Report')} icon={<BarChart3 size={18}/>} label="Reports" />
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button 
            onClick={() => setActiveCollectionId(null)}
            className="w-full text-left p-3 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-3"
          >
            <ChevronDown size={14} className="rotate-90" />
            Switch Collection
          </button>
          <button onClick={onLogout} className="w-full text-left p-3 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-3">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{activeTab}</p>
              <h2 className="text-2xl font-light uppercase tracking-[0.2em]">{activeCollection.name}</h2>
            </div>
            {msg && (
              <div className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-top-4 ${msg.type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
                {msg.text}
              </div>
            )}
          </div>

          <div className="bg-white p-10 shadow-sm min-h-[600px]">
            {activeTab === 'Settings' && (
              <SettingsTab 
                collection={activeCollection} 
                adminConfig={adminConfig}
                onUpdateAdminConfig={onUpdateAdminConfig}
                onUpdate={onUpdateCollection} 
                showMsg={showMsg}
              />
            )}
            {activeTab === 'Products' && <ProductsTab collection={activeCollection} onUpdate={onUpdateCollection} showMsg={showMsg}/>}
            {activeTab === 'Shipping' && <ShippingTab collection={activeCollection} onUpdate={onUpdateCollection} showMsg={showMsg}/>}
            {activeTab === 'Report' && <ReportTab collection={activeCollection} />}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components for Tabs ---

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all ${active ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{label}</span>
  </button>
);

const SettingsTab: React.FC<{ collection: Collection; adminConfig: any; onUpdateAdminConfig: (cfg: any) => void; onUpdate: (c: Collection) => void; showMsg: (t: string) => void }> = ({ collection, adminConfig, onUpdateAdminConfig, onUpdate, showMsg }) => {
  const [localCol, setLocalCol] = useState(collection);
  const [localAdmin, setLocalAdmin] = useState(adminConfig);

  const save = () => {
    onUpdate(localCol);
    onUpdateAdminConfig(localAdmin);
    showMsg('Settings saved');
  };

  const handleAddCode = () => {
    setLocalCol({ ...localCol, accessCodes: [...localCol.accessCodes, { code: '', limit: 1 }] });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setLocalCol({ ...localCol, logoUrl: url });
    }
  };

  const handleLookbookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems: LookbookItem[] = Array.from(e.target.files).map((f, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(f as File),
        order: localCol.lookbook.length + i
      }));
      setLocalCol({ ...localCol, lookbook: [...localCol.lookbook, ...newItems] });
    }
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2">Admin Credentials</h3>
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-gray-400">Admin Password</label>
            <div className="relative">
              <Key size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={localAdmin.password} 
                onChange={e => setLocalAdmin({...localAdmin, password: e.target.value})}
                className="w-full border-b pl-6 py-2 focus:outline-none text-sm uppercase tracking-widest"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-gray-400">Recovery Phrase</label>
            <input 
              type="text" 
              value={localAdmin.recoveryPhrase} 
              onChange={e => setLocalAdmin({...localAdmin, recoveryPhrase: e.target.value})}
              className="w-full border-b py-2 focus:outline-none text-sm uppercase tracking-widest"
              placeholder="nuuanu"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2">Branding & Codes</h3>
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-gray-400">Collection Logo</label>
            <div className="flex items-center gap-4">
              {localCol.logoUrl && <img src={localCol.logoUrl} className="h-10 object-contain border p-1" />}
              <label className="flex-1 border border-dashed border-gray-200 p-4 text-center cursor-pointer hover:border-black transition-colors">
                <Upload size={16} className="mx-auto mb-1 text-gray-400" />
                <span className="text-[10px] uppercase tracking-widest">Upload Logo</span>
                <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest text-gray-400">Influencer Access Codes</label>
              <button onClick={handleAddCode} className="text-[10px] uppercase tracking-widest underline">Add Code</button>
            </div>
            <div className="space-y-2">
              {localCol.accessCodes.map((ac, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    type="text" 
                    value={ac.code} 
                    onChange={e => {
                      const codes = [...localCol.accessCodes];
                      codes[i].code = e.target.value;
                      setLocalCol({...localCol, accessCodes: codes});
                    }}
                    placeholder="CODE"
                    className="flex-1 border-b py-1 text-xs focus:outline-none uppercase tracking-widest"
                  />
                  <input 
                    type="number" 
                    value={ac.limit} 
                    onChange={e => {
                      const codes = [...localCol.accessCodes];
                      codes[i].limit = parseInt(e.target.value);
                      setLocalCol({...localCol, accessCodes: codes});
                    }}
                    className="w-16 border-b py-1 text-xs text-center focus:outline-none"
                  />
                  <button onClick={() => setLocalCol({...localCol, accessCodes: localCol.accessCodes.filter((_, idx) => idx !== i)})}>
                    <X size={14} className="text-gray-300 hover:text-black"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2">Intro Text</h3>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Description Title"
            value={localCol.descriptionTitle}
            onChange={e => setLocalCol({...localCol, descriptionTitle: e.target.value})}
            className="w-full border-b py-2 focus:outline-none text-sm uppercase tracking-widest font-medium"
          />
          <textarea 
            placeholder="Body content..."
            rows={4}
            value={localCol.descriptionBody}
            onChange={e => setLocalCol({...localCol, descriptionBody: e.target.value})}
            className="w-full border p-4 text-xs font-light leading-relaxed focus:outline-none focus:border-black"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2">Lookbook Images</h3>
        <div className="flex flex-wrap gap-4">
          {localCol.lookbook.map((item) => (
            <div key={item.id} className="relative group w-32 aspect-lookbook bg-gray-50 border overflow-hidden">
              <img src={item.url} className="w-full h-full object-cover" />
              <button 
                onClick={() => setLocalCol({...localCol, lookbook: localCol.lookbook.filter(lb => lb.id !== item.id)})}
                className="absolute top-1 right-1 p-1 bg-white shadow-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="w-32 aspect-lookbook border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-300 hover:text-black hover:border-black transition-colors cursor-pointer">
            <Plus size={24} />
            <span className="text-[10px] uppercase tracking-widest">Upload</span>
            <input type="file" multiple className="hidden" onChange={handleLookbookUpload} />
          </label>
        </div>
      </section>

      <div className="pt-10 flex justify-end">
        <button onClick={save} className="flex items-center gap-2 bg-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-colors">
          <Save size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
};

const ProductsTab: React.FC<{ collection: Collection; onUpdate: (c: Collection) => void; showMsg: (t: string) => void }> = ({ collection, onUpdate, showMsg }) => {
  const [products, setProducts] = useState<Product[]>(collection.products);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split(/\r?\n/);
      const newProducts: Product[] = rows.map(row => {
        const parts = row.split(/[\t,]/); // Support both TSV and CSV
        const [name, price, optionsStr, summary] = parts;
        if (!name || name === '상품') return null;
        
        let options: string[] = [];
        const optMatch = optionsStr?.match(/size\{(.*)\}/);
        if (optMatch) options = optMatch[1].split('|');

        return {
          id: Math.random().toString(36).substr(2, 9),
          name,
          price: parseInt(price) || 0,
          options,
          summary: summary || '',
          images: []
        };
      }).filter(p => p !== null) as Product[];

      setProducts([...products, ...newProducts]);
      showMsg(`${newProducts.length} items added`);
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const urls = Array.from(e.target.files).map(f => URL.createObjectURL(f as File));
      setProducts(products.map(p => p.id === id ? { ...p, images: [...p.images, ...urls] } : p));
    }
  };

  const updateProductField = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const save = () => {
    onUpdate({ ...collection, products });
    showMsg('Product catalog updated');
  };

  return (
    <div className="space-y-12">
      <section className="flex justify-between items-center border-b pb-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Upload Data</h3>
          <p className="text-[10px] text-gray-400 uppercase">Excel/CSV (Header: 상품, 판매가, 옵션, 요약설명)</p>
        </div>
        <label className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-zinc-800 transition-colors">
          <FileText size={14} /> Upload File
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".csv,.txt,.xlsx" />
        </label>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest">Manage Products ({products.length})</h3>
          <button onClick={() => setProducts([])} className="text-[10px] text-red-500 uppercase tracking-widest hover:underline">Delete All</button>
        </div>
        
        <div className="space-y-4">
          {products.map((p, idx) => (
            <div key={p.id} className="flex gap-6 items-start p-6 bg-gray-50 border border-gray-100 group relative">
              <span className="text-[10px] text-gray-300 font-mono mt-1">{idx + 1}</span>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Product Name</p>
                  <p className="text-xs uppercase tracking-widest font-medium">{p.name}</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Price</p>
                  <p className="text-xs">₩{p.price.toLocaleString()}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Summary (Supports HTML)</p>
                  <textarea 
                    value={p.summary}
                    onChange={e => updateProductField(p.id, 'summary', e.target.value)}
                    className="w-full bg-white border border-gray-100 p-2 text-xs font-light focus:outline-none focus:border-black h-20 resize-none"
                  />
                </div>
              </div>

              <div className="w-48 flex gap-2 flex-wrap justify-end">
                {p.images.map((img, i) => (
                  <div key={i} className="relative w-12 aspect-product bg-white border group/img">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => {
                        const newImgs = p.images.filter((_, imgIdx) => imgIdx !== i);
                        updateProductField(p.id, 'images', newImgs);
                      }}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <label className="w-12 aspect-product border border-dashed border-gray-300 flex items-center justify-center text-gray-300 hover:text-black cursor-pointer">
                  <Plus size={14} />
                  <input type="file" multiple className="hidden" onChange={e => handleImageUpload(p.id, e)} />
                </label>
              </div>

              <button 
                onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                className="absolute top-2 right-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <div className="py-20 text-center text-gray-400 text-xs uppercase tracking-widest">No products in this collection</div>
          )}
        </div>
      </section>

      <div className="pt-10 flex justify-end">
        <button onClick={save} className="flex items-center gap-2 bg-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-colors">
          <Save size={16} /> Save Product List
        </button>
      </div>
    </div>
  );
};

const ShippingTab: React.FC<{ collection: Collection; onUpdate: (c: Collection) => void; showMsg: (t: string) => void }> = ({ collection, onUpdate, showMsg }) => {
  const [orders, setOrders] = useState<Order[]>(collection.orders);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; dir: 'asc' | 'desc' } | null>(null);

  const sortedOrders = useMemo(() => {
    let sortable = [...orders];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const aVal = String(a[sortConfig.key] || '');
        const bVal = String(b[sortConfig.key] || '');
        return sortConfig.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return sortable;
  }, [orders, sortConfig]);

  const toggleSelect = (id: string) => {
    const next = new Set(selection);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelection(next);
  };

  const updateOrderField = (id: string, field: keyof Order, value: string) => {
    let finalValue = value;
    let extraFields = {};
    
    // Auto date logic
    if (field === 'status' && value === 'Shipped') {
      extraFields = { shippedDate: new Date().toLocaleDateString() };
    }

    setOrders(orders.map(o => o.id === id ? { ...o, [field]: value, ...extraFields } : o));
  };

  const handleBulkStatus = (status: 'Preparing' | 'Shipped') => {
    const date = status === 'Shipped' ? new Date().toLocaleDateString() : undefined;
    const nextOrders = orders.map(o => selection.has(o.id) ? { ...o, status, shippedDate: date } : o);
    setOrders(nextOrders);
    setSelection(new Set());
    showMsg('Status updated');
  };

  const duplicateOrder = (id: string) => {
    const original = orders.find(o => o.id === id);
    if (original) {
      const copy: Order = {
        ...original,
        id: Math.random().toString(36).substr(2, 9),
        date: '추가 제품',
        productName: '',
        size: '',
      };
      setOrders([copy, ...orders]);
      showMsg('Order row duplicated');
    }
  };

  const downloadExcel = () => {
    const list = selection.size > 0 ? orders.filter(o => selection.has(o.id)) : orders;
    const header = "instagram ID,이름,전화번호,받는분기타연락처,받는분우편번호,주소,제품명,사이즈,수량,배송메세지1";
    const csv = list.map(o => `${o.instagramId},${o.name},${o.phone},,,${o.address},${o.productName},${o.size},1,${o.message}`).join('\n');
    const blob = new Blob([`\ufeff${header}\n${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipping_${collection.name}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const save = () => {
    onUpdate({...collection, orders});
    showMsg('Delivery changes saved');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <select 
            onChange={(e) => handleBulkStatus(e.target.value as any)}
            className="text-[10px] uppercase tracking-widest border p-2 focus:outline-none"
            value=""
          >
            <option value="" disabled>Bulk Status</option>
            <option value="Preparing">Preparing</option>
            <option value="Shipped">Shipped</option>
          </select>
          <button onClick={downloadExcel} className="flex items-center gap-2 border px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <button onClick={save} className="flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] uppercase tracking-widest">
          <Save size={14}/> Save Changes
        </button>
      </div>

      <div className="overflow-x-auto no-scrollbar border border-gray-100">
        <table className="w-full text-[10px] uppercase tracking-wider text-left border-collapse table-fixed min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-3 w-10">
                <input type="checkbox" onChange={(e) => setSelection(e.target.checked ? new Set(orders.map(o => o.id)) : new Set())}/>
              </th>
              <SortHeader label="Status" k="status" config={sortConfig} set={setSortConfig} width="100px" />
              <SortHeader label="Date" k="date" config={sortConfig} set={setSortConfig} width="80px" />
              <SortHeader label="Instagram" k="instagramId" config={sortConfig} set={setSortConfig} width="100px" />
              <SortHeader label="Name" k="name" config={sortConfig} set={setSortConfig} width="80px" />
              <th className="p-3 font-bold text-gray-400 w-[80px]">Contact</th>
              <th className="p-3 font-bold text-gray-400 w-[120px]">Address</th>
              <th className="p-3 font-bold text-gray-400 w-[100px]">Message</th>
              <SortHeader label="Product" k="productName" config={sortConfig} set={setSortConfig} width="120px" />
              <th className="p-3 font-bold text-gray-400 w-[60px]">Size</th>
              <th className="p-3 font-bold text-gray-400 w-[240px]">Admin Memo</th>
              <th className="p-3 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 group">
                <td className="p-3"><input type="checkbox" checked={selection.has(o.id)} onChange={() => toggleSelect(o.id)}/></td>
                <td className="p-3">
                  <select 
                    value={o.status} 
                    onChange={e => updateOrderField(o.id, 'status', e.target.value)}
                    className={`bg-transparent focus:outline-none font-bold ${o.status === 'Shipped' ? 'text-green-500' : 'text-orange-400'}`}
                  >
                    <option value="Preparing">Preparing</option>
                    <option value="Shipped">Shipped</option>
                  </select>
                </td>
                <td className="p-3 text-gray-400 whitespace-nowrap">
                  {o.status === 'Shipped' ? (
                    <input 
                      type="text" 
                      value={o.shippedDate || ''} 
                      onChange={e => updateOrderField(o.id, 'shippedDate', e.target.value)}
                      className="bg-transparent w-full focus:bg-white p-1 text-[9px]"
                    />
                  ) : o.date}
                </td>
                <td className="p-3 font-medium">{o.instagramId}</td>
                <td className="p-3">{o.name}</td>
                <td className="p-3 text-gray-400 truncate" title={o.phone}>{o.phone.slice(0,3)}...</td>
                <td className="p-3 text-gray-400 truncate" title={o.address}>{o.address.slice(0,10)}...</td>
                <td className="p-3 text-gray-400 truncate" title={o.message}>{o.message || '-'}</td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={o.productName} 
                    onChange={e => updateOrderField(o.id, 'productName', e.target.value)}
                    className="bg-transparent w-full focus:bg-white p-1"
                  />
                </td>
                <td className="p-3">
                   <input 
                    type="text" 
                    value={o.size} 
                    onChange={e => updateOrderField(o.id, 'size', e.target.value)}
                    className="bg-transparent w-full focus:bg-white p-1 text-center"
                  />
                </td>
                <td className="p-3">
                  <textarea 
                    value={o.adminMemo || ''}
                    onChange={e => updateOrderField(o.id, 'adminMemo', e.target.value)}
                    className="bg-transparent w-full focus:bg-white p-1 h-8 resize-none no-scrollbar border border-transparent focus:border-gray-100"
                    placeholder="Memo..."
                  />
                </td>
                <td className="p-3 flex items-center gap-4">
                  <button onClick={() => duplicateOrder(o.id)} className="text-gray-500 hover:text-black transition-colors" title="Duplicate row">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => setOrders(orders.filter(item => item.id !== o.id))} className="text-gray-200 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SortHeader: React.FC<{ label: string; k: keyof Order; config: any; set: any; width?: string }> = ({ label, k, config, set, width }) => (
  <th 
    className="p-3 font-bold text-gray-400 cursor-pointer hover:text-black transition-colors" 
    style={{ width }}
    onClick={() => set({ key: k, dir: config?.key === k && config.dir === 'asc' ? 'desc' : 'asc' })}
  >
    <div className="flex items-center gap-1">
      {label}
      <ArrowUpDown size={10} className={config?.key === k ? 'text-black' : 'text-gray-200'} />
    </div>
  </th>
);

const ReportTab: React.FC<{ collection: Collection }> = ({ collection }) => {
  const productStats = useMemo(() => {
    const stats: Record<string, number> = {};
    collection.orders.forEach(o => {
      stats[o.productName] = (stats[o.productName] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ 
      name: name || 'Unknown', 
      value,
      percentage: ((value / (collection.orders.length || 1)) * 100).toFixed(1)
    })).sort((a,b) => b.value - a.value);
  }, [collection]);

  const sizeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    collection.orders.forEach(o => {
      const key = `${o.productName} (${o.size})`;
      stats[key] = (stats[key] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ 
      name, 
      value,
      percentage: ((value / (collection.orders.length || 1)) * 100).toFixed(1)
    })).sort((a,b) => b.value - a.value).slice(0, 10);
  }, [collection]);

  const COLORS = ['#3b82f6', '#14b8a6', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-2">Product Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 9, fill: '#999'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#999'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {productStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {productStats.map((s, i) => (
              <div key={i} className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-gray-400">{s.name}</span>
                <span className="font-bold">{s.value} items ({s.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-2">Top 10 SKU Ranking</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{fontSize: 8, fill: '#999'}} width={120} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                   {sizeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {sizeStats.slice(0, 5).map((s, i) => (
              <div key={i} className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-gray-400">{s.name}</span>
                <span className="font-bold">{s.value} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
