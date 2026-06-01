import { ShoppingBag, User, Compass, Sparkles, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  toggleCart: () => void;
  memberPoints: number;
  userEmail: string | null;
  onOpenLogin: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  toggleCart,
  memberPoints,
  userEmail,
  onOpenLogin
}: HeaderProps) {
  const navItems = [
    { id: 'home', label: '传奇史画', icon: Compass },
    { id: 'flavors', label: '艺术口味', icon: Compass },
    { id: 'sundae', label: '圣代工坊', icon: Compass },
    { id: 'ai-arom', label: 'AI 风味契合', icon: Sparkles },
    { id: 'boutiques', label: '尊尚会所', icon: Compass },
    { id: 'shop', label: '奢华商城', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#fff8f6]/90 backdrop-blur-md border-b border-[#ffe9e3] transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
        {/* Brand Logo - Styled strictly to standard display type */}
        <div 
          className="cursor-pointer group select-none flex flex-col"
          onClick={() => setActiveTab('home')}
        >
          <span className="font-serif text-[24px] md:text-[28px] font-bold tracking-[0.15em] text-[#6c2f00] leading-none">
            Häagen-Dazs
          </span>
          <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-[#b97a20] font-semibold mt-1">
            EST. 1961 NEW YORK
          </span>
        </div>

        {/* Desktop Navigation Link Cluster */}
        <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-2 rounded-full font-display text-[14px] font-medium tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none transform hover:scale-105 active:scale-[0.97]
                  ${isActive 
                    ? 'text-white bg-[#6c2f00] shadow-sm' 
                    : 'text-[#54433a] hover:text-[#6c2f00] hover:bg-[#ffe9e3]/50'
                  }`}
              >
                {item.id === 'ai-arom' && <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />}
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-12 right-12 h-0.5 bg-[#b97a20] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Utility Elements Hub: Member Status Pill, Cart, Member Profile Toggle */}
        <div className="flex items-center space-x-3.5">
          {userEmail ? (
            <div 
              onClick={() => setActiveTab('member')}
              className="flex items-center gap-2 cursor-pointer bg-[#ffe9e3] hover:lift border border-[#ffdbd0] px-3.5 py-1.5 rounded-full select-none"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse" />
              <span className="font-sans text-[12px] font-semibold text-[#6c2f00]">
                {memberPoints} 尊享积分
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="hidden sm:flex items-center gap-1.5 border border-[#6c2f00]/30 hover:border-[#6c2f00] hover:bg-[#ffe9e3]/30 text-[#6c2f00] font-sans font-medium text-[13px] px-3.5 py-1.5 rounded-full transition-all cursor-pointer select-none"
            >
              <User className="w-3.5 h-3.5" />
              登录会员
            </button>
          )}

          {/* Interactive Cart Button with Dynamic Badge Count Bump Animation */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-full hover:bg-[#ffe9e3]/50 text-[#6c2f00] transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Shopping Bag"
          >
            <ShoppingBag className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#006e20] text-white text-[10px] font-bold ring-2 ring-white animate-bounce-short">
                {cartCount}
              </span>
            )}
          </button>

          {/* Member Profile Quick Action (Mobile) */}
          <button
            onClick={() => setActiveTab('member')}
            className="lg:hidden p-2 text-[#54433a] hover:text-[#6c2f00] cursor-pointer"
            aria-label="Account Settings"
          >
            <User className="w-5.5 h-5.5" />
          </button>
        </div>
      </div>

      {/* Mobile Sticky Drawer Bar Link list */}
      <div className="lg:hidden flex bg-[#fff1ed] border-t border-[#ffdbd0] overflow-x-auto hide-scrollbar py-2 px-3 space-x-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-[12px] font-medium transition-all cursor-pointer select-none text-sans
                ${isActive 
                  ? 'bg-[#6c2f00] text-white shadow-xs' 
                  : 'text-[#54433a] hover:bg-[#ffe9e3]/40'
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
