import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, ArrowRight, RefreshCw, MessageSquare, Compass, Info, Smile } from 'lucide-react';
import { FLAVORS } from '../data';
import { playBubbleSound, playCrystalChime, playSwooshSound } from '../utils/audio';
import Ballpit from './Ballpit';
import SplitText from './SplitText';
import ShinyText from './ShinyText';

interface AromaAIAdvisorProps {
  onAddFlavorToCart: (flavorId: string) => void;
}

interface AIResult {
  matchedFlavorId: string;
  sundaeTitle: string;
  poeticJustification: string;
  gourmetRecipe: string[];
  visualAura: string;
}

export default function AromaAIAdvisor({ onAddFlavorToCart }: AromaAIAdvisorProps) {
  const [mood, setMood] = useState('sanctuary');
  const [scene, setScene] = useState('sunset');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const moodPresets = [
    { id: 'melancholy', label: '苦甜沉静 (Melancholy)', text: '略带惆怅，向往微苦深邃的释怀' },
    { id: 'jubilant', label: '欢欣热忱 (Jubilant)', text: '明丽浪漫，期许热带阳光的轻欢' },
    { id: 'sanctuary', label: '正念禅室 (Sanctuary)', text: '宁心忘忧，寻求纯粹空灵的和解' },
    { id: 'adventure', label: '先锋猎奇 (Adventure)', text: '灵感爆棚，呼唤惊喜辛辣的碰撞' },
  ];

  const scenePresets = [
    { id: 'rainstorm', label: '塞纳河暴雨 (Paris Rainstorm)', icon: '🌧️' },
    { id: 'sunset', label: '撒哈拉极昼落日 (Sahara Sunset)', icon: '🌇' },
    { id: 'dawn', label: '勃朗峰微亮晨霭 (Alps Dawn)', icon: '🌫️' },
    { id: 'forest', label: '京都春雨竹林 (Kyoto Bamboo)', icon: '🎋' },
  ];

  const loadingQuotes = [
    '正在查阅联合创始人 Reuben Mattus 1961 手置黄页古籍笔记...',
    '依据塞纳河降水、空气湿度与可可乳脂颗粒相互配伍度分析中...',
    '极速调遣阿尔方索芒果果肉多酸与马达加斯加香草幽露配伍中...',
    '由 AI 甜美风味智脑为您设计凡尔赛宫室典藏级圣代配方...',
  ];

  const triggerAIAdvisor = async () => {
    setLoading(true);
    setResult(null);
    setLoadingStep(0);
    playSwooshSound();

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingQuotes.length);
    }, 2500);

    try {
      const response = await fetch('/api/taste-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: moodPresets.find(m => m.id === mood)?.label || mood,
          scene: scenePresets.find(s => s.id === scene)?.label || scene,
          customText: customText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResult(data);
      playCrystalChime();
    } catch (err) {
      console.error(err);
      // Fallback mock representation in case backend environment issue
      setResult({
        matchedFlavorId: 'belgian-chocolate',
        sundaeTitle: '勃朗峰午夜熔脆圣代堡',
        poeticJustification: '我们在意念的可可原浆中，检测到您正处于极具沉静与怀古的情绪奇界。此款至尊配伍将以微苦的比利时黑可可熔岩球，温吞瓦解勃朗峰晨雨带来的湿冷，杏仁碎的坚果爆裂感将带给您充分享受孤独的欢愉。',
        gourmetRecipe: ['2球 比利时巧巧克力球', '1球 经典香草球', '浇淋 黑松露热巧克力甘那许', '镶挂 佛罗伦萨食用碎金箔 与 酒渍甜樱桃'],
        visualAura: '深黛古铜色辅以碎星金箔，在温白瓷器中呈现巴洛克油画般的色差张力。'
      });
      playCrystalChime();
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const matchedFlavorObject = FLAVORS.find(f => f.id === (result?.matchedFlavorId || 'belgian-chocolate'));

  return (
    <div className="py-20 max-w-[1280px] mx-auto px-4 md:px-8 min-h-screen">
      
      {/* Visual background header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <ShinyText
          text="✦ COMPASS AI AROMA ORACLE ✦"
          disabled={false}
          speed={2}
          color="#b97a20"
          shineColor="#ffffff"
          spread={120}
          className="font-display text-[13px] uppercase tracking-[0.3em] font-bold bg-[#fff1ed] border border-[#ffdbd0] px-4.5 py-1.5 rounded-full inline-block"
        />
        <SplitText
          text="AI 专属风味契合"
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
          告诉我们的“风味占星罗盘”您的情绪状态和幻想场景，由 AI 智脑检索哈根达斯风味网格，为您调和最能安抚灵魂的奢华西点配方。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Interactive selectors */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          
          {/* STEP 1: Select Mood Preset */}
          <div className="bg-white rounded-3xl p-6 border border-[#ffe9e3] shadow-xs space-y-4">
            <h3 className="font-serif text-[18px] font-bold text-[#6c2f00] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b97a20]">psychology</span>
              请选择当下的精神况味 (Heart State)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moodPresets.map((m) => {
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMood(m.id);
                      playBubbleSound();
                    }}
                    className={`p-4 rounded-xl text-left transition-all border cursor-pointer select-none
                      ${isSelected 
                        ? 'border-[#6c2f00] bg-[#fff1ed]/40 text-[#6c2f00] shadow-2xs' 
                        : 'border-[#ffe9e3] hover:border-[#6c2f00]/30 text-[#54433a]'
                      }`}
                  >
                    <span className="block font-serif text-[14px] font-bold">{m.label}</span>
                    <span className="block font-sans text-[11px] opacity-75 mt-1 leading-normal">{m.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select Scene Preset */}
          <div className="bg-white rounded-3xl p-6 border border-[#ffe9e3] shadow-xs space-y-4">
            <h3 className="font-serif text-[18px] font-bold text-[#6c2f00] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006e20]">filter_hdr</span>
              脑海中向往的异域幻境 (Aura Scene)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {scenePresets.map((s) => {
                const isSelected = scene === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setScene(s.id);
                      playBubbleSound();
                    }}
                    className={`p-3.5 rounded-xl text-left border cursor-pointer select-none transition-all flex items-center gap-3
                      ${isSelected 
                        ? 'border-[#6c2f00] bg-[#fff1ed]/40 text-[#6c2f00]' 
                        : 'border-[#ffe9e3] hover:border-[#6c2f00]/30 text-[#54433a]'
                      }`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-sans text-[12.5px] font-semibold leading-tight">{s.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Customize Input */}
          <div className="bg-white rounded-3xl p-6 border border-[#ffe9e3] space-y-4">
            <h3 className="font-serif text-[18px] font-bold text-[#6c2f00] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6c2f00]">draw</span>
              手写额外的神秘心愿 (Custom Oracle Prompt)
            </h3>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="例如：刚下过暴雨，坐在窗口看街景，内心极其想吃具有坚果香、又不要太甜的冰淇淋配比..."
              className="w-full bg-[#fff8f6] border border-[#ffe9e3] rounded-xl p-4 text-xs font-sans text-[#54433a] focus:ring-1 focus:ring-[#6c2f00] focus:border-[#6c2f00] focus:outline-none min-h-[90px] placeholder-[#54433a]/40"
            />
          </div>

          {/* Trigger button */}
          <button
            onClick={triggerAIAdvisor}
            disabled={loading}
            className={`w-full py-4.5 rounded-full font-display text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md
              ${loading 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-100 shadow-none' 
                : 'bg-[#6c2f00] text-white hover:bg-[#8b4513] cursor-pointer active:scale-98'
              }`}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#ffdbc9]" />
            ) : (
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            )}
            {loading ? 'AI 正在调和圣代脂香配方' : '寻求 AI 专属定制建议'}
          </button>

        </div>

        {/* Right Active Dynamic Presentation Card */}
        <div className="lg:col-span-6 bg-[#fffcfb]/60 rounded-[2rem] p-8 border border-[#ffe9e3] shadow-md flex flex-col justify-between min-h-[500px] relative overflow-hidden backdrop-blur-xs">
          
          {/* Ambient kinetic gravity ballpit background */}
          <Ballpit 
            count={50} 
            gravity={0.012} 
            followCursor={false} 
            colors={['#5227FF', '#7cff67', '#ff6b6b', '#ffffff', '#ffffff', '#ffffff']} 
          />
          
          <AnimatePresence mode="wait">
            {loading ? (
              /* A. AI Processing animation card overlay */
              <motion.div
                key="loading-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#fff8f6] flex flex-col items-center justify-center text-center p-8 space-y-6 z-20"
              >
                {/* Vintage Clock / Compas rotator */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6c2f00] to-[#b97a20] rounded-full animate-spin duration-3000 opacity-20" />
                  <Compass className="w-16 h-16 text-[#6c2f00] animate-pulse" />
                </div>
                
                <div className="space-y-2 max-w-sm">
                  <span className="font-sans text-[11px] uppercase tracking-widest text-[#b97a20] font-bold block animate-bounce">
                    Aroma Pairing Analysis
                  </span>
                  <p className="font-serif italic text-[#6c2f00] text-[15px] leading-relaxed transition-all duration-500">
                    “ {loadingQuotes[loadingStep]} ”
                  </p>
                </div>
              </motion.div>
            ) : result ? (
              /* B. Full-fledged output display */
              <motion.div
                key="result-ui"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 h-full flex flex-col justify-between relative z-10 pointer-events-none"
              >
                <div className="space-y-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="font-display text-[10px] uppercase font-bold text-white bg-[#006e20] px-3 py-1 rounded-full">
                        ✦ AI 灵感推荐
                      </span>
                      <h3 className="font-serif text-[26px] font-bold text-[#6c2f00] tracking-tight mt-1.5 leading-tight">
                        {result.sundaeTitle}
                      </h3>
                    </div>
                    {/* Tiny representation image */}
                    {matchedFlavorObject && (
                      <div className="w-16 h-16 rounded-full bg-[#ffe9e3] p-1 flex-none flex items-center justify-center border border-[#ffdbd0] shadow-inner">
                        <img 
                          src={matchedFlavorObject.imageUrl} 
                          alt={matchedFlavorObject.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain filter drop-shadow-md scale-95" 
                        />
                      </div>
                    )}
                  </div>

                  <hr className="border-[#ffe9e3]" />

                  {/* Poetic Justification description in beautiful typography */}
                  <div className="space-y-2">
                    <span className="font-sans text-xs uppercase tracking-widest text-gray-400 font-bold block">
                      配伍心理解析 (The Poetic Match)
                    </span>
                    <p className="font-serif text-[14px] text-[#2c160e] leading-relaxed italic block indent-4 bg-[#fff8f6] p-4.5 rounded-2xl border border-[#ffe9e3]">
                      "{result.poeticJustification}"
                    </p>
                  </div>

                  {/* Recipe suggestion */}
                  <div className="space-y-2">
                    <span className="font-sans text-xs uppercase tracking-widest text-gray-400 font-bold block">
                      沙龙秘制圣代食谱 (Gourmet Recipe)
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#54433a] font-sans">
                      {result.gourmetRecipe.map((step, idx) => (
                        <li key={idx} className="flex gap-2 items-start bg-white p-2.5 rounded-xl border border-[#ffe9e3] shadow-2xs">
                          <span className="text-[#006e20] font-bold">✦</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual suggestions */}
                  <div className="space-y-1 bg-[#fff1ed] p-3.5 rounded-xl border border-[#ffdbd0]">
                    <span className="font-sans text-[11px] uppercase tracking-widest text-[#b97a20] font-bold block">
                      大师级美学视觉 (Aesthetic Aura)
                    </span>
                    <p className="font-sans text-xs text-[#54433a] leading-relaxed">
                      {result.visualAura}
                    </p>
                  </div>
                </div>

                {/* Buy the base flavor CTA button */}
                <div className="pt-6 border-t border-[#ffe9e3] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left space-y-0.5">
                    <span className="font-sans text-sm text-gray-400 block">契合基础风味</span>
                    <span className="font-serif text-[16px] font-bold text-[#6c2f00] block">
                      {matchedFlavorObject?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (matchedFlavorObject) {
                        onAddFlavorToCart(matchedFlavorObject.id);
                      }
                    }}
                    className="w-full sm:w-auto bg-[#6c2f00] hover:bg-[#8b4513] text-white px-8 py-3.5 rounded-full font-display text-xs tracking-wider cursor-pointer font-bold select-none pointer-events-auto"
                  >
                    加至购餐单 ✦ ¥88.00
                  </button>
                </div>
              </motion.div>
            ) : (
              /* C. Placeholders layout before first invoke */
              <div className="flex flex-col items-center justify-center h-full py-16 text-center text-gray-400 space-y-4 relative z-10 pointer-events-none select-none">
                <div className="p-4 bg-[#fff8f6] rounded-full border border-[#ffe9e3] animate-pulse">
                  <Sparkles className="w-10 h-10 text-[#b97a20]" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="font-serif text-[18px] text-[#6c2f00] font-bold block">
                    罗盘正垂，等待风宿
                  </h4>
                  <p className="font-sans text-xs text-[#54433a]/80 leading-relaxed">
                    请输入您的精神偏好。我们将运用西点大师灵感与高级 AI 模型，为您调制出专属极奢圣代。
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
