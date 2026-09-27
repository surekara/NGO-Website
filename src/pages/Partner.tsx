import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, BookOpen, Heart, Utensils, Target, Building, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Shine, SpotlightCard, Stagger } from "@/components/motion";
import { CTASection, PageHero, SectionTitle } from "@/components/PageFx";

const PartnerPage = () => {
  const upcomingEvents = [
    {
      id: "education-drive-sep",
      title: "Education Drive - September",
      date: "September 15, 2025",
      location: "Mumbai, Maharashtra",
      type: "Education",
      icon: BookOpen,
      volunteers: 25,
      description: "Help distribute educational materials and conduct learning sessions for underprivileged children.",
      impact: "500+ children will benefit",
      partnerOpportunities: ["Sponsor educational materials", "Provide venue support", "Expert mentors"]
    },
    {
      id: "health-camp-oct",
      title: "Community Health Camp",
      date: "October 8, 2025",
      location: "Pune, Maharashtra",
      type: "Healthcare",
      icon: Heart,
      volunteers: 15,
      description: "Assist in organizing health checkups and awareness sessions for rural communities.",
      impact: "1000+ people will receive healthcare",
      partnerOpportunities: ["Medical equipment sponsorship", "Healthcare professional volunteers", "Transportation support"]
    },
    {
      id: "food-distribution-aug",
      title: "Monthly Food Distribution",
      date: "August 20, 2025",
      location: "Delhi, India",
      type: "Food Security",
      icon: Utensils,
      volunteers: 30,
      description: "Help prepare and distribute nutritious meals to homeless individuals and families.",
      impact: "2000+ meals will be distributed",
      partnerOpportunities: ["Food ingredient sponsorship", "Kitchen facility support", "Distribution network"]
    },
    {
      id: "youth-workshop-nov",
      title: "Youth Empowerment Workshop",
      date: "November 12, 2025",
      location: "Bangalore, Karnataka",
      type: "Youth Development",
      icon: Users,
      volunteers: 20,
      description: "Mentor young adults in skill development and career guidance sessions.",
      impact: "200+ youth will gain new skills",
      partnerOpportunities: ["Industry expert speakers", "Training material support", "Job placement assistance"]
    }
  ];

  const partnershipTypes = [
    {
      title: "Corporate Sponsorship",
      icon: Building,
      description: "Partner with us through financial support and employee volunteer programs.",
      benefits: ["Tax benefits", "CSR compliance", "Brand visibility", "Employee engagement"]
    },
    {
      title: "Strategic Partnership",
      icon: Handshake,
      description: "Long-term collaboration for sustained community impact and development.",
      benefits: ["Joint program development", "Resource sharing", "Expertise exchange", "Impact measurement"]
    },
    {
      title: "Resource Partnership",
      icon: Target,
      description: "Contribute resources, facilities, or expertise to support our initiatives.",
      benefits: ["In-kind contributions", "Facility sharing", "Expert volunteers", "Technical support"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-clip">
      <Header />

      <PageHero
        eyebrow="🤝 Stronger Together"
        title="Partner"
        highlight="With Us"
        image="/collaborations/ramnadi-mula-nature-walk/community-meal.jpg"
        wave="text-white"
        subtitle={<p>Join hands with PRACHETAS to create lasting social impact. Explore our upcoming events and partnership opportunities.</p>}
      />

      {/* Partnership Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="Partnership" highlight="Opportunities" />
            <Stagger className="grid md:grid-cols-3 gap-8 mb-8" gap={0.15}>
              {partnershipTypes.map((type) => (
                <SpotlightCard key={type.title} className="rounded-2xl">
                <Card className="relative h-full bg-transparent hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-prachetas-yellow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-prachetas-yellow text-prachetas-black p-3 rounded-lg shadow-lg shadow-yellow-400/30 group-hover:rotate-[360deg] transition-transform duration-700">
                        <type.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl text-prachetas-black">{type.title}</CardTitle>
                    </div>
                    <CardDescription className="text-prachetas-medium-gray text-base">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-prachetas-black mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {type.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center space-x-2 text-prachetas-medium-gray">
                            <span className="w-2 h-2 bg-prachetas-yellow rounded-full"></span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                </SpotlightCard>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle eyebrow="📅 On The Calendar" title="Upcoming" highlight="Events" subtitle="Support our upcoming initiatives through partnership and collaboration" />
            <Stagger className="grid md:grid-cols-2 gap-8" gap={0.12}>
              {upcomingEvents.map((event) => (
                <SpotlightCard key={event.id} className="rounded-2xl">
                <Card className="relative h-full bg-white/90 hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-prachetas-yellow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-prachetas-yellow text-prachetas-black p-2 rounded-lg">
                          <event.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-prachetas-black">{event.title}</CardTitle>
                          <CardDescription className="text-prachetas-medium-gray">{event.type}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-prachetas-medium-gray mb-4">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-prachetas-medium-gray mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-prachetas-yellow" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-prachetas-yellow" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-prachetas-yellow" />
                        <span>{event.impact}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-prachetas-black mb-2">Partnership Opportunities:</h4>
                      <ul className="space-y-1">
                        {event.partnerOpportunities.map((opportunity) => (
                          <li key={opportunity} className="flex items-center space-x-2 text-sm text-prachetas-medium-gray">
                            <span className="w-1.5 h-1.5 bg-prachetas-yellow rounded-full"></span>
                            <span>{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-center">
                      <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          asChild
                          className="relative overflow-hidden bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow px-8"
                        >
                          <Link to="/volunteer"><Shine /><span className="relative">Volunteer</span></Link>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
                </SpotlightCard>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to"
        highlight="Partner?"
        icon={<Handshake className="h-9 w-9" />}
        text={<p>Let's discuss how we can work together to create meaningful impact in communities.</p>}
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/donate", label: "Support Our Cause" }}
      />

      <Footer />
    </div>
  );
};

export default PartnerPage;
