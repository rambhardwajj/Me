import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Personas from '@/components/Personas';
import Journey from '@/components/Journey';
import Work from '@/components/Work';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <Motion>
      <Nav />
      <main>
        <Hero />
        <Personas />
        <Journey />
        <Work />
        <Skills />
        <Contact />
      </main>
    </Motion>
  );
}
