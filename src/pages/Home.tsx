import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronRight, Star, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const search = searchParams.get("search") || "";
      const category = searchParams.get("category") || "";
      
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/products?search=${search}&category=${category}`),
        fetch("/api/categories")
      ]);
      
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      
      setProducts(prodData);
      setCategories(catData);
      setLoading(false);
    };
    fetchData();
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      {!searchParams.get("search") && !searchParams.get("category") && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Category Sidebar */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-800 mb-4 px-2">Categories</h3>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/?category=${cat.slug}`}
                  className="flex items-center justify-between px-2 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group"
                >
                  <span>{cat.name}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link 
                  to="/login" 
                  className="block px-2 py-2 text-xs text-slate-400 hover:text-orange-500 transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </nav>
          </div>

          {/* Banner */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden h-[400px] group">
            <img
              src="https://picsum.photos/seed/shopping/1200/600"
              alt="Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-12">
              <div className="max-w-md">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-white mb-4"
                >
                  Mega Sale is Live!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-200 mb-8"
                >
                  Up to 70% off on your favorite electronics and fashion brands. Limited time offer.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  Shop Now <ArrowRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {searchParams.get("search") ? `Search Results for "${searchParams.get("search")}"` : 
             searchParams.get("category") ? `Category: ${categories.find(c => c.slug === searchParams.get("category"))?.name}` : 
             "Just For You"}
          </h2>
          <Link to="#" className="text-orange-500 font-semibold hover:underline text-sm">View All</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image_url || `https://picsum.photos/seed/${product.id}/400/400`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {product.stock < 10 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        Low Stock
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-slate-700 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                      <span className="text-[10px] text-slate-400">(42)</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-orange-500">Rs. {product.price}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-wider">
                      {product.store_name}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">No products found matching your criteria.</p>
            <Link to="/" className="text-orange-500 font-medium mt-4 inline-block">Clear filters</Link>
          </div>
        )}
      </div>
    </div>
  );
}
