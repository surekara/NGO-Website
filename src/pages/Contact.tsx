import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Shine, SpotlightCard, Stagger } from "@/components/motion";
import { GlowBorder, PageHero, SectionTitle } from "@/components/PageFx";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+91 88888 08112"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "prachetasfoundation@gmail.com"
      ]
    },
    {
      icon: MapPin,
      title: "Address",
      details: [
        "HQPJ+97R, Vishal Nagar, Pimple Nilakh",
        "Pimpri-Chinchwad, Maharashtra 411027"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 2:00 PM"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-clip">
      <Header />

      <PageHero
        eyebrow="📬 Say Hello"
        title="Contact"
        highlight="Us"
        image="/gallery-new-4.jpg"
        wave="text-white"
        subtitle={<p>We'd love to hear from you. Reach out to us for any queries, collaborations, or to learn more about our work.</p>}
      />

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Stagger className="grid sm:grid-cols-2 md:grid-cols-4 gap-6" gap={0.12}>
            {contactInfo.map((info, index) => (
              <SpotlightCard key={index} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-yellow-400/60 hover:shadow-2xl transition-[border-color,box-shadow]">
                <motion.div
                  className="relative mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:rotate-[360deg] transition-transform duration-700"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                >
                  <info.icon className="h-7 w-7" />
                </motion.div>
                <h2 className="relative text-xl font-bold text-prachetas-black mb-4">{info.title}</h2>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="relative text-prachetas-medium-gray">{detail}</p>
                ))}
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-yellow-300 to-amber-500 group-hover:w-full transition-all duration-500" />
              </SpotlightCard>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <GlowBorder className="max-w-2xl mx-auto" innerClassName="bg-prachetas-black p-8">
            <h2 className="text-2xl font-bold text-prachetas-yellow mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input 
                    id="contact-name"
                    type="text"
                    className="bg-white text-prachetas-black border-gray-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input 
                    id="contact-email"
                    type="email"
                    className="bg-white text-prachetas-black border-gray-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <Input 
                  id="contact-subject"
                  type="text"
                  className="bg-white text-prachetas-black border-gray-300"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <Textarea 
                  id="contact-message"
                  className="bg-white text-prachetas-black border-gray-300 h-32"
                  placeholder="Your message..."
                />
              </div>
              <Button className="group relative overflow-hidden w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold">
                <Shine />
                <Send className="relative mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span className="relative">Send Message</span>
              </Button>
            </form>
          </GlowBorder>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="📍 Visit Us" title="Find Us" highlight="Here" subtitle="Our main office is located in Pune. We welcome you to visit us." className="mb-12" />
          <motion.div
            className="h-[600px] rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200"
            initial={{ clipPath: "inset(10% 10% 10% 10% round 24px)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 16px)", opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.8393601194985!2d73.79251147599615!3d18.580284882525492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b906c4b4b4b1%3A0x1234567890abcdef!2sHQPJ%2B97R%2C%20Vishal%20Nagar%2C%20Pimple%20Nilakh%2C%20Pimpri-Chinchwad%2C%20Maharashtra%20411027!5e0!3m2!1sen!2sin!4v1691123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PRACHETAS Foundation Location - HQPJ+97R, Vishal Nagar, Pimple Nilakh"
            ></iframe>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
