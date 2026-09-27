import Header from "../components/Header";
import Footer from "../components/Footer";
import MultistepDonation from "../components/MultistepDonation";
import { ArrowRight, Smile, Heart, Award, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { CountUp, Shine, Sparkles, SpotlightCard, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { SectionTitle } from "@/components/PageFx";

const benefits = [
  {
    icon: Award,
    title: "Transparency",
    text: "We are committed to financial transparency. View our annual reports to see how funds are utilized. All our financial statements are publicly available.",
    cta: "View our reports",
  },
  {
    icon: Heart,
    title: "Tax Benefits",
    text: "All donations are eligible for tax exemption under Section 80G of the Income Tax Act. You'll receive an official receipt for tax purposes immediately after donation.",
    cta: "Learn about tax benefits",
  },
  {
    icon: Smile,
    title: "Impact",
    text: "Your contribution directly impacts the lives of those in need, creating lasting positive change. We send regular updates on how your donations are making a difference.",
    cta: "View impact stories",
  },
];

const amounts = [
  { value: 1000, text: "Supplies educational materials for two students" },
  { value: 2500, text: "Funds a health checkup camp for an entire village" },
  { value: 5000, text: "Supports vocational training for unemployed youth" },
];

const faqs = [
  { q: "Is my donation tax-deductible?", a: "Yes! All donations to our registered trust are eligible for tax deduction under Section 80G of the Income Tax Act. You'll receive an immediate receipt for tax purposes." },
  { q: "How is my donation used?", a: "100% of your donation goes directly to our programs. Administrative costs are covered separately through dedicated fundraising efforts and grants." },
  { q: "Can I set up a recurring donation?", a: "Absolutely! Monthly recurring donations provide sustainable support and can be set up through our secure donation form. You can modify or cancel anytime." },
  { q: "Will I receive updates on how my donation is used?", a: "Yes! We send quarterly impact reports showing exactly how donations are being used and the difference they're making in our community programs." },
  { q: "Can I make a donation in someone's memory?", a: "Yes, you can dedicate your donation in memory or honor of someone special. Simply include their name in the message field of the donation form.", dark: true },
  { q: "How will my donation be used?", a: "Your donation directly supports our programs in education, healthcare, livelihood, and community development. We maintain full transparency about fund allocation.", dark: true },
  { q: "How can I cancel my monthly donation?", a: "You can cancel your monthly donation at any time by contacting our donor support team at prachetasfoundation@gmail.com or by calling the number at the bottom of this page.", dark: true },
];

const DonatePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-clip">
      <Header />

      {/* Donation Form Section */}
      <MultistepDonation />

      {/* Hero Section */}
      <section className="py-20 bg-white text-prachetas-black overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <SplitWords text="Support Our" inView />{" "}
              <SplitWords text="Mission" inView delay={0.15} wordClassName="text-gradient-yellow" />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg text-prachetas-medium-gray mb-8"
            >
              Your generous donation helps us create lasting change in the lives of those who need it most.
            </motion.p>
            <Stagger className="flex flex-wrap justify-center gap-4 items-center" gap={0.12} delay={0.3}>
              {[
                { icon: Heart, label: "Tax Benefits" },
                { icon: Award, label: "100% Transparency" },
                { icon: HeartHandshake, label: "Direct Impact" },
              ].map(({ icon: Icon, label }) => (
                <StaggerItem key={label} whileHover={{ y: -4, scale: 1.05 }} className="flex items-center bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 shadow-sm">
                  <Icon className="text-amber-500 h-5 w-5 mr-2" />
                  <span className="text-prachetas-medium-gray font-medium">{label}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Donation Benefits */}
          <Stagger className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto" gap={0.15}>
            {benefits.map(({ icon: Icon, title, text, cta }) => (
              <SpotlightCard key={title} className="bg-gray-50 p-8 rounded-2xl shadow-md border border-gray-200 hover:border-yellow-400/60 hover:shadow-2xl transition-[border-color,box-shadow] duration-300">
                <h3 className="relative text-2xl font-bold mb-4 text-prachetas-black flex items-center">
                  <span className="mr-3 w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:rotate-[360deg] transition-transform duration-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  {title}
                </h3>
                <p className="relative text-prachetas-medium-gray text-lg leading-relaxed mb-6">{text}</p>
                <span className="relative text-amber-600 inline-flex items-center text-base font-medium">
                  {cta} <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1.5" />
                </span>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-yellow-300 to-amber-500 group-hover:w-full transition-all duration-500" />
              </SpotlightCard>
            ))}
          </Stagger>

          {/* How Your Donation Helps */}
          <div className="max-w-5xl mx-auto my-16 text-center">
            <SectionTitle title="How Your Donation" highlight="Helps" />
            <Stagger className="grid md:grid-cols-3 gap-8 text-center" gap={0.15}>
              {amounts.map(({ value, text }) => (
                <StaggerItem
                  key={value}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="group relative overflow-hidden bg-prachetas-black p-8 rounded-2xl shadow-xl hover:shadow-[0_30px_70px_-20px_rgba(255,215,0,0.45)] transition-shadow"
                >
                  <Sparkles count={8} />
                  <Shine />
                  <div className="relative text-5xl font-extrabold text-prachetas-yellow mb-4 tabular-nums">
                    <CountUp to={value} format={(n) => `₹${n}`} />
                  </div>
                  <p className="relative text-gray-300 text-lg">{text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-100 text-prachetas-black">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="❓ Got Questions" title="Frequently Asked" highlight="Questions" />
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map(({ q, a, dark }, i) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, x: i % 2 ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.015 }}
                className={`group relative overflow-hidden p-8 rounded-2xl shadow-md transition-shadow hover:shadow-2xl ${dark ? "bg-prachetas-black" : "bg-white border border-gray-200"}`}
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-300 to-amber-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />
                <h3 className={`text-2xl font-semibold mb-4 ${dark ? "text-white" : "text-prachetas-black"}`}>{q}</h3>
                <p className={`text-lg leading-relaxed ${dark ? "text-gray-200" : "text-prachetas-medium-gray"}`}>{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonatePage;
