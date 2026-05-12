import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Target } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

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

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-gray-950 dot-grid relative overflow-hidden transition-colors" id="about">
      {/* Animated decorative blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Badge + heading */}
          <div className="text-center mb-14">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/30 text-yellow-700 dark:text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 hover:bg-yellow-100 dark:hover:bg-yellow-400/20 transition-colors cursor-default">
              🏛️ Who We Are
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              About <span className="text-gradient-yellow">PRACHETAS</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 dark:text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Dedicated to creating positive change through education, healthcare, and community development initiatives
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Left: mission + CTAs */}
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="relative bg-gray-950 dark:bg-gray-900 p-8 rounded-2xl border-l-4 border-yellow-400 shadow-xl hover:shadow-2xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                    <Target size={18} className="text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400">Our Mission</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-[15px]">
                  Our mission is to empower communities through a holistic approach that combines sustainable development, quality education, and accessible healthcare. We are dedicated to creating lasting opportunities for growth, fostering resilience, and facilitating positive transformation for both individuals and society as a whole.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button asChild
                  className="bg-yellow-400 text-black hover:bg-yellow-300 transition-all font-bold px-7 py-5 rounded-xl btn-glow hover:scale-105 transform">
                  <Link to="/about" className="flex items-center gap-1">
                    Learn More <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline"
                  className="border-2 border-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-yellow-400 hover:text-yellow-500 transition-all font-semibold px-7 py-5 rounded-xl hover:scale-105 transform">
                  <Link to="/about#team" className="flex items-center gap-1">
                    Meet Our Team <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: image with decorative frame */}
            <motion.div
              variants={itemVariants}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute -top-4 -left-4 w-full h-full border-2 border-yellow-400/30 rounded-2xl pointer-events-none"
                animate={{
                  rotate: [-2, 0, -2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-full h-full border-2 border-yellow-400/10 rounded-2xl pointer-events-none"
                animate={{
                  rotate: [2, 0, 2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <img
                src="/Copy of WhatsApp Image 2025-02-26 at 15.41.35 (1).jpeg"
                alt="PRACHETAS Foundation community work"
                loading="eager"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              {/* Floating badge on image */}
              <motion.div
                className="absolute bottom-5 left-5 bg-black/80 backdrop-blur-sm border border-yellow-400/40 text-white text-xs font-semibold px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                🌟 Est. 2022 · Pune, Maharashtra
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
