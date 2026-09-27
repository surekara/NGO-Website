import { BarChart, TrendingUp, Users, Heart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CountUp, Shimmer, Shine, Sparkles, SpotlightCard, Stagger, StaggerItem, Tilt } from "@/components/motion";
import { CTASection, PageHero, SectionTitle } from "@/components/PageFx";

const ImpactPage = () => {
  const impactStats = [
    {
      value: 50000, format: (n: number) => `${n.toLocaleString("en-IN")}+`,
      label: "Lives Impacted",
      icon: Users,
      description: "Direct beneficiaries of our programs across communities"
    },
    {
      value: 100, format: (n: number) => `${n}+`,
      label: "Villages Reached",
      icon: TrendingUp,
      description: "Communities where we've implemented our programs"
    },
    {
      value: 2, format: (n: number) => `₹${n}Cr+`,
      label: "Funds Utilized",
      icon: BarChart,
      description: "Effectively allocated for maximum social impact"
    },
    {
      value: 1000, format: (n: number) => `${n.toLocaleString("en-IN")}+`,
      label: "Volunteers",
      icon: Heart,
      description: "Dedicated individuals supporting our mission"
    }
  ];

  const successStories = [
    {
      name: "Village Education Initiative",
      location: "Rural Maharashtra",
      image: "/placeholder.svg",
      description: "Transformed education access for 500+ children through digital learning centers.",
      achievement: "90% improvement in learning outcomes"
    },
    {
      name: "Healthcare Outreach",
      location: "Tribal Areas",
      image: "/placeholder.svg",
      description: "Provided essential healthcare services to remote communities.",
      achievement: "2000+ health checkups conducted"
    },
    {
      name: "Youth Empowerment",
      location: "Urban Slums",
      image: "/placeholder.svg",
      description: "Skilled training program helping youth secure better employment.",
      achievement: "80% placement rate achieved"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-clip">
      <Header />

      <PageHero
        eyebrow="📈 Measurable Change"
        title="Our"
        highlight="Impact"
        image="/gallery-new-2.jpg"
        subtitle={<p>See how we're creating measurable change in communities and transforming lives through our dedicated programs and initiatives.</p>}
      />

      {/* Impact Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="Numbers That" highlight="Matter" subtitle="Measurable impact through dedicated service and community engagement" />
          <Stagger className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto" gap={0.12}>
            {impactStats.map((stat, index) => (
              <SpotlightCard key={`${stat.label}-${index}`} className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-200 hover:border-yellow-400/60 hover:shadow-2xl transition-[border-color,box-shadow]">
                <motion.div
                  className="relative mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:rotate-[360deg] transition-transform duration-700"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                >
                  <stat.icon className="h-8 w-8" />
                </motion.div>
                <div className="relative text-4xl font-extrabold text-prachetas-black mb-2 tabular-nums">
                  <CountUp to={stat.value} format={stat.format} />
                </div>
                <div className="relative text-xl font-semibold text-amber-500 mb-3">{stat.label}</div>
                <p className="relative text-prachetas-medium-gray">{stat.description}</p>
              </SpotlightCard>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative py-20 bg-gray-950 overflow-hidden">
        <Sparkles count={18} />
        <div className="relative container mx-auto px-4">
          <SectionTitle dark eyebrow="🌟 Transformation" title="Success" highlight="Stories" subtitle="Real stories of transformation and hope from the communities we serve" />
          <Stagger className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" gap={0.15}>
            {successStories.map((story, index) => (
              <StaggerItem key={`${story.name}-${index}`}>
                <Tilt max={7} className="group relative h-full bg-white/5 border border-white/10 hover:border-yellow-400/50 rounded-2xl overflow-hidden shadow-xl transition-colors">
                  <div className="relative overflow-hidden">
                    <img src={story.image} alt={story.name} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                    <Shine />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{story.name}</h3>
                    <p className="text-prachetas-yellow text-sm mb-4 font-medium">{story.location}</p>
                    <p className="text-gray-400 mb-5">{story.description}</p>
                    <div className="relative overflow-hidden bg-prachetas-yellow/10 border border-prachetas-yellow/30 p-3 rounded-lg">
                      <Shimmer />
                      <p className="relative text-prachetas-yellow font-semibold">{story.achievement}</p>
                    </div>
                  </div>
                </Tilt>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="📄 Open Books"
            title="Transparency"
            subtitle="We maintain complete transparency in our operations and fund utilization. View our annual reports to learn more about our impact."
          />
          <Stagger className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" gap={0.12}>
            {["2024-25", "2023-24", "2022-23"].map((year) => (
              <SpotlightCard key={year} className="bg-white p-7 rounded-2xl shadow-md border border-gray-200 hover:border-yellow-400/60 hover:shadow-2xl transition-[border-color,box-shadow] text-center">
                <h3 className="relative text-amber-500 font-extrabold mb-2 text-2xl">{year}</h3>
                <p className="relative text-prachetas-medium-gray mb-5">Annual Impact Report</p>
                <Button variant="outline" className="relative w-full border-prachetas-yellow text-amber-600 hover:bg-prachetas-yellow hover:text-prachetas-black">
                  Download PDF
                </Button>
              </SpotlightCard>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        title="Help Us Create More"
        highlight="Impact"
        icon={<Heart className="h-9 w-9" fill="currentColor" />}
        text={<p>Your support enables us to reach more communities and create lasting change. Join us in our mission.</p>}
        primary={{ to: "/donate", label: "Make a Donation" }}
        secondary={{ to: "/volunteer", label: "Volunteer With Us" }}
      />

      <Footer />
    </div>
  );
};

export default ImpactPage;
