import { Helmet } from 'react-helmet';
import ExperienceTimeline from '../components/experience/ExperienceTimeline';

const ExperiencePage = () => {
  return (
    <>
      <Helmet>
        <title>Deneyimler | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ'ın profesyonel iş deneyimleri ve kariyeri" />
      </Helmet>
      
      <div className="py-20 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-950/20 dark:to-transparent">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Deneyimlerim
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Profesyonel kariyerimde edindiğim iş deneyimleri, projeler ve sorumluluklar
          </p>
        </div>
      </div>
      
      <ExperienceTimeline />
    </>
  );
};

export default ExperiencePage;