/*
  # Update Projects Data with Real Portfolio Projects

  1. Changes
    - Clear existing projects
    - Insert new portfolio projects with images
    - Set featured status
*/

-- Clear existing projects
TRUNCATE TABLE projeler;

-- Insert new projects
INSERT INTO projeler (
  baslik,
  aciklama,
  gorsel_url,
  canli_demo_url,
  github_url,
  teknolojiler,
  one_cikan,
  created_at
) VALUES 
(
  'Maviş Cafe & Beach QR Menü',
  'Maviş Cafe & Beach için modern ve kullanıcı dostu bir QR menü uygulaması geliştirildi. Müşteriler, menüye hızlıca erişebilir ve siparişlerini kolayca verebilir.',
  'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg',
  'https://mavis-cafe.example.com',
  'https://github.com/example/mavis-cafe',
  ARRAY['React Js', 'Node Js', 'MongoDB'],
  true,
  NOW()
),
(
  'Mescid.az Landing Page',
  'Mescid.az mobil uygulamasının tanıtımını yapan bir landing page projesi. Bu projede, kullanıcılar uygulamanın özelliklerini keşfedebilir ve indirme bağlantılarına erişebilir.',
  'https://images.pexels.com/photos/3473569/pexels-photo-3473569.jpeg',
  'https://mescid.az',
  'https://github.com/example/mescid-landing',
  ARRAY['React Js', 'Tailwind CSS', 'Figma'],
  true,
  NOW()
),
(
  'Devers AI Chatbot Destekli Tanıtım Sayfası',
  'Devers Web & Mobile App Development Uni Club için AI chatbot destekli bir tanıtım sayfası. Bu projede, kulübün faaliyetleri ve projeleri hakkında bilgi almak için bir chatbot entegre edildi.',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  'https://devers.example.com',
  'https://github.com/example/devers-ai',
  ARRAY['React Js', 'OpenAI API', 'Node Js'],
  true,
  NOW()
),
(
  'Portfolio Page',
  'Kişisel portfolyo sayfası. Bu projede, yapılan çalışmalar ve projeler sergilenerek, kullanıcıların bilgi alması sağlandı.',
  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
  'https://portfolio.example.com',
  'https://github.com/example/portfolio',
  ARRAY['Next Js', 'Tailwind CSS', 'Figma'],
  true,
  NOW()
),
(
  'Ciğerci Ali Baba QR Menü',
  'Ciğerci Ali Baba için geliştirilen QR menü uygulaması. Müşteriler, menüye hızlıca erişebilir ve siparişlerini kolayca verebilir.',
  'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
  'https://alibaba-menu.example.com',
  'https://github.com/example/alibaba-menu',
  ARRAY['React Js', 'Node Js', 'MongoDB'],
  true,
  NOW()
);