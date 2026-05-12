import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Send, Share2, Linkedin } from "lucide-react";

const socialLinks = [
  {
    href: "https://instagram.com/prachetasfoundation",
    handle: "@prachetasfoundation",
    platform: "Instagram",
    logo: "/Instagram_logo_2016.svg",
    isImg: true,
  },
  {
    href: "https://snapchat.com/add/prachetasorg",
    handle: "@prachetasorg",
    platform: "Snapchat",
    logo: "/snapchat-logo-svgrepo-com.svg",
    isImg: true,
  },
  {
    href: "https://twitter.com/PrachetasFoundation",
    handle: "@PrachetasFoundation",
    platform: "X (Twitter)",
    logo: "/X_logo_2023_original.svg",
    isImg: true,
  },
  {
    href: "https://www.linkedin.com/company/prachetas-foundation/",
    handle: "Prachetas Foundation",
    platform: "LinkedIn",
    logo: null,
    isImg: false,
  },
];

const ContactSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/30 text-yellow-700 dark:text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            📬 Reach Out
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Stay <span className="text-gradient-yellow">Connected</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Get in touch with us to learn more about our initiatives or how you can contribute
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h3>

            {[
              { icon: MapPin, label: "Main Office", value: "HQPJ+97R, Vishal Nagar, Pimple Nilakh, Pimpri-Chinchwad, Maharashtra 411027" },
              { icon: Phone, label: "Phone Number", value: "+91 8888808112", href: "tel:+918888808112" },
              { icon: Mail, label: "Email Address", value: "prachetasfoundation@gmail.com", href: "mailto:prachetasfoundation@gmail.com" },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors text-sm font-medium">{value}</a>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={14} className="text-yellow-500" />
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Follow Us</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {socialLinks.map((s) => (
                  <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-400/10 border border-transparent hover:border-yellow-200 dark:hover:border-yellow-400/30 transition-all group">
                    {s.isImg
                      ? <img src={s.logo} alt={s.platform} className="h-4 w-4 object-contain" />
                      : <Linkedin size={16} className="text-[#0A66C2]" />
                    }
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{s.handle}</span>
                    <span className="ml-auto text-xs text-gray-400">{s.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gray-950 rounded-2xl p-8 border border-yellow-400/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-5">
                <Mail size={18} className="text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Stay Updated</h3>
              <p className="mb-6 text-gray-400 text-sm leading-relaxed">Subscribe to our newsletter to receive updates about our work and upcoming events.</p>
              <form className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-400/50 rounded-xl"
                />
                <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl btn-glow transition-all">
                  Subscribe <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-600 mt-4 text-center">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
