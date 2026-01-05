
import React, { useState, useMemo } from 'react';
import { Collection, Product, Order } from '../types';
import { ShoppingBag, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface Props {
  collection: Collection;
  limit: number;
  onLogout: () => void;
  onOrderSubmit: (orders: Order[]) => void;
}

const InfluencerPage: React.FC<Props> = ({ collection, limit, onLogout, onOrderSubmit }) => {
  const [cart, setCart] = useState<{ product: Product; size: string }[]>([]);
  const [view, setView] = useState<'browse' | 'detail' | 'cart' | 'success'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempSize, setTempSize] = useState<string | null>(null);
  const [lookbookIndex, setLookbookIndex] = useState(0);

  // Delivery Form State
  const [formData, setFormData] = useState({
    instagramId: '',
    name: '',
    phone: '',
    address: '',
    message: '',
    additionalRequest: '',
    agreed: false
  });

  const canAddToCart = cart.length < limit;

  const handleConfirmAddToCart = () => {
    if (!selectedProduct || !tempSize) return;
    if (!canAddToCart) {
      alert(`You can select up to ${limit} products.`);
      return;
    }
    setCart([...cart, { product: selectedProduct, size: tempSize }]);
    setTempSize(null);
    setSelectedProduct(null);
    setView('browse');
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = () => {
    if (!formData.agreed) {
      alert('Please agree to the terms.');
      return;
    }

    const newOrders: Order[] = cart.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      status: 'Preparing',
      date: new Date().toLocaleDateString(),
      instagramId: formData.instagramId,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      message: formData.message,
      additionalRequest: formData.additionalRequest,
      productName: item.product.name,
      size: item.size
    }));

    onOrderSubmit(newOrders);
    setView('success');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="w-10"></div>
        {collection.logoUrl ? (
          <img src={collection.logoUrl} alt="Logo" className="h-6 object-contain" />
        ) : (
          <h1 className="text-xl font-light tracking-[0.2em] uppercase italic">nuuanu</h1>
        )}
        <div className="flex items-center gap-4">
          <button onClick={() => setView('cart')} className="relative p-2">
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button onClick={onLogout} className="text-[10px] uppercase tracking-widest font-medium">Log out</button>
        </div>
      </header>

      {view === 'browse' && (
        <main className="max-w-6xl mx-auto pb-20">
          {/* Lookbook Slider */}
          <section className="relative group px-0 md:px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="hidden md:block">
                <img 
                  src={collection.lookbook[lookbookIndex]?.url} 
                  className="w-full aspect-lookbook object-cover" 
                />
              </div>
              <div>
                <img 
                  src={collection.lookbook[lookbookIndex + 1]?.url || collection.lookbook[0]?.url} 
                  className="w-full aspect-lookbook object-cover" 
                />
              </div>
            </div>
            
            <button 
              onClick={() => setLookbookIndex(prev => Math.max(0, prev - 2))}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors drop-shadow-md"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={() => setLookbookIndex(prev => (prev + 2 >= collection.lookbook.length ? 0 : prev + 2))}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors drop-shadow-md"
            >
              <ChevronRight size={32} />
            </button>
          </section>

          {/* Intro */}
          <section className="text-center px-6 py-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-light tracking-widest uppercase mb-6">{collection.descriptionTitle}</h2>
            <p className="text-sm text-gray-500 leading-relaxed font-light">{collection.descriptionBody}</p>
          </section>

          {/* Product List */}
          <section className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {collection.products.map(product => (
              <div 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => { setSelectedProduct(product); setTempSize(null); setView('detail'); }}
              >
                <div className="aspect-product overflow-hidden bg-gray-50 mb-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-medium uppercase tracking-wider">{product.name}</h3>
                  <p className="text-[10px] text-gray-400">₩{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </section>
        </main>
      )}

      {view === 'detail' && selectedProduct && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto">
          <button 
            onClick={() => {setView('browse'); setTempSize(null);}} 
            className="fixed top-6 right-6 p-2 z-[70] bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col md:flex-row min-h-screen">
            <div className="w-full md:w-1/2 space-y-4 p-4">
              {selectedProduct.images.length > 0 ? (
                selectedProduct.images.map((img, i) => (
                  <img key={i} src={img} className="w-full aspect-product object-cover" />
                ))
              ) : (
                <div className="w-full aspect-product bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">No Image</div>
              )}
            </div>
            <div className="w-full md:w-1/2 p-10 md:sticky md:top-0 md:h-screen flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-8">
                <div>
                  <h2 className="text-2xl font-light uppercase tracking-widest mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-500 font-light text-sm">₩{selectedProduct.price.toLocaleString()}</p>
                </div>
                
                <div 
                  className="text-sm text-gray-600 leading-relaxed font-light whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.summary }}
                />
                
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.options.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setTempSize(opt)}
                        className={`px-6 py-3 border text-xs tracking-widest transition-colors uppercase ${tempSize === opt ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={handleConfirmAddToCart}
                    disabled={!tempSize || !canAddToCart}
                    className="w-full bg-black text-white py-5 text-xs tracking-[0.3em] font-medium disabled:bg-gray-100 transition-colors uppercase"
                  >
                    Add to Bag
                  </button>
                </div>
                
                {!canAddToCart && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest text-center">
                    You can select up to {limit} products.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'cart' && (
        <div className="min-h-[calc(100-80px)] p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => setView('browse')} className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-gray-400 transition-colors">
              <ArrowLeft size={14} /> Back to Collection
            </button>
            <h2 className="text-xl font-light tracking-[0.2em] uppercase">Your Selection ({cart.length}/{limit})</h2>
            <div className="w-20" />
          </div>
          
          <div className="space-y-8 mb-20">
            {cart.map((item, i) => (
              <div key={i} className="flex gap-6 border-b border-gray-100 pb-8 items-center">
                <img src={item.product.images[0] || 'https://via.placeholder.com/200x300'} className="w-24 aspect-product object-cover bg-gray-50" />
                <div className="flex-1 space-y-1">
                  <h3 className="text-xs font-medium uppercase tracking-wider">{item.product.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase">Size: {item.size}</p>
                </div>
                <button onClick={() => removeFromCart(i)} className="text-gray-300 hover:text-black transition-colors">
                  <X size={18} />
                </button>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="text-center py-20 text-gray-400 text-xs uppercase tracking-widest">Your bag is empty</div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="space-y-12">
              <h3 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-4">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InputField label="Instagram ID" required value={formData.instagramId} onChange={v => setFormData({...formData, instagramId: v})} />
                  <InputField label="Name" required value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                  <InputField label="Phone" required value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                </div>
                <div className="space-y-6">
                  <InputField label="Address" required value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                  <InputField label="Delivery Message" value={formData.message} onChange={v => setFormData({...formData, message: v})} />
                  <InputField label="Additional Requests" value={formData.additionalRequest} onChange={v => setFormData({...formData, additionalRequest: v})} />
                </div>
              </div>

              <div className="space-y-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.agreed}
                    onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                    className="mt-1 accent-black"
                  />
                  <span className="text-[10px] text-gray-500 uppercase leading-relaxed tracking-wider">
                    *재고 상황 등에 따라 일부 내용이 달라질 수 있으며, 올려주신 콘텐츠는 브랜드 소개나 홍보에 활용될 수 있습니다.
                  </span>
                </label>
                <button 
                  onClick={handleSubmitOrder}
                  disabled={!formData.agreed || !formData.instagramId || !formData.name || !formData.phone || !formData.address}
                  className="w-full bg-black text-white py-6 text-xs tracking-[0.3em] font-medium disabled:bg-gray-200 transition-colors uppercase"
                >
                  Submit Order
                </button>
              </div>
            </div>
          )}
          
          <div className="h-20" />
        </div>
      )}

      {view === 'success' && (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-xl font-light leading-relaxed tracking-wider italic">
              Thank you, nuuanu girl! <br/>
              We love having you as part of our journey ✨
            </h2>
            <button 
              onClick={onLogout}
              className="px-12 py-4 border border-black text-[10px] uppercase tracking-[0.3em]"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField: React.FC<{ label: string; required?: boolean; value: string; onChange: (v: string) => void }> = ({ label, required, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
      {label} {required && '*'}
    </label>
    <input 
      type="text" 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors text-sm"
    />
  </div>
);

export default InfluencerPage;
