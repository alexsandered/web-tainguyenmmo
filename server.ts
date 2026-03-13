import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import { EventEmitter } from "events";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// --- MONGODB CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/digihub";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- MONGOOSE SCHEMAS & MODELS ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otp: String,
  expiresAt: Date
});
const Otp = mongoose.model("Otp", otpSchema);

const productSchema = new mongoose.Schema({
  name: String,
  basePrice: Number,
  warrantyType: String,
  keywords: String
});
const Product = mongoose.model("Product", productSchema);

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  data: String,
  isUsed: { type: Boolean, default: false }
});
const Inventory = mongoose.model("Inventory", inventorySchema);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: String,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  deliveredData: String
});
const Order = mongoose.model("Order", orderSchema);

// --- SEED DATA (Chỉ chạy nếu DB trống) ---
async function seedData() {
  const count = await User.countDocuments();
  if (count === 0) {
    console.log("Đang khởi tạo dữ liệu mẫu...");
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({ username: "demo_user", email: "demo@example.com", password: hashedPassword, balance: 1000000, role: "admin" });

    const productsData = [
      // AI Tools
      { name: "Supper Grok Acc Cấp 1 Tháng", basePrice: 240000, warrantyType: "BHF", keywords: "Grok, AI Tools" },
      { name: "Supper Grok Active Chính Chủ 1 Tháng", basePrice: 265000, warrantyType: "BHF", keywords: "Grok, AI Tools" },
      { name: "Code Perplexity Pro 1 Năm (KBH)", basePrice: 84000, warrantyType: "KBH", keywords: "Perplexity, AI Tools" },
      { name: "Acc Perplexity Pro 1 Năm (KBH)", basePrice: 96000, warrantyType: "KBH", keywords: "Perplexity, AI Tools" },
      { name: "Gemini Pro & Veo 3 1 Năm (Kèm Drive 2TB - KBH)", basePrice: 84000, warrantyType: "KBH", keywords: "Gemini, Veo3, AI Tools" },
      { name: "Chat GPT Plus 1 Tháng (KBH)", basePrice: 20000, warrantyType: "KBH", keywords: "ChatGPT, AI Tools" },
      { name: "Slot Add GPT Team 1 Tháng (KBH)", basePrice: 39000, warrantyType: "KBH", keywords: "ChatGPT, AI Tools" },
      { name: "Chat GPT Plus Acc Cấp 1 Tháng (BHF)", basePrice: 60000, warrantyType: "BHF", keywords: "ChatGPT, AI Tools" },
      { name: "Chat GPT Plus Dịch Vụ Pay Lại Acc Cũ 1 Tháng (KBH)", basePrice: 72000, warrantyType: "KBH", keywords: "ChatGPT, AI Tools" },
      { name: "Chat GPT Plus Dịch Vụ Pay Lại Acc Cũ 1 Tháng (BHF)", basePrice: 192000, warrantyType: "BHF", keywords: "ChatGPT, AI Tools" },
      { name: "Chat GPT Go 12 Tháng (Chính Chủ - KBH)", basePrice: 156000, warrantyType: "KBH", keywords: "ChatGPT, AI Tools" },
      { name: "Kling AI 1100 Credit (KBH)", basePrice: 120000, warrantyType: "KBH", keywords: "Kling, AI Tools" },
      { name: "Veo 3 Ultra 45000 Credit", basePrice: 96000, warrantyType: "BHF", keywords: "Veo3, AI Tools" },
      { name: "Add Farm Ultra + 30TB (5K Credit - BH 30D)", basePrice: 414000, warrantyType: "BHF", keywords: "Farm, AI Tools" },
      // Design & Video
      { name: "CapCut Pro 35 Ngày", basePrice: 16000, warrantyType: "BHF", keywords: "CapCut, Design & Video" },
      { name: "CapCut Pro Team 11-12 Tháng", basePrice: 253000, warrantyType: "BHF", keywords: "CapCut, Design & Video" },
      { name: "Canva Pro Chính Chủ 1 Tháng", basePrice: 26000, warrantyType: "BHF", keywords: "Canva, Design & Video" },
      { name: "Canva Pro Chính Chủ 6 Tháng", basePrice: 59000, warrantyType: "BHF", keywords: "Canva, Design & Video" },
      { name: "Canva Pro Chính Chủ 12 Tháng", basePrice: 96000, warrantyType: "BHF", keywords: "Canva, Design & Video" },
      { name: "Admin Canva Pro 500 Slot (3 Năm)", basePrice: 204000, warrantyType: "BHF", keywords: "Canva, Design & Video" },
      { name: "Adobe Creative 3 Tháng (KBH)", basePrice: 60000, warrantyType: "KBH", keywords: "Adobe, Design & Video" },
      { name: "Adobe Full App Dùng Riêng 4 Tháng", basePrice: 102000, warrantyType: "BHF", keywords: "Adobe, Design & Video" },
      { name: "Meitu SVIP 7 Ngày", basePrice: 30000, warrantyType: "BHF", keywords: "Meitu, Design & Video" },
      { name: "Meitu SVIP 1 Tháng", basePrice: 72000, warrantyType: "BHF", keywords: "Meitu, Design & Video" },
      { name: "Wink VIP 1 Tháng", basePrice: 84000, warrantyType: "BHF", keywords: "Wink, Design & Video" },
      { name: "Beautycam VIP (Log 1 TB)", basePrice: 132000, warrantyType: "BHF", keywords: "Beautycam, Design & Video" },
      { name: "Xingtu SVIP 1 Tháng", basePrice: 138000, warrantyType: "BHF", keywords: "Xingtu, Design & Video" },
      // Entertainment
      { name: "YouTube Premium 1 Tháng", basePrice: 52000, warrantyType: "BHF", keywords: "YouTube, Entertainment" },
      { name: "YouTube Premium 3 Tháng", basePrice: 96000, warrantyType: "BHF", keywords: "YouTube, Entertainment" },
      { name: "YouTube Premium 6 Tháng", basePrice: 180000, warrantyType: "BHF", keywords: "YouTube, Entertainment" },
      { name: "YouTube Premium 12 Tháng", basePrice: 265000, warrantyType: "BHF", keywords: "YouTube, Entertainment" },
      { name: "Netflix Dùng Chung Cấp Acc 1 Tháng", basePrice: 55000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Slot Riêng 1 Tháng", basePrice: 101000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Extra 1 Tháng (TK Riêng Tư)", basePrice: 160000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Premium 4K 1 Tháng (Slot Riêng Đổi Tên/PIN)", basePrice: 140000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Premium 4K 3 Tháng", basePrice: 269000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Premium 4K 3 Tháng (Slot Riêng Đổi Tên/PIN)", basePrice: 396000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Premium 4K 6 Tháng", basePrice: 503000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Premium 4K 6 Tháng (Slot Riêng Đổi Tên/PIN)", basePrice: 781000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Premium 4K 12 Tháng", basePrice: 969000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Netflix Premium 4K 12 Tháng (Slot Riêng Đổi Tên/PIN)", basePrice: 1543000, warrantyType: "BHF", keywords: "Netflix, Entertainment" },
      // VPN & Proxy
      { name: "Nord VPN 1 Năm 1 Thiết Bị", basePrice: 156000, warrantyType: "BHF", keywords: "Nord, VPN & Proxy" },
      { name: "Nord VPN 1 Năm 3 Thiết Bị", basePrice: 240000, warrantyType: "BHF", keywords: "Nord, VPN & Proxy" },
      { name: "Surfshark VPN Hạn 4-7 Ngày", basePrice: 21000, warrantyType: "BHF", keywords: "Surfshark, VPN & Proxy" },
      { name: "Surfshark VPN 2 Tháng", basePrice: 169000, warrantyType: "BHF", keywords: "Surfshark, VPN & Proxy" },
      { name: "HMA 5 Thiết Bị (PC/Android - 28-30 Ngày)", basePrice: 20000, warrantyType: "BHF", keywords: "HMA, VPN & Proxy" },
      { name: "HMA 5 Thiết Bị (PC/Android/iOS - 28-30 Ngày)", basePrice: 33000, warrantyType: "BHF", keywords: "HMA, VPN & Proxy" },
      { name: "PIA VPN 5 Thiết Bị Hạn 4-7 Ngày", basePrice: 26000, warrantyType: "BHF", keywords: "PIA, VPN & Proxy" },
      { name: "Express VPN Hạn 27-32 Ngày (8 Thiết Bị)", basePrice: 18000, warrantyType: "BHF", keywords: "Express, VPN & Proxy" },
      { name: "Express VPN 3 Tháng", basePrice: 85000, warrantyType: "BHF", keywords: "Express, VPN & Proxy" },
      { name: "Express VPN 6 Tháng", basePrice: 156000, warrantyType: "BHF", keywords: "Express, VPN & Proxy" },
      { name: "9 Proxy 100 IP (VIP)", basePrice: 226000, warrantyType: "BHF", keywords: "Proxy, VPN & Proxy" },
      // Marketing & Social
      { name: "Gmail New Trắng (Ngâm 8-9 Ngày)", basePrice: 20000, warrantyType: "BHF", keywords: "Gmail, Marketing & Social" },
      { name: "Gmail Old 2006-2012", basePrice: 34000, warrantyType: "BHF", keywords: "Gmail, Marketing & Social" },
      { name: "Nhóm Chat Zalo 950-1000 TV", basePrice: 173000, warrantyType: "BHF", keywords: "Zalo, Marketing & Social" },
      { name: "Nhóm Chat Zalo 1800-2000 TV", basePrice: 216000, warrantyType: "BHF", keywords: "Zalo, Marketing & Social" },
      { name: "Tài Khoản Trao Đổi Sub 1M Xu", basePrice: 26000, warrantyType: "BHF", keywords: "Traodoisub, Marketing & Social" },
      { name: "Tài Khoản Trao Đổi Sub 2M Xu", basePrice: 49000, warrantyType: "BHF", keywords: "Traodoisub, Marketing & Social" },
      { name: "Tài Khoản Trao Đổi Sub 5M Xu", basePrice: 113000, warrantyType: "BHF", keywords: "Traodoisub, Marketing & Social" },
      { name: "Tài Khoản Trao Đổi Sub 10M Xu", basePrice: 226000, warrantyType: "BHF", keywords: "Traodoisub, Marketing & Social" },
      { name: "TikTok Việt Ngâm 2000-2500 Follow", basePrice: 132000, warrantyType: "BHF", keywords: "TikTok, Marketing & Social" },
      { name: "TikTok Việt Sẵn Full Chức Năng (Live, PK, Thoại)", basePrice: 180000, warrantyType: "BHF", keywords: "TikTok, Marketing & Social" },
      { name: "TikTok Việt 1000-1500 Follow", basePrice: 180000, warrantyType: "BHF", keywords: "TikTok, Marketing & Social" },
      { name: "GPM Login Key Bản Quyền (Bảo Hành 3 Năm)", basePrice: 828000, warrantyType: "BHF", keywords: "GPM, Marketing & Social" }
    ];

    const insertedProducts = await Product.insertMany(productsData);
    
    // Add inventory
    const inventoryItems = [];
    for (let p of insertedProducts) {
      for (let j = 0; j < 5; j++) {
        inventoryItems.push({ productId: p._id, data: `account_${p._id.toString().substring(0,4)}_${j}@example.com|password123` });
      }
    }
    await Inventory.insertMany(inventoryItems);
    console.log("✅ Đã khởi tạo dữ liệu mẫu thành công!");
  }
}
seedData();

// --- SSE Setup ---
const sseEmitter = new EventEmitter();

app.get("/api/sse/:userId", (req, res) => {
  const userId = req.params.userId;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const listener = (data: any) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  sseEmitter.on(`user_${userId}`, listener);
  req.on("close", () => sseEmitter.off(`user_${userId}`, listener));
});

// --- API ROUTES ---

// Auth
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ" });
  if (username.includes(" ")) return res.status(400).json({ success: false, message: "Username không được chứa khoảng trắng" });

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ success: false, message: "Tên đăng nhập hoặc Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    const { password: _, ...userWithoutPass } = user.toObject();
    res.json({ success: true, user: userWithoutPass });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác" });
  }

  const { password: _, ...userWithoutPass } = user.toObject();
  res.json({ success: true, user: userWithoutPass });
});

