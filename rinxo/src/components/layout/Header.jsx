import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Rocket,
  DollarSign,
  Bitcoin,
  BarChart3,
  TrendingUpIcon,
  Package,
  Headphones,
  ShieldCheck,
  Info,
  HelpCircle
} from "lucide-react";
import Button from "../common/Button/Button";
import { PORTAL_URL } from "../../../src/config";
import { Link } from "react-router-dom";

/* ---------------- Dropdown Wrapper ---------------- */
const DropdownMenu = ({ title, isOpen, onOpen, onClose, children }) => (
  <div
    className="relative"
    onMouseEnter={onOpen}
    onMouseLeave={onClose}
  >
    <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
      {title}
      <ChevronDown
        size={16}
        className={`transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    <div
      className={`absolute left-1/2 top-full mt-3 transform -translate-x-1/2
      transition-all duration-300 ease-out
      ${isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
      bg-white rounded-xl shadow-2xl z-50`}
    >
      {children}
    </div>
  </div>
);

/* ---------------- Dropdown Item ---------------- */
const DropdownItem = ({ icon, title, description }) => (
  <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
    <div className="shrink-0 my-auto">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
);

/* ---------------- Trading Dropdown ---------------- */

const CompanyDropdown = () => (
  <div className="grid  gap-8 p-6 w-[30vw] max-w-4xl">
    <div className="space-y-4">
      <DropdownItem
        icon={<HelpCircle className="w-5 h-5 text-yellow-500" />}
        title="Why Rinxo"
        description="Explore the world of trading with Rinxo where strategy meets success."
      />

      <DropdownItem
        icon={<Info className="w-5 h-5 text-yellow-500" />}
        title="About Us"
        description="Learn about company’s vision, mission, history, and global reach."
      />

      <DropdownItem
        icon={<ShieldCheck className="w-5 h-5 text-yellow-500" />}
        title="Regulation"
        description="Learn more about our company’s regulation and commitment to transparency."
      />

      <DropdownItem
        icon={<Headphones className="w-5 h-5 text-yellow-500" />}
        title="Contact Us"
        description="Connect with our 24/7 customer support via chat, call, or email."
      />
    </div>
  </div>
);

/* ---------------- Trading Dropdown ---------------- */
const TradingDropdown = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 w-[90vw] max-w-4xl">
    <div className="space-y-4">
      <DropdownItem
        icon={<Rocket className=" text-yellow-500"/>}
        title="Market Overview"
        description="Trade stocks, forex & crypto with ease."
      />
      <DropdownItem
        icon={<DollarSign className=" text-yellow-500"/>}
        title="Forex"
        description="50+ global currency pairs."
      />
      <DropdownItem
        icon={<Bitcoin className=" text-yellow-500"/>}
        title="Crypto"
        description="Popular digital assets."
      />
      <DropdownItem
        icon={<BarChart3 className=" text-yellow-500"/>}
        title="Stocks"
        description="800+ international stocks."
      />
      <DropdownItem
        icon={<TrendingUpIcon className=" text-yellow-500"/>}
        title="Indices"
        description="Top global indices."
      />
      <DropdownItem
        icon={<Package className=" text-yellow-500"/>}
        title="Commodities"
        description="Gold, oil & more."
      />
    </div>

    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">
        Try Demo Trading
      </h3>
      <p className="text-xs text-gray-600 mb-4">
        Practice trading risk-free with a demo account.
      </p>
      <button className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition">
        Try Demo
      </button>
    </div>
  </div>
);

/* ---------------- Mobile Item ---------------- */
const MobileItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-800 rounded"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-6 py-3 space-y-3">{children}</div>
      </div>
    </div>
  );
};

/* ---------------- Header ---------------- */
const Header = () => {
  const [active, setActive] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[#0A0A14] text-white sticky top-0 z-50 border-b-[1px] border-[#323232]">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          RIN<span className="text-yellow-400">X</span>O
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex gap-6 items-center">
          <DropdownMenu
            title="Trading"
            isOpen={active === "trading"}
            onOpen={() => setActive("trading")}
            onClose={() => setActive(null)}
          >
            <TradingDropdown />
          </DropdownMenu>


            <DropdownMenu
                title="Company"
                isOpen={active === "Company"}
                onOpen={() => setActive("Company")}
                onClose={() => setActive(null)}
            >
            <CompanyDropdown />
          </DropdownMenu>
          {["Tools", "Education", "Promotions"].map(item => (
            <button
              key={item}
              className="hover:text-yellow-400 transition"
            >
              {item}
            </button>
          ))}  
          <Button btnName="Login" locationHref={`${PORTAL_URL}/login`} extraCss="px-5 py-2 rounded  text-white ml-[50px] -mr-[10px]"  bgColour="bg-gray-800"  textColour="text-gray-900"  hoverBgColour="hover:bg-gray-700 transition" fontTextStyle="" />
          <Button btnName="Get Started" locationHref="/register" extraCss="px-5 py-2 rounded" bgColour="bg-yellow-400"  textColour="text-gray-900"  hoverBgColour="hover:bg-yellow-500 transition" fontTextStyle="font-semibold transition" />
          {/* <button className="px-5 py-2 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-500 transition">
            Get Started
          </button> */}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-2">
          <MobileItem title="Trading">
            <p className="text-sm text-gray-300">Forex</p>
            <p className="text-sm text-gray-300">Crypto</p>
            <p className="text-sm text-gray-300">Stocks</p>
          </MobileItem>

          {["Tools", "Education", "Company", "Promotions"].map(item => (
            <button
              key={item}
              className="w-full text-left px-4 py-3 hover:bg-gray-800 rounded"
            >
              {item}
            </button>
          ))}
           <Link to={"/login"}>
              <button className="w-full bg-yellow-400 text-gray-900 py-3 rounded font-semibold">
                Get Started
              </button>
           </Link>
          
        </div>
      )}
    </header>
  );
};

export default Header;
