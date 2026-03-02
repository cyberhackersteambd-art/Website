import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { Plus, Package, DollarSign, ShoppingBag, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { motion } from "motion/react";

export default function VendorDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (user) {
      fetch(`/api/vendor/products?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setProducts(data));
      
      fetch("/api/categories")
        .then(res => res.json())
        .then(data => setCategories(data));
    }
  }, [user]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/vendor/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProduct, userId: user.id })
    });
    if (res.ok) {
      setIsAdding(false);
      setNewProduct({ name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "" });
      // Refresh products
      fetch(`/api/vendor/products?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  };

  if (!user || user.role !== 'vendor') {
    return <div className="p-20 text-center">Access Denied. Vendors only.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-400 p-6 hidden lg:block">
        <div className="text-white font-bold text-xl mb-12 flex items-center gap-2">
          <ShoppingBag className="text-orange-500" />
          DarazClone
        </div>
        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-500 text-white rounded-xl font-medium transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-all">
            <Package size={20} /> Products
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-all">
            <Settings size={20} /> Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user.name}</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-200"
          >
            <Plus size={20} /> Add New Product
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit mb-4">
              <DollarSign size={24} />
            </div>
            <div className="text-slate-500 text-sm font-medium">Total Revenue</div>
            <div className="text-2xl font-bold text-slate-900">Rs. 45,200</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-green-50 text-green-600 p-3 rounded-xl w-fit mb-4">
              <Package size={24} />
            </div>
            <div className="text-slate-500 text-sm font-medium">Total Products</div>
            <div className="text-2xl font-bold text-slate-900">{products.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl w-fit mb-4">
              <ShoppingBag size={24} />
            </div>
            <div className="text-slate-500 text-sm font-medium">Total Sales</div>
            <div className="text-2xl font-bold text-slate-900">124</div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Your Products</h2>
            <button className="text-orange-500 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image_url || `https://picsum.photos/seed/${product.id}/100/100`} 
                          className="w-10 h-10 rounded-lg object-cover" 
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                        <div className="font-medium text-slate-800">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">Rs. {product.price}</td>
                    <td className="px-6 py-4 text-slate-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {product.stock > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-orange-500 transition-colors">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3 focus:ring-2 focus:ring-orange-500"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3 focus:ring-2 focus:ring-orange-500"
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3 focus:ring-2 focus:ring-orange-500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3 focus:ring-2 focus:ring-orange-500"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                <input
                  type="url"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 focus:ring-2 focus:ring-orange-500"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                >
                  Save Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
