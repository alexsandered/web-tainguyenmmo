import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { EventEmitter } from "events";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Database Setup (SQLite) ---
const db = new Database("database.sqlite", { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    balance INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    otp TEXT,
    expires_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    base_price INTEGER,
    warranty_type TEXT,
    keywords TEXT
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    data TEXT,
    is_used BOOLEAN DEFAULT 0,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    delivered_data TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const bcrypt = await import('bcrypt');
  const hashedPassword = await bcrypt.hash('password123', 10);
  db.prepare("INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, ?)").run("demo_user", "demo@example.com", hashedPassword, 1000000);
  
  const insertProduct = db.prepare("INSERT INTO products (name, base_price, warranty_type, keywords) VALUES (?, ?, ?, ?)");
  
  // AI Tools
  insertProduct.run("Supper Grok Acc Cấp 1 Tháng", 240000, "BHF", "Grok, AI Tools");
  insertProduct.run("Supper Grok Active Chính Chủ 1 Tháng", 265000, "BHF", "Grok, AI Tools");
  insertProduct.run("Code Perplexity Pro 1 Năm (KBH)", 84000, "KBH", "Perplexity, AI Tools");
  insertProduct.run("Acc Perplexity Pro 1 Năm (KBH)", 96000, "KBH", "Perplexity, AI Tools");
  insertProduct.run("Gemini Pro & Veo 3 1 Năm (Kèm Drive 2TB - KBH)", 84000, "KBH", "Gemini, Veo3, AI Tools");
  insertProduct.run("Chat GPT Plus 1 Tháng (KBH)", 20000, "KBH", "ChatGPT, AI Tools");
  insertProduct.run("Slot Add GPT Team 1 Tháng (KBH)", 39000, "KBH", "ChatGPT, AI Tools");
  insertProduct.run("Chat GPT Plus Acc Cấp 1 Tháng (BHF)", 60000, "BHF", "ChatGPT, AI Tools");
  insertProduct.run("Chat GPT Plus Dịch Vụ Pay Lại Acc Cũ 1 Tháng (KBH)", 72000, "KBH", "ChatGPT, AI Tools");
  insertProduct.run("Chat GPT Plus Dịch Vụ Pay Lại Acc Cũ 1 Tháng (BHF)", 192000, "BHF", "ChatGPT, AI Tools");
  insertProduct.run("Chat GPT Go 12 Tháng (Chính Chủ - KBH)", 156000, "KBH", "ChatGPT, AI Tools");
  insertProduct.run("Kling AI 1100 Credit (KBH)", 120000, "KBH", "Kling, AI Tools");
  insertProduct.run("Veo 3 Ultra 45000 Credit", 96000, "BHF", "Veo3, AI Tools");
  insertProduct.run("Add Farm Ultra + 30TB (5K Credit - BH 30D)", 414000, "BHF", "Farm, AI Tools");

  // Design & Video
  insertProduct.run("CapCut Pro 35 Ngày", 16000, "BHF", "CapCut, Design & Video");
  insertProduct.run("CapCut Pro Team 11-12 Tháng", 253000, "BHF", "CapCut, Design & Video");
  insertProduct.run("Canva Pro Chính Chủ 1 Tháng", 26000, "BHF", "Canva, Design & Video");
  insertProduct.run("Canva Pro Chính Chủ 6 Tháng", 59000, "BHF", "Canva, Design & Video");
  insertProduct.run("Canva Pro Chính Chủ 12 Tháng", 96000, "BHF", "Canva, Design & Video");
  insertProduct.run("Admin Canva Pro 500 Slot (3 Năm)", 204000, "BHF", "Canva, Design & Video");
  insertProduct.run("Adobe Creative 3 Tháng (KBH)", 60000, "KBH", "Adobe, Design & Video");
  insertProduct.run("Adobe Full App Dùng Riêng 4 Tháng", 102000, "BHF", "Adobe, Design & Video");
  insertProduct.run("Meitu SVIP 7 Ngày", 30000, "BHF", "Meitu, Design & Video");
  insertProduct.run("Meitu SVIP 1 Tháng", 72000, "BHF", "Meitu, Design & Video");
  insertProduct.run("Wink VIP 1 Tháng", 84000, "BHF", "Wink, Design & Video");
  insertProduct.run("Beautycam VIP (Log 1 TB)", 132000, "BHF", "Beautycam, Design & Video");
  insertProduct.run("Xingtu SVIP 1 Tháng", 138000, "BHF", "Xingtu, Design & Video");

  // Entertainment
  insertProduct.run("YouTube Premium 1 Tháng", 52000, "BHF", "YouTube, Entertainment");
  insertProduct.run("YouTube Premium 3 Tháng", 96000, "BHF", "YouTube, Entertainment");
  insertProduct.run("YouTube Premium 6 Tháng", 180000, "BHF", "YouTube, Entertainment");
  insertProduct.run("YouTube Premium 12 Tháng", 265000, "BHF", "YouTube, Entertainment");
  insertProduct.run("Netflix Dùng Chung Cấp Acc 1 Tháng", 55000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Slot Riêng 1 Tháng", 101000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Extra 1 Tháng (TK Riêng Tư)", 160000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Premium 4K 1 Tháng (Slot Riêng Đổi Tên/PIN)", 140000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Premium 4K 3 Tháng", 269000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Premium 4K 3 Tháng (Slot Riêng Đổi Tên/PIN)", 396000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Premium 4K 6 Tháng", 503000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Premium 4K 6 Tháng (Slot Riêng Đổi Tên/PIN)", 781000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Premium 4K 12 Tháng", 969000, "BHF", "Netflix, Entertainment");
  insertProduct.run("Netflix Premium 4K 12 Tháng (Slot Riêng Đổi Tên/PIN)", 1543000, "BHF", "Netflix, Entertainment");

  // VPN & Proxy
  insertProduct.run("Nord VPN 1 Năm 1 Thiết Bị", 156000, "BHF", "Nord, VPN & Proxy");
  insertProduct.run("Nord VPN 1 Năm 3 Thiết Bị", 240000, "BHF", "Nord, VPN & Proxy");
  insertProduct.run("Surfshark VPN Hạn 4-7 Ngày", 21000, "BHF", "Surfshark, VPN & Proxy");
  insertProduct.run("Surfshark VPN 2 Tháng", 169000, "BHF", "Surfshark, VPN & Proxy");
  insertProduct.run("HMA 5 Thiết Bị (PC/Android - 28-30 Ngày)", 20000, "BHF", "HMA, VPN & Proxy");
  insertProduct.run("HMA 5 Thiết Bị (PC/Android/iOS - 28-30 Ngày)", 33000, "BHF", "HMA, VPN & Proxy");
  insertProduct.run("PIA VPN 5 Thiết Bị Hạn 4-7 Ngày", 26000, "BHF", "PIA, VPN & Proxy");
  insertProduct.run("Express VPN Hạn 27-32 Ngày (8 Thiết Bị)", 18000, "BHF", "Express, VPN & Proxy");
  insertProduct.run("Express VPN 3 Tháng", 85000, "BHF", "Express, VPN & Proxy");
  insertProduct.run("Express VPN 6 Tháng", 156000, "BHF", "Express, VPN & Proxy");
  insertProduct.run("9 Proxy 100 IP (VIP)", 226000, "BHF", "Proxy, VPN & Proxy");

  // Marketing & Social
  insertProduct.run("Gmail New Trắng (Ngâm 8-9 Ngày)", 20000, "BHF", "Gmail, Marketing & Social");
  insertProduct.run("Gmail Old 2006-2012", 34000, "BHF", "Gmail, Marketing & Social");
  insertProduct.run("Nhóm Chat Zalo 950-1000 TV", 173000, "BHF", "Zalo, Marketing & Social");
  insertProduct.run("Nhóm Chat Zalo 1800-2000 TV", 216000, "BHF", "Zalo, Marketing & Social");
  insertProduct.run("Tài Khoản Trao Đổi Sub 1M Xu", 26000, "BHF", "Traodoisub, Marketing & Social");
  insertProduct.run("Tài Khoản Trao Đổi Sub 2M Xu", 49000, "BHF", "Traodoisub, Marketing & Social");
  insertProduct.run("Tài Khoản Trao Đổi Sub 5M Xu", 113000, "BHF", "Traodoisub, Marketing & Social");
  insertProduct.run("Tài Khoản Trao Đổi Sub 10M Xu", 226000, "BHF", "Traodoisub, Marketing & Social");
  insertProduct.run("TikTok Việt Ngâm 2000-2500 Follow", 132000, "BHF", "TikTok, Marketing & Social");
  insertProduct.run("TikTok Việt Sẵn Full Chức Năng (Live, PK, Thoại)", 180000, "BHF", "TikTok, Marketing & Social");
  insertProduct.run("TikTok Việt 1000-1500 Follow", 180000, "BHF", "TikTok, Marketing & Social");
  insertProduct.run("GPM Login Key Bản Quyền (Bảo Hành 3 Năm)", 828000, "BHF", "GPM, Marketing & Social");

  const insertInventory = db.prepare("INSERT INTO inventory (product_id, data) VALUES (?, ?)");
  // Add some inventory
  for (let i = 1; i <= 50; i++) {
    for (let j = 0; j < 5; j++) {
      insertInventory.run(i, `account${i}_${j}@example.com|password123`);
    }
  }
}

// --- SSE (Server-Sent Events) Setup ---
const sseEmitter = new EventEmitter();

app.get("/api/sse/:userId", (req, res) => {
  const userId = req.params.userId;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const listener = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sseEmitter.on(`user_${userId}`, listener);

  req.on("close", () => {
    sseEmitter.off(`user_${userId}`, listener);
  });
});

// --- API Routes ---

import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
  }
  if (username.includes(" ")) {
    return res.status(400).json({ success: false, message: "Tên đăng nhập không được chứa khoảng trắng" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)").run(username, email, hashedPassword);
    const user = db.prepare("SELECT id, username, email, balance FROM users WHERE id = ?").get(result.lastInsertRowid);
    res.json({ success: true, user });
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ success: false, message: "Tên đăng nhập hoặc Email đã tồn tại" });
    }
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?").get(identifier, identifier) as any;
  if (!user) {
    return res.status(400).json({ success: false, message: "Tài khoản không tồn tại" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ success: false, message: "Mật khẩu không chính xác" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'demo@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  
  if (!user) {
    return res.status(400).json({ success: false, message: "Email không tồn tại trong hệ thống" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

  db.prepare("INSERT INTO otps (user_id, otp, expires_at) VALUES (?, ?, ?)").run(user.id, otp, expiresAt);

  const mailOptions = {
    from: '"DigiHub" <noreply@digihub.vn>',
    to: email,
    subject: '[DigiHub] Mã khôi phục tài khoản của bạn',
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">Khôi phục mật khẩu</h2>
        <p>Chào <strong>${user.username}</strong>,</p>
        <p>Bạn vừa yêu cầu khôi phục mật khẩu tại DigiHub. Dưới đây là mã xác nhận (OTP) của bạn:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
        </div>
        <p style="color: #ef4444; font-size: 14px; text-align: center;">Mã này sẽ hết hạn sau 5 phút.</p>
        <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">© 2026 DigiHub. All rights reserved.</p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("Sent OTP to", email);
    } else {
      console.log("Sending OTP to", email, ":", otp); // Mocking email send for preview
    }
    res.json({ success: true, message: "Mã OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Lỗi khi gửi email" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  if (!user) {
    return res.status(400).json({ success: false, message: "Email không tồn tại" });
  }

  const otpRecord = db.prepare("SELECT * FROM otps WHERE user_id = ? AND otp = ? AND expires_at > CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1").get(user.id, otp) as any;
  
  if (!otpRecord) {
    return res.status(400).json({ success: false, message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashedPassword, user.id);
  db.prepare("DELETE FROM otps WHERE user_id = ?").run(user.id);

  res.json({ success: true, message: "Đổi mật khẩu thành công" });
});

// Get current user (mock auth)
app.get("/api/user", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get("demo_user");
  res.json(user);
});

// Get all users (for admin)
app.get("/api/users", (req, res) => {
  try {
    const users = db.prepare("SELECT id, username, email, balance, role, created_at FROM users ORDER BY created_at DESC").all();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

// Update user (for admin)
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { role, balance } = req.body;
  try {
    db.prepare("UPDATE users SET role = ?, balance = ? WHERE id = ?").run(role, balance, id);
    res.json({ success: true, message: "Cập nhật người dùng thành công" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

// Delete user (for admin)
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ success: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

// Get products with stock
app.get("/api/products", (req, res) => {
  const products = db.prepare(`
    SELECT p.*, (SELECT COUNT(*) FROM inventory i WHERE i.product_id = p.id AND i.is_used = 0) as stock
    FROM products p
  `).all();
  res.json(products);
});

// Webhook for Auto-Recharge
app.post("/api/recharge/webhook", (req, res) => {
  const { content, amount } = req.body; // e.g., content: "NAPTIEN 1"
  
  const match = content.match(/NAPTIEN\s+(\d+)/i);
  if (match && amount > 0) {
    const userId = parseInt(match[1]);
    
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (user) {
      db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(amount, userId);
      
      // Notify UI via SSE
      sseEmitter.emit(`user_${userId}`, { type: "RECHARGE_SUCCESS", amount, newBalance: (user as any).balance + amount });
      
      return res.json({ success: true, message: "Recharge successful" });
    }
  }
  res.status(400).json({ success: false, message: "Invalid syntax or user not found" });
});

// Create Order
app.post("/api/orders", (req, res) => {
  const { userId, productId, price } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  if (!user || user.balance < price) {
    return res.status(400).json({ success: false, message: "Insufficient balance" });
  }

  const stock = db.prepare("SELECT COUNT(*) as count FROM inventory WHERE product_id = ? AND is_used = 0").get(productId) as any;
  if (stock.count === 0) {
    return res.status(400).json({ success: false, message: "Out of stock" });
  }

  // Deduct balance
  db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(price, userId);
  
  // Create Pending Order
  const result = db.prepare("INSERT INTO orders (user_id, product_id, status) VALUES (?, ?, ?)").run(userId, productId, "Pending");
  const orderId = result.lastInsertRowid;

  // Notify UI of new balance
  sseEmitter.emit(`user_${userId}`, { type: "BALANCE_UPDATE", newBalance: user.balance - price });

  // Simulate BullMQ Queue with random delay (1 to 5 minutes)
  // For testing purposes, let's use 10 to 30 seconds instead of 1-5 mins so user can see it complete.
  const delayMs = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000; 
  
  setTimeout(() => {
    processOrder(orderId, productId, userId);
  }, delayMs);

  res.json({ success: true, orderId, delayMs });
});

// Worker logic
function processOrder(orderId: number | bigint, productId: number, userId: number) {
  const inventoryItem = db.prepare("SELECT * FROM inventory WHERE product_id = ? AND is_used = 0 LIMIT 1").get(productId) as any;
  
  if (inventoryItem) {
    db.prepare("UPDATE inventory SET is_used = 1 WHERE id = ?").run(inventoryItem.id);
    db.prepare("UPDATE orders SET status = ?, completed_at = CURRENT_TIMESTAMP, delivered_data = ? WHERE id = ?").run("Completed", inventoryItem.data, orderId);
    
    sseEmitter.emit(`user_${userId}`, { type: "ORDER_COMPLETED", orderId });
  } else {
    // Handle edge case where stock ran out during delay
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run("Failed - Out of Stock", orderId);
    // Refund logic could go here
    sseEmitter.emit(`user_${userId}`, { type: "ORDER_FAILED", orderId });
  }
}

// Get User Orders
app.get("/api/orders/:userId", (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, p.name as product_name 
    FROM orders o 
    JOIN products p ON o.product_id = p.id 
    WHERE o.user_id = ? 
    ORDER BY o.created_at DESC
  `).all(req.params.userId);
  res.json(orders);
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
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
