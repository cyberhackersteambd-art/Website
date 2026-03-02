import { useContext } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { CartContext } from "../App";
import { motion } from "motion/react";

export default function Cart() {
  const { cart, removeFromCart, addToCart, clearCart } = useContext(CartContext);

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 inline-block">
          <div className="bg-orange-50 text-orange-500 p-6 rounded-full w-fit mx-auto mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Shopping Cart ({cart.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: any) => (
            <motion.div 
              layout
              key={item.id} 
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 items-center"
            >
              <img 
                src={item.image_url || `https://picsum.photos/seed/${item.id}/200/200`} 
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow">
                <Link to={`/product/${item.id}`} className="font-bold text-slate-800 hover:text-orange-500 transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{item.store_name}</div>
                <div className="flex items-center justify-between">
                  <div className="text-orange-500 font-bold">Rs. {item.price}</div>
                  <div className="flex items-center border border-slate-100 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 hover:bg-slate-50 text-slate-400"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="p-1.5 hover:bg-slate-50 text-slate-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
          <button 
            onClick={clearCart}
            className="text-slate-400 text-sm hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} /> Clear Shopping Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span>Rs. {shipping}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-lg font-bold text-slate-800">
                <span>Total</span>
                <span className="text-orange-500">Rs. {total}</span>
              </div>
            </div>
            <Link 
              to="/payment"
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
            <div className="mt-6 space-y-3">
              <div className="text-[10px] text-slate-400 text-center uppercase tracking-widest">We Accept</div>
              <div className="flex justify-center gap-4 opacity-50 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
