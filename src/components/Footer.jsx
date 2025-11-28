import { MapPin, Mail, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import kz3 from '../images/kz3.png'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const currentYear = new Date().getFullYear()

  const getMinistryName = () => {
    if (i18n.language === 'kk') {
      return 'Қазақстан Республикасының Цифрлық даму, инновациялар және аэроғарыш өнеркәсібі министрлігі'
    }
    if (i18n.language === 'en') {
      return 'Ministry of Digital Development, Innovation and Aerospace Industry of the Republic of Kazakhstan'
    }
    return 'Министерство цифрового развития, инноваций и аэрокосмической промышленности Республики Казахстан'
  }

  const getAddress = () => {
    if (i18n.language === 'kk') {
      return 'Қазақстан Республикасы, 010000, Астана қ., ул. Иманова, 13'
    }
    if (i18n.language === 'en') {
      return 'Republic of Kazakhstan, 010000, Astana, Imanova St., 13'
    }
    return 'Республика Казахстан, 010000, г. Астана, ул. Иманова, 13'
  }

  return (
    <footer className="bg-[#5865F2] text-white">
      {/* Верхняя часть с гербом и информацией */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            {/* Герб Казахстана */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
                <img 
                  src={kz3}
                  alt="Герб Казахстана"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Информация о министерстве */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <h3 className="text-xl font-bold mb-4 leading-relaxed">
                {getMinistryName()}
              </h3>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{getAddress()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a href="mailto:info@rfs.gov.kz" className="text-sm hover:text-white/80 transition-colors">
                    info@rfs.gov.kz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Средняя часть с контактами */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Приёмная */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg">
                {i18n.language === 'kk' ? 'Қабылдау бөлмесі' : i18n.language === 'en' ? 'Reception' : 'Приёмная'}
              </h4>
            </div>
            <div className="text-white/90 space-y-1">
              <a href="tel:+77172575570" className="block hover:text-white transition-colors">
                8 (7172) 57 55 70
              </a>
            </div>
          </div>

          {/* Канцелярия */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg">
                {i18n.language === 'kk' ? 'Кеңсе' : i18n.language === 'en' ? 'Office' : 'Канцелярия'}
              </h4>
            </div>
            <div className="text-white/90 space-y-1">
              <a href="tel:+77172575592" className="block hover:text-white transition-colors">
                8 (7172) 57 55 92
              </a>
            </div>
          </div>

          {/* Факс */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg">
                {i18n.language === 'kk' ? 'Факс' : i18n.language === 'en' ? 'Fax' : 'Факс'}
              </h4>
            </div>
            <div className="text-white/90 space-y-1">
              <span className="block">8 (7172) 57 55 91</span>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть - копирайт */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-white/80 text-sm">
            © {currentYear} {t('common.siteName')}. {' '}
            {i18n.language === 'kk' 
              ? 'Барлық құқықтар қорғалған' 
              : i18n.language === 'en' 
              ? 'All rights reserved' 
              : 'Все права защищены'}
          </div>
        </div>
      </div>
    </footer>
  )
}