import Header from "../components/Header";
import Footer from "../components/Footer";

const EducationProgram = () => {
  const galleryImages = [
    { src: "/education-1.png", caption: "Value-Based Education Seminar" },
    { src: "/education-2.png", caption: "Certificate Distribution" },
    { src: "/education-3.png", caption: "Group Discussions" },
    { src: "/education-4.png", caption: "Interactive Learning Sessions" },
    { src: "/education-5.png", caption: "Youth Empowerment Seminars" },
    { src: "/education-6.png", caption: "Student Engagement Programs" },
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
                  src="/education-hero.png"
                  alt="Education Program"
                  className="hexagon-image"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-prachetas-black">
                EDUCATION
              </h1>
              <p className="text-xl text-prachetas-black leading-relaxed">
                Our youth empowerment program focuses on imparting human value-based education inspired by Vedic wisdom. By instilling positive values and life skills, we aim to steer young minds away from negative influences and empower them to become leaders for tomorrow
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

export default EducationProgram;
