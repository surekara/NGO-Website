import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Our Programs" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      className="bg-black/95 backdrop-blur-md text-white py-4 sticky top-0 z-50 shadow-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              src="/New_Logo_Whole-White.png"
              alt="Prachetas Foundation Logo"
              className="h-12 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                <span className="text-white">PRACHETAS</span>{" "}
                <span className="text-prachetas-yellow group-hover:text-yellow-300 transition-colors">FOUNDATION</span>
              </span>
              <span className="text-prachetas-yellow text-sm tracking-wider font-medium">
                WHERE COMPASSION MEETS ACTION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.div key={item.href} whileHover={{ y: -2 }}>
                <Link
                  to={item.href}
                  className="text-white hover:text-prachetas-yellow transition-colors font-medium relative group"
                >
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-prachetas-yellow group-hover:w-full transition-all"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/create-fundraiser"
                className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-sm border border-yellow-400/40 hover:border-yellow-300 px-4 py-2 rounded-lg hover:bg-yellow-400/10"
              >
                🔗 Fundraise
              </Link>
            </motion.div>
            <motion.button
              onClick={toggle}
              className="p-2 rounded-lg border border-white/20 hover:border-yellow-400/50 text-gray-300 hover:text-yellow-400 transition-all hover:scale-110"
              aria-label="Toggle theme"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold px-6 shadow-lg shadow-yellow-400/20"
              >
                <Link to="/donate">Donate Now</Link>
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden mt-4 space-y-4 pb-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="block text-white hover:text-prachetas-yellow transition-colors font-medium py-2 hover:pl-4 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.1 }}
              >
                <Link
                  to="/create-fundraiser"
                  className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium py-2 hover:pl-4 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔗 Create Fundraiser Link
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (navItems.length + 1) * 0.1 }}
              >
                <Button
                  asChild
                  className="w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold"
                >
                  <Link to="/donate">Donate Now</Link>
                </Button>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
