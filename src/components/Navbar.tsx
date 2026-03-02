import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ShoppingCart, User, Search, Menu, X, LogOut, Store, ChevronDown, ShieldCheck } from "lucide-react";
import { AuthContext, CartContext } from "../App";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${searchQuery}`);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-orange-500 tracking-tight">
              DarazClone
            </Link>
            
            {/* Categories Dropdown */}
            <div className="hidden lg:block relative">
              <button 
                onMouseEnter={() => setIsCatOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors"
              >
                Categories <ChevronDown size={16} />
              </button>
              
              {isCatOpen && (
                <div 
                  onMouseLeave={() => setIsCatOpen(false)}
                  className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl border border-slate-100 py-2 z-50 mt-2"
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      onClick={() => setIsCatOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search in DarazClone..."
                className="w-full bg-slate-100 border-none rounded-lg py-2 pl-4 pr-10 focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-orange-500">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link to="/cart" className="relative text-slate-600 hover:text-orange-500 transition-colors">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cart.reduce((acc: number, item: any) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 hover:text-orange-500 flex items-center gap-1 text-sm font-medium">
                    <ShieldCheck size={20} />
                    <span>Admin</span>
                  </Link>
                )}
                {user.role === 'vendor' && (
                  <Link to="/vendor" className="text-slate-600 hover:text-orange-500 flex items-center gap-1 text-sm font-medium">
                    <Store size={20} />
                    <span>Store</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-slate-600 hover:text-orange-500 flex items-center gap-1 text-sm font-medium">
                <User size={24} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative text-slate-600">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-orange-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-100 border-none rounded-lg py-2 pl-4 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search size={20} />
            </button>
          </form>
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{user.name}</span>
                  <button onClick={logout} className="text-red-500 text-sm font-medium">Logout</button>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 font-medium">Admin Dashboard</Link>
                )}
                {user.role === 'vendor' && (
                  <Link to="/vendor" className="text-slate-600 font-medium">Vendor Dashboard</Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 font-medium">Login / Register</Link>
                <Link to="/login" className="text-slate-400 text-sm">Admin Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
