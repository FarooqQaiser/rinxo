import {
  ArrowRight,
  BarChart3,
  Headphones,
  TrendingUp,
  Award,
  Shield,
  Unlock,  Monitor, Smartphone, Globe, Apple, Download, 
  Chrome
} from "lucide-react";

import instrument1 from "../../assets/images/landingPage/trade-instruments-1.png";
import instrument2 from "../../assets/images/landingPage/trade-instruments-2.png";
import tradingApp from "../../assets/images/landingPage/tradingApp.png";
import stars from "../../assets/images/landingPage/stars.png";
import rocket from "../../assets/images/landingPage/rocket.png";
import diamond from "../../assets/images/landingPage/diamond.png";
import Button from "../common/Button/Button";
import { Link } from "react-router-dom";
import desktopImg from "../../assets/images/landingPage/desktopMT5.png";
import mobileImg from "../../assets/images/landingPage/mobile-group-icon.webp";
import webImg from "../../assets/images/landingPage/web.webp";
import { useState } from "react";


// Hero Section

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#0A0A14] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.08),transparent_55%)]" />

      <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
          data-aos="fade-up"
        >
          Your Gateway to <br />
          Profitable <span className="text-yellow-400">Forex Trading</span>
        </h1>

        {/* Description */}
        <p
          className="max-w-3xl mx-auto text-gray-400 text-sm md:text-base mb-10"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Unlock the world of Forex trading with Rinxo. Experience seamless
          trading on our platform, equipped with powerful tools, educational
          resources, and expert support. Start your journey to financial success
          today.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Button
            btnName="Start Trading"
            locationHref="/login"
            extraCss="flex items-center gap-2 px-8 py-3 rounded-lg"
            bgColour="bg-yellow-400"
            textColour="text-gray-900"
            hoverBgColour="hover:bg-yellow-500 transition"
            fontTextStyle="font-semibold"
          >
            <ArrowRight size={18} />
          </Button>

          <Button
            btnName="Try Demo Account"
            locationHref="/register"
            extraCss="px-8 py-3 rounded-lg border border-gray-700"
            bgColour="bg-gray-800"
            textColour="text-white"
            hoverBgColour="hover:bg-gray-700 transition"
            fontTextStyle="font-semibold"
          />
        </div>

        {/* Bottom Stats Bar */}
        <div
          className="max-w-6xl mx-auto rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <Stat
            icon={<ArrowRight className="text-yellow-400" />}
            title="No Minimum Deposit"
          />
          <Stat
            icon={<BarChart3 className="text-yellow-400" />}
            title="950+"
            subtitle="Trading Instruments"
          />
          <Stat
            icon={<TrendingUp className="text-yellow-400" />}
            title="0.2"
            subtitle="Spreads from 0.2 points"
          />
          <Stat
            icon={<Headphones className="text-yellow-400" />}
            title="24/7"
            subtitle="Customer Support"
          />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-400/10">
      {icon}
    </div>
    <div>
      <p className="font-semibold">{title}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

// Trading Instruments Section
const TradingInstruments = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[1240px] mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          data-aos="fade-up"
        >
          Trade 950+ Instruments
        </h2>

        <div className="flex flex-wrap lg:mx-4 mb-8">
          <div
            className="w-full md:w-1/3 px-4 mb-4 md:mb-0"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <InstrumentCard
              title="Stocks And Indices CFDs"
              description="Trade world's most popular stocks and indices"
              instruments={instrument1}
            />
          </div>
          <div
            className="w-full md:w-1/3 px-4 mb-4 md:mb-0"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <InstrumentCard
              title="Forex, Metals, Commodities"
              description="130+ leveraged CFD instruments"
              instruments={instrument1}
            />
          </div>
          <div
            className="w-full md:w-1/3 px-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <InstrumentCard
              title="Crypto"
              description="40+ crypto CFDs: BTC, ETH and more"
              instruments={instrument2}
            />
          </div>
        </div>

        <div className="text-center" data-aos="fade-up" data-aos-delay="400">
          <Button
            btnName="See All Product"
            locationHref="/"
            extraCss="px-8 py-3 rounded border border-gray-900"
            bgColour=""
            textColour="text-black"
            hoverBgColour="hover:bg-gray-900 hover:text-white transition-colors"
            fontTextStyle="font-semibold"
          />
        </div>
      </div>
    </section>
  );
};

