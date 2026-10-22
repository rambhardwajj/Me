import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Personas from '@/components/Personas';
import Journey from '@/components/Journey';
import Experience from '@/components/Experience';
import Work from '@/components/Work';
import Contact from '@/components/Contact';
import Mascot from '@/components/Mascot';

export default function OldHome() {
  return (
    <Motion>
      <Nav />
      <main>
        <Hero />
        <Personas />
        <Journey />
        <Experience />
        <Work />
        <Contact />
      </main>
      <Mascot />
    </Motion>
  );
}
