import { Helmet } from 'react-helmet';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>İletişim | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ ile iletişime geçin. Proje teklifleri, iş birlikleri ve sorularınız için iletişim formu." />
      </Helmet>
      
      <div className="py-20 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-950/20 dark:to-transparent">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
            İletişim
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Proje teklifleri, iş birlikleri veya sorularınız için benimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;