import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Clock, ArrowRight, Award, Key, Sparkles, Check, Calendar } from 'lucide-react';
import { BOUTIQUES } from '../data';
import { Boutique } from '../types';
import SplitText from './SplitText';
import ShinyText from './ShinyText';

export default function BoutiqueFinder() {
  const [selectedBoutique, setSelectedBoutique] = useState<Boutique>(BOUTIQUES[0]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-05-24');
  const [bookingTime, setBookingTime] = useState('14:00-16:00 (精品品鉴会)');

  const cities = Array.from(new Set(BOUTIQUES.map(b => b.city)));

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <div className="py-20 max-w-[1280px] mx-auto px-4 md:px-8">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <ShinyText
          text="✦ MAISON HAAGEN-DAZS FINDER ✦"
          disabled={false}
          speed={2}
          color="#006e20"
          shineColor="#ffffff"
          spread={120}
          className="font-display text-[13px] uppercase tracking-[0.3em] font-bold bg-[#90f691]/20 border border-[#90f691]/35 px-4.5 py-1.5 rounded-full inline-block"
        />
        <SplitText
          text="寻寻尊尚会所"
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
          探寻您身边最具有历史和文化意义的哈根达斯艺术沙龙旗舰店。不仅供应冰品，更是海派、京派与岭南庭院式的优雅社交中心。
        </p>
      </div>

      {/* Main split interactive layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: city buttons, locator cards and detail info */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* City selector row tab */}
          <div className="bg-white rounded-3xl p-6 border border-[#ffe9e3] shadow-xs flex items-center gap-4 flex-wrap">
            <span className="font-sans text-xs font-bold text-[#6c2f00] uppercase tracking-wider select-none">
              选择奢华大都市:
            </span>
            <div className="flex gap-2">
              {cities.map((city) => {
                const isSelected = selectedBoutique.city === city;
                // Finds first branch for that city to default load
                const matchedBoutique = BOUTIQUES.find(b => b.city === city)!;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedBoutique(matchedBoutique)}
                    className={`px-5 py-2 rounded-full font-serif text-[13.5px] font-bold tracking-wider transition-all cursor-pointer select-none
                      ${isSelected 
                        ? 'bg-[#6c2f00] text-white shadow-xs' 
                        : 'bg-transparent text-[#54433a] hover:bg-[#ffe9e3]/30 border border-[#ffe9e3]'
                      }`}
                  >
                    ✦ {city} Belles
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boutique interactive Detail Presenter card with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBoutique.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ 
                duration: 0.5,
                scale: { type: "spring", stiffness: 300, damping: 25 }
              }}
              className="bg-white rounded-[2rem] overflow-hidden border border-[#ffe9e3] shadow-md flex flex-col md:flex-row cursor-pointer"
            >
              <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                <img
                  src={selectedBoutique.imageUrl}
                  alt={selectedBoutique.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#6c2f00] text-[#ffdbc9] text-[10px] font-bold uppercase py-1 px-3 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-yellow-500" /> FLAGSHIP BOUTIQUE
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="font-sans text-xs uppercase tracking-widest text-gray-400 font-bold block">
                      MAISON LOCATION • {selectedBoutique.city}
                    </span>
                    <h3 className="font-serif text-[24px] font-bold text-[#6c2f00] leading-tight pt-1">
                      {selectedBoutique.name}
                    </h3>
                  </div>

                  <p className="font-sans text-xs text-[#54433a] leading-relaxed">
                    {selectedBoutique.description}
                  </p>

                  <hr className="border-[#ffe9e3]" />

                  {/* Technical specifics and telephone triggers */}
                  <div className="space-y-2 text-xs font-sans text-[#54433a]">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#b97a20] flex-none" />
                      <span>{selectedBoutique.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#b97a20] flex-none" />
                      <span>{selectedBoutique.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#b97a20] flex-none" />
                      <span>营业时段：AM 10:00 - PM 22:30 (包含露台夜宵)</span>
                    </div>
                  </div>
                </div>

                {/* Local Menu Specialties badge tags */}
                <div className="space-y-2.5 bg-[#fff8f6] p-4 rounded-2xl border border-[#ffe9e3]">
                  <span className="font-sans text-[11px] font-bold text-[#6c2f00] uppercase tracking-wider block">
                    ✦ 该店专享限定菜谱 (Parlour Specialties)
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedBoutique.specialties.map((spec) => (
                      <span key={spec} className="bg-white border border-[#ffdbd0] text-[#6c2f00] text-[10px] px-3 py-1 rounded-full font-sans font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right Side: schematic map and lesson booking */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* A. Stylized Schematic Map widget representing landmarks */}
          <div className="bg-white rounded-3xl p-6 border border-[#ffe9e3] shadow-xs relative h-72 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-[#fff8f6] bg-[radial-gradient(#ffe9e3_1.2px,transparent_1.2px)] bg-[size:16px_16px] opacity-25 pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10 select-none">
              <div>
                <span className="font-sans text-[10px] text-gray-400 font-extrabold uppercase">SCHEMATIC RADAR</span>
                <h4 className="font-serif text-[16px] font-bold text-[#6c2f00] leading-none mt-1">
                  大都市艺术巡礼雷达
                </h4>
              </div>
              <span className="bg-[#006e20]/10 border border-[#006e20]/25 text-[#006e20] text-[9.5px] uppercase font-bold py-1 px-3.5 rounded-full">
                {selectedBoutique.city} 地图标点
              </span>
            </div>

            {/* Custom stylized vector city line simulation */}
            <div className="relative flex-1 w-full flex items-center justify-center my-4">
              
              {/* Central vector line simulation */}
              <div className="absolute w-3/4 h-[1px] bg-dashed border-b border-dashed border-[#6c2f00]/30" />
              <div className="absolute h-1/2 w-[1px] bg-dashed border-l border-dashed border-[#6c2f00]/30" />

              {/* Dynamic Coordinate point marker */}
              <motion.div
                key={selectedBoutique.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: 1 }}
                onClick={() => {}}
                className="absolute w-10 h-10 rounded-full bg-[#6c2f00]/15 flex items-center justify-center cursor-pointer z-20"
                style={{
                  top: `${selectedBoutique.latPercent}%`,
                  left: `${selectedBoutique.lngPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-5 h-5 rounded-full bg-[#6c2f00] flex items-center justify-center border-2 border-white shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-white text-[10px] font-bold text-[#6c2f00] px-2.5 py-1 rounded shadow-md border border-[#ffdbd0] whitespace-nowrap mb-1.5 leading-none">
                  {selectedBoutique.city} 新天地
                </div>
              </motion.div>

            </div>

            <p className="font-sans text-[10.5px] text-gray-400 leading-normal relative z-10 select-none">
              坐标依据地区 GPS 定制映射。您可以直接携电子会员卡出示给门店主厨，解锁免排队堂食礼遇。
            </p>
          </div>

          {/* B. Boutique class custom Booking module */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#ffe9e3] shadow-md relative">
            <AnimatePresence>
              {bookingSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#fff8f6]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="p-3 bg-green-100 rounded-full border border-green-200 text-green-600 mb-3 animate-bounce-short">
                    <Check className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif text-[20px] font-bold text-[#6c2f00] mb-1">
                    预约成功的音讯！
                  </h4>
                  <p className="font-sans text-xs text-gray-500 max-w-xs leading-relaxed">
                    您的席位已登记在 [ {selectedBoutique.city} 沙龙旗舰店 ]。专属的黄金入场二维码已下发至您的微信及手机短信中。
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="mt-6 bg-[#6c2f00] text-white text-xs px-6 py-2.5 rounded-full"
                  >
                    好，收下凭证
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="font-sans text-xs uppercase tracking-widest text-[#b97a20] font-bold block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#b97a20]" />
              MASTERCLASS RESERVATION
            </span>
            <h3 className="font-serif text-[20px] font-bold text-[#6c2f00] mb-4 leading-none">
              贵宾定制大师课席位
            </h3>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-sans text-[11px] font-bold text-gray-400 uppercase">预约席位时间</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[#fff8f6] border border-[#ffe9e3] rounded-xl p-3 text-xs font-sans text-[#54433a] focus:ring-1 focus:ring-[#6c2f00] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-sans text-[11px] font-bold text-gray-400 uppercase">体验专席分类</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-[#fff8f6] border border-[#ffe9e3] rounded-xl p-3 text-xs font-sans text-[#54433a] focus:ring-1 focus:ring-[#6c2f00] focus:outline-none"
                >
                  <option value="14:00-16:00 (精品品鉴会)">14:00-16:00 (Reuben 主厨手作品味会)</option>
                  <option value="16:30-18:30 (法式骨瓷下午茶定制)">16:30-18:30 (法式浮雕骨瓷下午茶定制款)</option>
                  <option value="19:30-21:30 (威士忌流莹雪车夜色主题)">19:30-21:30 (威士忌与重巧风味微醺夜色主题)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6c2f00] hover:bg-[#8b4513] text-white py-3.5 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-all shadow-sm cursor-pointer select-none"
              >
                递贵宾尊享预约单
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
