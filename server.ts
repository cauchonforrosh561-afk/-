import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. API: Server-side Gemini taste oracle pairing counselor
app.post("/api/taste-oracle", async (req, res) => {
  const { mood, scene, customText } = req.body;

  if (!ai) {
    // Elegant baseline fallback if key is missing or not configured
    return res.json({
      matchedFlavorId: "belgian-chocolate",
      sundaeTitle: "勃朗峰雨夜熔岩巧堡",
      poeticJustification: "在缺乏云端密钥的风味星图中，我们仍能感应到您优雅的感官波动。为您奉上经典的比利时巧巧克力球，多层厚润的苦甜脂香如凡尔赛大门被叩开，在微冷风宿里治愈灵魂。",
      gourmetRecipe: ["2球 比利时巧克力球", "1球 经典香草球", "手工太妃海盐焦糖酱 浇淋", "佛罗伦萨食用碎金箔 点缀成云端星月"],
      visualAura: "金粉金屑落在浓黛可可表面，辅以古典雕花瓷杯，凝聚巴洛克大师油画感。"
    });
  }

  try {
    const promptText = `
      您是哈根达斯(Häagen-Dazs)官方主厨艺术顾问，请根据下述宾客的状态与偏好：
      - 当前精神况味(Mood): ${mood}
      - 脑海向往异域(Scene): ${scene}
      - 额外手写意愿(Custom Details): ${customText || "无额外手写意愿"}

      请调和、设计一款只属于他的高尚定制冰淇淋圣代。并精准寻找出最核心匹配的哈根达斯口味ID。
      支持的主干口味ID仅限：
      - "belgian-chocolate" （比利时巧克力）
      - "madagascar-vanilla" （马达加斯加香草）
      - "strawberry-cheesecake" （草莓芝士蛋糕）
      - "mango-sorbet" （热带芒果雪芭）

      返回数据务必遵循结构化 JSON Schema 格式。Poetic Justification 部分文字请字斟句酌，展现欧陆复古高奢下午茶沙龙的主厨质感，用富有艺术感、优雅温婉、带有故事层级的中文撰写，切忌刻板死板。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are the head masterchef and sensory designer of Häagen-Dazs, an expert in blending high-end chocolates, milk fats, and visual fine arts. Speak in an elegant, luxurious, poetic vintage tone.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedFlavorId: {
              type: Type.STRING,
              description: "Must be exactly one of: belgian-chocolate, madagascar-vanilla, strawberry-cheesecake, mango-sorbet."
            },
            sundaeTitle: {
              type: Type.STRING,
              description: "A gorgeous, poetic, luxurious custom named sundae recipe e.g. '凡尔赛雨夜熔岩巧堡', '勃朗峰晨雨香草金塔'."
            },
            poeticJustification: {
              type: Type.STRING,
              description: "Poetic explanation in Chinese of why this ingredient profile matches their current psychiatric state and scene imagery."
            },
            gourmetRecipe: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of ingredients representing how to prepare this luxury custom sundae from cups to toppings."
            },
            visualAura: {
              type: Type.STRING,
              description: "A description of the layout aesthetics, colours, and porcelain frames."
            }
          },
          required: ["matchedFlavorId", "sundaeTitle", "poeticJustification", "gourmetRecipe", "visualAura"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error) {
    console.error("Gemini API error in oracle:", error);
    // Robust graceful fallback
    return res.json({
      matchedFlavorId: "madagascar-vanilla",
      sundaeTitle: "香风晨雾静谧雅塔",
      poeticJustification: "在流云交错的风味回廊中，我们捕捉到您向往温润平静的心。这款以马达加斯加香草为本源的黄金极简，将极好的抚慰一切焦渴喧扰。",
      gourmetRecipe: ["2球 经典马达加斯加香草球", "手工海盐焦糖酱 浇淋", "清晨露水薄荷叶 1片 点缀"],
      visualAura: "温润温白，浮雕瓷杯承载着碎斑香草籽，如白雪般透出本真高压。"
    });
  }
});

// Serve Vite frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production built dist bundle folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Häagen-Dazs Server] running beautifully on http://localhost:${PORT}`);
  });
}

startServer();
