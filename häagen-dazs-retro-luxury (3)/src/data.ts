import { Flavor, Product, Boutique, SundaeIngredient } from './types';

export const HISTORIAL_YEARS = [
  {
    year: '1960',
    title: '鲁本的宏伟蓝图',
    heading: '突破平庸的甜蜜梦想',
    text: '联合创始人鲁本·马杜斯（Reuben Mattus）对现有冰淇淋品质极度不满足。他矢志不渝地坚信，唯有最极致、最天然的原料才配被称为艺术珍享。他全神贯注研发数年，终于在纽约迈出了传奇的第一步。',
    tag: '创世之光',
    bgColor: 'bg-primary'
  },
  {
    year: '1961',
    title: '三大经典启程',
    heading: '香草、巧克力与硬派咖啡',
    text: '哈根达斯品牌正式面世，首发仅提供三种至高纯粹的口味。它们瞬间风靡曼哈顿名流社交界，被盛赞为冰淇淋界的「凡尔赛水晶」。没有捷径，只凭本真，这三大金刚口味至今仍是高级甜品的代名词。',
    tag: '不老经典',
    bgColor: 'bg-[#5c2400]'
  },
  {
    year: '1976',
    title: '首家奢华沙龙店铺',
    heading: '让冰淇淋成为一种社交艺术',
    text: '鲁本的女儿多丽丝在布鲁克林黄金地段开设了第一家意式冰淇淋经典概念沙龙。精致的白瓷咖啡杯、尊贵银匙，以及舒缓的现场古典室内弦乐，彻底改写了年轻一代的惬意下午茶社交文化。',
    tag: '优雅地标',
    bgColor: 'bg-[#003b14]'
  },
  {
    year: '1990',
    title: '风靡全球大都会',
    heading: '巴黎香榭丽舍与东京银座的钟声',
    text: '从纽约走向世界，哈根达斯成为跨越欧亚非的全球轻奢生活符号。在巴黎老派剧院外，在东京繁华的午夜街头，带着金框纸杯的哈根达斯成为表达高雅审美品味的奢华信物。',
    tag: '时代风潮',
    bgColor: 'bg-primary-container'
  },
  {
    year: '2020',
    title: '六十载纯真洗礼',
    heading: '经典艺术再年轻',
    text: '庆祝60载风味传承与纯粹洗礼。联合先锋视觉艺术家，重构传统包装设计，并推出低脂轻卡的水果雪芭与创新的流心熔岩系列，致力于将「心无挂碍，舌尖起舞」的沉浸感带给全新世代。',
    tag: '未来旅程',
    bgColor: 'bg-[#3b1200]'
  }
];

