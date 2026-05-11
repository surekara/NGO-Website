import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Heart, HandHelping, ArrowRight, UtensilsCrossed, HeartPulse } from "lucide-react";

const ProgramsSection = () => {
  const programs = [
    {
      id: 1,
      title: "Education",
      description: "Our youth empowerment program focuses on imparting human value-based education inspired by Vedic wisdom. By instilling positive values and life skills, we aim to steer young minds away from negative influences and empower them to become leaders for tomorrow",
      icon: BookOpen,
      category: "Education",
      link: "/programs/education",
      backgroundImage: "/Copy of IMG-20250610-WA0013.jpg"
    },
    {
      id: 2,
      title: "Food Distribution",
      description: "We believe that access to nutritious food is a fundamental human right. Through our food distribution program, we aim to alleviate hunger and malnutrition in our community by providing wholesome meals to those in need.",
      icon: Heart,
      category: "Food Distribution",
      link: "/programs/food-distribution",
      backgroundImage: "/fooddistribution.png"
    },
    {
      id: 3,
      title: "Wellness",
      description: "At Prachetas, we believe true well-being begins with balance. We organize free yoga sessions, health camps, and wellness programs to promote physical and mental wellness. Rooted in holistic practices and Vedic wisdom, our initiatives help individuals lead healthier, more balanced lives.",
      icon: HeartPulse,
      category: "Wellness",
      link: "/programs/wellness",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg"
    }
  ];

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors" id="programs">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-prachetas-black dark:text-white">Our Programs</h2>
          <p className="text-prachetas-medium-gray dark:text-gray-400 text-lg">
            Making a meaningful impact through targeted initiatives in education, healthcare, and community development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={program.backgroundImage}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-prachetas-yellow text-black text-xs font-bold px-3 py-1 rounded-full">
                    <program.icon className="h-3.5 w-3.5" />
                    {program.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{program.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">{program.description}</p>
                <Button
                  asChild
                  className="w-full bg-black text-prachetas-yellow hover:bg-gray-900 transition-colors font-semibold"
                >
                  <Link to={program.link} className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            asChild 
            size="lg"
            className="bg-prachetas-black text-prachetas-yellow hover:bg-prachetas-dark-gray transition-colors px-8 py-6 text-lg font-semibold"
          >
            <Link to="/programs">
              View All Programs <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
