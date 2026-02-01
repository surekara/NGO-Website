import Header from "../components/Header";
import Footer from "../components/Footer";

const WellnessProgram = () => {
  const galleryImages = [
    { src: "/wellness-1.png", caption: "" },
    { src: "/wellness-2.png", caption: "" },
    { src: "/wellness-3.png", caption: "" },
    { src: "/wellness-4.png", caption: "" },
    { src: "/wellness-5.png", caption: "" },
    { src: "/wellness-6.png", caption: "" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-prachetas-yellow py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Hexagonal Image */}
            <div className="relative w-64 h-64 flex-shrink-0">
              <div className="hexagon-container">
                <img
                  src="/wellness-hero.png"
                  alt="Wellness Program"
                  className="hexagon-image"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-prachetas-black">
                WELLNESS
              </h1>
              <p className="text-xl text-prachetas-black leading-relaxed">
                At Prachetas, we believe true well-being begins with balance. We organize free yoga sessions, health camps, and wellness programs to promote physical and mental wellness. Rooted in holistic practices and Vedic wisdom, our initiatives help individuals lead healthier, more balanced lives. Through yoga, naturopathy, mindfulness, and sustainable living workshops, we empower communities to heal naturally without dependency on medicines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-prachetas-black py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-64 object-cover rounded"
                  />
                </div>
                <p className="text-white text-lg font-semibold italic">
                  {image.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        .hexagon-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .hexagon-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          border: 8px solid white;
        }
      `}</style>
    </div>
  );
};

export default WellnessProgram;
