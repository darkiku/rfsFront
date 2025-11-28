import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// Глобальные стили - добавляем один раз при загрузке модуля
if (typeof document !== 'undefined' && !document.getElementById('accessibility-global-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'accessibility-global-styles'
  styleEl.textContent = `
    :root.color-black {
      --bg: #000000;
      --text: #ffffff;
      --bg-secondary: #1a1a1a;
    }
    :root.color-blue {
      --bg: #9DD1FF;
      --text: #063462;
      --bg-secondary: #b8deff;
    }
    :root.color-brown {
      --bg: #F7F3D6;
      --text: #4D4B43;
      --bg-secondary: #ebe7c5;
    }
    :root.color-green {
      --bg: #3B2716;
      --text: #A9E44D;
      --bg-secondary: #2a1d0f;
    }
    
    .color-black body,
    .color-blue body,
    .color-brown body,
    .color-green body {
      background-color: var(--bg) !important;
      color: var(--text) !important;
    }
    
    .color-black section,
    .color-blue section,
    .color-brown section,
    .color-green section {
      background-color: var(--bg-secondary) !important;
      color: var(--text) !important;
    }
    
    .color-black header,
    .color-blue header,
    .color-brown header,
    .color-green header {
      background-color: var(--bg-secondary) !important;
    }
    
    .color-black a,
    .color-blue a,
    .color-brown a,
    .color-green a {
      color: var(--text) !important;
    }
    
    .color-black button:not(.accessibility-panel button),
    .color-blue button:not(.accessibility-panel button),
    .color-brown button:not(.accessibility-panel button),
    .color-green button:not(.accessibility-panel button) {
      color: var(--text) !important;
    }
    
    .color-black h1,
    .color-black h2,
    .color-black h3,
    .color-black h4,
    .color-black h5,
    .color-black h6,
    .color-black p,
    .color-black span,
    .color-black div {
      color: var(--text) !important;
    }
    
    .color-blue h1,
    .color-blue h2,
    .color-blue h3,
    .color-blue h4,
    .color-blue h5,
    .color-blue h6,
    .color-blue p,
    .color-blue span,
    .color-blue div {
      color: var(--text) !important;
    }
    
    .color-brown h1,
    .color-brown h2,
    .color-brown h3,
    .color-brown h4,
    .color-brown h5,
    .color-brown h6,
    .color-brown p,
    .color-brown span,
    .color-brown div {
      color: var(--text) !important;
    }
    
    .color-green h1,
    .color-green h2,
    .color-green h3,
    .color-green h4,
    .color-green h5,
    .color-green h6,
    .color-green p,
    .color-green span,
    .color-green div {
      color: var(--text) !important;
    }
    
    .images-off img {
      display: none !important;
    }
    
    .images-grayscale img {
      filter: grayscale(100%) !important;
    }

    .accessibility-panel {
      background-color: #ffffff !important;
    }

    .accessibility-panel,
    .accessibility-panel * {
      color: #000000 !important;
    }

    .accessibility-panel .text-gray-800 {
      color: #1f2937 !important;
    }

    .accessibility-panel .bg-gray-200 {
      background-color: #e5e7eb !important;
    }

    .accessibility-panel .bg-gray-100 {
      background-color: #f3f4f6 !important;
    }

    .accessibility-panel .border-gray-300 {
      border-color: #d1d5db !important;
    }

    .accessibility-panel .bg-blue-50 {
      background-color: #eff6ff !important;
    }

    .accessibility-panel .text-blue-600 {
      color: #2563eb !important;
    }

    .accessibility-panel .border-blue-600 {
      border-color: #2563eb !important;
    }

    .accessibility-panel .bg-blue-600 {
      background-color: #2563eb !important;
    }

    .accessibility-panel .text-white {
      color: #ffffff !important;
    }

    .accessibility-panel button {
      color: inherit !important;
    }
  `
  document.head.appendChild(styleEl)
}

// Функция для применения настроек
const applySettings = (s) => {
  const root = document.documentElement
  const body = document.body
  
  root.style.fontSize = `${s.fontSize}px`
  
  // Убираем все классы цветовых схем
  root.classList.remove('color-white', 'color-black', 'color-blue', 'color-brown', 'color-green')
  
  // Применяем цветовую схему
  if (s.colorScheme === 'white') {
    body.style.removeProperty('background-color')
    body.style.removeProperty('color')
  } else {
    root.classList.add(`color-${s.colorScheme}`)
  }
  
  const lineHeights = { normal: '1.5', medium: '1.8', large: '2.2' }
  root.style.lineHeight = lineHeights[s.lineSpacing]
  
  const letterSpacings = { normal: 'normal', medium: '0.05em', large: '0.1em' }
  root.style.letterSpacing = letterSpacings[s.letterSpacing]
  
  root.style.fontFamily = s.fontFamily === 'serif' 
    ? 'Georgia, serif' 
    : '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  
  root.classList.remove('images-off', 'images-grayscale')
  if (s.imagesMode === 'off') {
    root.classList.add('images-off')
  } else if (s.imagesMode === 'grayscale') {
    root.classList.add('images-grayscale')
  }
}

// Инициализация при загрузке страницы
if (typeof window !== 'undefined') {
  const saved = window.localStorage.getItem('accessibility-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applySettings(parsed))
      } else {
        applySettings(parsed)
      }
    } catch (e) {
      console.error('Error loading settings:', e)
    }
  }
}

