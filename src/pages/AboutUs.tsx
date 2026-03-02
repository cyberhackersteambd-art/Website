import { motion } from "motion/react";
import { Target, Users, ShieldCheck, Globe, Award, Heart } from "lucide-react";

export default function AboutUs() {
  const stats = [
    { label: "Active Vendors", value: "10,000+", icon: <Users className="text-blue-500" /> },
    { label: "Monthly Customers", value: "1M+", icon: <Target className="text-orange-500" /> },
    { label: "Products Listed", value: "500,000+", icon: <Globe className="text-green-500" /> },
    { label: "Customer Satisfaction", value: "98%", icon: <Award className="text-purple-500" /> }
  ];

  const values = [
    {
      title: "Customer First",
      description: "We believe in providing the best experience for our shoppers, ensuring quality and trust in every transaction.",
      icon: <Heart className="text-red-500" />
    },
    {
      title: "Empowering Sellers",
      description: "Our platform provides local businesses with the tools they need to reach a national audience and grow sustainably.",
      icon: <Users className="text-blue-500" />
    },
    {
      title: "Secure & Trusted",
      description: "With advanced verification and secure payment methods, we ensure a safe marketplace for everyone.",
      icon: <ShieldCheck className="text-green-500" />
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Our Team" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
          >
            About <span className="text-orange-500">DarazClone</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-200 max-w-2xl mx-auto font-medium"
          >
            Building the future of e-commerce in Bangladesh, one delivery at a time.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center"
              >
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">
                Our Journey to Becoming the <br />
                <span className="text-orange-500">#1 Marketplace</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Founded in 2024, DarazClone started with a simple mission: to make online shopping accessible, 
                  affordable, and reliable for everyone in Bangladesh. What began as a small team of passionate 
                  individuals has now grown into a massive ecosystem of vendors and shoppers.
                </p>
                <p>
                  We realized that the traditional retail model was leaving many local artisans and small 
                  businesses behind. By building a multi-vendor platform, we've empowered thousands of 
                  entrepreneurs to digitize their businesses and reach customers across the entire country.
                </p>
                <p>
                  Today, we are more than just an e-commerce site; we are a community that values trust, 
                  innovation, and the spirit of entrepreneurship.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Our Office" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-orange-500 text-white p-8 rounded-3xl shadow-xl hidden md:block">
                <div className="text-4xl font-bold mb-1">2+ Years</div>
                <div className="text-sm font-medium opacity-90">Of Excellence & Growth</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The principles that guide everything we do at DarazClone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 p-10 rounded-[32px] border border-slate-700 hover:border-orange-500/50 transition-all group"
              >
                <div className="bg-slate-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-500 rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-200">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to join the <br /> revolution?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-500 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all">
                  Start Shopping
                </button>
                <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all">
                  Become a Seller
                </button>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
        </div>
      </section>
    </div>
  );
}
