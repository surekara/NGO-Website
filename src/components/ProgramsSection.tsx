import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Heart, HandHelping, ArrowRight, UtensilsCrossed, HeartPulse } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ProgramsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors" id="programs">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-prachetas-black dark:text-white">Our Programs</h2>
          <p className="text-prachetas-medium-gray dark:text-gray-400 text-lg">
            Making a meaningful impact through targeted initiatives in education, healthcare, and community development
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              variants={cardVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
              whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <motion.img
                  src={program.backgroundImage}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <motion.span
                    className="inline-flex items-center gap-1.5 bg-prachetas-yellow text-black text-xs font-bold px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    <program.icon className="h-3.5 w-3.5" />
                    {program.category}
                  </motion.span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{program.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">{program.description}</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="w-full bg-black text-prachetas-yellow hover:bg-gray-900 transition-colors font-semibold"
                  >
                    <Link to={program.link} className="flex items-center justify-center gap-2">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="bg-prachetas-black text-prachetas-yellow hover:bg-prachetas-dark-gray transition-colors px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <Link to="/programs">
                View All Programs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
