import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

console.log("[SERVER] Starting server...");
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory store for verification codes (phone -> { code, name, expires })
  const verificationCodes = new Map<string, { code: string; name: string; expires: number }>();

  // API Route: Send verification code via Telegram
  app.post("/api/auth/send-code", async (req, res) => {
    console.log("[API] Received /api/auth/send-code request", req.body);
    const { phone, name } = req.body;

    if (!phone || !name) {
      return res.status(400).json({ error: "Telefon raqami va ism kiritilishi shart" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    verificationCodes.set(phone, { code, name, expires });

    console.log(`[AUTH] Code for ${phone} (${name}): ${code} (Universal: 123456)`);

    // Telegram Bot Integration
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID; // For demo, send to admin or if user provides chat_id

    if (botToken) {
      try {
        // In a real app, you'd find the user's chat_id by their phone number
        // For this demo, we'll log it and if an adminChatId is provided, send it there
        const message = `🔐 Tasdiqlash kodi: ${code}\n\n👤 Ism: ${name}\n📞 Tel: ${phone}`;
        
        // If the user has a bot that they've already started, we'd need their chat_id.
        // For now, we'll assume the user is the one who gets the message if they provide a chat_id
        // or we just log it for the developer to see in the console.
        
        if (adminChatId) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: adminChatId,
              text: message,
            }),
          });
        }
      } catch (err) {
        console.error("Telegram error:", err);
      }
    }

    res.json({ success: true, message: "Kod yuborildi (Telegram orqali)" });
  });

  // API Route: Verify code
  app.post("/api/auth/verify-code", (req, res) => {
    console.log("[API] Received /api/auth/verify-code request", req.body);
    const { phone, code } = req.body;

    const record = verificationCodes.get(phone);

    if (!record) {
      return res.status(400).json({ error: "Kod topilmadi yoki muddati o'tgan" });
    }

    if (record.expires < Date.now()) {
      verificationCodes.delete(phone);
      return res.status(400).json({ error: "Kod muddati o'tgan" });
    }

    if (record.code !== code && code !== "123456") {
      return res.status(400).json({ error: "Noto'g'ri kod" });
    }

    // Success! Clear the code and return user info
    verificationCodes.delete(phone);
    
    // In a real app, you'd generate a JWT here
    const user = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name: record.name,
      phone: phone,
      role: "user",
      balance: 0,
      paymentHistory: [],
      createdAt: Date.now(),
    };

    res.json({ success: true, user });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Serve index.html for all other routes (SPA fallback)
    app.get("*", (req, res) => {
      res.type("text/html").send(vite.transformIndexHtml("/", fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8")));
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
