import { BookOpen, Users, Heart, Brain, GraduationCap, Sprout } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CountUp, RevealImage, Shine, SpotlightCard, Stagger, StaggerItem, Tilt } from "@/components/motion";
import { CTASection, PageHero, SectionTitle } from "@/components/PageFx";

const ProgramsPage = () => {
  const programs = [
    {
      title: "Education Empowerment",
      icon: GraduationCap,
      category: "Education",
      description: "Providing quality education and learning resources to underprivileged children.",
      backgroundImage: "/Copy of IMG-20250610-WA0013.jpg",
      benefits: [
        "Free education for underprivileged children",
        "Digital literacy programs",
        "Vocational training for youth",
        "Scholarships for higher education"
      ]
    },
    {
      title: "Community Health",
      icon: Heart,
      category: "Healthcare",
      description: "Promoting health awareness and providing medical support to communities.",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-26 at 15.50.55 (1).jpeg",
      benefits: [
        "Regular health checkup camps",
        "Nutrition programs for children",
        "Mental health awareness",
        "Preventive healthcare education"
      ]
    },
    {
      title: "Skill Development",
      icon: Brain,
      category: "Skills",
      description: "Empowering youth with skills for better employment opportunities.",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg",
      benefits: [
        "Technical skills training",
        "Soft skills development",
        "Career counseling",
        "Job placement support"
      ]
    },
    {
      title: "Rural Development",
      icon: Sprout,
      category: "Community",
      description: "Supporting rural communities with sustainable development initiatives.",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-27 at 16.15.54.jpeg",
      benefits: [
        "Agricultural support",
        "Water conservation projects",
        "Sustainable living practices",
        "Community infrastructure"
      ]
    }
  ];

  const stats = [
    { value: 5000, label: "Students Educated" },
    { value: 100, label: "Villages Reached" },
    { value: 2000, label: "Health Checkups" },
    { value: 1000, label: "Youth Skilled" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-clip">
      <Header />

      <PageHero
        eyebrow="🌱 What We Do"
        title="Our"
        highlight="Programs"
        image="/Copy of IMG-20250610-WA0013.jpg"
        subtitle={<p>Through our diverse range of programs, we aim to create lasting positive change in communities and empower individuals to build better futures.</p>}
      />

      {/* Programs Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Stagger className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto" gap={0.15}>
            {programs.map((program) => (
              <StaggerItem key={program.title}>
                <Tilt max={5} className="group relative overflow-hidden rounded-3xl h-[26rem] shadow-xl hover:shadow-[0_30px_80px_-20px_rgba(255,215,0,0.4)] transition-shadow duration-500">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <RevealImage
                      src={program.backgroundImage}
                      alt={`${program.title} background`}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/95 transition-colors duration-500" />
                  </div>
                  <Shine />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-prachetas-yellow text-prachetas-black w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg shadow-yellow-400/30 group-hover:rotate-[360deg] group-hover:scale-110 transition-transform duration-700">
                        <program.icon className="h-7 w-7" />
                      </div>
                      <Badge className="bg-prachetas-yellow/90 text-prachetas-black hover:bg-yellow-300 w-fit">{program.category}</Badge>
                    </div>
                    <h3 className="text-white text-3xl font-bold">{program.title}</h3>
                    <p className="mt-2 text-gray-200 text-base">{program.description}</p>
                    <ul className="mt-auto space-y-2">
                      {program.benefits.map((benefit, idx) => (
                        <motion.li
                          key={`${program.title}-${idx}`}
                          className="flex items-start text-gray-200 text-sm group-hover:translate-x-1 transition-transform"
                          style={{ transitionDelay: `${idx * 60}ms` }}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                          <span className="text-prachetas-yellow mr-2">✦</span>
                          {benefit}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </Tilt>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="✨ Real Change" title="Our" highlight="Impact" subtitle="See the difference we're making in communities across the region" />
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto" gap={0.12}>
            {stats.map((s) => (
              <SpotlightCard key={s.label} className="text-center bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-yellow-400/60 hover:shadow-2xl transition-[border-color,box-shadow]">
                <div className="relative text-4xl md:text-5xl font-extrabold text-gradient-yellow mb-2 tabular-nums">
                  <CountUp to={s.value} />+
                </div>
                <div className="relative text-prachetas-black font-medium">{s.label}</div>
              </SpotlightCard>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        title="Support Our"
        highlight="Programs"
        icon={<Heart className="h-9 w-9" fill="currentColor" />}
        text={<p>Your contribution helps us expand our reach and create more impact. Join us in making a difference.</p>}
        primary={{ to: "/donate", label: "Make a Donation" }}
        secondary={{ to: "/volunteer", label: "Volunteer With Us" }}
      />

      <Footer />
    </div>
  );
};

export default ProgramsPage;
