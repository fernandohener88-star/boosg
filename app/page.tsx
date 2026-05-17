import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Reviews from '@/components/Reviews'
import Contact from '@/components/Contact'
import CornerMark from '@/components/CornerMark'
import Cursor from '@/components/Cursor'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <Hero />
      <About />
      <Services />
      <Reviews />
      <Contact />
      <CornerMark />
    </>
  )
}
