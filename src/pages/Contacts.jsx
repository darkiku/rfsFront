import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Building2 } from 'lucide-react'
import { contactsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Contacts() {
  const { t, i18n } = useTranslation()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const { data } = await contactsAPI.getAll()
      setContacts(data)
    } catch (error) {
      toast.error(t('contacts.errorLoading'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getLabel = (contact) => {
    const lang = i18n.language
    if (lang === 'kk') return contact.labelKk || contact.labelRu
    if (lang === 'en') return contact.labelEn || contact.labelRu
    return contact.labelRu
  }

  const getIcon = (type) => {
    switch (type) {
      case 'ADDRESS': return MapPin
      case 'EMAIL': return Mail
      case 'PHONE': return Phone
      default: return Phone
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'ADDRESS': return 'from-blue-500 to-blue-600'
      case 'EMAIL': return 'from-green-500 to-green-600'
      case 'PHONE': return 'from-purple-500 to-purple-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  // Группируем контакты
  const mainContacts = contacts.filter(c => c.displayOrder >= 0 && c.displayOrder < 10)
  const management = contacts.filter(c => c.displayOrder >= 10 && c.displayOrder < 30)
  const departments = contacts.filter(c => c.displayOrder >= 30 && c.displayOrder < 50)
  const services = contacts.filter(c => c.displayOrder >= 50 && c.displayOrder < 100)
  const regional = contacts.filter(c => c.displayOrder >= 100)

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('contacts.title')}
          </h1>
        </motion.div>

        {/* КАРТА + АДРЕС СВЕРХУ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Карта */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl border h-[500px]"
          >
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.8!2d71.437!3d51.164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDA5JzUwLjQiTiA3McKwMjYnMTMuMiJF!5e0!3m2!1sru!2skz!4v1699999999999!5m2!1sru!2skz"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
/>
          </motion.div>

          {/* Основная информация справа */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {mainContacts.map((contact, idx) => {
              const Icon = getIcon(contact.contactType)
              const color = getColor(contact.contactType)
              
              return (
                <div
                  key={contact.id}
                  className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-2 text-lg">{getLabel(contact)}</p>
                      <p className="text-gray-600 leading-relaxed break-words">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* Руководство */}
        {management.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              Руководство
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {management.map((contact, idx) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all border"
                >
                  <p className="font-bold text-gray-900 mb-2">{getLabel(contact)}</p>
                  {contact.value && (
                    <p className="text-sm text-gray-600">{contact.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Департаменты */}
        {departments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Департаменты</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((contact, idx) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all border"
                >
                  <p className="font-bold text-gray-900 mb-2">{getLabel(contact)}</p>
                  <p className="text-sm text-blue-600">{contact.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Службы */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Службы</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((contact, idx) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all border"
                >
                  <p className="font-bold text-gray-900 mb-2">{getLabel(contact)}</p>
                  <p className="text-sm text-blue-600">{contact.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Региональные отделения */}
        {regional.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Региональные отделения</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regional.map((contact, idx) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition-all border"
                >
                  <p className="font-bold text-gray-900 mb-2 text-sm">{getLabel(contact)}</p>
                  <p className="text-xs text-blue-600">{contact.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}