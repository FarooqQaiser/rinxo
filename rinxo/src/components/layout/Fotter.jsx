import { Linkedin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-[1240px] mx-auto px-4 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold tracking-wide">
              RIN<span className="text-yellow-400">X</span>O
            </h2>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed max-w-sm">
              Bridging strategy with opportunity, turning precision into
              success and excellence into profitability.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Trading */}
          <div>
            <h4 className="font-semibold mb-4">Trading</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Market Overview</li>
              <li>Forex</li>
              <li>Crypto</li>
              <li>Stocks</li>
              <li>Indices</li>
              <li>Commodities</li>
            </ul>
          </div>

          {/* Accounts & Services */}
          <div>
            <h4 className="font-semibold mb-4">Accounts & Services</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Trading Accounts</li>
              <li>Deposit And Withdrawal</li>
              <li>Help Center</li>
            </ul>
          </div>

          {/* Tools & Education */}
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>Economic Calendar</li>
              <li>Calculators</li>
            </ul>

            <h4 className="font-semibold mb-2">Education</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Blogs</li>
            </ul>
          </div>

          {/* Company & Promotions */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>Why Rinxo</li>
              <li>About Us</li>
              <li>Regulation</li>
              <li>Contact Us</li>
            </ul>

            <h4 className="font-semibold mb-2">Promotions</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>Level Up</li>
            </ul>

            <h4 className="font-semibold mb-2">Partner</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Join Partner Program</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-xs text-gray-500 leading-relaxed space-y-3">
          <p>
            Rinxo LTD is registered at the International Business Companies (IBC)
            of Saint Lucia with Registration Number 2023-00658.
          </p>
          <p>
            Restricted Regions: RINXO Limited does not provide services for the
            residents of certain countries, such as the United States of America,
            Dubai (UAE), North Korea, Iran, Cuba, Afghanistan, Israel and Canada
            or a country where such distribution or use would be contrary to
            local law or regulation.
          </p>
          <p>
            Risk Disclosure / Risk Disclaimer: Trading Forex and Leveraged
            Financial Instruments involves significant risk and can result in
            the loss of your invested capital. You should not invest more than
            you can afford to lose. Trading leveraged products may not be
            suitable for all investors. Past performance is no guarantee of
            future results.
            <span className="text-blue-600 cursor-pointer ml-1">Learn more.</span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-black">Risk Disclosure</span>
            <span className="cursor-pointer hover:text-black">AML Policy</span>
            <span className="cursor-pointer hover:text-black">Privacy Policy</span>
            <span className="cursor-pointer hover:text-black">Leverage Disclaimer</span>
          </div>
          <div>© 2025 Rinxo</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
