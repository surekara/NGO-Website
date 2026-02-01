import Header from "../components/Header";
import Footer from "../components/Footer";

const FoodDistributionProgram = () => {
  const galleryImages = [
    { src: "/food-1.png", caption: "Groups of labourers" },
    { src: "/food-2.png", caption: "Labour Adda Annadaan" },
    { src: "/food-3.png", caption: "At Hospital" },
    { src: "/food-4.png", caption: "Full Meals" },
    { src: "/food-5.png", caption: "Needy patients" },
    { src: "/food-6.png", caption: "Needy patients" },
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
                  src="/food-hero.png"
                  alt="Food Distribution Program"
                  className="hexagon-image"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-prachetas-black">
                FOOD DISTRIBUTION
              </h1>
              <p className="text-xl text-prachetas-black leading-relaxed">
                We believe that access to nutritious food is a fundamental human right. Through our food distribution program, we aim to alleviate hunger and malnutrition in our community by providing wholesome meals to those in need. Our initiatives focus on serving underprivileged communities, slum areas, patients, and the homeless with sanctified, nourishing meals prepared with care and compassion.
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

export default FoodDistributionProgram;
