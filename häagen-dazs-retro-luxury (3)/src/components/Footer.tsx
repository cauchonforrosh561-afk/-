import { Mail, Shield, MessageCircle, Heart, Award, Sparkles } from 'lucide-react';
import LightRays from './LightRays';

interface FooterProps {
  onNavTab: (tabId: string) => void;
}

export default function Footer({ onNavTab }: FooterProps) {
  return (
    <footer className="w-full bg-[#6c2f00] text-white pt-20 pb-12 relative overflow-hidden">
      {/* Premium LightRays backdrop configured with custom studio ray parameters */}
      <LightRays
        lightSpread={0.5}
        rayLength={3.0}
        raysColor="fbf0f0"
        rayOpacity={0.16}
        speed={0.002}
        originX={0.5}
        originY={-0.15}
      />

      {/* Absolute Decorative Vector elements */}
      <div className="absolute -bottom-24 -right-24 text-[#8b4513]/25 select-none pointer-events-none transition-transform hover:scale-110 duration-1000">
        <Sparkles className="w-96 h-96" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
        {/* Prime modular columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#ffe9e3]/10">
          
          {/* Brand Presentation Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-[28px] md:text-[32px] font-bold tracking-[0.16em] text-[#ffdbc9]">
                Häagen-Dazs
              </span>
              <span className="font-sans text-[10px] text-[#ffb68c] uppercase tracking-[0.45em] mt-1">
                60载奢华传奇，至臻献礼
              </span>
            </div>
            <p className="text-[#ffe9e3]/80 font-sans text-[14px] leading-relaxed max-w-sm">
              自1960年创业之始，鲁本·马杜斯坚持纯天然纯粹理念，让冰淇淋不仅仅是甜味消遣，更是一门将温度、质地与香气融汇贯通的舌尖艺术学。
            </p>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 bg-[#ffdbc9]/10 hover:bg-[#ffdbc9]/20 border border-[#ffdbc9]/20 px-3.5 py-1.5 rounded-full text-xs text-[#ffdbc9] transition-all">
                <Heart className="w-3.5 h-3.5 fill-[#ffdbc9] text-[#ffdbc9]" />
                坚持100%全奶油
              </div>
              <div className="flex items-center gap-2 bg-[#ffdbc9]/10 hover:bg-[#ffdbc9]/20 border border-[#ffdbc9]/20 px-3.5 py-1.5 rounded-full text-xs text-[#ffdbc9] transition-all">
                <Award className="w-3.5 h-3.5 text-[#ffdbc9]" />
                拒绝防腐剂添加
              </div>
            </div>
          </div>

          {/* Quick Explorations Column */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-display font-semibold text-[15px] tracking-[0.12em] text-[#ffdbc9] uppercase">
              探索体验
            </h4>
            <ul className="space-y-3.5">
              {[
                { id: 'home', label: '传奇史画' },
                { id: 'flavors', label: '艺术口味' },
                { id: 'sundae', label: '圣代工坊' },
                { id: 'ai-arom', label: 'AI 风味契合' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavTab(item.id)}
                    className="text-[#ffe9e3]/75 hover:text-white transition-colors text-sm hover:translate-x-1 duration-300 inline-block font-sans cursor-pointer"
                  >
                    ✦ {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Columns */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-display font-semibold text-[15px] tracking-[0.12em] text-[#ffdbc9] uppercase">
              贵宾专席
            </h4>
            <ul className="space-y-3.5 text-[#ffe9e3]/75 text-sm font-sans">
              <li><button onClick={() => onNavTab('member')} className="hover:text-white cursor-pointer select-none">✦ 尊尊会员卡</button></li>
              <li><button onClick={() => onNavTab('boutiques')} className="hover:text-white cursor-pointer select-none">✦ 寻访艺廊店铺</button></li>
              <li><button onClick={() => onNavTab('shop')} className="hover:text-white cursor-pointer select-none">✦ 尊礼配售商城</button></li>
              <li><span className="opacity-50 select-none">✦ 批发大宗定制</span></li>
            </ul>
          </div>

          {/* Contact and Community Link */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-display font-semibold text-[15px] tracking-[0.12em] text-[#ffdbc9] uppercase">
              奢华微信社区
            </h4>
            <div className="flex gap-4 items-center bg-[#ffdbc9]/10 p-4 border border-[#ffdbc9]/15 rounded-2xl max-w-sm">
              {/* Fake High contrast QR Code vector block */}
              <div className="bg-white p-2.5 rounded-xl flex-none shadow-sm select-none">
                <div className="w-18 h-18 bg-[#6c2f00] p-1 flex items-center justify-center">
                  <div className="w-full h-full border-2 border-white flex flex-wrap content-between justify-between">
                    <div className="w-4 h-4 bg-white"></div>
                    <div className="w-4 h-4 bg-white"></div>
                    <div className="w-4 h-4 bg-white"></div>
                    <div className="w-4 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="font-sans font-semibold text-[14px] text-white flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" /> 扫码加入哈根尊享会
                </span>
                <p className="font-sans text-[12px] text-[#ffe9e3]/70 leading-normal">
                  随时随地定制新品配送，累计积分兑换“隐藏经典系列”特权，与主厨在线沙龙对话。
                </p>
              </div>
            </div>
            
            <div className="flex gap-3.5">
              <a 
                href="mailto:contact@haagendazs.cn" 
                className="p-2.5 rounded-full bg-[#ffdbc9]/10 hover:bg-[#ffdbc9]/20 border border-[#ffdbc9]/10 text-[#ffdbc9] transition-all"
                title="Email Us"
              >
                <Mail className="w-4.5 h-4.5" />
              </a>
              <span className="flex items-center text-xs text-[#ffdbc9]/70 font-sans gap-1.5">
                <Shield className="w-3.5 h-3.5" /> 尊享网络安全及品质保障协议
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-[#ffe9e3]/50">
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <a href="#" className="hover:text-white transition-colors">隐私保护政策</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">贵宾服务条款</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">无障碍访问说明</a>
          </div>
          <p>© 2026 Häagen-Dazs. 自1960年起的匠心尊享。版权所有。</p>
        </div>
      </div>
    </footer>
  );
}
