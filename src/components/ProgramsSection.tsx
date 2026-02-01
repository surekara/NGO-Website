import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <section className="py-16 bg-gray-100" id="programs">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-prachetas-black">Our Programs</h2>
          <p className="text-prachetas-medium-gray text-lg">
            Making a meaningful impact through targeted initiatives in education, healthcare, and community development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <Card 
              key={program.id} 
              className="relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={program.backgroundImage}
                  alt={`${program.title} background`}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/60"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <CardHeader>
                  <div className="bg-prachetas-yellow text-prachetas-black w-14 h-14 flex items-center justify-center rounded-full mb-4 shadow-lg">
                    <program.icon className="h-7 w-7" />
                  </div>
                  <Badge className="mb-2 bg-prachetas-yellow text-prachetas-black hover:bg-yellow-300">
                    {program.category}
                  </Badge>
                  <CardTitle className="text-white text-2xl">{program.title}</CardTitle>
                  <CardDescription className="text-gray-200 text-base">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full border-2 border-prachetas-yellow bg-prachetas-yellow/20 text-white hover:bg-prachetas-yellow hover:text-prachetas-black transition-colors backdrop-blur-sm"
                  >
                    <Link to={program.link} className="flex items-center justify-center">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
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
