import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const app = express();
const port = Number(process.env.PORT || 8787);
const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
const corsOrigin = process.env.CORS_ORIGIN || "*";

const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT || 3306);
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const dbEnabled = Boolean(dbHost && dbUser && dbName);
let pool = null;

app.use(cors({ origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((entry) => entry.trim()) }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const normalizeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const passwordStrong = (password) => {
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && password.length >= 8;
};

const createToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.full_name,
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "30m" },
  );
};

const authRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "unauthorized", message: "Missing bearer token." });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "unauthorized", message: "Invalid or expired token." });
  }
};

const mapProductRow = (row) => ({
  id: row.id,
  name: row.name,
  price: normalizeNumber(row.price),
  oldPrice: normalizeNumber(row.old_price),
  rating: normalizeNumber(row.rating, 5),
  reviews: normalizeNumber(row.reviews),
  stock: row.stock,
  img: row.img,
  category: row.category,
  color: row.color,
  brand: row.brand,
  cpu: row.cpu,
  featured: row.featured,
  vdPorts: row.vd_ports,
});

const mapCouponRow = (row) => ({
  id: row.id,
  code: row.code,
  discount: row.discount,
  type: row.type,
  minOrder: normalizeNumber(row.min_order),
  uses: normalizeNumber(row.uses),
  maxUses: normalizeNumber(row.max_uses),
  expires: row.expires,
  status: row.status,
});

const mapBrandRow = (row) => ({
  id: row.id,
  name: row.name,
  products: normalizeNumber(row.products_count),
  country: row.country,
  status: row.status,
  revenue: normalizeNumber(row.revenue),
});

const ensureDb = (res) => {
  if (!dbEnabled || !pool) {
    res.status(503).json({
      error: "database_unavailable",
      message: "MariaDB is not configured. Define DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.",
    });
    return false;
  }
  return true;
};

