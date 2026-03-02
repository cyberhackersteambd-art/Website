import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import InfoPage from "./pages/InfoPage";
import Payment from "./pages/Payment";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";

// Contexts
export const AuthContext = createContext<any>(null);
export const CartContext = createContext<any>(null);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/vendor" element={<VendorDashboard />} />
                <Route path="/info/:slug" element={<InfoPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
