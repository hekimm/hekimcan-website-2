import { Helmet } from 'react-helmet';
import EducationTimeline from '../components/education/EducationTimeline';

const EducationPage = () => {
  return (
    <>
      <Helmet>
        <title>Eğitim | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ'ın eğitim geçmişi ve akademik başarıları" />
      </Helmet>
      
      <div className="py-20 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-950/20 dark:to-transparent">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Eğitim
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Akademik geçmişim, eğitim hayatım ve sertifikalarım
          </p>
        </div>
      </div>
      
      <EducationTimeline />
    </>
  );
};

export default EducationPage;