// Forgot Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER || 'demo@example.com', pass: process.env.EMAIL_PASS || 'password' }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ success: false, message: "Email không tồn tại" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ userId: user._id, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

  try {
    if (process.env.EMAIL_USER) {
      await transporter.sendMail({
        from: '"DigiHub" <noreply@digihub.vn>', to: email, subject: '[DigiHub] Mã khôi phục tài khoản',
        html: `<h2>Mã OTP của bạn là: <strong>${otp}</strong></h2><p>Hết hạn sau 5 phút.</p>`
      });
    } else {
      console.log("Preview OTP cho", email, ":", otp);
    }
    res.json({ success: true, message: "Đã gửi OTP" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi gửi email" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ success: false, message: "Email không tồn tại" });

  const otpRecord = await Otp.findOne({ userId: user._id, otp, expiresAt: { $gt: new Date() } }).sort({ _id: -1 });
  if (!otpRecord) return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc hết hạn" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await Otp.deleteMany({ userId: user._id });

  res.json({ success: true, message: "Đổi mật khẩu thành công" });
});

// User & Admin APIs
app.get("/api/user", async (req, res) => {
  // Mock cho auth hiện tại
  const user = await User.findOne({ username: "demo_user" }).select("-password");
  res.json(user);
});

app.get("/api/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// Products & Inventory
app.get("/api/products", async (req, res) => {
  const products = await Product.aggregate([
    {
      $lookup: {
        from: "inventories",
        localField: "_id",
        foreignField: "productId",
        pipeline: [{ $match: { isUsed: false } }],
        as: "stockItems"
      }
    },
    { $addFields: { stock: { $size: "$stockItems" }, id: "$_id" } },
    { $project: { stockItems: 0 } }
  ]);
  res.json(products);
});

// Orders & Payment
app.post("/api/recharge/webhook", async (req, res) => {
  const { content, amount } = req.body;
  const match = content.match(/NAPTIEN\s+(\w+)/i);
  if (match && amount > 0) {
    const user = await User.findById(match[1]);
    if (user) {
      user.balance += amount;
      await user.save();
      sseEmitter.emit(`user_${user._id}`, { type: "RECHARGE_SUCCESS", amount, newBalance: user.balance });
      return res.json({ success: true, message: "Recharge successful" });
    }
  }
  res.status(400).json({ success: false, message: "Invalid syntax" });
});

app.post("/api/orders", async (req, res) => {
  const { userId, productId, price } = req.body;
  
  const user = await User.findById(userId);
  if (!user || user.balance < price) return res.status(400).json({ success: false, message: "Số dư không đủ" });

  const inventoryItem = await Inventory.findOne({ productId, isUsed: false });
  if (!inventoryItem) return res.status(400).json({ success: false, message: "Hết hàng" });

  user.balance -= price;
  await user.save();

  const order = await Order.create({ userId, productId, status: "Pending" });
  sseEmitter.emit(`user_${userId}`, { type: "BALANCE_UPDATE", newBalance: user.balance });

  // Delay ngắn cho Vercel (khoảng 3-5 giây)
  setTimeout(async () => {
    const inv = await Inventory.findOneAndUpdate({ _id: inventoryItem._id, isUsed: false }, { isUsed: true });
    if (inv) {
      order.status = "Completed";
      order.completedAt = new Date();
      order.deliveredData = inv.data;
      await order.save();
      sseEmitter.emit(`user_${userId}`, { type: "ORDER_COMPLETED", orderId: order._id });
    } else {
      order.status = "Failed - Out of Stock";
      await order.save();
    }
  }, 3000);

  res.json({ success: true, orderId: order._id, delayMs: 3000 });
});

app.get("/api/orders/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).populate("productId", "name").sort({ createdAt: -1 }).lean();
  const formattedOrders = orders.map(o => ({
    ...o,
    id: o._id,
    product_name: (o.productId as any)?.name
  }));
  res.json(formattedOrders);
});

// --- VITE CẤU HÌNH (Chỉ chạy ở môi trường DEV) ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server dev chạy tại http://localhost:${PORT}`));
  }
}
startServer();

// XUẤT APP ĐỂ VERCEL CÓ THỂ ĐỌC ĐƯỢC
export default app;