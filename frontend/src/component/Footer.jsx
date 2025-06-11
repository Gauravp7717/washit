import { Waves, Facebook, Twitter, Instagram, Mail, Send } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Services: [
      "Wash & Fold",
      "Dry Cleaning",
      "Express Service",
      "Business Solutions",
      "Specialty Care",
    ],
    Company: ["About Us", "Careers", "Blog", "Partner With Us", "Locations"],
    Support: [
      "FAQs",
      "Contact Us",
      "Terms of Service",
      "Privacy Policy",
      "Shipping Policy",
    ],
    Connect: ["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube"],
  };

  return (
    <footer className="bg-gray-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Newsletter Section */}
        <div className="max-w-xl mx-auto text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-400 mb-6">
            Stay updated with our latest services and offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center">
              Subscribe <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-lg mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media and Copyright */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Waves className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold ml-2">Washit</span>
            </div>
            <div className="flex space-x-6">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Mail className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          <div className="text-center mt-6 text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} FreshPress. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <span className="mx-2">·</span>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
              <span className="mx-2">·</span>
              <a href="#" className="hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
