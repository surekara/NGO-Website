import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shine } from "@/components/motion";
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
  { href: "/collaborations", label: "Collaborations" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`bg-black/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10 transition-all duration-300 ${scrolled ? 'py-2 shadow-xl shadow-black/40' : 'py-4 shadow-md'}`}
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
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-8' : 'h-12'}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <div className="flex flex-col leading-none">
              <div className="flex flex-col" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span
                  className={`font-bold italic leading-none text-white transition-all duration-300 ${scrolled ? 'text-[22px]' : 'text-[30px]'}`}
                  style={{ letterSpacing: '0.04em' }}
                >
                  PRACHETAS
                </span>
                <span
                  className={`font-semibold tracking-[0.45em] uppercase text-prachetas-yellow group-hover:text-yellow-300 transition-all duration-300 ${scrolled ? 'text-[8.5px]' : 'text-[11px]'}`}
                >
                  FOUNDATION
                </span>
              </div>
              <AnimatePresence>
                {!scrolled && (
                  <motion.span
                    className="text-white/35 tracking-[0.22em] mt-1"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '7.5px', fontWeight: 400 }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    WHERE COMPASSION MEETS ACTION
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
              {navItems.map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setHovered(item.href)}
                    className="relative"
                  >
                    {hovered === item.href && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-prachetas-yellow/30"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Link
                      to={item.href}
                      className={`relative block px-3 py-2 font-medium transition-colors ${active ? "text-prachetas-yellow" : "text-white hover:text-prachetas-yellow"}`}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-prachetas-yellow to-transparent"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <motion.button
              onClick={toggle}
              className="p-2 rounded-lg border border-white/20 hover:border-yellow-400/50 text-gray-300 hover:text-yellow-400 transition-all hover:scale-110"
              aria-label="Toggle theme"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, boxShadow: ["0 0 0 0 rgba(255,215,0,0.5)", "0 0 0 12px rgba(255,215,0,0)"] }}
              transition={{ opacity: { delay: 0.8 }, scale: { delay: 0.8, type: "spring", stiffness: 260, damping: 14 }, boxShadow: { duration: 2, repeat: Infinity, delay: 1.5 } }}
              className="rounded-md"
            >
              <Button
                asChild
                className="bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold px-6 shadow-lg shadow-yellow-400/20 relative overflow-hidden group"
              >
                <Link to="/donate">
                  <Shine />
                  <motion.span
                    className="relative z-10"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Donate Now
                  </motion.span>
                </Link>
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
