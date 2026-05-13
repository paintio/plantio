'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🌱 Plantio
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Пользовательское соглашение</h1>
          <p className="text-gray-500 mb-8">Последнее обновление: 12 мая 2024 г.</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Термины и определения</h2>
              <p>1.1. Plantio — интернет-платформа для покупки и продажи растений.</p>
              <p>1.2. Пользователь — дееспособное физическое лицо, использующее сайт.</p>
              <p>1.3. Продавец — пользователь, размещающий товары на платформе.</p>
              <p>1.4. Покупатель — пользователь, приобретающий товары на платформе.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Предмет соглашения</h2>
              <p>2.1. Продавец размещает информацию о товарах на платформе.</p>
              <p>2.2. Покупатель выбирает и оплачивает товары.</p>
              <p>2.3. Plantio предоставляет площадку для совершения сделок.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Правила размещения товаров</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Товары должны соответствовать категории "Растения"</li>
                <li>Запрещено размещение запрещенных растений</li>
                <li>Цена должна быть указана в Euro (€)</li>
                <li>Фотографии должны соответствовать реальному товару</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Ответственность сторон</h2>
              <p>4.1. Plantio не несет ответственности за качество товаров.</p>
              <p>4.2. Продавец несет ответственность за достоверность информации о товаре.</p>
              <p>4.3. Покупатель обязуется оплатить товар после получения.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Порядок разрешения споров</h2>
              <p>Все споры решаются путем переговоров. При недостижении согласия — в судебном порядке по месту нахождения Plantio.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Реквизиты</h2>
              <p>ИП Иванов И.И.<br />ИНН: 1234567890<br />ОГРНИП: 123456789012345<br />Юридический адрес: г. Москва, ул. Цветочная, д. 1</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
