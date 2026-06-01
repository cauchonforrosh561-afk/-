import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Compass, Sparkles, ArrowRight, BookOpen, Quote, ShieldAlert, Award, Star } from 'lucide-react';
import { HISTORIAL_YEARS, FLAVORS } from '../data';
import CircularText from './CircularText';
import ShinyText from './ShinyText';
import SplitText from './SplitText';
import { playBubbleSound } from '../utils/audio';
import HistoricalCarousel from './HistoricalCarousel';
import OrbitImages from './OrbitImages';

interface HistoricalHomeProps {
  onNavTab: (tabId: string) => void;
}

export default function HistoricalHome({ onNavTab }: HistoricalHomeProps) {
  const [selectedDecadeIdx, setSelectedDecadeIdx] = useState(0);
  const [heroImageIdx, setHeroImageIdx] = useState(0);

  // Scroll Parallax setup with spring settings for silky-smooth response
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Create an ultra-smooth spring motion to dampen fast scroll gestures and deliver perfect tactile feedback
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 85,
    damping: 24,
    mass: 0.5,
    restDelta: 0.001
  });

  // Background speed 0.5x (scrolls down by positive scroll offset)
  const bgY = useTransform(smoothScrollY, [0, 1200], [0, 600]);
  // Background slow zoom camera effect (creates visual depth expansion)
  const bgScale = useTransform(smoothScrollY, [0, 1200], [1, 1.06]);

  // Foreground speed 1.2x (drifts up by -20% of scroll offset)
  const fgY = useTransform(smoothScrollY, [0, 1200], [0, -240]);

  // Multi-dimensional nested parallax layers (rotating visual elements)
  const flY1 = useTransform(smoothScrollY, [0, 1200], [0, -420]);
  const flY2 = useTransform(smoothScrollY, [0, 1200], [0, -144]);

  // Smooth fade-out of hero content as user scrolls down
  const heroOpacity = useTransform(smoothScrollY, [0, 650], [1, 0]);

  const heroImages = [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjhbF0PGC9nw0rSu-Y4vfiN6QDXEBZ2Eo9DeqLe4r04KxjE6YtJ3unVD_zABWEVxWP97vK8DOYaMgWyi4dRVi7S4mTb5iiRj7QJz8gno1fqW4OWLaDxQrah-aDIhHk_3fZG6-aUnJYCEiFNIK0dTWTm1_gOe-9JN6GQhRJz6NgsvW2SRah2Q6xzu-5Ur7eAqtB2EILiD2ZvMR_NhCvvxU1woDAvZ-CqrZnfnOwUKEWCUP_ZXkagXLr1J8w0yGePt-mWyzOX0_m4TTZ',
      title: '60载匠心奢华传奇',
      subtitle: '每一勺都是艺术的熔融印迹',
      accent: '香草 • 巧克力 • 咖啡 创始之作'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7F2AisO2th8fUNfnx5fugilfJvhTIz-3SZAR9AVJofXLUne09pFnPrK0QG8B7hZCI2iH1oSr3QgJFXfN1FMFqtJHQEfeRarAbx-kLBBhsauVpcYfI9Sj_kJFG2VYNI5wzmMhQkZWW12de-nE4Mygaf8yYOl9lSSrJTGzit_jvD1ivIDyLbH93dhQiSwieU87CDqq0Uuf6hrYh0-r5zFIG-a10gmP076O_LtidyQiRCBdMXcEtp1A5cCvRhzxICZlvhrCsOUWZNIY',
      title: '比法式金碧更甜美',
      subtitle: '专属高级沙龙定制圣代极奢体验',
      accent: '尊享凡尔赛鎏金食光'
    }
  ];

  const [decadeBgImage] = useState<string>('/src/assets/images/vintage_table_salon_bg_1779841262706.png');

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero with Crossfading Motion and Parallax Title Overlays */}
      <section ref={heroRef} className="relative w-full h-[85vh] md:h-[95vh] flex items-center justify-center overflow-hidden bg-[#2c160e]">
        
        {/* Background Layer: Scrolling 0.5x speed with slow zoom-in camera depth */}
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute w-full h-[140%] -top-[20%] left-0 right-0 z-0 pointer-events-none will-change-transform"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroImageIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.55, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.8 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[heroImageIdx].url})` }}
            />
          </AnimatePresence>
        </motion.div>
        
        {/* Absolute dark screen filter */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c160e] via-transparent to-black/30 pointer-events-none z-10" />

        {/* Celestial Orbit of Häagen-Dazs gourmet creations */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <OrbitImages
            images={FLAVORS.slice(0, 6).map(f => f.imageUrl)}
            shape="ellipse"
            radiusX={540}
            radiusY={130}
            rotation={-10}
            duration={60}
            itemSize={85}
            responsive={true}
            showPath={true}
            pathColor="rgba(255, 219, 201, 0.15)"
            pathWidth={1.5}
            className="w-full max-w-[1400px] h-[1400px] pointer-events-auto"
          />
        </motion.div>

        {/* Vintage Frame borders */}
        <div className="absolute inset-4 md:inset-8 border border-[#ffdbc9]/15 pointer-events-none z-20 rounded-2xl flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <span className="font-serif text-[#ffdbc9] text-[10px] tracking-[0.4em] uppercase">Maison de l'Art</span>
            <span className="font-serif text-[#ffdbc9] text-[10px] tracking-[0.4em] uppercase">Pure & True</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="font-serif text-[#ffdbc9] text-[10px] tracking-[0.4em] uppercase">DEPUIS 1961</span>
            <span className="font-serif text-[#ffdbc9] text-[10px] tracking-[0.4em] uppercase">HAAGEN-DAZS.CN</span>
          </div>
        </div>

        {/* Left Floating Ornament (Nested 3D depth layer at 1.35x speed) */}
        <motion.div
          style={{ y: flY1, opacity: heroOpacity }}
          className="hidden lg:flex absolute left-12 top-[32%] z-20 flex-col items-center gap-2 pointer-events-none text-[#ffdbc9]/40 select-none will-change-transform"
        >
          <Sparkles className="w-8 h-8 animate-pulse text-[#ffdbc9]/30" />
          <div className="h-24 w-[1px] bg-gradient-to-b from-[#ffdbc9]/30 to-transparent" />
          <span className="font-serif text-[10px] uppercase tracking-[0.4em] [writing-mode:vertical-lr] text-[#ffdbc9]/50">
            CREATIVE LUXURY
          </span>
        </motion.div>

        {/* Right Floating Ornament (Nested 3D depth layer at 1.12x speed) */}
        <motion.div
          style={{ y: flY2, opacity: heroOpacity }}
          className="hidden lg:flex absolute right-12 bottom-[25%] z-20 flex-col items-center gap-3 pointer-events-none text-[#ffdbc9]/40 select-none will-change-transform"
        >
          <span className="font-serif text-[10px] uppercase tracking-[0.4em] [writing-mode:vertical-lr] text-[#ffdbc9]/50">
            ARTISANAL CRAFT
          </span>
          <div className="h-20 w-[1px] bg-gradient-to-t from-[#ffdbc9]/30 to-transparent" />
          <div className="w-8 h-8 rounded-full border border-[#ffdbc9]/25 flex items-center justify-center">
            <span className="font-serif text-[9px] text-[#ffdbc9]/40">H•D</span>
          </div>
        </motion.div>

        {/* Widescreen Hero content overlays: Scrolling 1.2x speed with auto fade-out */}
        <motion.div
          style={{ y: fgY, opacity: heroOpacity }}
          className="relative z-25 max-w-4xl mx-auto text-center px-4 flex flex-col items-center will-change-transform"
        >
          {/* Circular float seal emblem */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="mb-8 floating-icecream bg-white/95 p-3.5 rounded-full shadow-xl shadow-black/20 border border-[#ffe9e3]"
          >
            <div className="border border-dashed border-[#6c2f00] px-4 py-1 rounded-full flex items-center justify-center">
              <ShinyText
                text="Est. 1961"
                speed={2.2}
                color="#6c2f00"
                shineColor="#dfa77b"
                className="font-sans font-bold text-[10px] uppercase tracking-[0.25em]"
              />
            </div>
          </motion.div>

          {/* Crossfaded Title texts */}
          <AnimatePresence mode="wait">
            <motion.div
              key={heroImageIdx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="font-serif text-[42px] sm:text-[62px] md:text-[84px] text-[#fff8f6] tracking-tight leading-none drop-shadow-md">
                {heroImages[heroImageIdx].title}
              </h1>
              <p className="font-sans text-[#ffdbc9] text-base md:text-[22px] tracking-[0.1em] font-light max-w-xl mx-auto leading-relaxed">
                {heroImages[heroImageIdx].subtitle}
              </p>
              <div className="font-serif text-[#ffb68c] text-[12px] uppercase tracking-[0.3em] font-semibold">
                {heroImages[heroImageIdx].accent}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Actions CTA button clusters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => onNavTab('sundae')}
              className="bg-[#6c2f00] hover:bg-[#8b4513] text-[#fff8f6] border border-[#ffb68c]/30 hover:shadow-lg transform hover:scale-105 active:scale-[0.98] transition-all duration-300 px-8 py-4 rounded-full font-display text-sm tracking-widest cursor-pointer select-none flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#ffdbc9]" />
              设计我的定制圣代
            </button>
            <button
              onClick={() => onNavTab('flavors')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/35 text-white px-8 py-4 rounded-full font-sans text-sm tracking-wider cursor-pointer select-none transition-all flex items-center gap-2"
            >
              寻觅经典风味
              <ArrowRight className="w-4 h-4 text-[#ffdbc9]" />
            </button>
          </motion.div>
        </motion.div>

        {/* Bouncing scroll-indicator at page bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 animate-bounce">
          <span className="font-sans text-[10px] tracking-widest uppercase text-[#ffe9e3]">下滑探索传奇史诗</span>
          <span className="material-symbols-outlined text-white text-lg">expand_more</span>
        </div>
      </section>

      {/* 2. Interactive Historical Decades Slider (Reuben Mattus legacy) */}
      <section className="relative py-24 border-y border-[#ffe9e3] overflow-hidden bg-[#fffdfb]">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-85"
          >
            <source src="https://ik.imagekit.io/vpkooy7vh/6%E6%9C%881%E6%97%A5.mp4?updatedAt=1780275703850" type="video/mp4" />
          </video>
          {/* Symmetrical premium warm-cream overlay to guarantee excellent readability for text and carousel cards */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffdfb]/90 via-[#fffdfb]/55 to-[#fffdfb]/90" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
          
          {/* Header block with elegant typography pairing */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <ShinyText
              text="60 YEARS LANDMARK HISTORIES"
              disabled={false}
              speed={2}
              className="font-display text-[14px] uppercase tracking-[0.3em] font-bold block"
              color="#006e20"
              shineColor="#fff1ed"
              spread={120}
              pauseOnHover={true}
            />
            <SplitText
              text="六十载纯粹初心，史诗级跨越"
              className="font-serif text-[36px] md:text-[54px] text-[#6c2f00] leading-tight block"
              delay={80}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              tag="h2"
            />
            <p className="text-[#54433a] font-sans text-base max-w-xl mx-auto">
              拉动下方光轴，重温 Reuben Mattus 颠覆纽约冰淇淋界的传世传奇，感受每一个里程碑的极致与优雅。
            </p>
          </div>

          {/* 3D Stereoscopic Decades Carousel with Spring Physics */}
          <HistoricalCarousel />

        </div>
      </section>

      {/* 3. Pure Ingredient Guarantee block with subtle table salon background */}
      <section className="relative py-24 border-b border-[#ffe9e3] bg-[#fffdfb] overflow-hidden">
        
        {/* Absolute sketch outline salon tabletop backdrop */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="https://i.postimg.cc/nVDy2gn1/a8dab78f13d6112409a82f0bf17042c9.jpg"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.includes('.jpg')) {
                img.src = "https://i.postimg.cc/nVDy2gn1/a8dab78f13d6112409a82f0bf17042c9.png";
              } else if (img.src.includes('.png')) {
                img.src = "https://i.postimg.cc/nVDy2gn1/a8dab78f13d6112409a82f0bf17042c9.jpeg";
              } else if (img.src.includes('.jpeg')) {
                img.src = "https://i.postimg.cc/nVDy2gn1/a8dab78f13d6112409a82f0bf17042c9.webp";
              }
            }}
            alt="Guarantee Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 mix-blend-multiply transition-opacity duration-300"
          />
          {/* Symmetrical soft light gradient overlay to maintain absolute clear contrast and typography separation */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffdfb]/80 via-[#fffdfb]/30 to-[#fffdfb]/80" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
          
          {/* Centered Premium Title and Brand Philosophy Header */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <ShinyText
              text="The Gilded Rule of Reuben Mattus"
              disabled={false}
              speed={2.5}
              className="font-serif text-[18px] md:text-[22px] italic block"
              color="#b97a20"
              shineColor="#ffe38c"
              spread={120}
              pauseOnHover={false}
            />
            <SplitText
              text="5种至臻真材实料，概不退让。"
              className="font-serif text-[38px] md:text-[54px] text-[#6c2f00] leading-tight block"
              tag="h2"
              delay={80}
              duration={0.8}
              ease="back.out(1.2)"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
            />
            <p className="text-[#54433a] font-sans text-base leading-relaxed max-w-3xl mx-auto">
              鲁本创造的哈根达斯并非奇迹，而是尊崇最基本的食物尊严。市面上充斥着廉价代乳和人造香精，我们坚持回归最初。仅使用新鲜全脂牛奶、醇厚鲜奶油、纯天然蛋黄、农庄砂糖，以及来自自然本源的草木香料（如天然香草荚），构筑丝缎般的梦幻乳脂网印。
            </p>
            
            {/* Horizontal Flex Cards for Core Commitments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6 text-left">
              {[
                { name: '0% 人造防腐材料', desc: '唯有依靠无菌全密闭低温冷链保鲜，不屑于使用一滴化学防腐剂' },
                { name: '极少内部空气注入 (Low Overrun)', desc: '普通空气充填可达80%，我们将空气比严格控在20%以下，实现致密和厚润' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white/70 backdrop-blur-xs p-5 rounded-2xl border border-[#ffe9e3]/60 shadow-sm transition-all duration-300 hover:shadow-md">
                  <span className="p-1 px-2.5 rounded bg-[#006e20] text-white text-xs font-bold leading-none mt-1">✓</span>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#6c2f00]">{item.name}</h4>
                    <p className="font-sans text-xs text-[#54433a] leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 2: Magnificent full horizontal grid displaying the four ingredients with custom images */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '手采马达加斯加香草', icon: '✦', desc: '手工繁硕授粉结荚，于琥珀色的陈化阴凉中醇厚香溢。', path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4GxW4O1T4E0XMhjqfhilIpHSgpjDQkrzWHSWRaLlHJm4qIqMb1c00TimGLYoHIo23ukFXuz1q75Wg7tYQ1NjT4qU6LnFRcg3KmswdQQhGewVPgT_r3fjQ4cNN3eUIQtNIl872Rfa1DksBmpnNVnIl5S5bHR-G4twZqMyyLqADbKyZCPnkq-Yaspn-_EDLOkHswwgmvyYWuqbEADWBHiAsJF7SZNoLssJjCmxZF-2pTPuMlEP5d6ddWG80aCRRNR8L_O16hKXiV6Bk' },
              { title: '西非黄金可可配比', icon: '✦', desc: '古法木桶焙火，保留原始可可微苦 and 丰沃的黑松露果胶香味。', path: 'https://i.postimg.cc/RFsfkWMy/west-african-cocoa-1780278393215.jpg' },
              { title: '新西兰牧场有机乳源', icon: '✦', desc: '全年 300 天自由放牧，纯生原生乳腺营养，构筑浓重绵乳脂。', path: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIMopRsYy_AcBsE5r7742PJbJaKQgSE1HILakiEP9_fY8mc9obliHbkXCT_RcUe5XLPeJUXMnmzq9ikr1HRb6if6uecJJ4mFK2mvOHoGcuZYGcegBTlqgERk6b1qNxliPG-dDBVONpl6um7yBZSSC_sL-e4s4gEd6490V4Di98oTKnyqWDVGx6GCDpdWY_VQFAuFqUro21XWTfuqyciMNObjGiQM5UTHrcFitT_iNfyOhKimoc4AXo8whPDAn4UFGon6NuaaHQ8UkO' },
              { title: '庄园鲜桃覆盆子汁', icon: '✦', desc: '清晨带露时分手工摘采，冷碾鲜榨保留果酸 and 高抗氧化活性。', path: 'https://i.postimg.cc/CLvtc7TP/peach-raspberry-juice-1780278408279.jpg' }
            ].map((grid, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-[#ffe9e3] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 select-none text-center group">
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border border-[#fff2ee] relative">
                  <img src={grid.path} alt={grid.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6c2f00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h4 className="font-display font-semibold text-[15px] text-[#6c2f00] flex items-center justify-center gap-1.5">
                  <span className="text-[#b97a20]">{grid.icon}</span>
                  {grid.title}
                </h4>
                <p className="font-sans text-[11px] text-[#54433a] leading-relaxed mt-2 px-1">{grid.desc}</p>
              </div>
            ))}

          </div>

        </div>
      </section>



      {/* 4. Artistic Flavor Showcase list with elegant vintage illustration background */}
      <section className="relative py-24 border-b border-[#ffe9e3] bg-[#fffdfb] overflow-hidden">
        
        {/* Absolute vintage illustration backdrop */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="https://i.postimg.cc/4y7FS7C3/45637f7158b42dd5cb8fc3f3ec772036.jpg"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.includes('.jpg')) {
                img.src = "https://i.postimg.cc/4y7FS7C3/45637f7158b42dd5cb8fc3f3ec772036.png";
              } else if (img.src.includes('.png')) {
                img.src = "https://i.postimg.cc/4y7FS7C3/45637f7158b42dd5cb8fc3f3ec772036.jpeg";
              } else if (img.src.includes('.jpeg')) {
                img.src = "https://i.postimg.cc/4y7FS7C3/45637f7158b42dd5cb8fc3f3ec772036.webp";
              }
            }}
            alt="Showcase Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-125 origin-center opacity-48 mix-blend-multiply transition-all duration-300"
          />
          {/* Symmetrical soft light gradient overlay to maintain absolute clear contrast and typography separation */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffdfb]/80 via-[#fffdfb]/25 to-[#fffdfb]/80" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-3">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-[#b97a20] font-bold block">
                CURATED CLASSICS
              </span>
              <h2 className="font-serif text-[38px] md:text-[48px] text-[#6c2f00] leading-none">
                世纪至尊风味
              </h2>
            </div>
            <button
              onClick={() => onNavTab('flavors')}
              className="bg-transparent hover:bg-[#6c2f00]/5 text-[#6c2f00] font-display text-xs tracking-widest border border-[#6c2f00] uppercase px-5 py-3 rounded-full transition-all cursor-pointer flex items-center gap-2"
            >
              浏览所有口味
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FLAVORS.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onNavTab('flavors')}
                className="group cursor-pointer bg-white rounded-3xl p-6 border border-[#ffe9e3] hover:lift flex flex-col items-center"
              >
                <div className="w-48 h-48 rounded-full bg-[#ffe9e3] p-4 relative mb-6 flex items-center justify-center">
                  {idx === 0 && (
                    <CircularText
                      text="  HÄAGEN DAZS  ✦  CLASSIC VANILLA ORIGINE  ✦  "
                      spinDuration={24}
                      onHover="speedUp"
                      className="absolute inset-0 text-[#6c2f00]/25 group-hover:text-[#6c2f00]/40 transition-colors duration-300 font-serif text-[12px] uppercase tracking-[0.15em] font-black z-0 scale-102"
                    />
                  )}
                  {idx === 1 && (
                    <CircularText
                      text="  HÄAGEN DAZS  ✦  INTENSE BELGIAN CHOCOLATE  ✦  "
                      spinDuration={24}
                      onHover="speedUp"
                      className="absolute inset-0 text-[#6c2f00]/25 group-hover:text-[#6c2f00]/40 transition-colors duration-300 font-serif text-[12px] uppercase tracking-[0.15em] font-black z-0 scale-102"
                    />
                  )}
                  {idx === 2 && (
                    <CircularText
                      text="  HÄAGEN DAZS  ✦  SWEET CAROUSEL STRAWBERRY  ✦  "
                      spinDuration={24}
                      onHover="speedUp"
                      className="absolute inset-0 text-[#6c2f00]/25 group-hover:text-[#6c2f00]/40 transition-colors duration-300 font-serif text-[12px] uppercase tracking-[0.15em] font-black z-0 scale-102"
                    />
                  )}

                  <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#ffe9e3]/60 rounded-full scale-95 group-hover:scale-105 transition-transform duration-500" />
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full filter drop-shadow-lg scale-95 group-hover:scale-110 transition-transform duration-500 relative z-10"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#006e20] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full z-20 shadow-xs">
                    甜度 {item.sweetness}/5
                  </span>
                </div>

                <div className="w-full text-center space-y-2">
                  <h3 className="font-serif text-[20px] font-bold text-[#6c2f00]">
                    {item.name}
                  </h3>
                  <span className="font-sans text-[11px] uppercase tracking-widest text-[#b97a20] block font-semibold">
                    {item.englishName}
                  </span>
                  <p className="font-sans text-xs text-[#54433a] leading-relaxed max-w-sm mx-auto line-clamp-3">
                    {item.description}
                  </p>
                  
                  {/* Decorative tag cluster */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-3">
                    {item.tags.map((tag) => (
                      <span key={tag} className="bg-[#fff1ed] text-[#6c2f00] border border-[#ffdbd0] text-[10px] px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