export const FLAVORS: Flavor[] = [
  {
    id: 'belgian-chocolate',
    name: '比利时巧克力',
    englishName: 'Belgian Chocolate',
    category: '经典重乳',
    sweetness: 3,
    milkContent: '35% 高浓度新鲜奶油',
    description: '甄选北欧或西非优质可可豆精研，在熔融的苦甜之间寻找绝对平衡。犹如在巴黎冬夜里裹上面纱，其厚重的脂香和持久的喉韵让人在静默中感动。',
    tags: ['醇厚', '微苦回甘', '王牌热销'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANnz1SfyiTpLT3KNlnwwEV4OdrxlMx4R79o_1oowEAXaFJqKfSGpmchrMfeorKXuRZuEH7Af8tXjxgdFIxLMfbarszHYVyewogAL8X9PgRhWgtt-ov-WY_2-2oVcRacOf5j0gQR5y2Unao_n1HdC6EtSF0eLVnHuf1jiU34_GzgKK-R5wJLPpWqDEVI5aqTlgLEm6iYLe7R_L1EqicSfJBHIZo8j2HrcuhXUsxyqYlx6hlfaEXkW49q9N2Kob9h5QwGzT8AE5gU0fi'
  },
  {
    id: 'madagascar-vanilla',
    name: '马达加斯加香草',
    englishName: 'Madagascar Vanilla',
    category: '黄金本源',
    sweetness: 2,
    milkContent: '40% 牧场直供全脂牛乳',
    description: '选用手工授粉并自然醇化数月的马达加斯加香草荚。那些细小肉眼可见的香草籽，是大自然赐予最真实的乐章，将牛奶的芳香推向极致纯粹。',
    tags: ['天然香气', '温润经典', '原料至上'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9a-TJwYfuS58p9J-koVbHX7Xfv44U1eBtqk_fl5xdhZ0KalnMRPrc5RMHVM8kgzgchcFoy9b0xzXzeKhqnPDGfpxvBe_u52MOMuFDbEbulhdL3YYuMxMKgPtT9hohpCIXMy1ZLcUsl7dl4nzIGm58fFjgbD7iE1kTFebaqdTuWF5yGCEUsvztitUkWx2Nq-c1RgAVRq__mEvHzu7wUrxDggVY378UYUnkgobEooNWsOG6kLoJ83_C0ms10urnD9OTXckL2hVYXKT'
  },
  {
    id: 'strawberry-cheesecake',
    name: '草莓芝士蛋糕',
    englishName: 'Strawberry Cheesecake',
    category: '烘焙二重奏',
    sweetness: 4,
    milkContent: '30% 精选乳酪基底',
    description: '来自夏日庄园的熟透红艳草莓，调入浓郁酸甜的法式软质干酪。内嵌多孔香甜的全麦消化饼干碎，咬下的一瞬仿佛在舌尖上演了一场盛大的歌剧。',
    tags: ['多重口感', '酸甜交织', '法式灵感'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCimEICijj1kDMSRmD4qPDRSJUj8x_sBjzjv6tOOcfvJXLDVi0QkULGF7RNRttt-HIr2ClCypKVY5aVICkepZGXdhJGA4FwVKNp0oMIsFhL-tjPy-A-cBuQk0reJXrkcuOml_0McM5u9DGx5TUuiBPhAnO_CO-4zacIPAaweunTB3a63l65RfFusP4xkfBCj1MzvNl9T1hcLXWS7LL5xcQDaKtAt5ZVUZ5pqDI7DYQZRtGEXZnWaiYQt5XsC7fLjOsEX5ggmxaRbkXl'
  },
  {
    id: 'mango-sorbet',
    name: '热带芒果雪芭',
    englishName: 'Mango Sorbet',
    category: '果树流莹',
    sweetness: 2,
    milkContent: '0% 纯果肉研榨无油脂',
    description: '百分百精选热带阿尔方索芒果肉直接成泥成冰。剔除了任何牛乳和奶油的厚重感，保留了热带阳光的奔放，沙冰融化时轻盈酸爽，零卡路里负担的最佳选择。',
    tags: ['夏日冰爽', '全素零脂', '热烈果感'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBjDubv42sNVZ9jMz2Sk3EfNQUuLjE4OgWGup-CFyVUfSmuuDwRm5ypUGdFzG_bouEonX9dOPUvzVZXhsxsmJST0BYsO-UWTMUYrQEnw_XGU1zZPcIWLSPTY6ZOVoVnW3TC9Zm_8_po7Bx556o11CaSBCt1xENhb8cDZZZ4NGWtWpfBsnTOv7swJP_w18CI0xEAp5YLPwKEimG-AupJex-2V4qJkG8YQlHPpaBRXDHZiISixK7yKVbSt8egHWpmtEhPwDoBBbb_7Na'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p-chocolate-pint',
    name: '比利时巧克力 经典品脱杯',
    englishName: 'Belgian Chocolate Pint',
    price: 88,
    category: 'family',
    description: '浓郁的比利时可可底，丝滑天成，473ml 阖量，是与亲密爱人深夜观影或周末小聚的高尚伴侣。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANnz1SfyiTpLT3KNlnwwEV4OdrxlMx4R79o_1oowEAXaFJqKfSGpmchrMfeorKXuRZuEH7Af8tXjxgdFIxLMfbarszHYVyewogAL8X9PgRhWgtt-ov-WY_2-2oVcRacOf5j0gQR5y2Unao_n1HdC6EtSF0eLVnHuf1jiU34_GzgKK-R5wJLPpWqDEVI5aqTlgLEm6iYLe7R_L1EqicSfJBHIZo8j2HrcuhXUsxyqYlx6hlfaEXkW49q9N2Kob9h5QwGzT8AE5gU0fi',
    isPopular: true
  },
  {
    id: 'p-strawberry-pint',
    name: '草莓芝士蛋糕 经典品脱杯',
    englishName: 'Strawberry Cheesecake Pint',
    price: 92,
    category: 'family',
    description: '松脆饼干颗粒、香浓乳酪与红润草莓旋纹在473ml装里碰撞出丰富味觉。美味难挡。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCimEICijj1kDMSRmD4qPDRSJUj8x_sBjzjv6tOOcfvJXLDVi0QkULGF7RNRttt-HIr2ClCypKVY5aVICkepZGXdhJGA4FwVKNp0oMIsFhL-tjPy-A-cBuQk0reJXrkcuOml_0McM5u9DGx5TUuiBPhAnO_CO-4zacIPAaweunTB3a63l65RfFusP4xkfBCj1MzvNl9T1hcLXWS7LL5xcQDaKtAt5ZVUZ5pqDI7DYQZRtGEXZnWaiYQt5XsC7fLjOsEX5ggmxaRbkXl',
    isNew: true
  },
  {
    id: 'p-macadamia-pint',
    name: '夏威夷果仁 经典品脱杯',
    englishName: 'Macadamia Nut Pint',
    price: 95,
    category: 'limited',
    description: '精选烘烤松脆的夏威夷火山果仁，搭配醇滑奶香四溢的冰淇淋，坚果气息与香甜奶脂的奢茂双修。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAAuFvayzke9rRv5qIqeyTmB3wDDZh5vSGX8Q8Bpdbk2_XQbm4-nYtBqC1DvuyG9UxZEwBnpkVyf3YXumwCQgs1Bg96SlobJNckorpb4CZTIY_ZZibrJAkDMYAKDilVlvSjifBRJbUtUu1oUkPkGZHAAZxwPSHVPn2miuhnCMFCiWiBIPeMUjd_EQtz04bXwgBJQ8uu06sZpIYE8-wHDKSzcQxsfPLB69HMkftedASPYkgc-EX0agzly2wKI-kYh7slEyhT_8VXMX4'
  },
  {
    id: 'p-stickbars-pack',
    name: '脆皮雪糕多支装 (比利时巧克力/焦糖杏仁)',
    englishName: 'Stick Bar Multipack',
    price: 128,
    category: 'limited',
    description: '3支精品盒装，每一支均裹有厚重松脆的顶级卡乐力巧克力，内蕴温润奶香，优雅手持手作。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTHBpZyw5l9-81d787AgSHrWL66Bpi_7vQgP0strlzWN1KiYa5Yj1FcWOXLaW061hY1lK5prwqtKsMBnzFxuONsmOxbtSKERvNbDrdMelHEteAj1S_5J61u4DvUJrfPdLfRhxYjS9Zh0OYap36_jIMbvKECdzadjH_d5hUBMS0Y_MNnJUZH6aNgrRG6JQ37oT6OyyJ2VLw3l22PRY8J2uRwsbsSdYvxXpfxRsVWFqeT2xdEtGMuWumAAyJOrXUb8yoZTZfxcQBdtMh'
  },
  {
    id: 'p-goldbox-edition',
    name: '六十周年纪念金礼盒',
    englishName: '60th Golden Celebration Gift Box',
    price: 588,
    category: 'giftbox',
    description: '内含4款殿堂级极罕口味中品、2款极匠定制镀金冰淇淋船勺、一幅手绘Reuben创业史丝巾，礼赞极致。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0a4ld9Gnf_9SM8aEklAz8GPk9qqJZ3UUGZRCkA-j3LQr30eNiGAMrAoSDlXUTKAp7VsKaBHCNH-hRgvI1c3O0C3b7uWgjjgOxHmhwEi35UiBNFFgAflihdMNW76izXqm4Q_iplbC5PrrMHJ_XHKMw9I7_DwFbcxpG4pyjEEpYJXm93PEhjULyLXGEjbr2dknZUuEo4TyVO0OlUWJVX-uB1VC3wPJYWztzKTPbLHN3-CT4lcYHeg0p1SKaTRvkzWhHoXbEh9nzG2T',
    isPopular: true
  },
  {
    id: 'p-sculpture-cup',
    name: '凡尔赛浮雕瓷杯珍藏版及勺套装',
    englishName: 'Versailles Porcelain Cup & Gilded Spoon',
    price: 320,
    category: 'boutique',
    description: '联名法国高尚骨瓷窑，纯手工拉胚与18K鎏金花卉浮雕，让您在家享用的每一口，都是皇家洗礼。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhNdPJi3XHd-lGweFMVrcXde2NyF6WwSQqxHwtmnD8boNc-DKf-KDYmJwzLz5ICvuiXVsOrRJzmWToynromq_eLQcKgrsdriLft0eenP2Dw05QukcDezZtlL-G5YLUdEC6T_la8ufM7LeW7l0ki2ezWK7wk_ytZVO0q9atTqYr17wVP2U3yJzA7lxEXXQcwI0Vd8hJq_7YcDGEXIbQZbCPKTMnxwnePH4dYMXE8ojjKenZ7Y2qp8WOgYoSVgEcMEsTWU3q31HHGdji'
  }
];

export const BOUTIQUES: Boutique[] = [
  {
    id: 'b-shanghai',
    city: '上海',
    name: '上海新天地历史石库门旗舰店',
    address: '黄浦区马当路159号石库门雅致苑区',
    phone: '021-6385-2888',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5NqQhe89U8mJYr_Oky8RDEopQw_SIkBZUBLZMuYO4c2WoPKdRvAakihyBrlONvyvyQio2ixZMxE1sDNuGw94ZxgLl8S-T4QgtTbtz77yhjlIjoqF5zrlmx_3jDYGfZDtKZ2WAoXnBGOQpBJQRuXWuE-ftZkwG2F82na6bV57nDx-kIKZNOXYDVltUNUrobi23t-E6_nn-RCiI3FaK10pstQViPFfjMzv4_PkiD3zLGROQKIJux9mBpg2qrZVSR5EmVH2B_VZYma8B',
    description: '坐落于充满历史浪漫的海派建筑石库门核心区，将古典中式清水红砖和巴洛克式铜雕，与哈根达斯经典的胡桃木高尚家私深度融合。本店本月正举办「凡尔赛玫瑰特展」，供应全球仅有三家门市特供的「香槟熔岩冰淇淋圣代堡」。',
    specialties: ['黑松露熔岩巧圣代', '冷萃法兰绒琥珀咖啡', '玫瑰露苏打雪巴'],
    latPercent: 44,
    lngPercent: 48
  },
  {
    id: 'b-beijing',
    city: '北京',
    name: '北京国贸商城云端艺术工坊',
    address: '朝阳区建国门外大街1号国贸高层观景阁',
    phone: '010-6505-1960',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFVD6TB9By4MaHmCFGLoQO8jpDoDw--V_osMvpZLGboBjgNfA8Xv8ZNMXVA8mqADLBLnbHpXP4sEl2qTZw0G8golh_bKuurwUKcSOo-XVDYKkX3HmAWwVKmlD2xRRd_kFuP42FUOLhxSm04dABPIK_T5-IAt43i5H9O0uMcR5TRy0lHUXJtkKVeO8JVo0zHnZ53UD85oJUHHX3tZnbFHnQ4qurSXLErJWtQXqRee5bY88B7ci6p5ZLAsZNCFDqZ2SV6lvuU7oUrlyM',
    description: '在俯瞰繁华帝都天际红尘的优雅云端，以粗粝的莫兰迪灰硅藻泥手工刮痕墙面，衬托金叶般的香草兰吊顶。提供宛如美术馆级别的感官沉浸，特设主厨定制餐桌（Chef Table），开启全套顶级冰淇淋与金叶的灵感碰撞。',
    specialties: ['云端威士忌雪域金塔', '极罕巴拿马瑰夏冰水洗'],
    latPercent: 28,
    lngPercent: 62
  },
  {
    id: 'b-guangzhou',
    city: '广州',
    name: '广州太古汇绿野庭院静谧概念店',
    address: '天河区天河路383号太古汇顶层花园回廊',
    phone: '020-3868-2020',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMUEDSHQX6B54FXn0Cj_c_6YxUz5C6V6ombesWwY_AbgaLZ7y5SfZnvq2tyWZs28gc9O9C-udg67a-xjyMmKpURlKmTuR88qamEHzISx9wzFPmxSIscvGjlcQ_penIF_KZOA8_dINgC1jqhbHKexRtxk5Ik-mGqljvj8TT1qxnr6r90hFOlLa9sQloYu5dR_CG1r7VohLIwXcRYaMLTYCyOUyuu5ldzwmBEME12We4mRVf63cG8SGryWTOt1BuSssteyi93bGRVXNW',
    description: '采用极具呼吸感的温室穹顶花房设计，满眼尽是古陶盆中的波士顿蕨和热带天堂鸟。极具温润和静音的软木地板及抹茶绿麂皮，将闹市喧嚣彻底绝缘。是华南精英在午后慵懒享受经典果香冰品的最美庇护所。',
    specialties: ['岭南珍荔芒果大福圣代', '庄园野浆果双重奏'],
    latPercent: 65,
    lngPercent: 54
  }
];

export const SUNDAE_INGREDIENTS: SundaeIngredient[] = [
  // Cups
  { id: 'cup-crystal', name: '威尼斯水晶高脚碗', type: 'cup', color: '#eef8ff', price: 20 },
  { id: 'cup-waffle', name: '香脆奶香鸡蛋仔蛋筒碗', type: 'cup', color: '#ffead0', price: 15 },
  { id: 'cup-gilt', name: '皇家鎏金雕花瓷杯', type: 'cup', color: '#fbf4e6', price: 35 },

  // Scoops
  { id: 'scoop-chocolate', name: '顶级比利时巧克力球', type: 'scoop', color: '#321605', price: 25 },
  { id: 'scoop-vanilla', name: '马达加斯加香草球', type: 'scoop', color: '#fff9ea', price: 25 },
  { id: 'scoop-strawberry', name: '草莓芝士熔岩球', type: 'scoop', color: '#ffc1d1', price: 25 },
  { id: 'scoop-mango', name: '热带阳光芒果泥冰球', type: 'scoop', color: '#ffbc42', price: 25 },
  { id: 'scoop-matcha', name: '特供京都御前抹茶球', type: 'scoop', color: '#548235', price: 25 },

  // Sauces
  { id: 'sauce-caramel', name: '手工太妃海盐焦糖酱', type: 'sauce', color: '#b97a20', price: 10 },
  { id: 'sauce-fudge', name: '黑松露热巧克力甘那许', type: 'sauce', color: '#271101', price: 12 },
  { id: 'sauce-berry', name: '野生覆盆子多酚酸爽酱', type: 'sauce', color: '#970c10', price: 10 },

  // Toppings
  { id: 'topping-gold', name: '佛罗伦萨食用碎金箔', type: 'topping', color: '#ffd700', price: 50 },
  { id: 'topping-almond', name: '海盐烘烤杏仁与碧根果碎', type: 'topping', color: '#ab7030', price: 15 },
  { id: 'topping-wafer', name: '法式黑可可威化雪茄酥条', type: 'topping', color: '#634b35', price: 12 },
  { id: 'topping-mint', name: '清晨露水薄荷叶嫩芽', type: 'topping', color: '#68bd45', price: 5 },
  { id: 'topping-cherry', name: '酒渍黑森林甜野生樱桃', type: 'topping', color: '#570810', price: 18 }
];
