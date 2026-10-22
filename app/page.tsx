import type { Metadata } from 'next';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './vox.css';
import Mascot from '@/components/Mascot';
import Numbers from '@/components/vox/Numbers';
import TopBar from '@/components/vox/TopBar';
import VoxClock from '@/components/vox/VoxClock';
import { AboutChapter, EndCard, ExperienceChapter, JourneyChapter, TitleCard, WorkChapter } from '@/components/vox/Chapters';
import { MINI_RAM_NOTES } from '@/lib/explained';
import { PROFILE } from '@/lib/data';

export const metadata: Metadata = {
  title: `Ram, explained · ${PROFILE.name}`,
  description: PROFILE.intro,
};

/** The explainer: a scroll-driven page in the style of a Vox video. The previous site lives at /old. */
export default function Home() {
  return (
    <div className="vox" data-theme="light">
      <noscript>
        <style>{`.vox .vx-chap{height:auto!important;--p:1}.vox .vx-stage{position:relative;height:auto;overflow:visible}.vox .vx-jcard{margin-bottom:0}`}</style>
      </noscript>
      <VoxClock />
      <TopBar />
      <main>
        <TitleCard />
        <Numbers />
        <ExperienceChapter />
        <JourneyChapter />
        <WorkChapter />
        <AboutChapter />
        <EndCard />
      </main>
      <Mascot comments={MINI_RAM_NOTES} />
    </div>
  );
}
