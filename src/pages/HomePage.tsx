import { Helmet } from 'react-helmet';
import HeroSection from '../components/home/HeroSection';
import FeaturedProjects from '../components/home/FeaturedProjects';
import SkillsPreview from '../components/home/SkillsPreview';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Hekimcan AKTAŞ | Junior Yazılım Geliştirici</title>
        <meta name="description" content="Hekimcan AKTAŞ - Yazılım Geliştirici Portfolyosu" />
      </Helmet>
      
      <HeroSection />
      <FeaturedProjects />
      <SkillsPreview />
    </>
  );
};

export default HomePage;
