import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_BASE = "http://localhost:1234/api/v1/products";

const fetcher = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

const CATEGORIES = ["Electronics", "Clothing", "Food", "Sports", "Other"];

const getCatClass = (cat) => {
  const map = {
    Electronics: "cat-electronics",
    Clothing: "cat-clothing",
    Food: "cat-food",
    Sports: "cat-sports",
  };
  return map[cat] || "cat-other";
};

const stockLevel = (s) => {
  if (s < 10) return "low";
  if (s < 30) return "mid";
  return "ok";
};

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">✕</button>
    </div>
  );
}

function StatCard({ label, value, accent, danger }) {
  return (
    <div className={`stat-card${accent ? " accent" : ""}${danger ? " danger" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel, loading }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: initial?.name || "",
    price: initial?.price || "",
    stock: initial?.stock || "",
    category: initial?.category || "",
    description: initial?.description || "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) return;
    onSave({
      name: form.name.trim(),
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      category: form.category,
      description: form.description.trim(),
    });
  };

  return (
    <form className="panel-form" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div className="panel-title">{isEdit ? "Edit product" : "Add new product"}</div>
        <div className="panel-endpoint">
          <span className={`method-badge ${isEdit ? "patch" : "post"}`}>
            {isEdit ? "PATCH" : "POST"}
          </span>
          <span className="endpoint-text">
            /api/v1/products{isEdit ? `/${initial.id}` : ""}
          </span>
        </div>
      </div>

      <div className="field">
        <label>Product name *</label>
        <input value={form.name} onChange={set("name")} placeholder="e.g. Wireless Keyboard" required />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Price (₹)</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={set("price")} placeholder="0.00" />
        </div>
        <div className="field">
          <label>Stock</label>
          <input type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="0" />
        </div>
      </div>

      <div className="field">
        <label>Category *</label>
        <select value={form.category} onChange={set("category")} required>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Description</label>
        <input value={form.description} onChange={set("description")} placeholder="Short description..." />
      </div>

      <div className="panel-actions">
        <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update product" : "Save product"}
        </button>
      </div>
    </form>
  );
}

function DeleteConfirm({ product, onConfirm, onCancel, loading }) {
  return (
    <div className="panel-form">
      <div className="panel-header">
        <div className="panel-title">Delete product</div>
        <div className="panel-endpoint">
          <span className="method-badge delete">DELETE</span>
          <span className="endpoint-text">/api/v1/products/{product.id}</span>
        </div>
      </div>
      <p className="delete-msg">
        Are you sure you want to delete <strong>{product.name}</strong>? This cannot be undone.
      </p>
      <div className="panel-actions">
        <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [panel, setPanel] = useState(null);
  const [activeNav, setActiveNav] = useState("products");

  const showToast = (message, type = "success") => setToast({ message, type });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher(API_BASE);
      setProducts(data?.data || []);
    } catch (e) {
      if (e.message.includes("No products")) {
        setProducts([]);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleAdd = async (form) => {
    setActionLoading(true);
    try {
      const data = await fetcher(API_BASE, { method: "POST", body: JSON.stringify(form) });
      setProducts((p) => [...p, data.data]);
      setPanel(null);
      showToast(`"${form.name}" added successfully`);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (form) => {
    setActionLoading(true);
    try {
      const data = await fetcher(`${API_BASE}/${panel.product.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setProducts((p) => p.map((x) => (x.id === panel.product.id ? data.data : x)));
      setPanel(null);
      showToast(`"${form.name}" updated successfully`);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await fetcher(`${API_BASE}/${panel.product.id}`, { method: "DELETE" });
      setProducts((p) => p.filter((x) => x.id !== panel.product.id));
      showToast(`"${panel.product.name}" deleted`);
      setPanel(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = products
    .filter((p) => {
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock") return a.stock - b.stock;
      return a.id - b.id;
    });

  const stats = {
    total: products.length,
    cats: new Set(products.map((p) => p.category)).size,
    low: products.filter((p) => p.stock < 10).length,
    avg: products.length
      ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length)
      : 0,
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 16 16" fill="none" stroke="#04342C" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="2" width="5" height="5" rx="1" />
              <rect x="9" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="9" width="5" height="5" rx="1" />
              <rect x="9" y="9" width="5" height="5" rx="1" />
            </svg>
          </div>
          <div>
            <div className="logo-name">ProductAPI</div>
            <div className="logo-sub">v1 · port 1234</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          <button
            className={`nav-item${activeNav === "products" ? " active" : ""}`}
            onClick={() => { setActiveNav("products"); setPanel(null); }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 4.5h12M2 8h12M2 11.5h12" />
            </svg>
            All products
            {activeNav === "products" && <span className="nav-dot" />}
          </button>
          <button
            className="nav-item"
            onClick={() => { setPanel({ type: "add" }); setActiveNav("products"); }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 5.5v5M5.5 8h5" />
            </svg>
            Add product
          </button>

          <div className="nav-section-label" style={{ marginTop: 16 }}>Filter</div>
          {["all", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              className={`nav-item${categoryFilter === cat ? " active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              <span className={`nav-cat-dot ${cat === "all" ? "cat-all" : getCatClass(cat)}`} />
              {cat === "all" ? "All categories" : cat}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-refresh" onClick={loadProducts} disabled={loading}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={loading ? "spin" : ""}>
              <path d="M13.5 8A5.5 5.5 0 112.5 8" />
              <path d="M13.5 3.5v4.5H9" />
            </svg>
            {loading ? "Loading…" : "Refresh"}
          </button>
          <div className="api-badge">
            <span className="method-get">GET</span>
            <span>/api/v1/products</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">Products</h1>
            <span className="topbar-count">{filtered.length} shown</span>
          </div>
          <div className="topbar-right">
            <div className="search-wrap">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M12 12l-2-2" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch("")}>✕</button>
              )}
            </div>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="id">Sort: ID</option>
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
              <option value="stock">Sort: Stock</option>
            </select>
            <button className="btn btn-primary" onClick={() => setPanel({ type: "add" })}>
              + Add product
            </button>
          </div>
        </header>

        <div className="content">
          <div className="stats-row">
            <StatCard label="Total products" value={stats.total} accent />
            <StatCard label="Categories" value={stats.cats} />
            <StatCard label="Low stock" value={stats.low} danger={stats.low > 0} />
            <StatCard label="Avg. price" value={`₹${stats.avg.toLocaleString()}`} />
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠ {error}</span>
              <button onClick={loadProducts}>Retry</button>
            </div>
          )}

          <div className="table-wrap">
            <div className="table-head">
              <div className="th">ID</div>
              <div className="th">Name</div>
              <div className="th">Category</div>
              <div className="th">Price</div>
              <div className="th">Stock</div>
              <div className="th">Level</div>
              <div className="th">Actions</div>
            </div>

            {loading ? (
              <div className="table-loading">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-row" style={{ animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                    <rect x="8" y="12" width="24" height="20" rx="3" />
                    <path d="M14 12V9a6 6 0 0112 0v3" />
                    <path d="M16 22h8M16 26h5" />
                  </svg>
                </div>
                <p>No products found</p>
                <span>{search ? `No results for "${search}"` : "Add your first product to get started"}</span>
              </div>
            ) : (
              filtered.map((p, i) => {
                const pct = Math.min(100, Math.round((p.stock / 150) * 100));
                const lvl = stockLevel(p.stock);
                return (
                  <div key={p.id} className="table-row" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="td td-id">#{p.id}</div>
                    <div className="td td-name">
                      <span className="product-name">{p.name}</span>
                      {p.description && <span className="product-desc">{p.description}</span>}
                    </div>
                    <div className="td">
                      <span className={`cat-badge ${getCatClass(p.category)}`}>{p.category}</span>
                    </div>
                    <div className="td td-price">₹{p.price.toLocaleString()}</div>
                    <div className="td td-stock">{p.stock}</div>
                    <div className="td">
                      <div className="stock-bar">
                        <div className="bar-track">
                          <div className={`bar-fill bar-${lvl}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`stock-tag stock-${lvl}`}>
                          {lvl === "low" ? "Low" : lvl === "mid" ? "Mid" : "OK"}
                        </span>
                      </div>
                    </div>
                    <div className="td td-actions">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => setPanel({ type: "edit", product: p })}
                        title="Edit"
                      >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M11 2.5l2.5 2.5L6 12.5H3.5V10L11 2.5z" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => setPanel({ type: "delete", product: p })}
                        title="Delete"
                      >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M3 5h10M5 5V3.5h6V5M5.5 8v4M10.5 8v4M4 5l.8 8.5h6.4L12 5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {panel && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setPanel(null)}>
          <div className="panel">
            {panel.type === "add" && (
              <ProductForm onSave={handleAdd} onCancel={() => setPanel(null)} loading={actionLoading} />
            )}
            {panel.type === "edit" && (
              <ProductForm initial={panel.product} onSave={handleEdit} onCancel={() => setPanel(null)} loading={actionLoading} />
            )}
            {panel.type === "delete" && (
              <DeleteConfirm product={panel.product} onConfirm={handleDelete} onCancel={() => setPanel(null)} loading={actionLoading} />
            )}
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
