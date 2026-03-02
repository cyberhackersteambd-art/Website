import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Tag, 
  Trash2, 
  Edit, 
  Plus, 
  DollarSign, 
  Users, 
  ShoppingBag,
  Save,
  X,
  Truck,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  
  const [editingPage, setEditingPage] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    if (activeTab === "dashboard") {
      const res = await fetch("/api/admin/stats");
      setStats(await res.json());
    } else if (activeTab === "products") {
      const [pRes, cRes, vRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/vendors")
      ]);
      setProducts(await pRes.json());
      setCategories(await cRes.json());
      setVendors(await vRes.json());
    } else if (activeTab === "pages") {
      const res = await fetch("/api/admin/pages");
      setPages(await res.json());
    } else if (activeTab === "categories") {
      const res = await fetch("/api/admin/categories");
      setCategories(await res.json());
    } else if (activeTab === "orders") {
      const res = await fetch("/api/admin/orders");
      setOrders(await res.json());
    }
  };

  const deleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProduct.id ? "PUT" : "POST";
    const url = editingProduct.id ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct)
    });
    setEditingProduct(null);
    fetchData();
  };

  const savePage = async () => {
    await fetch(`/api/admin/pages/${editingPage.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingPage)
    });
    setEditingPage(null);
    fetchData();
  };

  const updateOrderStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (viewingOrder && viewingOrder.id === id) {
      setViewingOrder({ ...viewingOrder, status });
    }
    fetchData();
  };

  const addCategory = async () => {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory)
    });
    setNewCategory({ name: "", slug: "" });
    fetchData();
  };

  const fetchOrderDetails = async (id: number) => {
    const res = await fetch(`/api/admin/orders/${id}`);
    setViewingOrder(await res.json());
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-500">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "pages", label: "Pages (Footer)", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-400 p-6 hidden lg:block sticky top-0 h-screen">
        <div className="text-white font-bold text-xl mb-12 flex items-center gap-2">
          <ShoppingBag className="text-orange-500" />
          Admin Panel
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.id ? "bg-orange-500 text-white" : "hover:bg-slate-800 hover:text-white"}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab} Management</h1>
            <p className="text-slate-500">Manage your marketplace content and settings.</p>
          </div>
          {activeTab === "products" && (
            <button 
              onClick={() => setEditingProduct({ name: "", description: "", price: 0, stock: 0, category_id: categories[0]?.id, vendor_id: vendors[0]?.id, image_url: "" })}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <Plus size={20} /> Add Product
            </button>
          )}
        </header>

        {activeTab === "dashboard" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit mb-4">
                <DollarSign size={24} />
              </div>
              <div className="text-slate-500 text-sm font-medium">Total Revenue</div>
              <div className="text-2xl font-bold text-slate-900">Rs. {stats.totalRevenue}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl w-fit mb-4">
                <Package size={24} />
              </div>
              <div className="text-slate-500 text-sm font-medium">Total Products</div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalProducts}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-xl w-fit mb-4">
                <ShoppingBag size={24} />
              </div>
              <div className="text-slate-500 text-sm font-medium">Total Orders</div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalOrders}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-orange-50 text-orange-600 p-3 rounded-xl w-fit mb-4">
                <Users size={24} />
              </div>
              <div className="text-slate-500 text-sm font-medium">Total Users</div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Vendor</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                          <div className="font-medium text-slate-800">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{product.store_name}</td>
                      <td className="px-6 py-4 text-slate-600">{product.category_name}</td>
                      <td className="px-6 py-4 text-slate-600">Rs. {product.price}</td>
                      <td className="px-6 py-4 text-slate-600">{product.stock}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingProduct(product)} className="text-slate-400 hover:text-orange-500 transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">#ORD-{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-slate-800">{order.user_name || "Guest"}</div>
                          <div className="text-slate-500">{order.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">Rs. {order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'paid' ? 'bg-green-100 text-green-600' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => fetchOrderDetails(order.id)}
                          className="text-orange-500 hover:text-orange-600 font-bold text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 mb-4">Add New Category</h2>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Category Name" 
                  className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Slug (e.g. electronics)" 
                  className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                />
                <button onClick={addCategory} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">
                  Add Category
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="px-6 py-4 font-medium text-slate-800">{cat.name}</td>
                      <td className="px-6 py-4 text-slate-600">{cat.slug}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "pages" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Page Title</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 font-medium text-slate-800">{page.title}</td>
                    <td className="px-6 py-4 text-slate-600">/info/{page.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditingPage(page)} className="text-slate-400 hover:text-orange-500 transition-colors">
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Edit Page Modal */}
        {editingPage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Edit Page: {editingPage.title}</h2>
                <button onClick={() => setEditingPage(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Page Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Content (Markdown)</label>
                  <textarea 
                    rows={15}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    value={editingPage.content}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setEditingPage(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                  <button onClick={savePage} className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                    <Save size={20} /> Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={saveProduct} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price (Rs.)</label>
                    <input 
                      type="number" required
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Stock</label>
                    <input 
                      type="number" required
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                      value={editingProduct.category_id}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category_id: parseInt(e.target.value) })}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vendor</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                      value={editingProduct.vendor_id}
                      onChange={(e) => setEditingProduct({ ...editingProduct, vendor_id: parseInt(e.target.value) })}
                      disabled={!!editingProduct.id}
                    >
                      {vendors.map(v => <option key={v.id} value={v.id}>{v.store_name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                      value={editingProduct.image_url}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea 
                      rows={4} required
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                    <Save size={20} /> {editingProduct.id ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* View Order Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Order #ORD-{viewingOrder.id}</h2>
                  <p className="text-slate-500 text-sm">{new Date(viewingOrder.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => setViewingOrder(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Customer Info */}
                <div className="flex gap-4 items-start">
                  <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Customer Information</h3>
                    <p className="text-slate-600">{viewingOrder.user_name || "Guest"}</p>
                    <p className="text-slate-500 text-sm">{viewingOrder.user_email}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-orange-500" />
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {viewingOrder.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img src={item.image_url} className="w-12 h-12 rounded-xl object-cover" alt="" />
                          <div>
                            <div className="font-bold text-slate-800">{item.product_name}</div>
                            <div className="text-slate-500 text-sm">Qty: {item.quantity} × Rs. {item.price}</div>
                          </div>
                        </div>
                        <div className="font-bold text-slate-900">Rs. {item.quantity * item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                  <div>
                    <div className="text-slate-500 text-sm">Total Amount</div>
                    <div className="text-3xl font-bold text-orange-500">Rs. {viewingOrder.total}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-slate-500 text-sm text-right">Current Status: <span className="font-bold text-slate-900 uppercase">{viewingOrder.status}</span></div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateOrderStatus(viewingOrder.id, 'pending')}
                        className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-xl text-xs font-bold hover:bg-yellow-200 transition-all"
                      >
                        Set Pending
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(viewingOrder.id, 'paid')}
                        className="px-4 py-2 bg-green-100 text-green-600 rounded-xl text-xs font-bold hover:bg-green-200 transition-all"
                      >
                        Set Paid
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(viewingOrder.id, 'shipped')}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-200 transition-all"
                      >
                        Set Shipped
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
