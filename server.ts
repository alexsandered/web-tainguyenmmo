import express from "express";
import path from "path";
import mongoose from "mongoose";
import { EventEmitter } from "events";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// --- LÁ CHẮN CHỐNG CACHE ---
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// --- MONGODB CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/digihub";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- MONGOOSE SCHEMAS ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  role: { type: String, default: "user" },
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

const otpSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otp: String,
  expires_at: Date
});
const Otp = mongoose.model("Otp", otpSchema);

const productSchema = new mongoose.Schema({
  name: String,
  base_price: Number,
  warranty_type: String,
  keywords: String
});
const Product = mongoose.model("Product", productSchema);

const inventorySchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  data: String,
  is_used: { type: Boolean, default: false }
});
const Inventory = mongoose.model("Inventory", inventorySchema);

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: String,
  created_at: { type: Date, default: Date.now },
  completed_at: Date,
  delivered_data: String
});
const Order = mongoose.model("Order", orderSchema);

const formatDoc = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id ? obj._id.toString() : ""; 
  return obj;
};

// --- HÀM NẠP DỮ LIỆU ĐƯỢC ÉP CHẠY ĐỒNG BỘ ---
async function seedData() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log("Kho trống! Bắt đầu nạp 50 sản phẩm mẫu vào DB...");
    
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({ username: "demo_user", email: "demo@example.com", password: hashedPassword, balance: 1000000, role: "admin" });
    }

    const productsData = [
      { name: "Supper Grok Acc Cấp 1 Tháng", base_price: 240000, warranty_type: "BHF", keywords: "Grok, AI Tools" },
      { name: "Supper Grok Active Chính Chủ 1 Tháng", base_price: 265000, warranty_type: "BHF", keywords: "Grok, AI Tools" },
      { name: "Code Perplexity Pro 1 Năm (KBH)", base_price: 84000, warranty_type: "KBH", keywords: "Perplexity, AI Tools" },
      { name: "Chat GPT Plus 1 Tháng (KBH)", base_price: 20000, warranty_type: "KBH", keywords: "ChatGPT, AI Tools" },
      { name: "CapCut Pro 35 Ngày", base_price: 16000, warranty_type: "BHF", keywords: "CapCut, Design & Video" },
      { name: "Canva Pro Chính Chủ 1 Tháng", base_price: 26000, warranty_type: "BHF", keywords: "Canva, Design & Video" },
      { name: "YouTube Premium 1 Tháng", base_price: 52000, warranty_type: "BHF", keywords: "YouTube, Entertainment" },
      { name: "Netflix Slot Riêng 1 Tháng", base_price: 101000, warranty_type: "BHF", keywords: "Netflix, Entertainment" },
      { name: "Nord VPN 1 Năm 1 Thiết Bị", base_price: 156000, warranty_type: "BHF", keywords: "Nord, VPN & Proxy" },
      { name: "Gmail New Trắng (Ngâm 8-9 Ngày)", base_price: 20000, warranty_type: "BHF", keywords: "Gmail, Marketing & Social" },
      { name: "TikTok Việt Ngâm 2000-2500 Follow", base_price: 132000, warranty_type: "BHF", keywords: "TikTok, Marketing & Social" }
    ];

    const insertedProducts = await Product.insertMany(productsData);
    
    const inventoryItems = [];
    for (let p of insertedProducts) {
      for (let j = 0; j < 5; j++) {
        inventoryItems.push({ product_id: p._id, data: `account_${p._id.toString().substring(0,4)}_${j}@example.com|password123`, is_used: false });
      }
    }
    await Inventory.insertMany(inventoryItems);
    console.log("Đã nạp xong thành công!");
  }
}

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
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    const userObj = formatDoc(user);
    delete userObj.password;
    res.json({ success: true, user: userObj });
  } catch (error) {
    res.status(400).json({ success: false, message: "Tên đăng nhập hoặc Email đã tồn tại" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác" });
  }

  const userObj = formatDoc(user);
  delete userObj.password;
  res.json({ success: true, user: userObj });
});

app.get("/api/user", async (req, res) => {
  try {
    const user = await User.findOne().sort({ created_at: -1 }).select("-password");
    res.json(formatDoc(user));
  } catch (err) {
    res.json(null);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    // ÉP VERCEL ĐỨNG ĐỢI NẠP XONG SẢN PHẨM MỚI ĐƯỢC CHẠY TIẾP
    await seedData(); 

    const products = await Product.aggregate([
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "product_id",
          pipeline: [{ $match: { is_used: false } }],
          as: "stockItems"
        }
      },
      { $addFields: { stock: { $size: "$stockItems" } } },
      { $project: { stockItems: 0 } }
    ]);
    
    const formattedProducts = products.map(p => ({
      ...p,
      id: p._id.toString()
    }));
    
    res.json(formattedProducts);
  } catch (err) {
    console.error("Lỗi lấy sản phẩm:", err);
    res.json([]);
  }
});

app.post("/api/orders", async (req, res) => {
  const { userId, productId, price } = req.body;
  const user = await User.findById(userId);
  if (!user || user.balance < price) return res.status(400).json({ success: false, message: "Số dư không đủ" });

  const inventoryItem = await Inventory.findOne({ product_id: productId, is_used: false });
  if (!inventoryItem) return res.status(400).json({ success: false, message: "Hết hàng" });

  user.balance -= price;
  await user.save();

  const order = await Order.create({ user_id: userId, product_id: productId, status: "Pending" });
  sseEmitter.emit(`user_${userId}`, { type: "BALANCE_UPDATE", newBalance: user.balance });

  setTimeout(async () => {
    const inv = await Inventory.findOneAndUpdate({ _id: inventoryItem._id, is_used: false }, { is_used: true });
    if (inv) {
      order.status = "Completed";
      order.completed_at = new Date();
      order.delivered_data = inv.data;
      await order.save();
      sseEmitter.emit(`user_${userId}`, { type: "ORDER_COMPLETED", orderId: order._id });
    }
  }, 3000);

  res.json({ success: true, orderId: order._id, delayMs: 3000 });
});

app.get("/api/orders/:userId", async (req, res) => {
  const orders = await Order.find({ user_id: req.params.userId }).populate("product_id", "name").sort({ created_at: -1 }).lean();
  const formattedOrders = orders.map(o => ({
    ...o,
    id: o._id.toString(),
    product_name: (o.product_id as any)?.name
  }));
  res.json(formattedOrders);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server dev chạy tại http://localhost:${PORT}`));
  }
}
startServer();

export default app;