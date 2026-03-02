import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Customer Care</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/info/help-center" className="hover:text-orange-500 transition-colors">Help Center</Link></li>
              <li><Link to="/info/how-to-buy" className="hover:text-orange-500 transition-colors">How to Buy</Link></li>
              <li><Link to="/info/returns-refunds" className="hover:text-orange-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/info/contact-us" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-6">DarazClone</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link to="/info/digital-payments" className="hover:text-orange-500 transition-colors">Digital Payments</Link></li>
              <li><Link to="/info/careers" className="hover:text-orange-500 transition-colors">Careers</Link></li>
              <li><Link to="/info/terms-conditions" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Sell on DarazClone</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/register?role=vendor" className="hover:text-orange-500 transition-colors">Vendor Registration</Link></li>
              <li><Link to="/info/seller-center" className="hover:text-orange-500 transition-colors">Seller Center</Link></li>
              <li><Link to="/info/policies" className="hover:text-orange-500 transition-colors">Policies</Link></li>
              <li className="pt-4 border-t border-slate-800 mt-4">
                <Link to="/login" className="text-slate-500 hover:text-orange-500 transition-colors text-xs">Admin Login</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <Link to="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <Facebook size={20} />
              </Link>
              <Link to="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} DarazClone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
