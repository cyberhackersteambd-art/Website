import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Store, Plus, Minus } from "lucide-react";
import { CartContext } from "../App";
import { motion } from "motion/react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div className="max-w-7xl mx-auto p-8 animate-pulse">Loading...</div>;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Optional: show toast or redirect
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                src={product.image_url || `https://picsum.photos/seed/${product.id}/800/800`}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm text-slate-500">(128 Ratings)</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <span className="text-sm text-slate-500">Category: <span className="text-orange-500 font-medium">{product.category_name}</span></span>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <div className="text-3xl font-bold text-orange-500 mb-1">Rs. {product.price}</div>
              <div className="text-sm text-slate-400 line-through">Rs. {product.price * 1.5}</div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 w-20">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[40px] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-slate-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-xs text-slate-400">Only {product.stock} items left</span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { handleAddToCart(); navigate('/cart'); }}
                  className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                >
                  Buy Now
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-50 text-orange-600 py-4 rounded-xl font-bold hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border-t border-slate-100 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Standard Delivery</div>
                  <div className="text-xs text-slate-500">2-4 days • Rs. 150</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg h-fit">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">7 Days Returns</div>
                  <div className="text-xs text-slate-500">Change of mind is not applicable</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg h-fit">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Warranty</div>
                  <div className="text-xs text-slate-500">1 Year Brand Warranty</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg h-fit">
                  <Store size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Sold by</div>
                  <div className="text-xs text-slate-500 font-medium">{product.store_name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="border-t border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Product Description</h2>
          <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {product.description || "No description provided for this product."}
          </div>
        </div>
      </div>
    </div>
  );
}
