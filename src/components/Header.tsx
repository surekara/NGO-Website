import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

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
    <header className="bg-black text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/New_Logo_Whole-White.png"
              alt="Prachetas Foundation Logo"
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                <span className="text-white">PRACHETAS</span>{" "}
                <span className="text-prachetas-yellow">FOUNDATION</span>
              </span>
              <span className="text-prachetas-yellow text-sm tracking-wider font-medium">
                WHERE COMPASSION MEETS ACTION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-white hover:text-prachetas-yellow transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/create-fundraiser"
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-sm border border-yellow-400/40 hover:border-yellow-300 px-4 py-2 rounded-lg"
            >
              🔗 Fundraise
            </Link>
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-white/20 hover:border-yellow-400/50 text-gray-300 hover:text-yellow-400 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button
              asChild
              className="bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold px-6"
            >
              <Link to="/donate">Donate Now</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block text-white hover:text-prachetas-yellow transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/create-fundraiser"
              className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              🔗 Create Fundraiser Link
            </Link>
            <Button
              asChild
              className="w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold"
            >
              <Link to="/donate">Donate Now</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
