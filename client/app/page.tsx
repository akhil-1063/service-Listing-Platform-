
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedServices from "@/components/sections/FeaturedServices";


export default function Home() {
  return (
   <div>
  <Navbar/>


<HeroSection/>
<AboutSection/>
<FeaturedServices/>



  <Footer/>
   </div>
  );
}