export function AccessibilityPanel({ isOpen, onClose }) {
  const defaultSettings = {
    fontSize: 16,
    colorScheme: 'white',
    lineSpacing: 'normal',
    letterSpacing: 'normal',
    imagesMode: 'color',
    fontFamily: 'sans'
  }

  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('accessibility-settings')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          return defaultSettings
        }
      }
    }
    return defaultSettings
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('accessibility-settings', JSON.stringify(settings))
      applySettings(settings)
    }
  }, [settings])

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  const colorSchemes = [
    { id: 'white', label: 'Ц', bg: '#fff', text: '#000' },
    { id: 'black', label: 'Ц', bg: '#000', text: '#fff' },
    { id: 'blue', label: 'Ц', bg: '#9DD1FF', text: '#063462' },
    { id: 'brown', label: 'Ц', bg: '#F7F3D6', text: '#4D4B43' },
    { id: 'green', label: 'Ц', bg: '#3B2716', text: '#A9E44D' }
  ]

  if (!isOpen) return null

  return (
    <div className="accessibility-panel fixed top-16 left-0 right-0 z-50 border-b-4 border-gray-200 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800">
            РАЗМЕР ШРИФТА {settings.fontSize} PX
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Закрыть панель"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Размер шрифта */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">РАЗМЕР ТЕКСТА</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(12, s.fontSize - 1) }))}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-bold transition-colors text-gray-800"
                aria-label="Уменьшить шрифт"
              >
                A -
              </button>
              <span className="px-4 py-2 bg-gray-100 rounded font-mono text-gray-800">{settings.fontSize}px</span>
              <button
                onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(24, s.fontSize + 1) }))}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-bold transition-colors text-gray-800"
                aria-label="Увеличить шрифт"
              >
                A +
              </button>
            </div>
          </div>

          {/* Цветовая схема */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">ЦВЕТ САЙТА</h3>
            <div className="flex gap-2">
              {colorSchemes.map(scheme => (
                <button
                  key={scheme.id}
                  onClick={() => setSettings(s => ({ ...s, colorScheme: scheme.id }))}
                  className={`w-12 h-12 rounded-lg border-2 font-bold flex items-center justify-center transition-all ${
                    settings.colorScheme === scheme.id 
                      ? 'border-blue-600 ring-2 ring-blue-300 scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: scheme.bg, color: scheme.text }}
                  title={scheme.id}
                >
                  {scheme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Изображения */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">ИЗОБРАЖЕНИЯ</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSettings(s => ({ ...s, imagesMode: 'color' }))}
                className={`px-4 py-2 border-2 rounded-lg text-sm transition-all ${
                  settings.imagesMode === 'color' 
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-600' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
                title="Цветные"
              >
                🖼️ Цвет
              </button>
              <button
                onClick={() => setSettings(s => ({ ...s, imagesMode: 'grayscale' }))}
                className={`px-4 py-2 border-2 rounded-lg text-sm transition-all ${
                  settings.imagesMode === 'grayscale' 
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-600' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
                title="Чёрно-белые"
              >
                ⬛ Ч/Б
              </button>
              <button
                onClick={() => setSettings(s => ({ ...s, imagesMode: 'off' }))}
                className={`px-4 py-2 border-2 rounded-lg text-sm transition-all ${
                  settings.imagesMode === 'off' 
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-600' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
                title="Выключить"
              >
                ❌ Выкл
              </button>
            </div>
          </div>
        </div>

        {/* Дополнительные настройки */}
        <div className="mt-4 pt-4 border-t border-gray-300 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">МЕЖДУСТРОЧНЫЙ ИНТЕРВАЛ</h3>
            <div className="flex gap-2">
              {[
                { val: 'normal', label: 'Стандартный' },
                { val: 'medium', label: 'Средний' },
                { val: 'large', label: 'Большой' }
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setSettings(s => ({ ...s, lineSpacing: val }))}
                  className={`px-3 py-2 border-2 rounded-lg text-xs transition-all ${
                    settings.lineSpacing === val 
                      ? 'border-blue-600 bg-blue-50 font-semibold text-blue-600' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">МЕЖБУКВЕННЫЙ ИНТЕРВАЛ</h3>
            <div className="flex gap-2">
              {[
                { val: 'normal', label: 'Одинарный' },
                { val: 'medium', label: 'Полуторный' },
                { val: 'large', label: 'Двойной' }
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setSettings(s => ({ ...s, letterSpacing: val }))}
                  className={`px-3 py-2 border-2 rounded-lg text-xs transition-all ${
                    settings.letterSpacing === val 
                      ? 'border-blue-600 bg-blue-50 font-semibold text-blue-600' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">ШРИФТ</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSettings(s => ({ ...s, fontFamily: 'sans' }))}
                className={`px-4 py-2 border-2 rounded-lg text-xs transition-all ${
                  settings.fontFamily === 'sans' 
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-600' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
              >
                Без засечек
              </button>
              <button
                onClick={() => setSettings(s => ({ ...s, fontFamily: 'serif' }))}
                className={`px-4 py-2 border-2 rounded-lg text-xs font-serif transition-all ${
                  settings.fontFamily === 'serif' 
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-600' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-800'
                }`}
              >
                С засечками
              </button>
            </div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={resetSettings}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-sm transition-colors text-gray-800"
          >
            Настройки по умолчанию
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors"
          >
            Закрыть панель
          </button>
        </div>
      </div>
    </div>
  )
}