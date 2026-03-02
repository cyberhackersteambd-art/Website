import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("ecommerce.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'customer', -- 'customer', 'vendor', 'admin'
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    store_name TEXT,
    description TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    slug TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER,
    category_id INTEGER,
    name TEXT,
    description TEXT,
    price REAL,
    stock INTEGER,
    image_url TEXT,
    FOREIGN KEY(vendor_id) REFERENCES vendors(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trx_id TEXT UNIQUE,
    amount REAL,
    status TEXT DEFAULT 'unused' -- 'unused', 'used'
  );

  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT
  );
`);

// Seed Categories if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Living", slug: "home-living" },
    { name: "Health & Beauty", slug: "health-beauty" },
    { name: "Groceries", slug: "groceries" },
    { name: "Sports & Outdoors", slug: "sports-outdoors" },
    { name: "Automotive", slug: "automotive" },
    { name: "Books & Stationery", slug: "books-stationery" },
    { name: "Toys & Games", slug: "toys-games" },
    { name: "Baby Care", slug: "baby-care" }
  ];
  const insert = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
  categories.forEach(c => insert.run(c.name, c.slug));
}

// Seed Pages if empty
const pageCount = db.prepare("SELECT COUNT(*) as count FROM pages").get() as { count: number };
if (pageCount.count === 0) {
  const pages = [
    { title: "Help Center", slug: "help-center", content: "# Help Center\n\nHow can we help you today?" },
    { title: "How to Buy", slug: "how-to-buy", content: "# How to Buy\n\nFollow these steps to purchase products..." },
    { title: "Returns & Refunds", slug: "returns-refunds", content: "# Returns & Refunds\n\nOur policy on returns and refunds..." },
    { title: "Contact Us", slug: "contact-us", content: "# Contact Us\n\nGet in touch with our support team." },
    { title: "About Us", slug: "about-us", content: "# About Us\n\nLearn more about DarazClone." },
    { title: "Digital Payments", slug: "digital-payments", content: "# Digital Payments\n\nSecure payment methods available." },
    { title: "Careers", slug: "careers", content: "# Careers\n\nJoin our team!" },
    { title: "Terms & Conditions", slug: "terms-conditions", content: "# Terms & Conditions\n\nRead our terms of service." },
    { title: "Seller Center", slug: "seller-center", content: "# Seller Center\n\nManage your store here." },
    { title: "Policies", slug: "policies", content: "# Policies\n\nOur marketplace policies." },
    { title: "Privacy Policy", slug: "privacy-policy", content: "# Privacy Policy\n\nYour privacy is important to us." },
    { title: "Return Policy", slug: "return-policy", content: "# Return Policy\n\nOur return policy details." }
  ];
  const insert = db.prepare("INSERT INTO pages (title, slug, content) VALUES (?, ?, ?)");
  pages.forEach(p => insert.run(p.title, p.slug, p.content));
}

// Seed Transactions if empty
const transactionCount = db.prepare("SELECT COUNT(*) as count FROM transactions").get() as { count: number };
if (transactionCount.count === 0) {
  const transactions = [
    { trx_id: "TRX12345", amount: 1000 },
    { trx_id: "TRX67890", amount: 5000 },
    { trx_id: "BKASH999", amount: 2000 },
    { trx_id: "NAGAD888", amount: 1500 },
    { trx_id: "ROCKET777", amount: 3000 }
  ];
  const insert = db.prepare("INSERT INTO transactions (trx_id, amount) VALUES (?, ?)");
  transactions.forEach(t => insert.run(t.trx_id, t.amount));
}

// Seed Demo Products if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };

// Ensure Super Admin exists
const admins = [
  { email: "superadmin@daraz.com", password: "admin123", name: "Super Admin", role: "admin" },
  { email: "admin@admin.com", password: "admin", name: "Admin User", role: "admin" }
];

admins.forEach(admin => {
  const exists = db.prepare("SELECT * FROM users WHERE email = ?").get(admin.email) as any;
  if (!exists) {
    db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(admin.email, admin.password, admin.name, admin.role);
  } else {
    db.prepare("UPDATE users SET password = ?, role = ? WHERE email = ?").run(admin.password, admin.role, admin.email);
  }
});

if (productCount.count === 0) {
  // Create a default vendor first
  const userResult = db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run("admin@daraz.com", "admin123", "Daraz Official", "vendor");
  const vendorResult = db.prepare("INSERT INTO vendors (user_id, store_name) VALUES (?, ?)").run(userResult.lastInsertRowid, "Daraz Official Store");
  const vendorId = vendorResult.lastInsertRowid;

  const categories = db.prepare("SELECT * FROM categories").all() as any[];
  const insertProduct = db.prepare("INSERT INTO products (vendor_id, category_id, name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");

  const productNames: Record<string, string[]> = {
    "electronics": ["Smartphone X", "Laptop Pro", "Wireless Earbuds", "Smart Watch", "Bluetooth Speaker", "Gaming Console", "Camera 4K", "Tablet Air", "Monitor 27\"", "Keyboard Mechanical"],
    "fashion": ["Cotton T-Shirt", "Slim Fit Jeans", "Leather Jacket", "Running Shoes", "Summer Dress", "Handbag", "Sunglasses", "Winter Coat", "Silk Scarf", "Wristwatch"],
    "home-living": ["Coffee Maker", "Air Purifier", "Bed Sheet Set", "Wall Clock", "Desk Lamp", "Sofa Cushion", "Kitchen Knife Set", "Vacuum Cleaner", "Storage Box", "Dinnerware Set"],
    "health-beauty": ["Face Wash", "Moisturizer", "Shampoo", "Perfume", "Lipstick", "Sunscreen", "Hair Dryer", "Electric Toothbrush", "Vitamin C Serum", "Yoga Mat"],
    "groceries": ["Organic Honey", "Green Tea", "Pasta Pack", "Olive Oil", "Basmati Rice", "Coffee Beans", "Dark Chocolate", "Almonds", "Peanut Butter", "Fruit Jam"],
    "sports-outdoors": ["Camping Tent", "Backpack", "Water Bottle", "Dumbbell Set", "Cycling Helmet", "Football", "Tennis Racket", "Sleeping Bag", "Flashlight", "Binoculars"],
    "automotive": ["Car Wax", "Dash Cam", "Tire Inflator", "Seat Cover", "Car Charger", "Microfiber Cloth", "Wiper Blades", "Engine Oil", "Car Vacuum", "Air Freshener"],
    "books-stationery": ["Notebook", "Gel Pen Set", "Sketchbook", "Planner 2024", "Stapler", "Highlighters", "Desk Organizer", "Backpack", "Sticky Notes", "Calculator"],
    "toys-games": ["Building Blocks", "Remote Control Car", "Board Game", "Plush Toy", "Puzzle 1000pcs", "Action Figure", "Doll House", "Art Kit", "Water Gun", "Yo-Yo"],
    "baby-care": ["Baby Wipes", "Diapers Pack", "Baby Lotion", "Feeding Bottle", "Baby Shampoo", "Pacifier", "Stroller", "Baby Blanket", "Teething Toy", "Baby Monitor"]
  };

  for (let i = 0; i < 250; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const names = productNames[category.slug] || ["Generic Product " + i];
    const name = names[Math.floor(Math.random() * names.length)] + " " + (Math.floor(i / 10) + 1);
    const price = Math.floor(Math.random() * 5000) + 100;
    const stock = Math.floor(Math.random() * 100) + 10;
    const description = `High quality ${name} from our ${category.name} collection. Perfect for daily use and highly durable.`;
    const imageUrl = `https://picsum.photos/seed/prod${i}/600/600`;
    
    insertProduct.run(vendorId, category.id, name, description, price, stock, imageUrl);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/pages/:slug", (req, res) => {
    const page = db.prepare("SELECT * FROM pages WHERE slug = ?").get(req.params.slug);
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ error: "Page not found" });
    }
  });
  app.get("/api/products", (req, res) => {
    const { category, search } = req.query;
    let query = "SELECT p.*, c.name as category_name, v.store_name FROM products p JOIN categories c ON p.category_id = c.id JOIN vendors v ON p.vendor_id = v.id";
    const params: any[] = [];

    if (category || search) {
      query += " WHERE";
      if (category) {
        query += " c.slug = ?";
        params.push(category);
      }
      if (search) {
        if (category) query += " AND";
        query += " (p.name LIKE ? OR p.description LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }
    }

    const products = db.prepare(query).all(...params);
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT p.*, c.name as category_name, v.store_name FROM products p JOIN categories c ON p.category_id = c.id JOIN vendors v ON p.vendor_id = v.id WHERE p.id = ?").get(req.params.id);
    res.json(product);
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.post("/api/checkout", (req, res) => {
    const { userId, items, total, paymentMethod, phoneNumber, transactionId } = req.body;
    
    // Verify transaction
    const transaction = db.prepare("SELECT * FROM transactions WHERE trx_id = ? AND status = 'unused'").get(transactionId) as any;
    
    if (!transaction) {
      return res.status(400).json({ error: "Invalid or already used Transaction ID" });
    }

    // Create order
    const orderResult = db.prepare("INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)").run(userId || null, total, 'paid');
    const orderId = orderResult.lastInsertRowid;

    // Add items
    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    items.forEach((item: any) => {
      insertItem.run(orderId, item.id, item.quantity, item.price);
      // Update stock
      db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(item.quantity, item.id);
    });

    // Mark transaction as used
    db.prepare("UPDATE transactions SET status = 'used' WHERE trx_id = ?").run(transactionId);

    res.json({ success: true, orderId });
  });

  // Admin specific
  app.get("/api/admin/orders", (req, res) => {
    const orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `).all();
    res.json(orders);
  });

  app.get("/api/admin/orders/:id", (req, res) => {
    const order = db.prepare(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `).get(req.params.id);
    
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    const items = db.prepare(`
      SELECT oi.*, p.name as product_name, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `).all(req.params.id);
    
    res.json({ ...order, items });
  });

  app.put("/api/admin/orders/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/products", (req, res) => {
    const { vendor_id, category_id, name, description, price, stock, image_url } = req.body;
    const result = db.prepare(`
      INSERT INTO products (vendor_id, category_id, name, description, price, stock, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(vendor_id, category_id, name, description, price, stock, image_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/admin/products/:id", (req, res) => {
    const { category_id, name, description, price, stock, image_url } = req.body;
    db.prepare(`
      UPDATE products 
      SET category_id = ?, name = ?, description = ?, price = ?, stock = ?, image_url = ? 
      WHERE id = ?
    `).run(category_id, name, description, price, stock, image_url, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/admin/vendors", (req, res) => {
    const vendors = db.prepare("SELECT * FROM vendors").all();
    res.json(vendors);
  });

  app.get("/api/admin/stats", (req, res) => {
    const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get() as any;
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as any;
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const totalRevenue = db.prepare("SELECT SUM(total) as total FROM orders WHERE status = 'paid'").get() as any;
    
    res.json({
      totalProducts: totalProducts.count,
      totalOrders: totalOrders.count,
      totalUsers: totalUsers.count,
      totalRevenue: totalRevenue.total || 0
    });
  });

  app.get("/api/admin/products", (req, res) => {
    const products = db.prepare("SELECT p.*, c.name as category_name, v.store_name FROM products p JOIN categories c ON p.category_id = c.id JOIN vendors v ON p.vendor_id = v.id ORDER BY p.id DESC").all();
    res.json(products);
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/admin/pages", (req, res) => {
    const pages = db.prepare("SELECT * FROM pages").all();
    res.json(pages);
  });

  app.put("/api/admin/pages/:id", (req, res) => {
    const { title, content } = req.body;
    db.prepare("UPDATE pages SET title = ?, content = ? WHERE id = ?").run(title, content, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/admin/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.post("/api/admin/categories", (req, res) => {
    const { name, slug } = req.body;
    db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)").run(name, slug);
    res.json({ success: true });
  });

  // Simple Auth (Mock for now, but functional)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, role } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(email, password, name, role || 'customer');
      res.json({ id: info.lastInsertRowid, email, role: role || 'customer', name });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  // Vendor specific
  app.get("/api/vendor/products", (req, res) => {
    const userId = req.query.userId;
    const vendor = db.prepare("SELECT id FROM vendors WHERE user_id = ?").get(userId) as any;
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    const products = db.prepare("SELECT * FROM products WHERE vendor_id = ?").all(vendor.id);
    res.json(products);
  });

  app.post("/api/vendor/products", (req, res) => {
    const { userId, name, description, price, stock, categoryId, imageUrl } = req.body;
    let vendor = db.prepare("SELECT id FROM vendors WHERE user_id = ?").get(userId) as any;
    if (!vendor) {
      // Create vendor profile if it doesn't exist
      const info = db.prepare("INSERT INTO vendors (user_id, store_name) VALUES (?, ?)").run(userId, `${name}'s Store`);
      vendor = { id: info.lastInsertRowid };
    }
    const info = db.prepare("INSERT INTO products (vendor_id, category_id, name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)").run(vendor.id, categoryId, name, description, price, stock, imageUrl);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
