import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    quote: "The educational support from Prachetas Foundation has transformed our village school. The children now have access to quality learning materials and dedicated teachers.",
    name: "Priya Sharma",
    title: "School Principal",
    occupation: "Education Administrator, Pune",
    avatar: "/Copy of WhatsApp Image 2025-02-26 at 15.41.35 (1).jpeg"
  },
  {
    id: 2,
    quote: "The healthcare camp organized by Prachetas Foundation provided essential medical care to over 500 people in our community who otherwise wouldn't have access to these services.",
    name: "Dr. Rajesh Kumar",
    title: "Medical Volunteer",
    occupation: "Community Health Specialist",
    avatar: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg"
  },
  {
    id: 3,
    quote: "Thanks to the vocational training program by Prachetas Foundation, I was able to learn tailoring skills and now support my family with a steady income from my small business.",
    name: "Lakshmi Devi",
    title: "Program Beneficiary",
    occupation: "Small Business Owner & Tailor",
    avatar: "/Copy of WhatsApp Image 2025-02-26 at 15.50.55 (1).jpeg"
  },
  {
    id: 4,
    quote: "Volunteering with Prachetas Foundation has been a life-changing experience. The direct impact we make in communities gives me purpose and hope for a better future for all.",
    name: "Vikram Mehta",
    title: "Regular Volunteer",
    occupation: "IT Professional & Social Worker",
    avatar: "/Copy of WhatsApp Image 2025-02-27 at 16.15.54.jpeg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-950 dot-grid-dark relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-yellow-400/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            💬 Stories That Matter
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Making A <span className="text-gradient-yellow">Difference</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Hear stories from the communities we serve and those who help us fulfill our mission
          </p>
        </div>

        <Carousel
          className="w-full max-w-5xl mx-auto"
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.id} className="md:basis-1/2 pl-6">
                <div className="bg-white/5 border border-white/10 hover:border-yellow-400/40 rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-300 group">
                  {/* Large quote mark */}
                  <div>
                    <div className="text-6xl text-yellow-400/30 font-serif leading-none mb-2 group-hover:text-yellow-400/50 transition-colors">"</div>
                    <blockquote className="text-gray-300 text-[15px] leading-relaxed line-clamp-4 -mt-4">
                      {t.quote}
                    </blockquote>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/10">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-400/40"
                    />
                    <div>
                      <div className="font-semibold text-white text-sm">{t.name}</div>
                      <div className="text-yellow-400 text-xs font-medium">{t.title}</div>
                      <div className="text-gray-500 text-xs">{t.occupation}</div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex justify-center mt-8 gap-3">
            <CarouselPrevious className="relative bg-yellow-400 hover:bg-yellow-300 border-none text-black rounded-xl w-11 h-11" />
            <CarouselNext className="relative bg-yellow-400 hover:bg-yellow-300 border-none text-black rounded-xl w-11 h-11" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
