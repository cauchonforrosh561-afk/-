import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Minus, Plus, Trash2, X, Tag, Sparkles, CheckSquare, Award } from 'lucide-react';
import { CartItem, Product } from '../types';

interface StoreCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onClaimPoints: (points: number) => void;
}

export default function StoreCart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClaimPoints
}: StoreCartProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'receipt'>('cart');

  const baseSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountSum = promoApplied ? 50 : 0;
  const totalPrice = Math.max(0, baseSubtotal - discountSum);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'VIP1961') {
      if (baseSubtotal < 200) {
        setPromoError('该抵扣券需单笔消费满 ¥200 尊享');
        return;
      }
      setPromoApplied(true);
    } else {
      setPromoError('口令不正确或已被兑空');
    }
  };

  const executeCheckout = () => {
    setCheckoutStep('receipt');
  };

  const finishReceipt = () => {
    // Reward member points based on subtotal (e.g., 1 point per ¥1 spent)
    onClaimPoints(Math.round(totalPrice));
    onClearCart();
    setCheckoutStep('cart');
    setPromoApplied(false);
    setPromoCode('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Absolute Dark overlay blocker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[1000]"
          />

          {/* Sliding drawer block */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#fff8f6] z-[1001] shadow-2xl flex flex-col justify-between"
          >
            
            {/* Header section of cart drawer */}
            <div className="p-6 bg-white border-b border-[#ffe9e3] flex justify-between items-center select-none">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5.5 h-5.5 text-[#6c2f00]" />
                <h3 className="font-serif text-[18px] font-bold text-[#6c2f00]">
                  您的奢享购单 ({cartItems.length} 项)
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#ffe9e3]/65 text-gray-500 cursor-pointer"
                title="Dismiss Menu"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {checkoutStep === 'cart' ? (
                /* ================= STEP 1: CART DETAILS SECTION ================= */
                <motion.div
                  key="cart-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between overflow-hidden"
                >
                  {/* Items list wrapper */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-72 text-center text-gray-400 space-y-4">
                        <ShoppingBag className="w-12 h-12 stroke-[1] text-gray-300 animate-pulse" />
                        <div className="space-y-1">
                          <h4 className="font-serif text-[16px] text-[#6c2f00] font-bold">配售单空空如也</h4>
                          <p className="font-sans text-xs">您还没有追加任何奢享冰品或定制圣代进单。前往传奇工坊试试吧！</p>
                        </div>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="bg-white p-4.5 rounded-2xl border border-[#ffe9e3] flex gap-4 items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {/* Simple visual thumbnail mapping */}
                            <div className="w-12 h-12 rounded-xl bg-[#ffe9e3] p-1 flex-none flex items-center justify-center border border-[#ffdbd0]">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain filter drop-shadow-md scale-95"
                              />
                            </div>
                            <div className="space-y-0.5 max-w-[200px]">
                              <h4 className="font-sans font-bold text-xs text-[#6c2f00] truncate">
                                {item.product.name}
                              </h4>
                              <p className="font-sans text-[10.5px] text-gray-400 truncate">
                                {item.product.englishName}
                              </p>
                              <span className="font-serif font-bold text-xs text-[#b97a20]">
                                ¥ {item.product.price}
                              </span>
                            </div>
                          </div>

                          {/* Quantites toggle bar */}
                          <div className="flex items-center gap-3.5">
                            <div className="flex items-center border border-[#ffe9e3] rounded-full p-1 bg-[#fff8f6]">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#6c2f00] active:scale-95 focus:outline-none cursor-pointer border border-[#ffe9e3] text-xs font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold font-sans">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#6c2f00] active:scale-95 focus:outline-none cursor-pointer border border-[#ffe9e3] text-xs font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer calculations & Code checkout promo controls */}
                  {cartItems.length > 0 && (
                    <div className="p-6 bg-white border-t border-[#ffe9e3] space-y-4">
                      
                      {/* Promo voucher input */}
                      {!promoApplied ? (
                        <form onSubmit={applyPromo} className="flex gap-2 w-full">
                          <div className="relative flex-1">
                            <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="贴入尊享口令 例如 VIP1961"
                              className="w-full bg-[#fff8f6] border border-[#ffe9e3] rounded-full py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-[#6c2f00] focus:border-[#6c2f00] placeholder-gray-400 text-[#2c160e]"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-[#6c2f00] hover:bg-[#8b4513] text-white px-5 rounded-full font-display text-xs font-bold tracking-widest uppercase cursor-pointer"
                          >
                            兑入口令
                          </button>
                        </form>
                      ) : (
                        <div className="bg-[#006e20]/10 border border-[#006e20]/25 rounded-2xl p-3.5 flex justify-between items-center text-xs text-[#006e20] select-none animate-slideup">
                          <span className="font-semibold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                            已适用 ¥50 灵感抵扣专享口令
                          </span>
                          <button
                            onClick={() => setPromoApplied(false)}
                            className="font-bold underline cursor-pointer"
                          >
                            取消适
                          </button>
                        </div>
                      )}
                      
                      {promoError && (
                        <p className="font-sans text-[11px] text-red-500 font-bold ml-2">
                          ✕ {promoError}
                        </p>
                      )}

                      <hr className="border-[#ffe9e3]" />

                      {/* Calculations summary grid */}
                      <div className="space-y-2 text-xs font-sans text-gray-500">
                        <div className="flex justify-between">
                          <span>基础极冷高配小计</span>
                          <span className="font-bold text-[#6c2f00]">¥ {baseSubtotal}</span>
                        </div>
                        {promoApplied && (
                          <div className="flex justify-between text-[#006e20] font-semibold">
                            <span>尊享折扣抵扣</span>
                            <span>- ¥ {discountSum}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm pt-2 border-t border-[#ffe9e3] font-serif">
                          <span className="text-gray-900 font-bold">最终配售合价 (Total Cost)</span>
                          <span className="text-[20px] font-bold text-[#6c2f00]">
                            ¥ {totalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons triggers */}
                      <button
                        onClick={executeCheckout}
                        className="w-full bg-[#6c2f00] hover:bg-[#8b4513] text-white py-4 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-all shadow-sm cursor-pointer select-none text-center"
                      >
                        提交冷配下单
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* ================= STEP 2: COMPLETE PRINTED RECEIPT ================= */
                <motion.div
                  key="receipt-step"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto p-6 flex flex-col justify-between"
                >
                  {/* Styled vintage physical printed receipt */}
                  <div className="bg-white border border-[#ffe9e3] rounded-[2rem] p-6 text-center space-y-6 relative shadow-sm select-none animate-slideup">
                    <div className="absolute top-2 inset-x-0 h-1 bg-[#6c2f00]" />
                    
                    <div className="space-y-1 text-center">
                      <h4 className="font-serif text-[18px] font-bold text-[#6c2f00] tracking-wider uppercase">HÄAGEN-DAZS</h4>
                      <span className="font-sans text-[9px] text-[#b97a20] tracking-widest font-extrabold block">GUEST INVOICE RECEIPT</span>
                    </div>

                    <div className="border-y border-dashed border-gray-200 py-3.5 text-xs font-sans text-gray-500 space-y-1.5 text-left">
                      <div className="flex justify-between">
                        <span>账单单号 (ORDER ID)</span>
                        <span className="font-bold text-gray-900 font-mono">HD-202605-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>开具时间 (TIMESTAMP)</span>
                        <span className="font-bold text-gray-900">2026-05-20 UTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>配送服务 (SHIP DELIVERY)</span>
                        <span className="font-bold text-gray-950 flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5 text-[#006e20]" /> 极冷液氮保鲜车速配
                        </span>
                      </div>
                    </div>

                    {/* Bought items short summary list */}
                    <div className="space-y-3.5 text-left max-h-[160px] overflow-y-auto hide-scrollbar">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-xs font-sans text-[#2c160e]">
                          <div className="space-y-0.5">
                            <span className="font-semibold block">{item.product.name.split(' ')[0]}</span>
                            <span className="text-[10px] text-gray-400 font-medium font-mono">¥{item.product.price} × {item.quantity}</span>
                          </div>
                          <span className="font-bold font-serif text-gray-900">¥ {item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-4 text-center space-y-1.5">
                      <span className="font-sans text-[11px] text-[#b97a20] font-bold uppercase tracking-widest block">GRAND TOTAL INC. TAX</span>
                      <div className="font-serif text-[32px] font-bold text-[#6c2f00] leading-none">
                        ¥ {totalPrice}
                      </div>
                      {promoApplied && (
                        <span className="text-[10px] bg-[#006e20]/15 text-[#006e20] border border-[#006e20]/25 px-2.5 py-0.5 rounded-full inline-block font-semibold">
                          ✦ 已经减扣灵感折价 ¥50
                        </span>
                      )}
                    </div>

                    <p className="font-sans text-[10.5px] text-gray-400 leading-normal italic px-2">
                      “尊尚配单已派件至极冷主厨工作室。请保持微信与电话畅通。感谢您参与哈根达斯艺术风味旅程。”
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Points disclaimer */}
                    <div className="bg-[#fff1ed] p-3.5 rounded-xl border border-[#ffdbd0] text-center select-none">
                      <span className="font-sans text-[11px] font-extrabold text-[#6c2f00] uppercase block">
                        ✦ MEMBERSHIP CREDIT STATUS
                      </span>
                      <p className="font-sans text-xs text-[#54433a] leading-none mt-1">
                        下单完成，本单支出将转化为您尊享账户的 <span className="font-bold text-[#006e20]">{Math.round(totalPrice)} 分积分</span>。
                      </p>
                    </div>

                    <button
                      onClick={finishReceipt}
                      className="w-full bg-[#6c2f00] hover:bg-[#8b4513] text-white py-4 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-all shadow-sm cursor-pointer select-none text-center"
                    >
                      确认支付并收下凭封
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
