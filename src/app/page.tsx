import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Categories from "@/components/Categories";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Categories />
      <Features />
      <Testimonials />
      <Faq />
      <Footer />
      <Toaster />
    </main>
  );
}
