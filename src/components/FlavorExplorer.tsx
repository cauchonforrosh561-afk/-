import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, RotateCcw, ArrowRight, Award, Flame, Star, StarOff, Sparkles, Check, Info } from 'lucide-react';
import { FLAVORS } from '../data';
import { Flavor } from '../types';
import { playBubbleSound, playCrystalChime } from '../utils/audio';

interface FlavorExplorerProps {
  onAddFlavorToCart: (flavorId: string) => void;
}

export default function FlavorExplorer({ onAddFlavorToCart }: FlavorExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxSweetness, setMaxSweetness] = useState(5);
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);

  // Mini Quiz States
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<Flavor | null>(null);
  const [quizBgUrl, setQuizBgUrl] = useState("https://i.postimg.cc/phFWmG5d/2a4201a1854a13877f8be73486ba4237.png");

  const handleBgError = () => {
    if (quizBgUrl.endsWith('.png')) {
      setQuizBgUrl("https://i.postimg.cc/phFWmG5d/2a4201a1854a13877f8be73486ba4237.jpg");
    } else if (quizBgUrl.endsWith('.jpg')) {
      setQuizBgUrl("https://i.postimg.cc/phFWmG5d/2a4201a1854a13877f8be73486ba4237.jpeg");
    } else if (quizBgUrl.endsWith('.jpeg')) {
      setQuizBgUrl("https://i.postimg.cc/phFWmG5d/2a4201a1854a13877f8be73486ba4237.webp");
    }
  };

  const categories = Array.from(new Set(FLAVORS.map(f => f.category)));

  // Master Quiz definition
  const quizQuestions = [
    {
      q: '若您独处在1961年的曼哈顿雨夜，最想让哪缕声音伴您安神？',
      options: [
        { key: 'A', text: '略带沙哑的复古黑胶萨克斯风 (经典黑可可意境)', category: '经典重乳' },
        { key: 'B', text: '纯净圣洁、不带烟火气的教堂清唱 (天然本源纯奶)', category: '黄金本源' },
        { key: 'C', text: '剧院里正在上演的华丽法式轻歌剧 (多重口感乳酪)', category: '烘焙二重奏' },
        { key: 'D', text: '极简空灵、带雨夜芭蕉摩挲的海浪风声 (清盈雪芭)', category: '果树流莹' }
      ]
    },
    {
      q: '您赞同最动人的食材触觉，必须要来自于？',
      options: [
        { key: 'A', text: '泥土与可可木桶交织出的焙火醇香', category: '经典重乳' },
        { key: 'B', text: '手选并经历了漫长发酵、细看可见的草木籽粒', category: '黄金本源' },
        { key: 'C', text: '法式起酥皮夹藏着的松脆软质消化松饼', category: '烘焙二重奏' },
        { key: 'D', text: '熟透在果实挂枝处的冰爽多汁红艳果浆', category: '果树流莹' }
      ]
    },
    {
      q: '为这道甜品挑一壶搭配的优雅午后饮品，您的品鉴首选是？',
      options: [
        { key: 'A', text: '意式双份深焙黑苏丹玛奇朵 (高脂厚重配伍)', category: '经典重乳' },
        { key: 'B', text: '极细自然阴凉风干的大吉岭琥珀红茶 (天然乳香搭档)', category: '黄金本源' },
        { key: 'C', text: '一支带覆盆子风沙的皇家年份干酪香槟 (华奢果汁极品)', category: '烘焙二重奏' },
        { key: 'D', text: '沁凉的庄园草草荷叶气泡苏打水 (素食纯沙冰完美伴护)', category: '果树流莹' }
      ]
    }
  ];

  // Handles quiz click
  const handleAnswerSelect = (category: string) => {
    const nextAnswers = [...selectedAnswers, category];
    setSelectedAnswers(nextAnswers);

    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      playBubbleSound();
    } else {
      // Calculate dominant category among selectedAnswers
      const counts: { [key: string]: number } = {};
      let dominantCategory = '经典重乳';
      let maxCount = 0;

      nextAnswers.forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
        if (counts[ans] > maxCount) {
          maxCount = counts[ans];
          dominantCategory = ans;
        }
      });

      // Match a flavor having that dominant category (fallback if none)
      const matched = FLAVORS.find(f => f.category === dominantCategory) || FLAVORS[0];
      setQuizResult(matched);
      playCrystalChime();
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers([]);
    setQuizResult(null);
    playBubbleSound();
  };

  // Filter regular catalog showcase
  const filteredFlavors = FLAVORS.filter(flavor => {
    const matchesSearch = 
      flavor.name.includes(searchQuery) || 
      flavor.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flavor.description.includes(searchQuery);

    const matchesCategory = selectedCategory ? flavor.category === selectedCategory : true;
    const matchesSweetness = flavor.sweetness <= maxSweetness;

    return matchesSearch && matchesCategory && matchesSweetness;
  });

  return (
    <section className="relative py-20 min-h-screen w-full overflow-hidden bg-[#fffdfb]">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-85"
        >
          <source src="https://ik.imagekit.io/vpkooy7vh/5%E6%9C%8827%E6%97%A5.mp4?updatedAt=1779843683617" type="video/mp4" />
        </video>
        {/* Symmetrical premium warm-cream overlay to guarantee excellent readability for text and cards */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffdfb]/92 via-[#fffdfb]/60 to-[#fffdfb]/92" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
      
      {/* 1. Dynamic Mode Controller: Regular Catalog vs. Mini Quiz */}
      <div className="flex justify-center mb-16">
        <div className="bg-[#ffe9e3] p-1.5 rounded-full border border-[#ffdbd0] flex space-x-2">
          <button
            onClick={() => setQuizMode(false)}
            className={`px-6 py-2.5 rounded-full font-display text-[13.5px] font-bold tracking-widest uppercase transition-all cursor-pointer select-none
              ${!quizMode 
                ? 'bg-[#6c2f00] text-white shadow-xs' 
                : 'text-[#54433a] hover:bg-white/45'
              }`}
          >
            ✦ 手动甄选全口味 (Gourmet Grid)
          </button>
          <button
            onClick={() => {
              setQuizMode(true);
              handleResetQuiz();
            }}
            className={`px-6 py-2.5 rounded-full font-display text-[13.5px] font-bold tracking-widest uppercase transition-all cursor-pointer select-none flex items-center gap-1.5
              ${quizMode 
                ? 'bg-[#6c2f00] text-white shadow-xs' 
                : 'text-[#54433a] hover:bg-white/45'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
            灵魂风味测试 (Soulmate Quiz)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {quizMode ? (
          /* ================= MODE A: SOULMATE MINI QUIZ ================= */
          <motion.div
            key="quiz-block"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto"
          >
            {!quizResult ? (
              /* A. ACTIVE QUESTION CARD */
              <div className="bg-[#fffcfb] rounded-3xl p-8 md:p-12 border border-[#ffe9e3] shadow-md space-y-8 relative overflow-hidden">
                {/* Symmetrical premium background overlay with fallback */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
                  <img
                    src={quizBgUrl}
                    alt="Quiz Background Pattern"
                    referrerPolicy="no-referrer"
                    onError={handleBgError}
                    className="w-full h-full object-cover opacity-18 mix-blend-multiply transition-opacity duration-550"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fffdfc]/92 via-white/85 to-[#fffdfc]/92" />
                </div>

                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ffe9e3] to-[#ffdbd0] z-10" />
                
                {/* Progress bar ratio indicators */}
                <div className="flex justify-between items-center text-xs font-sans text-gray-500 z-10 relative">
                  <span className="uppercase tracking-widest font-black text-[#b97a20]">✦ HÄAGEN-DAZS ESSENCE ✦</span>
                  <span className="font-medium bg-[#ffe9e3]/30 px-3 py-1 rounded-full text-[#6c2f00]">进度：Q.{currentQuestionIdx + 1} / {quizQuestions.length}</span>
                </div>

                <div className="space-y-4 z-10 relative">
                  <h3 className="font-serif text-[24px] md:text-[30px] text-[#5c2800] font-black leading-tight">
                    {quizQuestions[currentQuestionIdx].q}
                  </h3>
                  <div className="h-0.5 w-16 bg-[#6c2f00]/40" />
                </div>

                <div className="space-y-3.5 z-10 relative">
                  {quizQuestions[currentQuestionIdx].options.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswerSelect(opt.category)}
                      className="w-full text-left p-5 rounded-2xl border border-[#ffe9e3] bg-white/75 hover:bg-white hover:border-[#6c2f00] hover:shadow-xs transition-all duration-300 cursor-pointer select-none group flex items-start gap-4"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#ffe9e3] group-hover:bg-[#6c2f00] group-hover:text-white transition-colors flex items-center justify-center text-xs font-bold text-[#6c2f00] flex-none">
                        {opt.key}
                      </span>
                      <span className="font-sans text-[14.5px] text-[#2c160e] font-semibold leading-relaxed group-hover:translate-x-1 transition-transform inline-block">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* B. CELEBRATION RESULT CARD */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#fffcfb] rounded-[2rem] p-8 md:p-12 border border-[#ffe9e3] shadow-lg text-center space-y-8 relative overflow-hidden"
              >
                {/* Symmetrical premium background overlay with fallback */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
                  <img
                    src={quizBgUrl}
                    alt="Quiz Background Pattern"
                    referrerPolicy="no-referrer"
                    onError={handleBgError}
                    className="w-full h-full object-cover opacity-18 mix-blend-multiply transition-opacity duration-550"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fffdfc]/92 via-white/85 to-[#fffdfc]/92" />
                </div>

                {/* Absolute background vector effects */}
                <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-yellow-500 via-[#6c2f00] to-yellow-600 z-10" />
                
                <div className="space-y-2 z-10 relative">
                  <span className="bg-[#006e20]/10 border border-[#006e20]/25 text-[#006e20] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block select-none">
                    ✦ YOUR PERFECT SOULMATE MATCHED ✦
                  </span>
                  <h3 className="font-serif text-[32px] md:text-[42px] text-[#6c2f00] leading-none font-black">
                    您的风味灵魂半兽：{quizResult.name}
                  </h3>
                </div>

                {/* Main illustration displaying the matched flavor */}
                <div className="w-56 h-56 rounded-full bg-[#ffe9e3]/60 p-4 mx-auto relative flex items-center justify-center shadow-inner z-10">
                  <img
                    src={quizResult.imageUrl}
                    alt={quizResult.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-lg scale-95 floating-icecream relative z-2"
                  />
                </div>

                <div className="space-y-4 max-w-lg mx-auto z-10 relative">
                  <p className="font-serif italic text-[#2c160e] text-[15.5px] leading-relaxed bg-white/75 backdrop-blur-xs p-5 rounded-2xl border border-dashed border-[#ffdbd0]">
                    "{quizResult.description}"
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {quizResult.tags.map(t => (
                      <span key={t} className="bg-[#fff1ed] text-[#6c2f00] border border-[#ffdbd0] font-sans font-semibold text-[11px] px-3.5 py-1 rounded-full uppercase">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coupon simulation wrapper */}
                <div className="bg-[#fff8f6]/90 backdrop-blur-xs rounded-2xl p-5 border border-dashed border-[#ffdbd0] max-w-sm mx-auto space-y-2 text-center select-none relative z-10">
                  <span className="text-[10px] tracking-widest font-sans font-bold uppercase text-gray-400 block">EXCLUSIVELY FOR YOU</span>
                  <div className="font-serif text-[24px] font-bold text-[#6c2f00] leading-none">
                    ¥50 灵感抵扣券
                  </div>
                  <p className="font-sans text-[11px] text-gray-400">凭本页订购首单满¥200时，自动削减抵扣。</p>
                  {/* Decorative side gaps */}
                  <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffcfb] border-r border-[#ffe9e3]" />
                  <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffcfb] border-l border-[#ffe9e3]" />
                </div>

                {/* Final step buttons */}
                <div className="flex justify-center gap-4 pt-4 z-10 relative">
                  <button
                    onClick={() => handleResetQuiz()}
                    className="border border-[#6c2f05]/30 hover:bg-[#fff8f6] text-[#6c2f00] font-display text-xs px-6 py-3.5 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 再测一次
                  </button>
                  <button
                    onClick={() => onAddFlavorToCart(quizResult.id)}
                    className="bg-[#6c2f00] hover:bg-[#8b4513] text-white font-display text-xs px-8 py-3.5 rounded-full font-bold cursor-pointer transition-all shadow-sm"
                  >
                    立享该风味 ✦ ¥88.00
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ================= MODE B: MASTER GOURMET CATALOG GRID ================= */
          <motion.div
            key="grid-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Control panel: Search index query, ranges, and selectors */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#ffe9e3] shadow-xs flex flex-col md:flex-row gap-6 justify-between items-center">
              
              {/* Category selector capsules list */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    playBubbleSound();
                  }}
                  className={`px-4.5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer select-none
                    ${selectedCategory === null 
                      ? 'bg-[#6c2f00] text-white shadow-xs' 
                      : 'bg-transparent text-[#54433a] hover:bg-[#ffe9e3]/30 border border-[#ffe9e3]'
                    }`}
                >
                  全部大系
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      playBubbleSound();
                    }}
                    className={`px-4.5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer select-none
                      ${selectedCategory === cat 
                        ? 'bg-[#6c2f00] text-white shadow-xs' 
                        : 'bg-transparent text-[#54433a] hover:bg-[#ffe9e3]/30 border border-[#ffe9e3]'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search text box */}
              <div className="relative w-full md:w-64">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="检索王牌香气、原料..."
                  className="w-full pl-10 pr-4 py-2.5 font-sans text-xs bg-[#fff8f6] border border-[#ffe9e3] rounded-full focus:outline-none focus:ring-1 focus:ring-[#6c2f00] focus:border-[#6c2f00] placeholder-[#54433a]/30 text-[#2c160e]"
                />
              </div>

              {/* Sweetness Slider controller */}
              <div className="flex items-center gap-4 flex-wrap select-none w-full md:w-auto">
                <span className="font-sans text-xs text-[#54433a] font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#b97a20]" />
                  最高风味甜度:
                </span>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={maxSweetness}
                  onChange={(e) => setMaxSweetness(Number(e.target.value))}
                  className="accent-[#6c2f00] cursor-pointer"
                />
                <span className="font-serif font-bold text-sm text-[#6c2f00]">
                  {maxSweetness}/5 级
                </span>
              </div>

            </div>

            {/* Standard Grid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredFlavors.map((flavor) => (
                <div
                  key={flavor.id}
                  onClick={() => setSelectedFlavor(flavor)}
                  className="group cursor-pointer bg-white rounded-3xl p-6 border border-[#ffe9e3] hover:lift flex flex-col items-center relative transition-transform"
                >
                  <div className="w-44 h-44 rounded-full bg-[#ffe9e3] p-3 relative mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#ffe9e3]/60 rounded-full scale-95 group-hover:scale-105 transition-transform duration-500" />
                    <img
                      src={flavor.imageUrl}
                      alt={flavor.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full filter drop-shadow-md scale-95 group-hover:scale-110 transition-transform duration-500 relative z-10"
                    />
                  </div>

                  <div className="w-full text-center space-y-1">
                    <span className="bg-[#fff1ed] text-[#b97a20] border border-[#ffdbd0] text-[9.5px] font-bold px-3 py-0.5 rounded-full uppercase">
                      {flavor.category}
                    </span>
                    <h3 className="font-serif text-[18px] font-bold text-[#6c2f00] pt-1">
                      {flavor.name}
                    </h3>
                    <p className="font-sans text-xs text-gray-500 line-clamp-2 min-h-[32px] pt-1 leading-normal px-2">
                      {flavor.description}
                    </p>

                    <div className="flex items-center justify-center gap-1.5 pt-2 select-none">
                      <span className="font-sans text-[10px] text-gray-400">甜度：</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < flavor.sweetness ? (
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="w-3.5 h-3.5 text-gray-200" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* If zero search results found */}
            {filteredFlavors.length === 0 && (
              <div className="text-center py-20 bg-white border border-[#ffe9e3] rounded-3xl space-y-4 max-w-lg mx-auto">
                <div className="p-3 bg-[#fff8f6] rounded-full inline-block border border-dashed border-[#ffe9e3]">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="font-serif text-[18px] font-bold text-[#6c2f00]">风宿微凉，未寻得该风味</h4>
                <p className="font-sans text-xs text-gray-500">
                  没有适配甜度或纯度极值匹配的项目。建议清空检索条件重试。
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setMaxSweetness(5);
                  }}
                  className="bg-[#6c2f00] hover:bg-[#8b4513] text-white px-5 py-2.5 rounded-full font-display text-xs"
                >
                  重置筛选器
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Detail Popup Panel Overlay */}
      <AnimatePresence>
        {selectedFlavor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2c160e]/55 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="bg-white rounded-[2rem] max-w-[720px] w-full overflow-hidden border border-[#ffe9e3] shadow-2xl relative"
            >
              {/* Dismiss trigger */}
              <button
                onClick={() => setSelectedFlavor(null)}
                className="absolute top-4 right-4 bg-[#fff8f6] hover:bg-[#ffe9e3]/60 text-[#6c2f00] p-2 rounded-full focus:outline-none cursor-pointer z-55"
                title="Dismiss details"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Visualizer illustration column */}
                <div className="md:col-span-5 bg-[#fff8f6] flex flex-col items-center justify-center p-8 relative border-b md:border-b-0 md:border-r border-[#ffe9e3]">
                  <div className="absolute inset-0 bg-[radial-gradient(#6c2f00_1.2px,transparent_1.2px)] bg-[size:18px_18px] opacity-10 pointer-events-none" />
                  <div className="w-40 h-40 rounded-full bg-[#ffe9e3] p-2 shadow-inner relative flex items-center justify-center mb-4">
                    <img
                      src={selectedFlavor.imageUrl}
                      alt={selectedFlavor.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain filter drop-shadow-md floating-icecream-delayed relative z-10"
                    />
                  </div>
                  <span className="font-sans text-[11px] font-bold text-[#b97a20] uppercase tracking-widest block text-center select-none">
                    EST. 1961 TRADITION
                  </span>
                </div>

                {/* Technical detail specifics list column */}
                <div className="md:col-span-7 p-8 md:p-10 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[#006e20] bg-[#006e20]/10 border border-[#006e20]/25 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block select-none">
                        ✦ {selectedFlavor.category}
                      </span>
                      <h3 className="font-serif text-[28px] font-bold text-[#6c2f00] leading-none pt-1">
                        {selectedFlavor.name}
                      </h3>
                      <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[#b97a20] block pt-0.5">
                        {selectedFlavor.englishName}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-[#54433a] leading-relaxed">
                      {selectedFlavor.description}
                    </p>

                    <hr className="border-[#ffe9e3]" />

                    {/* Metadata indicators detail block */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                      <div className="bg-[#fff8f6] p-3 rounded-xl border border-[#ffe9e3]">
                        <span className="block text-[10px] text-gray-400 uppercase font-semibold">乳脂纯度</span>
                        <span className="block font-serif font-bold text-sm text-[#6c2f00] mt-0.5">
                          {selectedFlavor.milkContent}
                        </span>
                      </div>
                      <div className="bg-[#fff8f6] p-3 rounded-xl border border-[#ffe9e3]">
                        <span className="block text-[10px] text-gray-400 uppercase font-semibold">甜感级别</span>
                        <div className="flex gap-0.5 mt-1 select-none">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>
                              {i < selectedFlavor.sweetness ? (
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="w-3 h-3 text-gray-200" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#ffe9e3] flex justify-between items-center">
                    <span className="font-serif text-[28px] font-bold text-[#6c2f00] leading-none">
                      ¥ 88.00 <span className="font-sans text-xs font-normal text-gray-400">/ 品脱</span>
                    </span>
                    <button
                      onClick={() => {
                        onAddFlavorToCart(selectedFlavor.id);
                        setSelectedFlavor(null);
                      }}
                      className="bg-[#6c2f00] hover:bg-[#8b4513] text-white font-display text-xs px-8 py-3.5 rounded-full font-bold cursor-pointer transition-all"
                    >
                      立享配售
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </section>
  );
}
