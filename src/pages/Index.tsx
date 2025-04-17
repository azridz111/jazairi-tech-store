
import Hero from '@/components/home/Hero';
import DirectOrderFeaturedProducts from '@/components/home/DirectOrderFeaturedProducts';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Categories />
        <DirectOrderFeaturedProducts />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
