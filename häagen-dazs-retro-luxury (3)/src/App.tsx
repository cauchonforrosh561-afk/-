/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShoppingCart, Award, Sparkles, Filter, Check, ShoppingBag, Eye } from 'lucide-react';
import { CartItem, Product } from './types';
import { PRODUCTS } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import HistoricalHome from './components/HistoricalHome';
import VirtualSundae from './components/VirtualSundae';
import AromaAIAdvisor from './components/AromaAIAdvisor';
import FlavorExplorer from './components/FlavorExplorer';
import BoutiqueFinder from './components/BoutiqueFinder';
import StoreCart from './components/StoreCart';
import MemberClub from './components/MemberClub';
import ClickSpark from './components/ClickSpark';
import SplitText from './components/SplitText';
import ShinyText from './components/ShinyText';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [memberPoints, setMemberPoints] = useState(380);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Shop categories filters local states
  const [shopCategory, setShopCategory] = useState<string | null>(null);

  // Appends product directly
  const handleAddProductToCart = (product: Product, quantity = 1) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }
  };

  // Helper mapping flavor ID to product representation & add
  const handleAddFlavorToCart = (flavorId: string) => {
    // Converts classic flavor pint
    const matchedProduct: Product = {
      id: `p-${flavorId}-pint`,
      name: `${flavorId === 'belgian-chocolate' ? '比利时巧克力 经典品脱杯' : flavorId === 'madagascar-vanilla' ? '马达加斯加香草 经典品脱杯' : flavorId === 'strawberry-cheesecake' ? '草莓芝士蛋糕 经典品脱杯' : '热带芒果雪芭 经典品脱杯'}`,
      englishName: `${flavorId.toUpperCase().replace('-', ' ')} PINT - 473ml`,
      price: 88,
      category: 'limited',
      description: '经典大都会品脱，选用全球臻选产区高尚原料酿制。',
      imageUrl: flavorId === 'belgian-chocolate' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuANnz1SfyiTpLT3KNlnwwEV4OdrxlMx4R79o_1oowEAXaFJqKfSGpmchrMfeorKXuRZuEH7Af8tXjxgdFIxLMfbarszHYVyewogAL8X9PgRhWgtt-ov-WY_2-2oVcRacOf5j0gQR5y2Unao_n1HdC6EtSF0eLVnHuf1jiU34_GzgKK-R5wJLPpWqDEVI5aqTlgLEm6iYLe7R_L1EqicSfJBHIZo8j2HrcuhXUsxyqYlx6hlfaEXkW49q9N2Kob9h5QwGzT8AE5gU0fi' 
        : flavorId === 'madagascar-vanilla'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9a-TJwYfuS58p9J-koVbHX7Xfv44U1eBtqk_fl5xdhZ0KalnMRPrc5RMHVM8kgzgchcFoy9b0xzXzeKhqnPDGfpxvBe_u52MOMuFDbEbulhdL3YYuMxMKgPtT9hohpCIXMy1ZLcUsl7dl4nzIGm58fFjgbD7iE1kTFebaqdTuWF5yGCEUsvztitUkWx2Nq-c1RgAVRq__mEvHzu7wUrxDggVY378UYUnkgobEooNWsOG6kLoJ83_C0ms10urnD9OTXckL2hVYXKT'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCimEICijj1kDMSRmD4qPDRSJUj8x_sBjzjv6tOOcfvJXLDVi0QkULGF7RNRttt-HIr2ClCypKVY5aVICkepZGXdhJGA4FwVKNp0oMIsFhL-tjPy-A-cBuQk0reJXrkcuOml_0McM5u9DGx5TUuiBPhAnO_CO-4zacIPAaweunTB3a63l65RfFusP4xkfBCj1MzvNl9T1hcLXWS7LL5xcQDaKtAt5ZVUZ5pqDI7DYQZRtGEXZnWaiYQt5XsC7fLjOsEX5ggmxaRbkXl'
    };

    handleAddProductToCart(matchedProduct, 1);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.product.id !== productId));
  };

  // Switch navigation tabs helper
  const handleNavTab = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Catalog items representing shop category
  const filteredProducts = shopCategory
    ? PRODUCTS.filter(p => p.category === shopCategory)
    : PRODUCTS;

  // Total products in cart helper
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fff8f6] flex flex-col justify-between">
      
      {/* ClickSpark premium background studio effect */}
      <ClickSpark sparkColor="#f5bcbc" sparkSize={29} />
      
      {/* Dynamic background paper grain filter */}
      <div className="fixed inset-0 vintage-grain z-40 pointer-events-none" />

      {/* Global Navigation Header bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavTab}
        cartCount={totalCartCount}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        memberPoints={memberPoints}
        userEmail={userEmail}
        onOpenLogin={() => handleNavTab('member')}
      />

      {/* Main active container view block */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'home' && (
              <HistoricalHome onNavTab={handleNavTab} />
            )}

            {activeTab === 'flavors' && (
              <FlavorExplorer onAddFlavorToCart={handleAddFlavorToCart} />
            )}

            {activeTab === 'sundae' && (
              <VirtualSundae
                onAddCustomProduct={handleAddProductToCart}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {activeTab === 'ai-arom' && (
              <AromaAIAdvisor onAddFlavorToCart={handleAddFlavorToCart} />
            )}

            {activeTab === 'boutiques' && (
              <BoutiqueFinder />
            )}

            {activeTab === 'member' && (
              <MemberClub
                memberPoints={memberPoints}
                userEmail={userEmail}
                onLogin={(email) => {
                  setUserEmail(email);
                  setMemberPoints(380); // Default reward balance
                }}
                onLogout={() => {
                  setUserEmail(null);
                  setMemberPoints(0);
                }}
                onDeductPoints={(pts) => setMemberPoints((prev) => Math.max(0, prev - pts))}
                onAddCustomProduct={(p) => {
                  handleAddProductToCart(p, 1);
                  setIsCartOpen(true);
                }}
                onClaimPoints={(pts) => setMemberPoints((prev) => prev + pts)}
              />
            )}

            {activeTab === 'shop' && (
              /* ================= MODE: SHOP COMPONENT PORTAL ================= */
              <section className="py-20 max-w-[1280px] mx-auto px-4 md:px-8">
                
                {/* Intro Title block */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                  <ShinyText
                    text="✦ PRESCRIBED OFFICIAL CATALOGUE ✦"
                    disabled={false}
                    speed={2}
                    color="#b97a20"
                    shineColor="#ffffff"
                    spread={120}
                    className="font-display text-[13px] uppercase tracking-[0.3em] font-bold bg-[#fff1ed] border border-[#ffdbd0] px-4.5 py-1.5 rounded-full inline-block"
                  />
                  <SplitText
                    text="配售奢尚商城"
                    className="font-serif text-[38px] md:text-[54px] text-[#6c2f00] leading-none block"
                    tag="h2"
                    delay={140}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                  <p className="font-sans text-xs text-[#54433a] leading-relaxed">
                    在这里，为您呈递哈根达斯限定礼献系列。包含家庭分享装品脱杯、六十周年纪念金盒、以及联名窑厂手作骨瓷器，开启礼赞。
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                  
                  {/* Left Side: Shop categories switcher */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-3xl p-5 border border-[#ffe9e3] shadow-xs space-y-3 select-none">
                      <h4 className="font-serif text-[15px] font-bold text-[#6c2f00] flex items-center gap-1.5">
                        <Filter className="w-4 h-4 text-[#b97a20]" /> 分类筛选
                      </h4>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: null, label: '全部臻品系列' },
                          { id: 'family', label: '家庭共享品脱杯' },
                          { id: 'giftbox', label: '周年限定奢华礼盒' },
                          { id: 'limited', label: '春日流光限定极品' },
                          { id: 'boutique', label: '主厨联名高尚周边' }
                        ].map((cat) => {
                          const isSelected = shopCategory === cat.id;
                          return (
                            <button
                              key={cat.id || 'all'}
                              onClick={() => setShopCategory(cat.id)}
                              className={`w-full text-left px-4 py-3 text-xs font-sans font-semibold rounded-xl border transition-all cursor-pointer
                                ${isSelected 
                                  ? 'border-[#6c2f00] bg-[#fff1ed]/40 text-[#6c2f00] shadow-2xs' 
                                  : 'border-transparent text-[#54433a] hover:bg-[#fff8f6]'
                                }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Product list grid showcase */}
                  <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="group bg-white rounded-3xl p-5 border border-[#ffe9e3] hover:lift flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          {/* Visual element frame */}
                          <div className="w-full aspect-square bg-[#fff8f6] rounded-full p-4 flex items-center justify-center border border-[#ffe9e3] relative overflow-hidden select-none">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-full filter drop-shadow-md scale-95 group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Decorative badge overlays */}
                            {p.isNew && (
                              <span className="absolute top-3 left-3 bg-[#006e20] text-white text-[9px] uppercase font-bold py-1 px-3 rounded-full">NEW</span>
                            )}
                            {p.isPopular && (
                              <span className="absolute top-3 left-3 bg-[#b97a20] text-white text-[9px] uppercase font-bold py-1 px-3 rounded-full">POPULAR</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-serif text-[15px] font-bold text-[#6c2f00] truncate" title={p.name}>
                              {p.name}
                            </h4>
                            <p className="font-sans text-[10.5px] text-gray-400 uppercase tracking-wider block font-semibold">
                              {p.englishName}
                            </p>
                            <p className="font-sans text-[11px] text-gray-500 line-clamp-3 pt-1 leading-normal">
                              {p.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-[#ffe9e3] mt-6 flex justify-between items-center">
                          <span className="font-serif text-[22px] font-bold text-[#6c2f00] leading-none">
                            ¥ {p.price}
                          </span>
                          
                          <button
                            onClick={() => {
                              handleAddProductToCart(p, 1);
                              setIsCartOpen(true);
                            }}
                            className="bg-[#6c2f00] hover:bg-[#8b4513] text-white p-2.5 rounded-full hover:shadow-sm cursor-pointer"
                            title="Add to order list"
                          >
                            <ShoppingCart className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global visual shopping cart drawer bar */}
      <StoreCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onClaimPoints={(pts) => setMemberPoints((prev) => prev + pts)}
      />

      {/* Global Retro luxury Footer bar */}
      <Footer onNavTab={handleNavTab} />

    </div>
  );
}