const InstrumentCard = ({ title, description, instruments }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between bg-gray-50 rounded hover:bg-gray-100">
      <img src={instruments} alt={title} className="p-4" />
    </div>

    <div className="border-t p-6">
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

// Platform Features Section

const PlatformFeatures = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:mx-8 mx-4 items-start lg:items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Trade with World's Leading MetaTrader 5 Platform
            </h2>
            <p className="text-gray-600 mb-8">
              Experience seamless trading with the world's leading MetaTrader 5
              platform. Access a multitude of markets, manage your accounts
              effortlessly, and unlock trading opportunities with advanced tools
              and indicators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link data-aos="fade-up" data-aos-delay="200">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-12"
                />
              </Link>
              <Link data-aos="fade-up" data-aos-delay="300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-12"
                />
              </Link>
            </div>
          </div>

          {/* Center Image */}
          <div
            className="flex justify-center"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <img
              src={tradingApp}
              className="w-[299px] sm:w-[350px] md:w-[400px] lg:w-[299px]"
              alt="Trading App"
            />
          </div>

          {/* Right Features */}
          <div className="grid gap-6">
            <FeatureItem
              icon={<Award className="text-gray-600" size={32} />}
              title="Access A Multitude Of Markets"
              description="Efficiently explore a wide range of trading instruments"
              aosDelay={500}
            />
            <FeatureItem
              icon={<Shield className="text-gray-600" size={32} />}
              title="Simplified Account Management"
              description="Customize your settings and fund your account with ease"
              aosDelay={600}
            />
            <FeatureItem
              icon={<Unlock className="text-gray-600" size={32} />}
              title="Unlock Trading Opportunities"
              description="Employ powerful charts and indicators to spot lucrative trades"
              aosDelay={700}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, description, aosDelay }) => (
  <div data-aos="fade-up" data-aos-delay={aosDelay}>
    <div className="flex mb-4">{icon}</div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// Account Types Section
const AccountTypes = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1240px] mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          data-aos="fade-up"
        >
          Account Types comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:mx-8 mx-4 gap-8">
          <AccountCard
            icon={stars}
            title="Classic"
            description="Spreads from 0.2 pips"
            aos="fade-up"
            delay={100}
          />
          <AccountCard
            icon={rocket}
            title="Razor"
            description="Spreads from 0.0 pips + Commission"
            highlighted
            aos="zoom-in"
            delay={200}
          />
          <AccountCard
            icon={diamond}
            title="VIP"
            description="Enjoy Premium Service and Tighter Spreads"
            aos="fade-up"
            delay={300}
          />
        </div>
      </div>
    </section>
  );
};

const AccountCard = ({ icon, title, description, highlighted, aos, delay }) => (
  <div
    data-aos={aos}
    data-aos-delay={delay}
    className={`bg-white p-5 rounded-lg shadow-sm border 
    transform transition-all duration-300 ease-out will-change-transform
    
    ${
      highlighted
        ? "border-yellow-400 ring-2 ring-yellow-400"
        : "border-gray-200"
    }`}
  >
    <div className="text-4xl mb-4">
      <img src={icon} alt={title} />
    </div>

    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>

    <Button
      btnName="Learn More"
      locationHref="/"
      extraCss="flex items-center gap-2"
      bgColour=""
      textColour="text-gray-900"
      hoverBgColour="hover:text-yellow-500 transition-colors duration-300"
      fontTextStyle="font-semibold"
    >
      <ArrowRight size={18} />
    </Button>
  </div>
);

// metatradertabs section

const tabs = [
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    image: mobileImg,
    buttons: [
      { label: "App Store", icon: Apple },
      { label: "Google Play", icon: Smartphone },
    ],
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    image: desktopImg,
    buttons: [
      { label: "MacBook", icon: Apple },
      { label: "Windows", icon: Monitor },
    ],
  },
  {
    id: "web",
    label: "Web",
    icon: Globe,
    image: webImg,
    buttons: [
      { label: "Trade on Browser", icon: Chrome },
    ],
  },
];

const MetaTraderTabs = () => {
  const [activeTab, setActiveTab] = useState("desktop");

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <section className="bg-yellow-400 py-20 ">
      <div className="max-w-5xl mx-auto px-4 text-center">

        {/* Heading */}
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          data-aos="fade-up"
        >
          Explore Markets with MetaTrader 5
        </h2>

        <p
          className="text-gray-800 max-w-3xl mx-auto mb-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Join millions of traders who trust MetaTrader 5 for advanced trading,
          technical analysis, and Expert Advisors.
        </p>

        {/* Tabs */}
        <div
          className="inline-flex bg-white rounded-full p-1 mb-12 shadow"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Image */}
        <div
          className="flex justify-center mb-10"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <img
            src={currentTab.image}
            alt={currentTab.label}
            className="max-w-full md:max-w-2xl"
          />
        </div>

        {/* Dynamic Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          {currentTab.buttons.map((btn, index) => {
            const Icon = btn.icon;
            return (
              <button
                key={index}
                data-aos="fade-up"
                data-aos-delay={400 + index * 100}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg
                           transition-transform duration-300 ease-out hover:-translate-y-1
                           will-change-transform hover:bg-gray-900"
              >
                <Icon size={18} />
                {btn.label}
                <Download size={16} />
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};



export default HeroSection;
export { TradingInstruments, PlatformFeatures, AccountTypes,MetaTraderTabs };
