import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ru: {
    translation: {
      nav: {
        home: 'ГЛАВНАЯ',
        news: 'НОВОСТИ',
        newsSection: 'НОВОСТИ И ВАКАНСИИ',
        vacancies: 'ВАКАНСИИ',
        about: 'О ПРЕДПРИЯТИИ',
        services: 'СЕРВИСЫ',
        procurements: 'ГОСУДАРСТВЕННЫЕ ЗАКУПКИ',
        contacts: 'КОНТАКТЫ'
      },
      about: {
        general: 'ОБЩАЯ ИНФОРМАЦИЯ',
        security: 'ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ',
        anticorruption: 'АНТИКОРРУПЦИОННЫЙ РАЗДЕЛ',
        legal: 'НОРМАТИВНЫЕ ПРАВОВЫЕ АКТЫ',
        title: 'О предприятии',
        notFound: 'Информация не найдена'
      },
      home: {
        heroSubtitle: 'Министерство цифрового развития, инноваций и аэрокосмической промышленности Республики Казахстан',
        hero: {
          title: 'Радиочастотная служба',
          subtitle: 'Министерство цифрового развития, инноваций и аэрокосмической промышленности Республики Казахстан',
          services: 'Наши сервисы',
          aboutBtn: 'О предприятии'
        },
        features: {
          title: 'Наши преимущества',
          emc: 'Электромагнитная совместимость',
          quality: 'Контроль качества связи',
          monitoring: 'Радиомониторинг',
          space: 'Космическая координация',
          item1: {
            description: 'Профессиональная оценка электромагнитной совместимости радиоэлектронных средств'
          },
          item2: {
            description: 'Постоянный мониторинг и контроль качества услуг связи на территории страны'
          },
          item3: {
            description: 'Непрерывный радиомониторинг для обеспечения эффективного использования спектра'
          },
          item4: {
            description: 'Координация космических систем и орбитальных позиций на международном уровне'
          }
        },
        news: {
          title: 'Новости',
          all: 'Все новости'
        },
        services: {
          title: 'Сервисы'
        },
        activities: {
          title: 'Виды деятельности',
          item1: {
            title: 'Измерение параметров качества услуг связи',
            desc: 'Контроль качества услуг связи, включая качество приема населением теле-, радиоканалов, а также мониторинг радиочастотного спектра'
          },
          item2: {
            title: 'Ведение реестра радиоэлектронных средств',
            desc: 'Техническое сопровождение мероприятий по международной координации ресурсов радиочастот и орбитальных позиций'
          },
          item3: {
            title: 'Расчет электромагнитной совместимости',
            desc: 'Проведение расчета электромагнитной совместимости радиоэлектронных средств'
          },
          item4: {
            title: 'Сопровождение базы данных IMEI',
            desc: 'Обеспечение формирования, функционирования, сопровождения и развития базы данных идентификационных кодов абонентских устройств'
          }
        }
      },
      news: {
        title: 'Новости',
        search: 'Поиск новостей...',
        searchBtn: 'Найти',
        searching: 'Поиск...',
        notFound: 'Новости не найдены',
        readMore: 'Читать далее',
        back: 'Назад к новостям',
        views: 'просмотров',
        errorLoading: 'Ошибка загрузки новости',
        newsNotFound: 'Новость не найдена'
      },
      vacancies: {
        title: 'Вакансии',
        search: 'Поиск вакансий...',
        searchBtn: 'Найти',
        searching: 'Поиск...',
        notFound: 'Вакансии не найдены',
        readMore: 'Подробнее',
        back: 'Назад к вакансиям',
        views: 'просмотров',
        errorLoading: 'Ошибка загрузки вакансии',
        vacancyNotFound: 'Вакансия не найдена'
      },
      services: {
        title: 'Сервисы',
        subtitle: 'Онлайн-сервисы для проверки регистрации устройств и качества связи',
        goTo: 'Перейти'
      },
      procurements: {
        title: 'Государственные закупки',
        subtitle: 'Информация о государственных закупках и тендерах',
        year: 'Год',
        type: 'Тип',
        allTypes: 'Все типы',
        notFound: 'Закупки не найдены',
        download: 'Скачать',
        published: 'Опубликовано',
        deadline: 'Срок',
        errorLoading: 'Ошибка загрузки закупок',
        types: {
          all: 'Все типы',
          annualPlan: 'Годовой план',
          announcement: 'Объявление',
          regulation: 'НПА'
        }
      },
      contacts: {
        title: 'Контакты',
        subtitle: 'Свяжитесь с нами удобным для вас способом',
        info: 'Контактная информация',
        departments: 'Департаменты',
        errorLoading: 'Ошибка загрузки данных'
      },
      footer: {
        ministry: 'Министерство цифрового развития, инноваций и аэрокосмической промышленности Республики Казахстан',
        address: 'Республика Казахстан, 010000, г. Астана, ул. Иманова, 13',
        reception: 'Приёмная',
        office: 'Канцелярия',
        fax: 'Факс',
        rights: 'Radio Frequency Service. Все права защищены.'
      },
      common: {
        siteName: 'Радиочастотная служба', 
        readMore: 'Подробнее',
        allNews: 'Все новости',
        search: 'Поиск...',
        loading: 'Загрузка...',
        error: 'Ошибка загрузки данных',
        noData: 'Нет данных',
        back: 'Назад',
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        edit: 'Редактировать',
        create: 'Создать',
        update: 'Обновить',
        close: 'Закрыть',
        confirm: 'Подтвердить',
        yes: 'Да',
        no: 'Нет'
      },
      admin: {
        login: 'Вход в админ-панель',
        username: 'Имя пользователя',
        password: 'Пароль',
        loginBtn: 'Войти',
        logout: 'Выйти',
        dashboard: 'Панель управления',
        news: 'Управление новостями',
        services: 'Управление сервисами',
        procurements: 'Управление закупками',
        about: 'О предприятии',
        contacts: 'Контакты',
        users: 'Пользователи',
        audit: 'Аудит'
      }
    }
  },
  kk: {
    translation: {
      nav: {
        home: 'БАС БЕТ',
        news: 'ЖАҢАЛЫҚТАР',
        newsSection: 'ЖАҢАЛЫҚТАР ЖӘНЕ ВАКАНСИЯЛАР',
        vacancies: 'ВАКАНСИЯЛАР',
        about: 'КӘСІПОРЫН ТУРАЛЫ',
        services: 'ҚЫЗМЕТТЕР',
        procurements: 'МЕМЛЕКЕТТІК САТЫП АЛУЛАР',
        contacts: 'БАЙЛАНЫСТАР'
      },
      about: {
        general: 'ЖАЛПЫ АҚПАРАТ',
        security: 'АҚПАРАТТЫҚ ҚАУІПСІЗДІК',
        anticorruption: 'СЫБАЙЛАС ЖЕМҚОРЛЫҚҚА ҚАРСЫ БӨЛІМ',
        legal: 'НОРМАТИВТІК ҚҰҚЫҚТЫҚ АКТІЛЕР',
        title: 'Кәсіпорын туралы',
        notFound: 'Ақпарат табылмады'
      },
      home: {
        heroSubtitle: 'Қазақстан Республикасының Цифрлық даму, инновациялар және аэроғарыш өнеркәсібі министрлігі',
        hero: {
          title: 'Радиожиілік қызметі',
          subtitle: 'Қазақстан Республикасының Цифрлық даму, инновациялар және аэроғарыш өнеркәсібі министрлігі',
          services: 'Біздің қызметтер',
          aboutBtn: 'Кәсіпорын туралы'
        },
        features: {
          title: 'Біздің артықшылықтар',
          emc: 'Электромагниттік үйлесімділік',
          quality: 'Байланыс сапасын бақылау',
          monitoring: 'Радиомониторинг',
          space: 'Ғарыштық үйлестіру',
          item1: {
            description: 'Радиоэлектрондық құралдардың электромагниттік үйлесімділігін кәсіби бағалау'
          },
          item2: {
            description: 'Ел аумағында байланыс қызметтерінің сапасын тұрақты бақылау'
          },
          item3: {
            description: 'Спектрді тиімді пайдалануды қамтамасыз ету үшін үздіксіз радиомониторинг'
          },
          item4: {
            description: 'Халықаралық деңгейде ғарыштық жүйелер мен орбиталық позицияларды үйлестіру'
          }
        },
        news: {
          title: 'Жаңалықтар',
          all: 'Барлық жаңалықтар'
        },
        services: {
          title: 'Қызметтер'
        },
        activities: {
          title: 'Қызмет түрлері',
          item1: {
            title: 'Байланыс қызметтерінің сапа параметрлерін өлшеу',
            desc: 'Байланыс қызметтерінің сапасын бақылау, соның ішінде халықтың теле-, радио арналарды қабылдау сапасы, сондай-ақ радиожиілік спектрін мониторингтеу'
          },
          item2: {
            title: 'Радиоэлектрондық құралдар тізілімін жүргізу',
            desc: 'Радиожиіліктер ресурстары мен орбиталық позицияларды халықаралық үйлестіру іс-шараларын техникалық қолдау'
          },
          item3: {
            title: 'Электромагниттік үйлесімділікті есептеу',
            desc: 'Радиоэлектрондық құралдардың электромагниттік үйлесімділігін есептеуді жүргізу'
          },
          item4: {
            title: 'IMEI дерекқорын сүйемелдеу',
            desc: 'Абоненттік құрылғылардың идентификациялық кодтарының дерекқорын қалыптастыруды, жұмыс істеуді, сүйемелдеуді және дамытуды қамтамасыз ету'
          }
        }
      },
      news: {
        title: 'Жаңалықтар',
        search: 'Жаңалықтарды іздеу...',
        searchBtn: 'Табу',
        searching: 'Іздеу...',
        notFound: 'Жаңалықтар табылмады',
        readMore: 'Толығырақ оқу',
        back: 'Жаңалықтарға оралу',
        views: 'қаралымдар',
        errorLoading: 'Жаңалықты жүктеу қатесі',
        newsNotFound: 'Жаңалық табылмады'
      },
      vacancies: {
        title: 'Вакансиялар',
        search: 'Вакансияларды іздеу...',
        searchBtn: 'Табу',
        searching: 'Іздеу...',
        notFound: 'Вакансиялар табылмады',
        readMore: 'Толығырақ',
        back: 'Вакансияларға оралу',
        views: 'қаралымдар',
        errorLoading: 'Вакансияны жүктеу қатесі',
        vacancyNotFound: 'Вакансия табылмады'
      },
      services: {
        title: 'Қызметтер',
        subtitle: 'Құрылғылардың тіркелуін және байланыс сапасын тексеруге арналған онлайн қызметтер',
        goTo: 'Өту'
      },
      procurements: {
        title: 'Мемлекеттік сатып алулар',
        subtitle: 'Мемлекеттік сатып алулар мен тендерлер туралы ақпарат',
        year: 'Жыл',
        type: 'Түрі',
        allTypes: 'Барлық түрлер',
        notFound: 'Сатып алулар табылмады',
        download: 'Жүктеу',
        published: 'Жарияланды',
        deadline: 'Мерзім',
        errorLoading: 'Сатып алуларды жүктеу қатесі',
        types: {
          all: 'Барлық түрлер',
          annualPlan: 'Жылдық жоспар',
          announcement: 'Хабарландыру',
          regulation: 'ҚНА'
        }
      },
      contacts: {
        title: 'Байланыстар',
        subtitle: 'Бізбен қолайлы тәсілмен хабарласыңыз',
        info: 'Байланыс ақпараты',
        departments: 'Департаменттер',
        errorLoading: 'Деректерді жүктеу қатесі'
      },
      footer: {
        ministry: 'Қазақстан Республикасының Цифрлық даму, инновациялар және аэроғарыш өнеркәсібі министрлігі',
        address: 'Қазақстан Республикасы, 010000, Астана қ., Иманов к-сі, 13',
        reception: 'Қабылдау бөлмесі',
        office: 'Кеңсе',
        fax: 'Факс',
        rights: 'Radio Frequency Service. Барлық құқықтар қорғалған.'
      },
      common: {
        siteName: 'Радиожиілік қызметі',
        readMore: 'Толығырақ',
        allNews: 'Барлық жаңалықтар',
        search: 'Іздеу...',
        loading: 'Жүктелуде...',
        error: 'Деректерді жүктеу қатесі',
        noData: 'Деректер жоқ',
        back: 'Артқа',
        save: 'Сақтау',
        cancel: 'Болдырмау',
        delete: 'Жою',
        edit: 'Өңдеу',
        create: 'Жасау',
        update: 'Жаңарту',
        close: 'Жабу',
        confirm: 'Растау',
        yes: 'Иә',
        no: 'Жоқ'
      },
      admin: {
        login: 'Админ панеліне кіру',
        username: 'Пайдаланушы аты',
        password: 'Құпия сөз',
        loginBtn: 'Кіру',
        logout: 'Шығу',
        dashboard: 'Басқару панелі',
        news: 'Жаңалықтарды басқару',
        services: 'Қызметтерді басқару',
        procurements: 'Сатып алуларды басқару',
        about: 'Кәсіпорын туралы',
        contacts: 'Байланыстар',
        users: 'Пайдаланушылар',
        audit: 'Аудит'
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'HOME',
        news: 'NEWS',
        newsSection: 'NEWS AND VACANCIES',
        vacancies: 'VACANCIES',
        about: 'ABOUT',
        services: 'SERVICES',
        procurements: 'GOVERNMENT PROCUREMENTS',
        contacts: 'CONTACTS'
      },
      about: {
        general: 'GENERAL INFORMATION',
        security: 'INFORMATION SECURITY',
        anticorruption: 'ANTI-CORRUPTION',
        legal: 'LEGAL ACTS',
        title: 'About Company',
        notFound: 'Information not found'
      },
      home: {
        heroSubtitle: 'Ministry of Digital Development, Innovation and Aerospace Industry of the Republic of Kazakhstan',
        hero: {
          title: 'Radio Frequency Service',
          subtitle: 'Ministry of Digital Development, Innovation and Aerospace Industry of the Republic of Kazakhstan',
          services: 'Our Services',
          aboutBtn: 'About Company'
        },
        features: {
          title: 'Our Advantages',
          emc: 'Electromagnetic Compatibility',
          quality: 'Communication Quality Control',
          monitoring: 'Radio Monitoring',
          space: 'Space Coordination',
          item1: {
            description: 'Professional assessment of electromagnetic compatibility of radio-electronic equipment'
          },
          item2: {
            description: 'Continuous monitoring and quality control of communication services throughout the country'
          },
          item3: {
            description: 'Continuous radio monitoring to ensure efficient spectrum use'
          },
          item4: {
            description: 'Coordination of space systems and orbital positions at international level'
          }
        },
        news: {
          title: 'News',
          all: 'All News'
        },
        services: {
          title: 'Services'
        },
        activities: {
          title: 'Types of Activities',
          item1: {
            title: 'Measuring communication service quality parameters',
            desc: 'Quality control of communication services, including the quality of reception by the population of TV and radio channels, as well as monitoring the radio frequency spectrum'
          },
          item2: {
            title: 'Maintaining register of radio-electronic equipment',
            desc: 'Technical support for activities on international coordination of radio frequency resources and orbital positions'
          },
          item3: {
            title: 'Electromagnetic compatibility calculation',
            desc: 'Performing calculation of electromagnetic compatibility of radio-electronic equipment'
          },
          item4: {
            title: 'IMEI database maintenance',
            desc: 'Ensuring the formation, operation, maintenance and development of a database of subscriber device identification codes'
          }
        }
      },
      news: {
        title: 'News',
        search: 'Search news...',
        searchBtn: 'Search',
        searching: 'Searching...',
        notFound: 'No news found',
        readMore: 'Read more',
        back: 'Back to news',
        views: 'views',
        errorLoading: 'Error loading news',
        newsNotFound: 'News not found'
      },
      vacancies: {
        title: 'Vacancies',
        search: 'Search vacancies...',
        searchBtn: 'Search',
        searching: 'Searching...',
        notFound: 'No vacancies found',
        readMore: 'Read more',
        back: 'Back to vacancies',
        views: 'views',
        errorLoading: 'Error loading vacancy',
        vacancyNotFound: 'Vacancy not found'
      },
      services: {
        title: 'Services',
        subtitle: 'Online services for checking device registration and communication quality',
        goTo: 'Go to'
      },
      procurements: {
        title: 'Government Procurements',
        subtitle: 'Information about government procurements and tenders',
        year: 'Year',
        type: 'Type',
        allTypes: 'All types',
        notFound: 'No procurements found',
        download: 'Download',
        published: 'Published',
        deadline: 'Deadline',
        errorLoading: 'Error loading procurements',
        types: {
          all: 'All types',
          annualPlan: 'Annual Plan',
          announcement: 'Announcement',
          regulation: 'Regulation'
        }
      },
      contacts: {
        title: 'Contacts',
        subtitle: 'Get in touch with us in a convenient way',
        info: 'Contact Information',
        departments: 'Departments',
        errorLoading: 'Error loading data'
      },
      footer: {
        ministry: 'Ministry of Digital Development, Innovation and Aerospace Industry of the Republic of Kazakhstan',
        address: 'Republic of Kazakhstan, 010000, Astana, Imanova St., 13',
        reception: 'Reception',
        office: 'Office',
        fax: 'Fax',
        rights: 'Radio Frequency Service. All rights reserved.'
      },
      common: {
        siteName: 'Radio Frequency Service',
        readMore: 'Read more',
        allNews: 'All news',
        search: 'Search...',
        loading: 'Loading...',
        error: 'Data loading error',
        noData: 'No data',
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        update: 'Update',
        close: 'Close',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No'
      },
      admin: {
        login: 'Admin Panel Login',
        username: 'Username',
        password: 'Password',
        loginBtn: 'Login',
        logout: 'Logout',
        dashboard: 'Dashboard',
        news: 'News Management',
        services: 'Services Management',
        procurements: 'Procurements Management',
        about: 'About Company',
        contacts: 'Contacts',
        users: 'Users',
        audit: 'Audit'
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n