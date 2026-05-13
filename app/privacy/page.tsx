'use client'

import Link from 'next/link'

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Политика конфиденциальности</h1>
          <p className="text-gray-500 mb-8">Последнее обновление: 12 мая 2024 г.</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Общие положения</h2>
              <p>Настоящая политика конфиденциальности (далее — Политика) действует в отношении всей информации, которую Plantio может получить о пользователе во время использования сайта.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Какие данные мы собираем</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Имя, фамилия, отчество</li>
                <li>Контактный телефон</li>
                <li>Адрес электронной почты</li>
                <li>Адрес доставки товаров</li>
                <li>История заказов</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Цели обработки данных</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Обработка и доставка заказов</li>
                <li>Связь с пользователем</li>
                <li>Улучшение качества обслуживания</li>
                <li>Информирование о акциях и новинках</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Условия обработки и передачи данных</h2>
              <p>Мы не передаем персональные данные третьим лицам без согласия пользователя, за исключением случаев, предусмотренных законодательством РФ.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Права пользователя</h2>
              <p>Пользователь имеет право на получение информации о своих персональных данных, их изменение и удаление. Для этого необходимо обратиться в службу поддержки.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Контактная информация</h2>
              <p>По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться по электронной почте: privacy@plantio.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
