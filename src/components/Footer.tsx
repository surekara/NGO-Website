import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-black text-white pt-16 pb-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="flex flex-col mb-6">
              <span className="font-bold text-2xl">
                <span className="text-white">PRACHETAS</span> <span className="text-prachetas-yellow">FOUNDATION</span>
              </span>
              <span className="text-prachetas-yellow text-sm tracking-wider">WHERE COMPASSION MEETS ACTION</span>
            </div>
            <p className="text-gray-400 mb-6">
              Building stronger communities through collaborative initiatives, empowering individuals, and fostering sustainable development worldwide.
            </p>
            <div className="flex space-x-4">
              {[
                { href: "https://www.instagram.com/prachetasfoundation/", icon: Instagram, label: "Instagram" },
                { href: "https://www.linkedin.com/company/prachetas-foundation/", icon: Linkedin, label: "LinkedIn" },
                { href: "https://youtube.com/@prachetasfoundation", icon: Youtube, label: "YouTube" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-prachetas-yellow transition-colors"
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-prachetas-yellow">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/programs", label: "Our Programs" },
                { to: "/volunteer", label: "Volunteer" },
                { to: "/donate", label: "Donate" },
                { to: "/create-fundraiser", label: "🔗 Create Fundraiser Link", special: true },
              ].map((link) => (
                <li key={link.label}>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      to={link.to}
                      className={`${link.special ? "text-yellow-400/80" : "text-gray-400"} hover:text-prachetas-yellow transition-colors`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-prachetas-yellow">Our Programs</h4>
            <ul className="space-y-3">
              {[
                { to: "/programs/tech-education", label: "Education Initiatives" },
                { to: "/programs/green-cloud", label: "Community Development" },
                { to: "/programs/training", label: "Skill Development Programs" },
              ].map((link) => (
                <li key={link.label}>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link to={link.to} className="text-gray-400 hover:text-prachetas-yellow transition-colors">
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-prachetas-yellow">Contact Info</h4>
            <ul className="space-y-5 text-gray-400">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-prachetas-yellow shrink-0 mt-0.5" />
                <span>
                  Regd Office: Ganga Panama, Pimple Nilakh, Pune 411027
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-prachetas-yellow" />
                <motion.a
                  href="tel:+918888808112"
                  className="hover:text-prachetas-yellow transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  +91 8888808112
                </motion.a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-prachetas-yellow" />
                <motion.a
                  href="mailto:prachetasfoundation@gmail.com"
                  className="hover:text-prachetas-yellow transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  prachetasfoundation@gmail.com
                </motion.a>
              </li>
              <li className="flex items-start">
                <span className="text-prachetas-yellow font-semibold mr-2">Government ID Number:</span>
                <span>MAHA/953/2022</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PRACHETAS Foundation. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              {[
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms-of-service", label: "Terms of Service" },
                { to: "/refund-policy", label: "Refund and Cancellation Policy" },
              ].map((link) => (
                <motion.div key={link.label} whileHover={{ y: -2 }}>
                  <Link to={link.to} className="hover:text-prachetas-yellow transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
