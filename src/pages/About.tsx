import { 
  ArrowRight, Users, GraduationCap, Heart, Handshake, 
  Leaf, Brain, BookOpen, UtensilsCrossed, HeartPulse, 
  Users2, BookOpen as Workshop, Sprout 
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  DrawLine, Magnetic, Marquee, ScrollCue, Shimmer, Shine, SplitWords, Sparkles, SpotlightCard, Stagger, StaggerItem, Tilt, ease, fadeUp,
} from "@/components/motion";

const AboutPage = () => {
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef, offset: ["start 75%", "end 60%"] });
  const journeyLine = useSpring(journeyProgress, { stiffness: 80, damping: 20 });
  const teamMembers = [
    {
      name: "Niranjan Pendharkar",
      role: "President",
      image: "/Niranjan.jpg",
      bio: "Niranjan has over 30 years of experience in the software industry, having worked with leading global organizations such as Google, Symantec, Veritas, and Nutanix. He holds an M.Sc. degree from the Indian Institute of Science (IISc), Bangalore",
    },
    {
      name: "Brajesh Kumar Pandey",
      role: "Vice President",
      image: "/brajesh.jpg",
      bio: "Brajesh Kumar Pandey has over 20 years of experience in the software industry, having worked with leading organizations such as L&T and Accolite. He holds a Bachelor of Engineering (B.E.) degree from Lakshmi Narain College of Technology, Bhopal",
    },
    {
      name: "Jai Gahlot",
      role: "Board Member",
      image: "/JaiGahlot.png",
      bio: "Jai Gahlot has over 17 years of experience in the IT industry, having worked with leading organizations such as Mindtree, Symantec, Dell, and Veritas. He holds an M.Tech. degree from the Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)",
    },
    {
      name: "Tushar Wakde",
      role: "Board Member",
      image: "/tushar.jpg",
      bio: "Tushar Wakde has over 30 years of experience in the IT industry, having served as Director and CEO of Remote Data Solutions Pvt. Ltd. He holds a Bachelor of Engineering (B.E.) degree from COEP Technological University, Pune",
    },
    {
      name: "Jasbir Singh",
      role: "Board Member",
      image: "/jasbir.png",
      bio: "Jasbir Singh has over 16 years of experience across the IT and manufacturing sectors and currently leads Sales and Delivery operations at UST Product Engineering. He holds an MBA degree from Symbiosis Centre for Management and Human Resource Development (SCMHRD), Pune",
    },
    {
      name: "Pradeep Sankaran",
      role: "Board Member",
      image: "/pradeep.jpg",
      bio: "Pradeep Sankaran has over 32 years of experience in the manufacturing and automotive industries, having worked with leading organizations such as Bajaj Auto, General Motors, and Schindler. He holds a Bachelor of Engineering (B.E.) degree from PSG College of Technology, Coimbatore",
    },
    {
      name: "Arkodit Deb Burman",
      role: "Board Member",
      image: "/arkodit.png",
      bio: "Arkodit Deb Burman has over 8 years of experience in human resources, having worked with leading organizations such as Cummins India, Airtel, and Vodafone Intelligent Solutions. He holds an MBA degree from Symbiosis Centre for Management and Human Resource Development (SCMHRD), Pune.",
    },
    {
      name: "CA. Amit Khare",
      role: "Legal & Compliance",
      image: "/amitkhare.jpeg",
      bio: "Amit Khare is a qualified Chartered Accountant with 21 years of professional experience in the Industry with organisations like General Motors, Kohler, Godrej, Peri, Kelvin etc.",
    },
    {
      name: "Anupam Agarwal",
      role: "Director Program",
      image: "/anupam.jpeg",
      bio: "Anupam Agarwal has more than 27 years of Telcom and IT experience. He has worked for companies like Infosys, TCS, Hughes software and others. He is Btech from NIT Surat.",
    },
    {
      name: "Priya Narayanan",
      role: "Department Head",
      image: "/priya.jpg",
      bio: "Priya has over 15 years of experience in Banking and Finance. She Leads a passionate and energetic team of trainers with a dream to do upskill the youths and create the leaders of tomorrow. Priya is also Founder of Daksha Skilling Academy.",
    },
    {
      name: "Smita Joshi",
      role: "Department Head",
      image: "/smita.png",
      bio: "Smita is a Financial and Investment Advisor, as well as a Yoga Instructor and Counsellor with over 15 years of experience since 2010. She conducts workshops and seminars focused on integrating yoga, mindfulness, and holistic practices into daily life to support stress management, emotional balance, and personal growth. Passionate about well-being and spiritual development, Smita is dedicated to fostering a mindful and empowered community that values inner harmony alongside financial wellness.",
    },
    {
      name: "Manish Mittal",
      role: "Department Head",
      image: "/Manish.jpg",
      bio: "Manish Mittal is a Mechanical Design PG from IIT Delhi with over 20 years of experience in R&D, currently contributing his expertise within a multinational corporation. Driven by a deep passion for serving humanity and promoting holistic wellness, Manish is well-versed in the Panchtatva Chikitsa Siddhant—a unique healing philosophy focused on treating ailments naturally without medication. Along with his team, he has trained more than 5,000 individuals in this approach, positively impacting the lives of nearly 50,000 people through awareness, guidance, and transformative wellness practices.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Foundation Established",
      description: "Started with a vision to create a service-oriented movement based on Vedic values"
    },
    {
      year: "2021",
      title: "Education Programs Launch",
      description: "Initiated value-based education programs in multiple communities"
    },
    {
      year: "2022",
      title: "Food Security Initiative",
      description: "Launched sustainable food distribution and nutrition programs"
    },
    {
      year: "2023",
      title: "Wellness Program Expansion",
      description: "Extended holistic wellness programs to serve more communities"
    }
  ];

  const missionItems = [
    { icon: Heart, title: "To Eliminate Hunger", text: "By providing sanctified, nourishing meals to the underprivileged, slum communities, patients, and the homeless." },
    { icon: GraduationCap, title: "To Empower Youth", text: "Through seminars, courses, and mentorships that blend science, spirituality, and life skills — protecting them from addiction, stress, low self-worth, and destructive habits." },
    { icon: Leaf, title: "To Promote Wellness", text: "Offering free yoga, naturopathy, mindfulness, and sustainable living workshops that heal the body and mind without dependency on medicines." },
    { icon: BookOpen, title: "To Uplift Society Spiritually", text: "Instilling inner strength, discipline, and purpose-driven living through Vedic-inspired, secular programs for all." },
  ];

  const approachItems = [
    { icon: Brain, title: "Character Education", text: "Guide youth toward clarity, self-control, and moral strength through structured programs and mentorship." },
    { icon: UtensilsCrossed, title: "Food Distribution", text: "Run daily meal drives for underserved communities, ensuring nutrition and dignity for all." },
    { icon: HeartPulse, title: "Free Wellness Programs", text: "Promote medicine-free, sattvik lifestyles for all through yoga and natural healing practices." },
    { icon: Users2, title: "Community Engagement", text: "Mobilize volunteers and partners for grassroots impact and sustainable community development." },
    { icon: Workshop, title: "Workshops & Seminars", text: "Host sessions on smart work, stress relief, and self-mastery for personal growth." },
    { icon: Sprout, title: "Sustainable Living", text: "Encourage conscious habits, clean environments, and minimalism for a better future." },
  ];

  const eyebrow = "relative overflow-hidden inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-5";

  return (
    <div className="min-h-screen bg-prachetas-black overflow-x-clip">
      <Header />

      {/* Hero Section */}
      <section className="relative py-28 md:py-36 bg-prachetas-black text-white overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-prachetas-yellow/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 60, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-amber-500/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <Sparkles count={30} />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
              className={`${eyebrow} bg-yellow-400/10 border border-yellow-400/30 text-yellow-400`}
            >
              <Shimmer />
              🏛️ About Prachetas Foundation
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <SplitWords text="Who We" delay={0.5} />{" "}
              <SplitWords text="Are" delay={0.7} wordClassName="bg-gradient-to-r from-prachetas-yellow via-yellow-200 to-prachetas-golden bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x pr-1" />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1, duration: 1 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Prachetas Foundation is a <span className="text-white font-semibold">dedicated team of professionals</span> united by a shared vision of service. Our name draws inspiration from the ancient sage Prachetas, known for his deep meditation and service to humanity. We believe in the power of combining <span className="text-white font-semibold">modern solutions with timeless Vedic wisdom</span> to create meaningful change in society.
            </motion.p>
            <motion.div
              className="mt-4 mb-10"
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0em" }}
              transition={{ delay: 1.4, duration: 1.4, ease }}
            >
              <p className="text-2xl text-prachetas-yellow italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "Service to humanity is service to divinity."
              </p>
            </motion.div>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.7 }}
            >
              <Magnetic>
                <Button asChild size="lg" className="group relative overflow-hidden bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors shadow-lg shadow-yellow-400/30">
                  <Link to="/donate"><Shine /><span className="relative">Support Our Cause</span><ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
                  <Link to="#contact">Get in Touch</Link>
                </Button>
              </Magnetic>
            </motion.div>
            <ScrollCue className="mt-16" />
          </div>
        </div>
      </section>

      {/* Values ribbon */}
      <div className="relative bg-prachetas-yellow text-black py-4 text-xl md:text-2xl font-bold italic -rotate-1 scale-105 shadow-xl z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <Marquee items={["Service", "Wisdom", "Compassion", "Community", "Wellness", "Education", "Nourishment", "Dignity"]} />
      </div>

      {/* Mission Section */}
      <section className="relative py-24 bg-white text-prachetas-medium-gray overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-prachetas-black mb-4">
              <SplitWords text="Our Mission:" inView />{" "}
              <SplitWords text="Why We Exist" inView delay={0.25} wordClassName="text-gradient-yellow" />
            </h2>
            <DrawLine className="mx-auto mb-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            <motion.p {...fadeUp} className="text-xl text-prachetas-medium-gray max-w-3xl mx-auto leading-relaxed">
              We believe the true measure of progress is how we uplift those in need — not just with money or materials, but with the tools to live better, think clearer, and serve others.
            </motion.p>
          </div>

          <Stagger className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto" gap={0.12}>
            {missionItems.map(({ icon: Icon, title, text }, i) => (
              <SpotlightCard key={title} color="rgba(255,193,7,0.18)" className="bg-gray-50 p-7 rounded-2xl border border-gray-200 hover:border-yellow-400/60 hover:shadow-2xl transition-[border-color,box-shadow] duration-300">
                <div className="relative flex items-start gap-5">
                  <motion.div
                    className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:rotate-[360deg] transition-transform duration-700"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-prachetas-black mb-2">{title}</h3>
                    <p className="text-prachetas-medium-gray leading-relaxed">{text}</p>
                  </div>
                </div>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-yellow-300 to-amber-500 group-hover:w-full transition-all duration-500" />
              </SpotlightCard>
            ))}
          </Stagger>

          <motion.div {...fadeUp} className="mt-14 max-w-3xl mx-auto text-center">
            <p className="text-xl text-prachetas-medium-gray leading-relaxed">
              Our goal is not short-term charity, but long-term transformation — to create a society where compassion becomes culture, and every person is empowered to live a fulfilling, value-based life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="relative py-24 bg-gray-950 text-gray-300 overflow-hidden">
        <Sparkles count={20} />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-14">
            <div className={`${eyebrow} bg-yellow-400/10 border border-yellow-400/30 text-yellow-400`}>
              <Shimmer />
              🧭 How We Work
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <SplitWords text="Our" inView />{" "}
              <SplitWords text="Approach" inView delay={0.12} wordClassName="text-yellow-400 italic pr-1" />
            </h2>
            <motion.p {...fadeUp} className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We take a holistic and grassroots approach to social change — combining inner transformation with practical support. Our work is driven by service, guided by wisdom, and powered by community.
            </motion.p>
          </div>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" gap={0.1}>
            {approachItems.map(({ icon: Icon, title, text }, i) => (
              <SpotlightCard key={title} className="bg-white/5 p-7 rounded-2xl border border-white/10 hover:border-yellow-400/50 transition-colors duration-300">
                <span className="absolute top-4 right-5 text-5xl font-black text-white/5 group-hover:text-yellow-400/15 transition-colors font-mono">0{i + 1}</span>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-5 group-hover:bg-yellow-400 group-hover:text-black group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-gray-400">{text}</p>
                </div>
              </SpotlightCard>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-24 bg-white text-prachetas-medium-gray overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-prachetas-black">
            <SplitWords text="Our" inView />{" "}
            <SplitWords text="Journey" inView delay={0.12} wordClassName="text-gradient-yellow" />
          </h2>
          <DrawLine className="mx-auto mb-16 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <div ref={journeyRef} className="relative max-w-5xl mx-auto">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-gray-200">
              <motion.div className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500" style={{ scaleY: journeyLine }} />
            </div>
            <div className="space-y-14">
              {milestones.map((milestone, index) => {
                const left = index % 2 === 0;
                return (
                  <div key={milestone.year} className={`relative flex items-center ${left ? "md:justify-start" : "md:justify-end"}`}>
                    <motion.div
                      className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 bg-prachetas-yellow text-prachetas-black font-extrabold px-4 py-2 rounded-full shadow-lg shadow-yellow-400/40 ring-4 ring-white"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    >
                      {milestone.year}
                    </motion.div>
                    <Tilt
                      max={6}
                      className={`group relative overflow-hidden ml-24 md:ml-0 md:w-[calc(50%-4rem)] bg-gray-50 p-7 rounded-2xl shadow-lg border border-gray-200 hover:border-yellow-400/60 hover:shadow-2xl transition-[border-color,box-shadow]`}
                      initial={{ opacity: 0, x: left ? -100 : 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.9, ease }}
                    >
                      <Shine />
                      <h3 className="relative text-xl font-bold mb-2 text-prachetas-black">{milestone.title}</h3>
                      <p className="relative text-prachetas-medium-gray">{milestone.description}</p>
                    </Tilt>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative py-24 bg-gray-100 text-prachetas-medium-gray overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className={`${eyebrow} bg-yellow-50 border border-yellow-200 text-yellow-700`}>
              <Shimmer color="via-yellow-400/30" />
              👥 The People Behind Prachetas
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-prachetas-black">
              <SplitWords text="Our" inView />{" "}
              <SplitWords text="Team" inView delay={0.12} wordClassName="text-gradient-yellow" />
            </h2>
            <DrawLine className="mx-auto mt-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          </div>
          <Stagger className="flex flex-wrap justify-center gap-8" gap={0.08}>
            {teamMembers.map((member) => (
              <StaggerItem key={member.name} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
                <Tilt max={8} className="group relative h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-yellow-400/20 transition-shadow duration-500">
                  <div className="relative overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="w-full h-64 object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-400">{member.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Shine />
                    <span className="absolute bottom-3 left-4 bg-prachetas-yellow text-black text-xs font-bold px-3 py-1 rounded-full translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      {member.role}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-prachetas-black">{member.name}</h3>
                    <p className="text-amber-600 mb-4 font-semibold">{member.role}</p>
                    <p className="text-prachetas-medium-gray text-sm">{member.bio}</p>
                  </div>
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-yellow-300 to-amber-500 group-hover:w-full transition-all duration-500" />
                </Tilt>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="relative py-24 bg-prachetas-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.12),transparent_60%)]" />
        <Sparkles count={24} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            className="mx-auto mb-6 w-16 h-16 rounded-full bg-prachetas-yellow/10 flex items-center justify-center"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 160, damping: 12 }}
          >
            <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <Heart className="h-8 w-8 text-prachetas-yellow" fill="currentColor" />
            </motion.span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <SplitWords text="Join Our" inView />{" "}
            <SplitWords text="Mission" inView delay={0.2} wordClassName="text-prachetas-yellow italic pr-1" />
          </h2>
          <motion.p {...fadeUp} className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Together, we can create lasting change and build a better future for all.
            Your support makes our work possible.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Button asChild size="lg" className="group relative overflow-hidden bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow shadow-lg shadow-yellow-400/30">
                <Link to="/donate"><Shine /><span className="relative">Make a Donation</span></Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
                <Link to="/volunteer">Volunteer With Us</Link>
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
