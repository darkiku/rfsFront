import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe, ChevronDown, Check, Eye } from 'lucide-react'
import { AccessibilityPanel } from '../components/AccessibilityPanel'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNewsOpen, setIsNewsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const { t, i18n } = useTranslation()
  
  const newsTimerRef = useRef(null)
  const aboutTimerRef = useRef(null)
  const langTimerRef = useRef(null)

  const languages = [
    { code: 'ru', label: 'Русский', short: 'RU' },
    { code: 'kk', label: 'Қазақша', short: 'KZ' },
    { code: 'en', label: 'English', short: 'EN' }
  ]

  const newsTypes = [
    { key: 'NEWS', label: t('nav.news') },
    { key: 'VACANCY', label: t('nav.vacancies') }
  ]

  const aboutSections = [
    { key: 'GENERAL_INFO', label: t('about.general') },
    { key: 'INFO_SECURITY', label: t('about.security') },
    { key: 'ANTI_CORRUPTION', label: t('about.anticorruption') },
    { key: 'LEGAL_ACTS', label: t('about.legal') }
  ]

  const currentLang = languages.find(lang => lang.code === i18n.language)

  const handleNewsMouseEnter = () => {
    if (newsTimerRef.current) clearTimeout(newsTimerRef.current)
    setIsNewsOpen(true)
  }

  const handleNewsMouseLeave = () => {
    newsTimerRef.current = setTimeout(() => {
      setIsNewsOpen(false)
    }, 200)
  }

  const handleAboutMouseEnter = () => {
    if (aboutTimerRef.current) clearTimeout(aboutTimerRef.current)
    setIsAboutOpen(true)
  }

  const handleAboutMouseLeave = () => {
    aboutTimerRef.current = setTimeout(() => {
      setIsAboutOpen(false)
    }, 200)
  }

  const handleLangMouseEnter = () => {
    if (langTimerRef.current) clearTimeout(langTimerRef.current)
    setIsLangOpen(true)
  }

  const handleLangMouseLeave = () => {
    langTimerRef.current = setTimeout(() => {
      setIsLangOpen(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (newsTimerRef.current) clearTimeout(newsTimerRef.current)
      if (aboutTimerRef.current) clearTimeout(aboutTimerRef.current)
      if (langTimerRef.current) clearTimeout(langTimerRef.current)
    }
  }, [])

  return (
    <>
      <header className="bg-[#5865F2] sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Логотип / Название */}
            <Link to="/" className="text-white hover:text-blue-100 transition-colors">
              <div className="text-xl font-bold leading-tight max-w-[200px]">
                {t('common.siteName')}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link 
                to="/" 
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
              >
                {t('nav.home')}
              </Link>
              
              {/* News Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleNewsMouseEnter}
                onMouseLeave={handleNewsMouseLeave}
              >
                <button className="flex items-center space-x-1 px-4 py-2 text-white hover:bg-white/10 rounded-lg font-medium transition-all text-sm whitespace-nowrap">
                  <span>{t('nav.newsSection')}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isNewsOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border z-50"
                    onMouseEnter={handleNewsMouseEnter}
                    onMouseLeave={handleNewsMouseLeave}
                  >
                    {newsTypes.map((newsType) => (
                      <Link
                        key={newsType.key}
                        to={`/news/${newsType.key}`}
                        className="block px-6 py-3 hover:bg-blue-50 border-b last:border-b-0 first:rounded-t-xl last:rounded-b-xl text-sm text-gray-900"
                        onClick={() => setIsNewsOpen(false)}
                      >
                        {newsType.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleAboutMouseEnter}
                onMouseLeave={handleAboutMouseLeave}
              >
                <button className="flex items-center space-x-1 px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all text-sm whitespace-nowrap">
                  <span>{t('nav.about')}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isAboutOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50"
                    onMouseEnter={handleAboutMouseEnter}
                    onMouseLeave={handleAboutMouseLeave}
                  >
                    {aboutSections.map((section) => (
                      <Link
                        key={section.key}
                        to={`/about/${section.key}`}
                        className="block px-6 py-3 hover:bg-blue-50 border-b last:border-b-0 first:rounded-t-xl last:rounded-b-xl text-sm text-gray-900"
                        onClick={() => setIsAboutOpen(false)}
                      >
                        {section.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                to="/procurements" 
                className="px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
              >
                {t('nav.procurements')}
              </Link>
              <Link 
                to="/contacts" 
                className="px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
              >
                {t('nav.contacts')}
              </Link>
            </nav>

            {/* Right Side Controls */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Accessibility Button */}
              <button
                onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                className={`p-2.5 rounded-lg transition-all ${
                  isAccessibilityOpen 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title="Версия для слабовидящих"
              >
                <Eye className="w-5 h-5" />
              </button>

              {/* Language Selector */}
              <div 
                className="relative"
                onMouseEnter={handleLangMouseEnter}
                onMouseLeave={handleLangMouseLeave}
              >
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur hover:bg-white/30 rounded-lg text-white transition-all">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{currentLang?.short}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isLangOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border z-50"
                    onMouseEnter={handleLangMouseEnter}
                    onMouseLeave={handleLangMouseLeave}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code)
                          setIsLangOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                          i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        <span className="font-medium">{lang.label}</span>
                        {i18n.language === lang.code && <Check className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 bg-white/20 backdrop-blur hover:bg-white/30 rounded-lg text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 space-y-1 border-t border-white/20">
              <Link to="/" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                {t('nav.home')}
              </Link>
              
              <div>
                <button
                  onClick={() => setIsNewsOpen(!isNewsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 rounded-lg"
                >
                  <span>{t('nav.newsSection')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isNewsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isNewsOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    {newsTypes.map((newsType) => (
                      <Link
                        key={newsType.key}
                        to={`/news/${newsType.key}`}
                        className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsNewsOpen(false)
                        }}
                      >
                        {newsType.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 rounded-lg"
                >
                  <span>{t('nav.about')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAboutOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    {aboutSections.map((section) => (
                      <Link
                        key={section.key}
                        to={`/about/${section.key}`}
                        className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsAboutOpen(false)
                        }}
                      >
                        {section.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/procurements" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                {t('nav.procurements')}
              </Link>
              <Link to="/contacts" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                {t('nav.contacts')}
              </Link>

              {/* Mobile Accessibility Button */}
              <button
                onClick={() => {
                  setIsAccessibilityOpen(!isAccessibilityOpen)
                  setIsMenuOpen(false)
                }}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg font-medium ${
                  isAccessibilityOpen ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                }`}
              >
                <Eye className="w-5 h-5" />
                <span>Версия для слабовидящих</span>
              </button>

              {/* Mobile Languages */}
              <div className="pt-2 space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code)
                      setIsMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium ${
                      i18n.language === lang.code ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {i18n.language === lang.code && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Accessibility Panel */}
      <AccessibilityPanel 
        isOpen={isAccessibilityOpen} 
        onClose={() => setIsAccessibilityOpen(false)} 
      />
    </>
  )
}