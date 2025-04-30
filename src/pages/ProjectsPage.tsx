import { Helmet } from 'react-helmet';
import ProjectsGrid from '../components/projects/ProjectsGrid';

const ProjectsPage = () => {
  return (
    <>
      <Helmet>
        <title>Projeler | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ'ın geliştirdiği yazılım projeleri ve çalışmaları" />
      </Helmet>
      
      <div className="py-20 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-950/20 dark:to-transparent">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Projelerim
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Profesyonel ve kişisel olarak geliştirdiğim projeler. Filtreleri kullanarak belirli teknolojilere göre arama yapabilirsiniz.
          </p>
        </div>
      </div>
      
      <ProjectsGrid />
    </>
  );
};

export default ProjectsPage;