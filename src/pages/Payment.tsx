import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext, AuthContext } from "../App";
import { CheckCircle2, AlertCircle, ArrowLeft, Smartphone, CreditCard } from "lucide-react";
import { motion } from "motion/react";

const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', color: 'bg-[#D12053]', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Bkash_logo.png', number: '01700000000' },
  { id: 'nagad', name: 'Nagad', color: 'bg-[#F7941D]', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Nagad_logo.svg/1200px-Nagad_logo.svg.png', number: '01800000000' },
  { id: 'rocket', name: 'Rocket', color: 'bg-[#8C3494]', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Rocket_logo.svg/1200px-Rocket_logo.svg.png', number: '01900000000' },
  { id: 'upay', name: 'Upay', color: 'bg-[#FFD400]', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Upay_logo.svg/1200px-Upay_logo.svg.png', number: '01600000000' }
];

export default function Payment() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const shipping = 150;
  const total = subtotal + shipping;

  useEffect(() => {
    if (cart.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cart, navigate, success]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          items: cart,
          total,
          paymentMethod: selectedMethod.id,
          phoneNumber,
          transactionId
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        setError(data.error || "Payment verification failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100"
        >
          <div className="bg-green-50 text-green-500 p-6 rounded-full w-fit mx-auto mb-6">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h2>
          <p className="text-slate-500 mb-8">Your order has been placed and is being processed. Thank you for shopping with DarazClone.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-slate-500 hover:text-orange-500 mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Select Payment Method</h2>
          <div className="grid grid-cols-2 gap-4">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  selectedMethod?.id === method.id 
                    ? 'border-orange-500 bg-orange-50 shadow-md' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white p-1`}>
                  <img src={method.logo} alt={method.name} className="object-contain" />
                </div>
                <span className="font-bold text-slate-800">{method.name}</span>
              </button>
            ))}
          </div>

          {selectedMethod && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Smartphone size={20} className="text-orange-500" />
                How to pay with {selectedMethod.name}
              </h3>
              <ol className="text-sm text-slate-600 space-y-3 list-decimal pl-4">
                <li>Go to your {selectedMethod.name} app or dial the USSD code.</li>
                <li>Choose "Send Money" or "Payment".</li>
                <li>Enter our Merchant Number: <span className="font-bold text-slate-900">{selectedMethod.number}</span></li>
                <li>Enter the amount: <span className="font-bold text-orange-500">Rs. {total}</span></li>
                <li>After successful payment, enter your phone number and Transaction ID below.</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-[10px] text-blue-700 font-medium">
                Demo Hint: Use Transaction ID like <span className="font-bold">TRX12345</span> or <span className="font-bold">BKASH999</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-orange-500" />
              Verify Payment
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 transition-all"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter TrxID"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 transition-all"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>

              <div className="border-t border-slate-100 my-6 pt-6 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Payable Amount</span>
                  <span className="font-bold text-slate-900">Rs. {total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedMethod}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Confirm Payment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
