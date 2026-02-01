import Header from "../components/Header";
import Footer from "../components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-prachetas-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-prachetas-yellow">
              Refunds and Cancellations
            </h1>
            <p className="text-gray-300">Our policy on donation refunds and cancellations</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Main Content */}
            <div className="mb-8">
              <p className="text-prachetas-medium-gray leading-relaxed mb-6">
                Prachetas Foundation currently accepts donations through its Online Payment Gateway Facility for various charitable / social purposes. Any payment made multiple times due to error, or any other kind of erroneous payment may be brought to the notice of the Site officials and the payment would be refunded if the Site official is satisfied with the cause and/or reason of error by the payee.
              </p>
              
              <p className="text-prachetas-medium-gray leading-relaxed mb-6">
                All donations and/or payment made through the Site, the acceptance of the same is at the sole discretion of the management and its trustees. The management reserves its sole rights to accept or cancel any donation and/or payment without assigning any reason thereof.
              </p>
              
              <p className="text-prachetas-medium-gray leading-relaxed">
                Please note that donations once made cannot be charged back, except in cases of fraudulent use, once investigation is carried out by necessary governmental / Bank authorities and proofs substantiated. In case any donation receipt is issued against the same, that shall stand cancelled, and any income tax benefit so derived shall be null and void.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
