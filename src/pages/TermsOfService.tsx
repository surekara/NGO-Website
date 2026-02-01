import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-prachetas-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-prachetas-yellow">
              Terms and Conditions
            </h1>
            <p className="text-gray-300">Last Revised: January 31st, 2025</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Ownership */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Ownership</h2>
              <p className="text-prachetas-medium-gray leading-relaxed">
                The website www.pracheta.in (The "SITE") is fully owned by Prachetas Foundation.
              </p>
            </div>

            {/* Agreement to Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Agreement to Terms</h2>
              <p className="text-prachetas-medium-gray leading-relaxed mb-4">
                Your use of the Site is governed by the policies, terms, and conditions set forth below. Please read the following information carefully. By using this Site or donating through the site, you indicate your acceptance of, and agreement to be bound by, the terms set forth below.
              </p>
              <p className="text-prachetas-medium-gray leading-relaxed">
                If you do not agree to these terms and conditions, please do not use this Site.
              </p>
            </div>

            {/* Amendments to Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Amendments to Terms</h2>
              <p className="text-prachetas-medium-gray leading-relaxed mb-4">
                These terms and conditions may be changed by Prachetas Foundation in the future. It is your responsibility as a user to periodically return to this page to review the terms and conditions for amendments. The amended terms shall take effect automatically the day they are posted on the site. Your continued use of the web site following any amendments will constitute agreement to such amendments.
              </p>
              <p className="text-prachetas-medium-gray leading-relaxed font-semibold">
                Last Revised: January 31st, 2025
              </p>
            </div>

            {/* Acceptance and Remedy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Acceptance and Remedy</h2>
              <p className="text-prachetas-medium-gray leading-relaxed">
                Your continued usage of the site shall be in acceptance to the terms that may be updated in future with retrospective effect. In case you do not agree to any terms, your sole remedy is to stop using the website.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
