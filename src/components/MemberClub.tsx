import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, Mail, Phone, Lock, Sparkles, AlertCircle, ShoppingBag, EyeOff, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface MemberClubProps {
  memberPoints: number;
  userEmail: string | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onDeductPoints: (points: number) => void;
  onAddCustomProduct: (product: Product) => void;
  onClaimPoints: (points: number) => void;
}

export default function MemberClub({
  memberPoints,
  userEmail,
  onLogin,
  onLogout,
  onDeductPoints,
  onAddCustomProduct,
  onClaimPoints
}: MemberClubProps) {
  // Authentication local states
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [formError, setFormError] = useState('');

  // Scratch Reward local states
  const [scratchClaimed, setScratchClaimed] = useState(false);
  const [scratchRewardAmt, setScratchRewardAmt] = useState(150);

  // Locked Secret Vintage items
  const secretFlavors = [
    {
      id: 'sc-whiskey-fudge',
      name: '奥利安波旁木桶 极罕黑威士忌巧球',
      englishName: 'Bourbon Cask Whiskey Fudge Single Scoop',
      pointCost: 150,
      desc: '在老橡木威士忌酒桶中醇化过冬的可可脂，带着烟熏微醺和黑松露甘美，唯有资深品鉴官尊享。',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhhpX353Sd7ucJjz8UTKvuvf9ftKmq1y2PF6UwkqcGRWzmsan71tRVQAtnjTHTMRkkQNz2KjmHT7-dF-8VYaWLSENMSYWqdzEgKpBkQlnRYxrx8-nqPy4xxGxTiU8NX5Yrg2IwfUL52HvoDHZDZdnykMMuul8-7uxj0NBEAY8P6UKLtsbPk2gxJVtj180Qh4Yjb3UHXKwYPcqZCJKGfFr-yFbeUJesfN71Ph9F1IZL3NS3pwxAg4RdSd2XjvopQZESDYSdU2gwVL9p'
    },
    {
      id: 'sc-kyoto-matcha',
      name: '特级本宇治御前 抹茶皇室金粉球',
      englishName: 'Premium Kyoto Imperial Gold Matcha Scoop',
      pointCost: 180,
      desc: '采选日本宇治清晨新吐雀舌绿芽，手工石磨碾细，点缀着熠熠闪耀的佛罗伦萨碎食用金箔。',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANnz1SfyiTpLT3KNlnwwEV4OdrxlMx4R79o_1oowEAXaFJqKfSGpmchrMfeorKXuRZuEH7Af8tXjxgdFIxLMfbarszHYVyewogAL8X9PgRhWgtt-ov-WY_2-2oVcRacOf5j0gQR5y2Unao_n1HdC6EtSF0eLVnHuf1jiU34_GzgKK-R5wJLPpWqDEVI5aqTlgLEm6iYLe7R_L1EqicSfJBHIZo8j2HrcuhXUsxyqYlx6hlfaEXkW49q9N2Kob9h5QwGzT8AE5gU0fi'
    }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!emailInput.includes('@') || emailInput.length < 5) {
      setFormError('请输入有效的哈根达斯贵宾电子邮箱');
      return;
    }

    if (passwordInput.length < 6) {
      setFormError('密码长度不能少于 6 位安全极值');
      return;
    }

    // Call global login action
    onLogin(emailInput);
  };

  const handleScratchExtraPoints = () => {
    if (scratchClaimed) return;
    onClaimPoints(scratchRewardAmt);
    setScratchClaimed(true);
  };

  const handleRedeemSecretFlavor = (flavor: typeof secretFlavors[0]) => {
    if (memberPoints < flavor.pointCost) return;

    // Deduct member points from balance
    onDeductPoints(flavor.pointCost);

    // Create custom product with complete zero pricing (unlocked freebie!)
    const freebieProduct: Product = {
      id: `${flavor.id}-${Date.now()}`,
      name: `👑 尊尚积分兑换：${flavor.name}`,
      englishName: flavor.englishName,
      price: 0, // completely free reward!
      description: `【积分专属兑换特礼】 消耗了 ${flavor.pointCost} 积分尊享解锁。${flavor.desc}`,
      imageUrl: flavor.imageUrl,
      category: 'boutique'
    };

    onAddCustomProduct(freebieProduct);
  };

  return (
    <div className="py-20 max-w-[1280px] mx-auto px-4 md:px-8 min-h-screen flex items-center justify-center relative">
      <div className="w-full max-w-4xl relative z-10">
        
        <AnimatePresence mode="wait">
          {!userEmail ? (
            /* ================= STATE A: UNAUTHENTICATED LOGIN CARD ================= */
            <motion.div
              key="auth-lounge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-[520px] mx-auto bg-white rounded-[2rem] border border-outline-variant p-8 md:p-12 shadow-lg space-y-8 relative overflow-hidden"
            >
              {/* Decorative top strip */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-[#6c2f00]" />
              
              <div className="text-center space-y-2">
                <span className="font-serif text-[32px] md:text-[42px] tracking-[0.16em] text-[#6c2f00] font-bold block leading-none select-none">
                  Häagen-Dazs
                </span>
                <span className="font-sans text-[11px] text-[#b97a20] uppercase tracking-[0.35em] block font-bold">
                  尊享会员注册登录
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-xs">
                
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-500 rounded-xl p-3.5 flex items-center gap-2 font-bold animate-slideup select-none">
                    <AlertCircle className="w-4 h-4 flex-none" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase tracking-widest block ml-1.5">贵宾电子邮箱 (Guest Email)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. connoisseur@haagendazs.cn"
                      className="w-full bg-[#fff8f6] border border-outline-variant rounded-xl p-4 pl-10 focus:ring-1 focus:ring-[#6c2f00] focus:border-[#6c2f00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase tracking-widest block ml-1.5">辅助注册手机 (Phone Option)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g. 138-XXXX-XXXX"
                      className="w-full bg-[#fff8f6] border border-outline-variant rounded-xl p-4 pl-10 focus:ring-1 focus:ring-[#6c2f00] focus:border-[#6c2f00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase tracking-widest block ml-1.5">登录密码 (Security Pass)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="设置您的奢享贵宾访问密码 (不少于6位)"
                      className="w-full bg-[#fff8f6] border border-outline-variant rounded-xl p-4 pl-10 focus:ring-1 focus:ring-[#6c2f00] focus:border-[#6c2f00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-[#6c2f00] hover:bg-[#8b4513] text-white py-4 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-all shadow-sm cursor-pointer select-none"
                  >
                    签署登录贵宾卡
                  </button>
                  <div className="text-center font-semibold text-[10px] text-gray-400 tracking-wider">
                    登录即代表同意【哈根达斯贵宾隐私保障与可控冷链免责条款】
                  </div>
                </div>
              </form>

              {/* Quick interactive mock dividers */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <span className="relative px-3 bg-white text-[10px] text-gray-400 font-bold uppercase tracking-widest">扫描贵宾二维码登录</span>
              </div>

              {/* Fake QR launch display */}
              <div className="flex justify-center flex-col items-center space-y-2 select-none">
                <div className="border border-dashed border-[#ffe9e3] p-1.5 rounded-xl bg-[#fff8f6]">
                  <div className="w-24 h-24 bg-[#6c2f00] p-1 flex items-center justify-center text-white text-[10px]">
                    <div className="w-full h-full border-2 border-white flex flex-wrap content-between justify-between p-0.5">
                      <div className="w-4 h-4 bg-white"></div>
                      <div className="w-4 h-4 bg-white"></div>
                      <div className="w-4 h-4 bg-white"></div>
                      <div className="w-4 h-4 bg-white"></div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-sans tracking-wide">用手机微信扫码，一秒快速加入贵宾沙龙</span>
              </div>
            </motion.div>
          ) : (
            /* ================= STATE B: AUTHENTICATED LOUNGE CARD ================= */
            <motion.div
              key="auth-lounge-vip"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                
                {/* Visualizer Gold Member Card */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#1c110c] to-[#452718] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between border-2 border-[#ffdbc9]/15 shadow-xl min-h-[340px] select-none">
                  {/* Decorative background grid line vectors */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,219,201,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  
                  {/* Decorative gold vector seal */}
                  <div className="absolute top-8 right-8 text-[#ffb68c]/15">
                    <Award className="w-28 h-28 stroke-[1.5]" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex flex-col">
                      <span className="font-serif text-[28px] font-bold tracking-[0.14em] text-[#ffdbc9]">
                        Häagen-Dazs
                      </span>
                      <span className="font-sans text-[10px] text-[#ffb68c] uppercase tracking-[0.4em] font-extrabold mt-0.5">
                        Aura Connoisseur Visa
                      </span>
                    </div>
                    
                    <div className="pt-8">
                      <span className="font-sans text-xs text-gray-400 uppercase tracking-widest block font-bold">贵宾尊享卡号 (CARD NO)</span>
                      <span className="font-serif text-[18px] font-bold tracking-widest text-[#ffdbc9] block font-mono">
                        HD-VIP-2026-{userEmail.substring(0, 3).toUpperCase()}-{Date.now().toString().slice(-4)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-12 flex justify-between items-end relative z-10">
                    <div>
                      <span className="font-sans text-[10px] text-gray-400 uppercase block font-bold">持卡贵宾 (CARD OWNER)</span>
                      <span className="font-sans text-xs font-bold text-white block">{userEmail}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-sans text-[10px] text-gray-400 uppercase block font-bold">累计尊赏积分 (BAL BALANCE)</span>
                      <span className="font-serif text-[28px] font-bold text-[#ffdbc9] leading-none block">
                        {memberPoints} <span className="font-sans text-xs font-semibold text-[#ffb68c]">PTS</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info board and interactive Scratch Reward ticket */}
                <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 border border-[#ffe9e3] shadow-md flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="bg-[#006e20]/10 border border-[#006e20]/25 text-[#006e20] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block select-none">
                      ✦ MAISON VIP PRIVATE RETREAT ✦
                    </span>
                    <h3 className="font-serif text-[28px] font-bold text-[#6c2f00] leading-none">
                      尊享贵宾沙龙阁
                    </h3>
                    <p className="font-sans text-xs text-[#54433a] leading-relaxed">
                      欢迎回到哈根达斯贵宾阁阁楼。在这里，您的每一笔配售单消费，都有助于在罗盘上累计积分。积分可用来在线全额折扣解锁由主厨Reuben特调的“隐藏古董口味 (Vintage Series)”。
                    </p>
                  </div>

                  {/* Interactive Scratch card voucher widget */}
                  <div className="bg-[#fff8f6] rounded-2xl p-5 border border-dashed border-[#ffdbd0] relative overflow-hidden select-none">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[10px] tracking-widest font-sans font-extrabold text-[#b97a20] uppercase block">
                          DAILY CLAIM GIFT CARD
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#6c2f00] leading-snug">
                          每日尊享刮刮卡 • 赠150积分
                        </h4>
                        <p className="font-sans text-[11px] text-gray-400">一建刮开，立马解锁并向持卡账户充入积分余额。</p>
                      </div>

                      <button
                        disabled={scratchClaimed}
                        onClick={handleScratchExtraPoints}
                        className={`px-6 py-3 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap
                          ${scratchClaimed
                            ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#6c2f00] text-white hover:bg-[#8b4513] hover:shadow-xs cursor-pointer'
                          }`}
                      >
                        {scratchClaimed ? '✓ 已经充入余额' : '✦ 刮开充入积分'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-sans text-gray-400 border-t border-[#ffe9e3] pt-4">
                    <span className="flex items-center gap-1.5 font-semibold text-[#006e20]">
                      <ShieldCheck className="w-4 h-4" /> 尊享会网络安全保密体系保护中
                    </span>
                    <button
                      onClick={onLogout}
                      className="text-red-500 hover:text-red-700 font-bold underline cursor-pointer select-none"
                    >
                      安全注销登出
                    </button>
                  </div>
                </div>

              </div>

              {/* Secret/Locked vintage flavors redemption zone */}
              <div className="space-y-6">
                <div>
                  <span className="font-display text-xs uppercase tracking-[0.25em] text-[#b97a20] font-bold block">
                    MAISON EXCLUSIVE REWARDS
                  </span>
                  <h3 className="font-serif text-[26px] md:text-[32px] text-[#6c2f00] font-bold leading-none mt-1">
                    隐藏古董限定大系
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {secretFlavors.map((flavor) => {
                    const isEligible = memberPoints >= flavor.pointCost;
                    return (
                      <div
                        key={flavor.id}
                        className="bg-white rounded-3xl p-6 border border-[#ffe9e3] flex flex-col sm:flex-row gap-6 items-center shadow-xs"
                      >
                        <div className="w-32 h-32 rounded-2xl bg-[#fff8f6] p-2 flex-none flex items-center justify-center border border-[#ffe9e3] shadow-inner select-none">
                          <img
                            src={flavor.imageUrl}
                            alt={flavor.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain filter drop-shadow-md scale-95"
                          />
                        </div>

                        <div className="space-y-3.5 flex-1 text-center sm:text-left">
                          <div>
                            <span className="bg-[#6c2f00] text-[#ffdbc9] text-[9.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                              ✦ 消耗 {flavor.pointCost} 积分尊享
                            </span>
                            <h4 className="font-serif text-[18px] font-bold text-[#6c2f00] leading-tight pt-1">
                              {flavor.name}
                            </h4>
                          </div>
                          
                          <p className="font-sans text-xs text-gray-500 leading-relaxed line-clamp-3">
                            {flavor.desc}
                          </p>

                          <button
                            disabled={!isEligible}
                            onClick={() => handleRedeemSecretFlavor(flavor)}
                            className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-display text-xs font-bold tracking-wider transition-all cursor-pointer
                              ${isEligible
                                ? 'bg-[#006e20] hover:bg-[#008f2a] text-white hover:shadow-xs'
                                : 'bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed'
                              }`}
                          >
                            {isEligible ? '使用积分折扣领取' : `还需 ${flavor.pointCost - memberPoints} 积分兑换`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