const initializeDatabase = async () => {
  if (!dbEnabled) {
    console.warn("[backend] MariaDB disabled. Set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME to enable persistence.");
    return;
  }

  const bootstrapConnection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    multipleStatements: true,
  });

  await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await bootstrapConnection.end();

  pool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      old_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      rating TINYINT NOT NULL DEFAULT 5,
      reviews INT NOT NULL DEFAULT 0,
      stock VARCHAR(50) NOT NULL DEFAULT 'en stock',
      img VARCHAR(100) NOT NULL DEFAULT 'laptop',
      category VARCHAR(120) NOT NULL,
      color VARCHAR(60) NOT NULL DEFAULT 'negro',
      brand VARCHAR(120) NOT NULL,
      cpu VARCHAR(120) NOT NULL DEFAULT '',
      featured VARCHAR(255) NOT NULL DEFAULT '',
      vd_ports VARCHAR(120) NOT NULL DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(60) NOT NULL UNIQUE,
      discount VARCHAR(30) NOT NULL,
      type ENUM('Percentage','Fixed') NOT NULL DEFAULT 'Percentage',
      min_order DECIMAL(10,2) NOT NULL DEFAULT 0,
      uses INT NOT NULL DEFAULT 0,
      max_uses INT NOT NULL DEFAULT 0,
      expires VARCHAR(30) NOT NULL,
      status ENUM('Active','Expired') NOT NULL DEFAULT 'Active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS brands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      products_count INT NOT NULL DEFAULT 0,
      country VARCHAR(120) NOT NULL DEFAULT '',
      status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
      revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('customer','seller','admin') NOT NULL DEFAULT 'customer',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      last_login_at TIMESTAMP NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      sender_id BIGINT NOT NULL,
      recipient_id BIGINT NOT NULL,
      product_id INT NULL,
      subject VARCHAR(180) NOT NULL,
      body TEXT NOT NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (recipient_id) REFERENCES users(id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT NULL,
      total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
      currency VARCHAR(10) NOT NULL DEFAULT 'MXN',
      status VARCHAR(50) NOT NULL DEFAULT 'created',
      payment_method VARCHAR(80) NULL,
      payment_status VARCHAR(80) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      order_id BIGINT NULL,
      mp_payment_id VARCHAR(120) NULL UNIQUE,
      status VARCHAR(80) NOT NULL,
      status_detail VARCHAR(255) NULL,
      transaction_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
      installments INT NOT NULL DEFAULT 1,
      payment_method_id VARCHAR(120) NULL,
      payment_type_id VARCHAR(120) NULL,
      payer_email VARCHAR(190) NULL,
      raw_response JSON NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);

  const [productCountRows] = await pool.query("SELECT COUNT(*) AS total FROM products");
  const productCount = normalizeNumber(productCountRows?.[0]?.total);
  if (productCount === 0) {
    await pool.query(
      `INSERT INTO products (name, price, old_price, rating, reviews, stock, img, category, color, brand, cpu, featured, vd_ports)
       VALUES
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "MSI Pro 16 Flex-036AU 15.6 pulgadas Multitouch", 899, 1299, 5, 12, "en stock", "monitor", "PCs todo en uno MSI", "negro", "MSI", "Intel Core i7", "Pantalla tactil", "HDMI / USB-C",
        "ASUS ROG G14 RTX 4060 i7 13a Gen Performance", 1299, 1699, 5, 18, "en stock", "tower", "PCs personalizadas", "negro", "ASUS", "Intel Core i7", "RTX 4060", "USB-C / DP",
      ],
    );
  }

  const [couponCountRows] = await pool.query("SELECT COUNT(*) AS total FROM coupons");
  const couponCount = normalizeNumber(couponCountRows?.[0]?.total);
  if (couponCount === 0) {
    await pool.query(
      `INSERT INTO coupons (code, discount, type, min_order, uses, max_uses, expires, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "SAVE10", "10%", "Percentage", 50, 142, 500, "31-03-2025", "Active",
        "FLAT20", "$20", "Fixed", 100, 89, 200, "28-02-2025", "Active",
      ],
    );
  }

  const [brandCountRows] = await pool.query("SELECT COUNT(*) AS total FROM brands");
  const brandCount = normalizeNumber(brandCountRows?.[0]?.total);
  if (brandCount === 0) {
    await pool.query(
      `INSERT INTO brands (name, products_count, country, status, revenue)
       VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?);`,
      [
        "Apple", 12, "USA", "Active", 125000,
        "Samsung", 28, "Korea", "Active", 95000,
      ],
    );
  }

  const [adminCountRows] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'");
  const adminCount = normalizeNumber(adminCountRows?.[0]?.total);
  if (adminCount === 0) {
    const hash = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || "Admin1234", 12);
    await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
      ["Admin VendoLaptops", process.env.DEFAULT_ADMIN_EMAIL || "admin@vendolaptops.mx", hash],
    );
  }

  console.log("[backend] MariaDB ready and schema initialized.");
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "vendolaptops-backend", database: dbEnabled && pool ? "connected" : "not-configured" });
});

