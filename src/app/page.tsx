import HeroSection      from '@/components/home/HeroSection'
import PromoStrip       from '@/components/home/PromoStrip'
import CategoriesSection from '@/components/home/CategoriesSection'
import FeaturedProducts  from '@/components/home/FeaturedProducts'
import SaleBanner        from '@/components/home/SaleBanner'
import NewArrivals       from '@/components/home/NewArrivals'
import ShopByAge         from '@/components/home/ShopByAge'
import Testimonials      from '@/components/home/Testimonials'
import Newsletter        from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PromoStrip />
      <CategoriesSection />
      <FeaturedProducts />
      <SaleBanner />
      <NewArrivals />
      <ShopByAge />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
