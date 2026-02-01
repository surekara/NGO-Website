import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-prachetas-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-prachetas-yellow">
              Privacy Policy
            </h1>
            <p className="text-gray-300">Your privacy is important to us</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-prachetas-medium-gray leading-relaxed mb-4">
                This privacy notice applies solely to information collected by www.pracheta.in website and will notify you of the following:
              </p>
              <ul className="list-disc list-inside text-prachetas-medium-gray leading-relaxed space-y-2 ml-4">
                <li>What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.</li>
                <li>What choices are available to you regarding the use of your data.</li>
                <li>The security procedures in place to protect the misuse of your information.</li>
                <li>How you can correct any inaccuracies in the information.</li>
              </ul>
            </div>

            {/* Information Collection, Use, and Sharing */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Information Collection, Use, and Sharing</h2>
              <p className="text-prachetas-medium-gray leading-relaxed mb-4">
                We are the sole owners of the information collected on this site. We only have access to collect information that you voluntarily give us via email or other direct contact from you. We will not sell or rent this information to anyone.
              </p>
              <p className="text-prachetas-medium-gray leading-relaxed mb-4">
                We will use your information to respond to you, regarding the reason you contacted us. We will not share your information with any third party outside of our organization, other than as necessary to fulfil your request, e.g. to ship an order.
              </p>
              <p className="text-prachetas-medium-gray leading-relaxed">
                Unless you ask us not to, we may contact you via email in the future to tell you about specials, new products or services, or changes to this privacy policy.
              </p>
            </div>

            {/* Your Access to and Control Over Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Your Access to and Control Over Information</h2>
              <p className="text-prachetas-medium-gray leading-relaxed mb-4">
                You may opt out of any future contacts from us at any time. You can do the following at any time by contacting us via the email address or phone number given on our website:
              </p>
              <ul className="list-disc list-inside text-prachetas-medium-gray leading-relaxed space-y-2 ml-4">
                <li>See what data we have about you, if any.</li>
                <li>Change/correct any data we have about you.</li>
                <li>Have us delete any data we have about you.</li>
                <li>Express any concern you have about our use of your data.</li>
              </ul>
            </div>

            {/* Security */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Security</h2>
              <p className="text-prachetas-medium-gray leading-relaxed mb-4">
                We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline.
              </p>
              <p className="text-prachetas-medium-gray leading-relaxed">
                While we use encryption to protect sensitive information transmitted online, we also protect your information offline. Only employees who need the information to perform a specific job (for example, billing or customer service) are granted access to personally identifiable information. The computer servers in which we store personally identifiable information are kept in a highly secure environment.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-prachetas-black mb-4">Contact Information</h2>
              <p className="text-prachetas-medium-gray leading-relaxed">
                If you feel that we are not abiding by this privacy policy, you should contact our business head immediately via email at{" "}
                <a href="mailto:prachetasfoundation@gmail.com" className="text-prachetas-yellow hover:underline">
                  prachetasfoundation@gmail.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