app.get("/api/admin/bootstrap", async (_req, res) => {
  if (!ensureDb(res)) return;
  try {
    const [productsRows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    const [couponsRows] = await pool.query("SELECT * FROM coupons ORDER BY id DESC");
    const [brandsRows] = await pool.query("SELECT * FROM brands ORDER BY id DESC");

    return res.json({
      ok: true,
      products: productsRows.map(mapProductRow),
      coupons: couponsRows.map(mapCouponRow),
      brands: brandsRows.map(mapBrandRow),
    });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/admin/products", async (req, res) => {
  if (!ensureDb(res)) return;
  const body = req.body ?? {};
  if (!body.name || !body.brand || !body.category) {
    return res.status(400).json({ error: "invalid_product", message: "name, brand and category are required" });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO products (name, price, old_price, rating, reviews, stock, img, category, color, brand, cpu, featured, vd_ports)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        normalizeNumber(body.price),
        normalizeNumber(body.oldPrice),
        normalizeNumber(body.rating, 5),
        normalizeNumber(body.reviews),
        body.stock || "en stock",
        body.img || "laptop",
        body.category,
        body.color || "negro",
        body.brand,
        body.cpu || "",
        body.featured || "",
        body.vdPorts || "",
      ],
    );
    const insertedId = result.insertId;
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [insertedId]);
    return res.status(201).json({ ok: true, item: mapProductRow(rows[0]) });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.put("/api/admin/products/:id", async (req, res) => {
  if (!ensureDb(res)) return;
  const id = Number(req.params.id);
  const body = req.body ?? {};
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "not_found" });
    const current = rows[0];
    await pool.query(
      `UPDATE products
       SET name = ?, price = ?, old_price = ?, rating = ?, reviews = ?, stock = ?, img = ?, category = ?, color = ?, brand = ?, cpu = ?, featured = ?, vd_ports = ?
       WHERE id = ?`,
      [
        body.name ?? current.name,
        normalizeNumber(body.price ?? current.price),
        normalizeNumber(body.oldPrice ?? current.old_price),
        normalizeNumber(body.rating ?? current.rating, 5),
        normalizeNumber(body.reviews ?? current.reviews),
        body.stock ?? current.stock,
        body.img ?? current.img,
        body.category ?? current.category,
        body.color ?? current.color,
        body.brand ?? current.brand,
        body.cpu ?? current.cpu,
        body.featured ?? current.featured,
        body.vdPorts ?? current.vd_ports,
        id,
      ],
    );
    const [updatedRows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    return res.json({ ok: true, item: mapProductRow(updatedRows[0]) });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.delete("/api/admin/products/:id", async (req, res) => {
  if (!ensureDb(res)) return;
  const id = Number(req.params.id);
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/admin/coupons", async (req, res) => {
  if (!ensureDb(res)) return;
  const body = req.body ?? {};
  if (!body.code || !body.discount) {
    return res.status(400).json({ error: "invalid_coupon", message: "code and discount are required" });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO coupons (code, discount, type, min_order, uses, max_uses, expires, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(body.code).trim().toUpperCase(),
        body.discount,
        body.type || "Percentage",
        normalizeNumber(body.minOrder),
        normalizeNumber(body.uses),
        normalizeNumber(body.maxUses),
        body.expires || "31-12-2026",
        body.status || "Active",
      ],
    );
    const [rows] = await pool.query("SELECT * FROM coupons WHERE id = ?", [result.insertId]);
    return res.status(201).json({ ok: true, item: mapCouponRow(rows[0]) });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.put("/api/admin/coupons/:id", async (req, res) => {
  if (!ensureDb(res)) return;
  const id = Number(req.params.id);
  const body = req.body ?? {};
  try {
    const [rows] = await pool.query("SELECT * FROM coupons WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "not_found" });
    const current = rows[0];
    await pool.query(
      `UPDATE coupons
       SET code = ?, discount = ?, type = ?, min_order = ?, uses = ?, max_uses = ?, expires = ?, status = ?
       WHERE id = ?`,
      [
        String(body.code ?? current.code).trim().toUpperCase(),
        body.discount ?? current.discount,
        body.type ?? current.type,
        normalizeNumber(body.minOrder ?? current.min_order),
        normalizeNumber(body.uses ?? current.uses),
        normalizeNumber(body.maxUses ?? current.max_uses),
        body.expires ?? current.expires,
        body.status ?? current.status,
        id,
      ],
    );
    const [updatedRows] = await pool.query("SELECT * FROM coupons WHERE id = ?", [id]);
    return res.json({ ok: true, item: mapCouponRow(updatedRows[0]) });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.delete("/api/admin/coupons/:id", async (req, res) => {
  if (!ensureDb(res)) return;
  const id = Number(req.params.id);
  try {
    await pool.query("DELETE FROM coupons WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/admin/brands", async (req, res) => {
  if (!ensureDb(res)) return;
  const body = req.body ?? {};
  if (!body.name) {
    return res.status(400).json({ error: "invalid_brand", message: "name is required" });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO brands (name, products_count, country, status, revenue)
       VALUES (?, ?, ?, ?, ?)`,
      [
        body.name,
        normalizeNumber(body.products),
        body.country || "",
        body.status || "Active",
        normalizeNumber(body.revenue),
      ],
    );
    const [rows] = await pool.query("SELECT * FROM brands WHERE id = ?", [result.insertId]);
    return res.status(201).json({ ok: true, item: mapBrandRow(rows[0]) });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.put("/api/admin/brands/:id", async (req, res) => {
  if (!ensureDb(res)) return;
  const id = Number(req.params.id);
  const body = req.body ?? {};
  try {
    const [rows] = await pool.query("SELECT * FROM brands WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "not_found" });
    const current = rows[0];
    await pool.query(
      `UPDATE brands
       SET name = ?, products_count = ?, country = ?, status = ?, revenue = ?
       WHERE id = ?`,
      [
        body.name ?? current.name,
        normalizeNumber(body.products ?? current.products_count),
        body.country ?? current.country,
        body.status ?? current.status,
        normalizeNumber(body.revenue ?? current.revenue),
        id,
      ],
    );
    const [updatedRows] = await pool.query("SELECT * FROM brands WHERE id = ?", [id]);
    return res.json({ ok: true, item: mapBrandRow(updatedRows[0]) });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.delete("/api/admin/brands/:id", async (req, res) => {
  if (!ensureDb(res)) return;
  const id = Number(req.params.id);
  try {
    await pool.query("DELETE FROM brands WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  if (!ensureDb(res)) return;
  const { fullName, email, password, role } = req.body ?? {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "invalid_payload", message: "fullName, email and password are required." });
  }
  if (!passwordStrong(password)) {
    return res.status(400).json({
      error: "weak_password",
      message: "Password must be at least 8 characters and include uppercase, lowercase and number.",
    });
  }
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [String(email).toLowerCase()]);
    if (existing.length) {
      return res.status(409).json({ error: "email_in_use", message: "Email is already registered." });
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [fullName, String(email).toLowerCase(), hash, ["customer", "seller", "admin"].includes(role) ? role : "customer"],
    );
    const [users] = await pool.query("SELECT id, full_name, email, role FROM users WHERE id = ?", [result.insertId]);
    const user = users[0];
    const token = createToken(user);
    return res.status(201).json({ ok: true, token, user });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  if (!ensureDb(res)) return;
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "invalid_payload", message: "email and password are required." });
  }
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [String(email).toLowerCase()]);
    if (!rows.length) {
      return res.status(401).json({ error: "invalid_credentials", message: "Invalid credentials." });
    }
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "invalid_credentials", message: "Invalid credentials." });
    }

    await pool.query("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    };
    const token = createToken(safeUser);
    return res.json({ ok: true, token, user: safeUser });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const [rows] = await pool.query("SELECT id, full_name, email, role FROM users WHERE id = ?", [req.user.sub]);
    if (!rows.length) {
      return res.status(404).json({ error: "not_found" });
    }
    return res.json({ ok: true, user: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.get("/api/messages/inbox", authRequired, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.subject, m.body, m.product_id, m.is_read, m.created_at, u.id AS sender_id, u.full_name AS sender_name, u.email AS sender_email
       FROM messages m
       INNER JOIN users u ON u.id = m.sender_id
       WHERE m.recipient_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.sub],
    );
    return res.json({ ok: true, items: rows });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.get("/api/messages/sent", authRequired, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.subject, m.body, m.product_id, m.is_read, m.created_at, u.id AS recipient_id, u.full_name AS recipient_name, u.email AS recipient_email
       FROM messages m
       INNER JOIN users u ON u.id = m.recipient_id
       WHERE m.sender_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.sub],
    );
    return res.json({ ok: true, items: rows });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/messages", authRequired, async (req, res) => {
  if (!ensureDb(res)) return;
  const { recipientId, productId, subject, body } = req.body ?? {};
  if (!recipientId || !subject || !body) {
    return res.status(400).json({ error: "invalid_payload", message: "recipientId, subject and body are required." });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, product_id, subject, body)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.sub, normalizeNumber(recipientId), productId ? normalizeNumber(productId) : null, String(subject).trim(), String(body).trim()],
    );
    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.patch("/api/messages/:id/read", authRequired, async (req, res) => {
  if (!ensureDb(res)) return;
  const id = normalizeNumber(req.params.id);
  try {
    await pool.query("UPDATE messages SET is_read = 1 WHERE id = ? AND recipient_id = ?", [id, req.user.sub]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/mercadopago/payments", async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({
        error: "missing_access_token",
        message: "Define MP_ACCESS_TOKEN in your environment.",
      });
    }

    const {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount,
      installments,
      payer,
      description,
    } = req.body ?? {};

    if (!token || !payment_method_id || !transaction_amount || !payer?.email) {
      return res.status(400).json({
        error: "invalid_payload",
        message: "Missing required payment fields.",
      });
    }

    const paymentPayload = {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount: Number(transaction_amount),
      installments: Number(installments || 1),
      payer: {
        email: payer.email,
        identification: payer.identification,
      },
      description: description || "Compra en VendoLaptops",
    };

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "mercadopago_error",
        details: data,
      });
    }

    await pool.query(
      `INSERT INTO payments (mp_payment_id, status, status_detail, transaction_amount, installments, payment_method_id, payment_type_id, payer_email, raw_response)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         status_detail = VALUES(status_detail),
         transaction_amount = VALUES(transaction_amount),
         installments = VALUES(installments),
         payment_method_id = VALUES(payment_method_id),
         payment_type_id = VALUES(payment_type_id),
         payer_email = VALUES(payer_email),
         raw_response = VALUES(raw_response)`,
      [
        String(data.id),
        data.status || "unknown",
        data.status_detail || null,
        normalizeNumber(data.transaction_amount),
        normalizeNumber(data.installments, 1),
        data.payment_method_id || null,
        data.payment_type_id || null,
        payer.email,
        JSON.stringify(data),
      ],
    );

    return res.status(200).json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      date_created: data.date_created,
      payment_method_id: data.payment_method_id,
      payment_type_id: data.payment_type_id,
      transaction_amount: data.transaction_amount,
      installments: data.installments,
    });
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/mercadopago/webhook", async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    const paymentId = req.query?.["data.id"] || req.body?.data?.id || req.body?.id;
    const topic = req.query.topic || req.query.type || req.body?.type;

    if (!accessToken || !paymentId || String(topic) !== "payment") {
      return res.status(200).json({ ok: true });
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return res.status(200).json({ ok: true });
    }

    const payment = await response.json();

    await pool.query(
      `INSERT INTO payments (mp_payment_id, status, status_detail, transaction_amount, installments, payment_method_id, payment_type_id, payer_email, raw_response)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         status_detail = VALUES(status_detail),
         transaction_amount = VALUES(transaction_amount),
         installments = VALUES(installments),
         payment_method_id = VALUES(payment_method_id),
         payment_type_id = VALUES(payment_type_id),
         payer_email = VALUES(payer_email),
         raw_response = VALUES(raw_response)`,
      [
        String(payment.id),
        payment.status || "unknown",
        payment.status_detail || null,
        normalizeNumber(payment.transaction_amount),
        normalizeNumber(payment.installments, 1),
        payment.payment_method_id || null,
        payment.payment_type_id || null,
        payment.payer?.email || null,
        JSON.stringify(payment),
      ],
    );

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(200).json({ ok: true });
  }
});

app.use((err, _req, res, _next) => {
  return res.status(500).json({
    error: "server_error",
    message: err instanceof Error ? err.message : "Unknown error",
  });
});

app.use((_req, res) => {
  return res.status(404).json({ error: "not_found" });
});

const start = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`VendoLaptops backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("[backend] Failed to start:", error);
    process.exit(1);
  }
};

start();
