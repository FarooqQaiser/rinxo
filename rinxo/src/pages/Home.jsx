import React, { useEffect } from 'react'
import Header from '../components/layout/Header'
import HeroSection, { AccountTypes, MetaTraderTabs, PlatformFeatures, TradingInstruments } from '../components/layout/LandingSections'
import Footer from '../components/layout/Fotter'
import Aos from 'aos';
import "aos/dist/aos.css";

export default function Home() {

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
        <Header/>

        <HeroSection/>

        <TradingInstruments/>

        <PlatformFeatures/>

        <AccountTypes/>

        <MetaTraderTabs/>
        
        <Footer/>
    </>
  )
}
