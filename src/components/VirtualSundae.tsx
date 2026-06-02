import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CupSoda, Eye, Plus, Trash2, ShoppingCart, Award, Sparkles, Scale, Info, Check, Sun, Sunset } from 'lucide-react';
import { SUNDAE_INGREDIENTS } from '../data';
import { SundaeIngredient, Product } from '../types';
import { playBubbleSound, playScoopDropSound, playCrystalChime } from '../utils/audio';
import SplitText from './SplitText';
import ShinyText from './ShinyText';

interface VirtualSundaeProps {
  onAddCustomProduct: (product: Product) => void;
  onOpenCart: () => void;
}

export default function VirtualSundae({ onAddCustomProduct, onOpenCart }: VirtualSundaeProps) {
  const [selectedCup, setSelectedCup] = useState<SundaeIngredient>(SUNDAE_INGREDIENTS[0]);
  const [selectedScoops, setSelectedScoops] = useState<SundaeIngredient[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<SundaeIngredient[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<SundaeIngredient[]>([]);
  const [successMode, setSuccessMode] = useState(false);
  const [sundaeBgUrl, setSundaeBgUrl] = useState("https://i.postimg.cc/T1pGD0HL/17590d6537b8bcb3b845b40e09bc7e6d.jpg");
  const [lightingMode, setLightingMode] = useState<'studio' | 'sunset'>('studio');

  // Interactive 3D tilt states based on hover & mouse movement
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    // Coordinates relative to the center of the container box
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates to ranges roughly between -1 and 1
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    // Translate to rotation angles: max -14/14 degree pitch and -22/22 degree yaw
    setRotateX(-normY * 14);
    setRotateY(normX * 22);
  };

  const handleMouseLeave = () => {
    // Smooth custom return snap back
    setRotateX(0);
    setRotateY(0);
  };

  const handleBgError = () => {
    if (sundaeBgUrl.includes('.jpg')) {
      setSundaeBgUrl("https://i.postimg.cc/T1pGD0HL/17590d6537b8bcb3b845b40e09bc7e6d.png");
    } else if (sundaeBgUrl.includes('.png')) {
      setSundaeBgUrl("https://i.postimg.cc/T1pGD0HL/17590d6537b8bcb3b845b40e09bc7e6d.jpeg");
    } else if (sundaeBgUrl.includes('.jpeg')) {
      setSundaeBgUrl("https://i.postimg.cc/T1pGD0HL/17590d6537b8bcb3b845b40e09bc7e6d.webp");
    }
  };

  const cups = SUNDAE_INGREDIENTS.filter(i => i.type === 'cup');
  const scoops = SUNDAE_INGREDIENTS.filter(i => i.type === 'scoop');
  const sauces = SUNDAE_INGREDIENTS.filter(i => i.type === 'sauce');
  const toppings = SUNDAE_INGREDIENTS.filter(i => i.type === 'topping');

  // Calculates total prices
  const totalPrice = 
    selectedCup.price +
    selectedScoops.reduce((sum, item) => sum + item.price, 0) +
    selectedSauces.reduce((sum, item) => sum + item.price, 0) +
    selectedToppings.reduce((sum, item) => sum + item.price, 0);

  // Calculates estimated nutrition specs
  const estCalories = 
    120 + // Cup base
    (selectedScoops.length * 280) + 
    (selectedSauces.length * 90) +
    (selectedToppings.length * 45);

  const estProtein = 
    2.5 + // Milk base
    (selectedScoops.length * 4.2) +
    (selectedToppings.length * 0.8);

  const avgSweetness = 
    selectedScoops.length > 0
      ? Math.round(selectedScoops.reduce((sum, s) => sum + (s.id.includes('matcha') || s.id.includes('mango') ? 3 : 5), 0) / selectedScoops.length)
      : 3;

  // Handles Scoop appending (Limit 3)
  const handleAddScoop = (scoop: SundaeIngredient) => {
    if (selectedScoops.length >= 3) return;
    setSelectedScoops([...selectedScoops, scoop]);
    playScoopDropSound();
  };

  // Handles removing single scoop at specific index
  const handleRemoveScoop = (index: number) => {
    const next = [...selectedScoops];
    next.splice(index, 1);
    setSelectedScoops(next);
    playBubbleSound();
  };

  // Toggle checklist sauces
  const handleToggleSauce = (item: SundaeIngredient) => {
    playBubbleSound();
    const isChecked = selectedSauces.some(s => s.id === item.id);
    if (isChecked) {
      setSelectedSauces(selectedSauces.filter(s => s.id !== item.id));
    } else {
      setSelectedSauces([...selectedSauces, item]);
    }
  };

  // Toggle checklist toppings
  const handleToggleTopping = (item: SundaeIngredient) => {
    playBubbleSound();
    const isChecked = selectedToppings.some(t => t.id === item.id);
    if (isChecked) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== item.id));
    } else {
      setSelectedToppings([...selectedToppings, item]);
    }
  };

  // Build custom item description & push to main checkout cart
  const handleCheckoutSundae = () => {
    if (selectedScoops.length === 0) return;

    const scoopSummaries = selectedScoops.map(s => s.name.replace('球', '')).join(' + ');
    const extraSummaries = [...selectedSauces, ...selectedToppings].map(e => e.name).join(', ');

    const customSundaeProduct: Product = {
      id: `sundae-custom-${Date.now()}`,
      name: `我的定制奢华圣代 [${selectedCup.name.substring(0, 4)}]`,
      englishName: `My Luxury Art Sundae (${selectedScoops.length} Scoops)`,
      price: totalPrice,
      description: `高尚定制手作圣代。配料配方：${scoopSummaries}${extraSummaries ? `，浇淋：${extraSummaries}` : ''}。提供奢华即配配送。`,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7F2AisO2th8fUNfnx5fugilfJvhTIz-3SZAR9AVJofXLUne09pFnPrK0QG8B7hZCI2iH1oSr3QgJFXfN1FMFqtJHQEfeRarAbx-kLBBhsauVpcYfI9Sj_kJFG2VYNI5wzmMhQkZWW12de-nE4Mygaf8yYOl9lSSrJTGzit_jvD1ivIDyLbH93dhQiSwieU87CDqq0Uuf6hrYh0-r5zFIG-a10gmP076O_LtidyQiRCBdMXcEtp1A5cCvRhzxICZlvhrCsOUWZNIY',
      category: 'boutique'
    };

    onAddCustomProduct(customSundaeProduct);
    playCrystalChime();
    setSuccessMode(true);
    setTimeout(() => {
      setSuccessMode(false);
    }, 4000);
  };

  // Clean slate configurations
  const handleReset = () => {
    setSelectedScoops([]);
    setSelectedSauces([]);
    setSelectedToppings([]);
    playBubbleSound();
  };

  return (
    <section className="relative py-20 min-h-screen w-full overflow-hidden bg-[#fffdfb]">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden select-none">
        <img
          src={sundaeBgUrl}
          onError={handleBgError}
          alt="Virtual Sundae Pattern"
          className="w-full h-full object-cover opacity-18 mix-blend-multiply transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />
        {/* Symmetrical premium warm-cream overlay to guarantee excellent readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffdfb]/92 via-[#fffdfb]/65 to-[#fffdfb]/92" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
        {/* Title description bar */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <ShinyText
          text="✦ VIRTUAL STUDIO WORKBENCH ✦"
          disabled={false}
          speed={2}
          color="#006e20"
          shineColor="#ffffff"
          spread={120}
          className="font-display text-[13px] uppercase tracking-[0.3em] font-bold bg-[#90f691]/20 border border-[#90f691]/30 px-4.5 py-1.5 rounded-full inline-block"
        />
        <SplitText
          text="至选圣代工坊"
          className="font-serif text-[38px] md:text-[54px] text-[#6c2f00] leading-none block"
          tag="h2"
          delay={120}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <p className="font-sans text-sm text-[#54433a] leading-relaxed">
          化身哈根达斯西点总厨，依照您挑剔的感官喜好。任意堆叠多层口感脂香，搭配意大利进口水晶瓷器与金箔。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Configurations controller panels */}
        <div className="lg:col-span-7 flex flex-col space-y-6">

          {/* STEP 1: Cup vessel picker */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#ffe9e3] shadow-xs space-y-4">
            <h3 className="font-serif text-[18px] font-bold text-[#6c2f00] flex items-center gap-2">
              <span className="p-1 rounded bg-[#6c2f00] text-white text-[10px] uppercase font-sans">01</span>
              选择尊享盛器 (Vessel Selection)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cups.map((cup) => {
                const isSelected = selectedCup.id === cup.id;
                return (
                  <button
                    key={cup.id}
                    onClick={() => {
                      setSelectedCup(cup);
                      playBubbleSound();
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer select-none relative
                      ${isSelected 
                        ? 'border-[#6c2f00] bg-[#fff1ed] shadow-xs text-[#6c2f00]' 
                        : 'border-[#ffe9e3] hover:border-[#6c2f00]/30 text-[#54433a]'
                      }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex w-4 h-4 rounded-full bg-[#006e20] text-white items-center justify-center text-[10px] font-bold">✓</span>
                    )}
                    <span className="block font-sans text-xs font-semibold mb-1 opacity-60">
                      {cup.id.substring(4).toUpperCase()} VESSEL
                    </span>
                    <span className="block font-display text-sm font-bold leading-tight min-h-[40px] flex items-center justify-center">
                      {cup.name}
                    </span>
                    <span className="block font-serif text-[14px] text-[#b97a20] font-bold mt-2">
                      ¥ {cup.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Ice milk scoop layer appenders */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#ffe9e3] shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-[18px] font-bold text-[#6c2f00] flex items-center gap-2">
                <span className="p-1 rounded bg-[#6c2f00] text-white text-[10px] uppercase font-sans">02</span>
                堆叠口味球 (Scoops Collection)
              </h3>
              <span className="font-sans text-xs text-[#b97a20] font-bold">
                已叠 {selectedScoops.length} / 3 球
              </span>
            </div>

            {/* Dynamic visual slot list */}
            {selectedScoops.length > 0 && (
              <div className="bg-[#fff8f6] p-4.5 rounded-2xl border border-dashed border-[#ffe9e3] flex flex-wrap gap-2.5">
                {selectedScoops.map((scoop, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#ffe9e3] text-xs font-sans text-[#6c2f00]"
                  >
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: scoop.color }} />
                    <span className="font-medium">第 {idx + 1} 层：{scoop.name.replace('球', '')}</span>
                    <button 
                      onClick={() => handleRemoveScoop(idx)}
                      className="text-red-500 hover:text-red-700 ml-1.5 focus:outline-none cursor-pointer"
                      title="Remove Layer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {scoops.map((scoop) => {
                const isLimit = selectedScoops.length >= 3;
                return (
                  <button
                    key={scoop.id}
                    disabled={isLimit}
                    onClick={() => handleAddScoop(scoop)}
                    className={`p-3 rounded-xl border text-center transition-all relative flex flex-col justify-between min-h-[110px]
                      ${isLimit 
                        ? 'opacity-40 border-[#ffe9e3] cursor-not-allowed bg-[#fff8f6]' 
                        : 'border-[#ffe9e3] hover:border-[#6c2f00] hover:bg-[#fff1ed]/20 cursor-pointer'
                      }`}
                  >
                    <span className="w-7 h-7 rounded-full mx-auto block mb-2.5 shadow-sm border border-black/10" style={{ backgroundColor: scoop.color }} />
                    <span className="block font-sans text-[11px] font-bold leading-tight text-[#6c2f00] line-clamp-2">
                      {scoop.name.replace('球', '').replace('顶级', '').replace('特供', '')}
                    </span>
                    <span className="block font-serif text-xs text-[#b97a20] font-bold mt-1">
                      + ¥{scoop.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3 & 4: Sub-ingredients checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sauces checklist */}
            <div className="bg-white rounded-3xl p-6 border border-[#ffe9e3] space-y-4">
              <h4 className="font-serif text-[16px] font-bold text-[#6c2f00] flex items-center gap-1.5">
                <span className="p-0.5 px-1.5 rounded bg-[#6c2f00] text-white text-[9px] font-sans">03</span>
                浇淋酱汁 (Sauces Drizzle)
              </h4>
              <div className="space-y-2">
                {sauces.map((sauce) => {
                  const isChecked = selectedSauces.some(s => s.id === sauce.id);
                  return (
                    <div 
                      key={sauce.id}
                      onClick={() => handleToggleSauce(sauce)}
                      className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer select-none transition-colors
                        ${isChecked ? 'border-[#6c2f00] bg-[#fff1ed]/30 text-[#6c2f00]' : 'border-[#ffe9e3] hover:bg-[#fff8f6]'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs text-white
                          ${isChecked ? 'bg-[#6c2f00] border-[#6c2f00]' : 'border-[#ffe9e3]'}`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="font-sans text-[12.5px] font-medium">{sauce.name}</span>
                      </div>
                      <span className="font-serif text-xs text-[#b97a20] font-bold">+ ¥{sauce.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Toppings checklist */}
            <div className="bg-white rounded-3xl p-6 border border-[#ffe9e3] space-y-4">
              <h4 className="font-serif text-[16px] font-bold text-[#6c2f00] flex items-center gap-1.5">
                <span className="p-0.5 px-1.5 rounded bg-[#6c2f00] text-white text-[9px] font-sans">04</span>
                点缀配饰 (Gilded Garnish)
              </h4>
              <div className="space-y-2">
                {toppings.map((top) => {
                  const isChecked = selectedToppings.some(t => t.id === top.id);
                  return (
                    <div 
                      key={top.id}
                      onClick={() => handleToggleTopping(top)}
                      className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer select-none transition-colors
                        ${isChecked ? 'border-[#6c2f00] bg-[#fff1ed]/30 text-[#6c2f00]' : 'border-[#ffe9e3] hover:bg-[#fff8f6]'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs text-white
                          ${isChecked ? 'bg-[#6c2f00] border-[#6c2f00]' : 'border-[#ffe9e3]'}`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="font-sans text-[12.5px] font-medium flex items-center gap-1">
                          {top.id.includes('gold') && <Sparkles className="w-3 h-3 text-yellow-500" />}
                          {top.name}
                        </span>
                      </div>
                      <span className="font-serif text-xs text-[#b97a20] font-bold">+ ¥{top.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Right Active layered visualizer display */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-[2rem] p-8 border border-[#ffe9e3] relative shadow-md">
          {/* Overlay success notifications */}
          <AnimatePresence>
            {successMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-4 rounded-3xl bg-[#6c2f00]/95 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-8 text-center text-white"
              >
                <div className="p-4 bg-white/10 rounded-full border border-white/20 mb-4 animate-bounce-short">
                  <Award className="w-12 h-12 text-[#ffdbc9]" />
                </div>
                <h3 className="font-serif text-[24px] font-bold mb-2 text-[#ffdbc9]">加入配售成功！</h3>
                <p className="font-sans text-xs text-[#ffe9e3]/80 max-w-sm mb-6">
                  您的专属手作圣代已经注册至配售单中。我们将调遣专业极冷鲜配专车为您制作并配送。
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={onOpenCart}
                    className="bg-white text-[#6c2f00] font-display text-xs px-6 py-2.5 rounded-full font-bold cursor-pointer"
                  >
                    前往我的配餐单
                  </button>
                  <button
                    onClick={() => setSuccessMode(false)}
                    className="border border-white/40 hover:bg-white/10 text-white font-sans text-xs px-5 py-2.5 rounded-full cursor-pointer"
                  >
                    继续设计
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <span className="text-center font-display text-xs uppercase tracking-[0.2em] text-[#b97a20] block font-semibold">
              ✦ REAL-TIME 3D VISUALIZATION ✦
            </span>

            {/* Simulated 3D Pile Visualizer block */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: 1000 }}
              className={`h-64 rounded-2xl relative overflow-hidden flex flex-col items-center justify-end p-8 border hover:shadow-md transition-all duration-700 cursor-grab active:cursor-grabbing ${
                lightingMode === 'sunset' 
                  ? 'bg-gradient-to-tr from-[#ffe0cc] via-[#fff5ed] to-[#fed7aa] border-orange-200' 
                  : 'bg-[#fff8f6] border-[#ffe9e3]'
              }`}
            >
              {/* Ambient Golden Hour Light Filter overlay */}
              {lightingMode === 'sunset' && (
                <div className="absolute inset-0 bg-[#e05300]/5 pointer-events-none transition-opacity duration-700 select-none mix-blend-color-burn" />
              )}

              <div className="absolute top-4 left-4 text-[10px] uppercase font-sans tracking-widest text-[#b97a20] font-bold flex items-center gap-2">
                <span>圣代结构堆栈 (Sundae Layers)</span>
                <span className="hidden sm:inline bg-[#b97a20]/10 text-[#b97a20] px-2 py-0.5 rounded-md text-[9px] tracking-normal font-medium animate-pulse">
                  🖱️ 移动鼠标进行 3D 旋转赏析
                </span>
              </div>
              
              {/* Top tools controls container */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-50">
                {/* Reset trigger */}
                <button 
                  onClick={handleReset}
                  className="text-xs text-red-500 hover:text-red-700 bg-white shadow-xs p-1.5 px-3 rounded-full flex items-center gap-1 cursor-pointer select-none border border-red-100 hover:bg-red-50/50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 清空
                </button>
              </div>

              {/* Lighting Toggle Button moved to the bottom right corner */}
              <button
                onClick={() => {
                  setLightingMode(prev => prev === 'studio' ? 'sunset' : 'studio');
                  playBubbleSound();
                }}
                className={`absolute bottom-3 right-3 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer select-none border transition-all duration-300 font-bold shadow-xs active:scale-95 z-50
                  ${lightingMode === 'sunset' 
                    ? 'bg-amber-600 text-white border-amber-500 hover:bg-amber-700 shadow-md shadow-orange-500/20' 
                    : 'bg-white text-[#6c2f00] border-[#ffe9e3] hover:bg-[#fff8f6]'
                  }`}
              >
                {lightingMode === 'sunset' ? (
                  <>
                    <Sunset className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                    <span>落日晚霞 (Sunset)</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>摄影棚光 (Studio)</span>
                  </>
                )}
              </button>

              {/* The stack layers items with interactive springy 3D tilt and ambient lighting filter */}
              <motion.div 
                animate={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`w-48 flex flex-col items-center relative select-none pt-12 pb-4 transition-all duration-700 ${
                  lightingMode === 'sunset' 
                    ? 'saturate-125 contrast-105 brightness-[1.02] drop-shadow-[0_12px_20px_rgba(234,88,12,0.25)]' 
                    : ''
                }`}
              >
                
                {/* 1. TOppings: Floating premium physical garnish illustrations */}
                {selectedToppings.length > 0 && (
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -top-6 left-0 right-0 flex justify-center gap-1.5 z-50 flex-wrap"
                  >
                    {selectedToppings.map((top, idx) => {
                      const isGold = top.id.includes('gold');
                      const borderCol = isGold ? 'border-yellow-400' : 'border-[#ffe9e3]';
                      const bgCol = isGold ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' : 'bg-amber-800 text-white';
                      return (
                        <motion.div 
                          key={idx} 
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2 + idx, repeat: Infinity, ease: 'easeInOut' }}
                          className={`text-[10px] ${bgCol} px-3 py-1 rounded-full shadow-md font-bold border ${borderCol} flex items-center gap-1`}
                        >
                          {isGold && <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />}
                          {top.name}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {/* 2. SYRUP DRIPS: Animated dripping sauce cascades sliding down the scoops */}
                {selectedSauces.length > 0 && (
                  <div className="absolute inset-x-0 top-6 bottom-16 pointer-events-none z-40 flex justify-center gap-3">
                    {selectedSauces.map((sauce, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: [12, 45, 38] }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="w-1.5 rounded-b-full shadow-inner opacity-85"
                        style={{ 
                          backgroundColor: sauce.color,
                          marginTop: `${idx * 14}px`,
                          boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.4)'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* 3. SCOOPS: Overlapping 3D glossy spheres with soft reflections and spring-loaded drop bounds */}
                <div className="relative w-full h-24 mb-1 flex items-center justify-center">
                  {selectedScoops.length === 0 ? (
                    <div className="text-xs text-center text-gray-400 font-sans tracking-wide italic absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-gray-300 text-3xl">icecream</span>
                      <span>请添加第 1 层风味球</span>
                    </div>
                  ) : (
                    selectedScoops.map((scoop, idx) => {
                      // Custom positions inside and sitting on the goblet rim
                      const offsetClasses = [
                        'bottom-0 scale-100 z-10 translate-y-3', 
                        'bottom-3 -translate-x-3 scale-95 z-20', 
                        'bottom-6 translate-x-3 scale-90 z-20'
                      ];
                      return (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0, y: -150, rotate: idx * 10 - 5 }}
                          animate={{ scale: 1, y: 0, rotate: 0 }}
                          transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                          className={`absolute w-16 h-16 rounded-full shadow-lg border-2 border-white/70 flex flex-col items-center justify-center text-[10px] font-serif font-black text-white tracking-widest ${offsetClasses[idx]}`}
                          style={{ 
                            backgroundColor: scoop.color,
                            backgroundImage: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.45) 0%, rgba(0,0,0,0.2) 100%)`
                          }}
                        >
                          {/* Inner soft cream gloss flare reflection */}
                          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none" />
                          
                          {/* Scoop title banner */}
                          <span className="bg-black/20 backdrop-blur-3xs px-1.5 py-0.5 rounded text-[8.5px] uppercase font-sans tracking-wide shadow-2xs font-semibold scale-90">
                            {scoop.name.replace('球', '')}
                          </span>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* 4. GOBLET: Premium Translucent Glass Goblet representing selected vessel */}
                <motion.div
                  onClick={() => {
                    playCrystalChime();
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -4,
                    transition: { type: 'spring', stiffness: 350, damping: 12 }
                  }}
                  whileTap={{ 
                    scale: 0.95, 
                    rotate: [0, -3, 3, 0],
                    transition: { duration: 0.25 } 
                  }}
                  className="flex flex-col items-center cursor-pointer select-none group relative z-30 perspective-1000"
                >
                  {/* Virtual rising interactive bubbles within the cup when hovered */}
                  <div className="absolute bottom-16 w-32 h-18 overflow-hidden pointer-events-none z-35 flex justify-around items-end px-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/40 border border-white/20"
                        animate={{
                          y: [0, -80],
                          x: [0, Math.sin(i) * 12, 0],
                          opacity: [0, 0.9, 0],
                          scale: [0.6, 1.2, 0.5]
                        }}
                        transition={{
                          duration: 1.5 + i * 0.4,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Cup Physical Bowl rendering */}
                  {selectedCup.id === 'cup-waffle' ? (
                    /* Textured Egg Waffle Cone Bowl style - Opaque & Highly detailed */
                    <div 
                      className="w-32 h-18 rounded-b-[40px] rounded-t-xl pt-2 flex flex-col items-center justify-center text-center px-4 relative transition-all duration-500 shadow-lg border-x-4 border-b-4 border-[#b47a46]"
                      style={{ 
                        backgroundColor: '#e3a869', // Opaque base
                        backgroundImage: `
                          repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139, 90, 43, 0.15) 10px, rgba(139, 90, 43, 0.15) 12px),
                          repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(139, 90, 43, 0.15) 10px, rgba(139, 90, 43, 0.15) 12px)
                        `,
                        boxShadow: '0 8px 16px -2px rgba(120,60,20,0.3), inset 0 2px 8px rgba(255,180,100,0.4), inset 0 -6px 14px rgba(90,40,10,0.2)'
                      }}
                    >
                      {/* Crinkled waffle crunchy rim */}
                      <div className="absolute -top-1.5 inset-x-0 h-3 flex justify-between px-0.5 pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#e3a869] border-t-2 border-[#ffead0]" />
                        ))}
                      </div>

                      <span className="font-serif text-[10px] font-black uppercase tracking-widest leading-none z-40 bg-[#fffdfa] border-2 border-[#b47a46] px-2.5 py-1 rounded-full text-[#6c2f00] max-w-[95%] truncate shadow-md group-hover:scale-103 transition-transform">
                        {selectedCup.name}
                      </span>
                    </div>
                  ) : selectedCup.id === 'cup-gilt' ? (
                    /* Royal Gilt Palace Cup - Opaque Royal Gold Velvet-Cream style */
                    <div 
                      className="w-32 h-18 rounded-b-[35px] rounded-t-sm pt-2 flex flex-col items-center justify-center text-center px-4 relative transition-all duration-500 shadow-xl border-x-4 border-b-4 border-amber-500"
                      style={{ 
                        backgroundColor: '#6c1512', // Rich royal red/burgundy ceramic (highly visible & high contrast)
                        backgroundImage: 'radial-gradient(circle at 50% 120%, #991c18 0%, #460907 100%)',
                        boxShadow: '0 10px 20px -3px rgba(0,0,0,0.45), inset 0 3px 10px rgba(255,215,0,0.5)'
                      }}
                    >
                      {/* Luxurious imperial gold strip ornament lines */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 z-35" />
                      <div className="absolute bottom-1 inset-x-4 h-1 rounded-full bg-amber-400 z-35" />

                      <span className="font-serif text-[10px] font-black uppercase tracking-widest leading-none z-40 bg-amber-50 border-2 border-amber-500 px-2.5 py-1 rounded-full text-amber-950 max-w-[95%] truncate shadow-md group-hover:scale-103 transition-transform">
                        👑 {selectedCup.name}
                      </span>
                    </div>
                  ) : (
                    /* Venetian Crystal Goblet - Turned into clean premium opaque glass/ceramic with gold trim */
                    <div 
                      className="w-32 h-18 rounded-b-[40px] rounded-t-sm pt-2 flex flex-col items-center justify-center text-center px-4 relative transition-all duration-500 shadow-xl border-x-4 border-b-4 border-sky-400"
                      style={{ 
                        backgroundColor: '#f1f8fc', // Solid premium sky-white glazed porcelain
                        backgroundImage: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #d4ebf7 100%)',
                        boxShadow: '0 8px 16px -2px rgba(14,116,144,0.15), inset 0 2px 10px rgba(255,255,255,0.9), inset 0 -4px 10px rgba(186,230,253,0.4)'
                      }}
                    >
                      {/* Shiny golden elegant bowl rim */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 z-35" />

                      <span className="font-serif text-[10px] font-black uppercase tracking-widest leading-none z-40 bg-white border-2 border-sky-500 px-2.5 py-1 rounded-full text-sky-950 max-w-[95%] truncate shadow-md group-hover:scale-103 transition-transform">
                        {selectedCup.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Goblet Stems & Foot bases (styled only for non-waffle cups since waffle bowl stands on its own base!) */}
                  {selectedCup.id !== 'cup-waffle' && (
                    <>
                      {/* Goblet Stem */}
                      <div 
                        className="w-4 h-9 border-x transition-all duration-500 relative" 
                        style={{ 
                          backgroundColor: selectedCup.id === 'cup-gilt' ? '#b45309' : '#bae6fd',
                          borderColor: selectedCup.id === 'cup-gilt' ? '#f59e0b' : '#38bdf8',
                          boxShadow: selectedCup.id === 'cup-gilt' ? 'inset 0 0 4px rgba(0,0,0,0.3)' : ''
                        }} 
                      >
                        {/* Stem vertical gold reflection */}
                        {selectedCup.id === 'cup-gilt' && (
                          <div className="absolute inset-y-0 left-1 w-0.5 bg-yellow-300 pointer-events-none" />
                        )}
                        {selectedCup.id === 'cup-crystal' && (
                          <div className="absolute inset-y-0 left-1 w-0.5 bg-white pointer-events-none" />
                        )}
                      </div>

                      {/* Foot base element */}
                      <div 
                        className="w-20 h-4 rounded-full border transition-all duration-500 shadow-md relative" 
                        style={{ 
                          backgroundColor: selectedCup.id === 'cup-gilt' ? '#6c1512' : '#f1f8fc',
                          borderColor: selectedCup.id === 'cup-gilt' ? '#f59e0b' : '#38bdf8',
                          backgroundImage: selectedCup.id === 'cup-gilt' 
                            ? 'radial-gradient(circle, #991c18 0%, #460907 100%)' 
                            : 'radial-gradient(circle, #ffffff 0%, #d4ebf7 100%)',
                          boxShadow: 'inset 0 1.5px 3px rgba(255,255,255,0.8), 0 3px 6px rgba(0,0,0,0.1)'
                        }} 
                      >
                        {/* Gold or white circular outline highlights */}
                        <div className={`absolute inset-x-2 top-0.5 h-[1.5px] rounded-full pointer-events-none ${
                          selectedCup.id === 'cup-gilt' ? 'bg-amber-400' : 'bg-white'
                        }`} />
                      </div>
                    </>
                  )}

                  {/* Cute small decorative tray stand base underneath waffle cup so it looks highly complete */}
                  {selectedCup.id === 'cup-waffle' && (
                    <div className="w-24 h-2 bg-[#8c5a2c] rounded-full shadow-md border border-[#5a3610] mt-0.5 relative">
                      <div className="absolute inset-x-2 top-0.5 h-[1px] bg-[#dca368] rounded-full" />
                    </div>
                  )}
                </motion.div>

              </motion.div>
            </div>

            {/* Estimated Nutrition breakdown list */}
            <div className="bg-[#fff8f6] p-5 rounded-2xl border border-[#ffe9e3] space-y-4">
              <span className="font-sans text-xs font-bold text-[#6c2f00] flex items-center gap-1.5 uppercase tracking-widest">
                <Scale className="w-4 h-4 text-[#b97a20]" />
                感官及品质评估 (Sensory Rating)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-3 rounded-xl border border-[#ffe9e3]">
                  <span className="block text-[11px] opacity-65 text-gray-500 font-sans uppercase">能量预估</span>
                  <span className="block font-serif text-[18px] font-bold text-[#6c2f00]">{estCalories} kcal</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#ffe9e3]">
                  <span className="block text-[11px] opacity-65 text-gray-500 font-sans uppercase">动物蛋白</span>
                  <span className="block font-serif text-[18px] font-bold text-[#6c2f00]">{estProtein.toFixed(1)} g</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#ffe9e3]">
                  <span className="block text-[11px] opacity-65 text-gray-500 font-sans uppercase">糖化指数</span>
                  <span className="block font-serif text-[18px] font-bold text-[#6c2f00]">
                    {avgSweetness === 5 ? '高级脂香' : avgSweetness === 4 ? '甜爽怡人' : '低碳幽雅'}
                  </span>
                </div>
              </div>
              <p className="font-sans text-[11px] text-[#54433a] leading-relaxed flex items-center gap-1 select-none opacity-80">
                <Info className="w-3.5 h-3.5 text-[#b97a20] flex-none" />
                所有乳脂、覆盆子等原浆均来源于认证无污染极冷庄园。配方拒绝任何人工乳化粉。
              </p>
            </div>
          </div>

          {/* Pricing bar and CTA triggers */}
          <div className="pt-8 border-t border-[#ffe9e3] flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-sans text-xs text-[#54433a] opacity-85 block uppercase tracking-wider">配售价值评估 (Total Cost)</span>
              <span className="font-serif text-[38px] font-bold text-[#6c2f00] leading-none block">
                ¥ {totalPrice}
              </span>
            </div>

            <button
              disabled={selectedScoops.length === 0}
              onClick={handleCheckoutSundae}
              className={`w-full sm:w-auto px-10 py-4.5 rounded-full font-display text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2
                ${selectedScoops.length === 0
                  ? 'bg-gray-200 border border-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#6c2f00] text-white hover:bg-[#8b4513] hover:shadow-lg cursor-pointer transform hover:scale-102 active:scale-98 shadow-sm'
                }`}
            >
              <ShoppingCart className="w-4 h-4 text-[#ffdbc9]" />
              加至配售账单
            </button>
          </div>

        </div>

      </div>

    </div>
    </section>
  );
}
