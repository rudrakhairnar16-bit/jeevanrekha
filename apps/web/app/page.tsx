import {CinematicExperience} from '@/components/cinema/experience';
import {StaticStory} from '@/components/static-story';
export default function Home(){return <main id="main" tabIndex={-1}><CinematicExperience fallback={<StaticStory/>}/></main>;}
