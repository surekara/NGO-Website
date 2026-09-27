import { Heart, Users, HandHeart, Mail, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SpotlightCard, Stagger } from "@/components/motion";
import { CTASection, PageHero, SectionTitle } from "@/components/PageFx";

const GetInvolvedPage = () => {
  const opportunities = [
    {
      title: "Volunteer",
      icon: Heart,
      description: "Join our team of dedicated volunteers and make a direct impact in our community programs.",
      actions: [
        "Teaching and mentoring",
        "Healthcare camps assistance",
        "Community outreach",
        "Event organization"
      ]
    },
    {
      title: "Partner With Us",
      icon: HandHeart,
      description: "Collaborate with us as an organization to create larger social impact through combined efforts.",
      actions: [
        "Corporate partnerships",
        "NGO collaborations",
        "Resource sharing",
        "Joint programs"
      ]
    },
    {
      title: "Support Our Cause",
      icon: Users,
      description: "Make a difference through financial support and help us expand our reach and impact.",
      actions: [
        "One-time donations",
        "Monthly giving",
        "Sponsor a child",
        "Project funding"
      ]
    }
  ];

  const links = ["/volunteer", "/partner", "/donate"];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-clip">
      <Header />

      <PageHero
        eyebrow="🤝 Be The Change"
        title="Get"
        highlight="Involved"
        image="/gallery-new-5.jpg"
        wave="text-white"
        subtitle={<p>Join our mission to create lasting change in communities. Whether through volunteering, partnerships, or support, there are many ways to make a difference.</p>}
      />

      {/* Opportunities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle title="Ways to Get" highlight="Involved" subtitle="Choose how you'd like to contribute to our mission and make an impact" />
          <Stagger className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" gap={0.15}>
            {opportunities.map((opportunity, index) => (
              <SpotlightCard key={opportunity.title} className="bg-prachetas-black rounded-2xl p-8 shadow-xl border border-gray-800 hover:border-yellow-400/50 hover:shadow-[0_30px_70px_-20px_rgba(255,215,0,0.35)] transition-[border-color,box-shadow] duration-500">
                <span className="absolute top-3 right-5 text-6xl font-black text-white/5 group-hover:text-yellow-400/15 transition-colors font-mono">0{index + 1}</span>
                <Link to={links[index]} className="relative block">
                  <motion.div
                    className="mx-auto mb-6 w-20 h-20 rounded-full bg-prachetas-yellow/10 flex items-center justify-center group-hover:bg-prachetas-yellow transition-colors duration-500"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                  >
                    <opportunity.icon className="h-10 w-10 text-prachetas-yellow group-hover:text-black group-hover:scale-110 transition-all duration-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-prachetas-yellow mb-4 text-center">{opportunity.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{opportunity.description}</p>
                  <ul className="space-y-2">
                    {opportunity.actions.map((action, idx) => (
                      <li key={`${opportunity.title}-${idx}`} className="flex items-start text-gray-300 group-hover:translate-x-1 transition-transform" style={{ transitionDelay: `${idx * 50}ms` }}>
                        <span className="text-prachetas-yellow mr-2">✦</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-prachetas-yellow group-hover:gap-3 transition-all">
                    Learn more <ArrowRight size={16} />
                  </span>
                </Link>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-yellow-300 to-amber-500 group-hover:w-full transition-all duration-500" />
              </SpotlightCard>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        title="Ready to Make a"
        highlight="Difference?"
        icon={<Mail className="h-9 w-9" />}
        text={<p>Contact us to learn more about how you can get involved and contribute to creating positive change in our communities.</p>}
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "mailto:prachetasfoundation@gmail.com", label: "Email Us" }}
      />

      <Footer />
    </div>
  );
};

export default GetInvolvedPage;
