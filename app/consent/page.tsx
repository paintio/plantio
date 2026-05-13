'use client'

import Link from 'next/link'

export default function ConsentPage() {
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Согласие на обработку персональных данных</h1>
          
          <div className="space-y-6 text-gray-700">
            <p>Я, являясь пользователем сайта Plantio (далее — Оператор), своей волей и в своем интересе даю согласие Оператору на обработку моих персональных данных.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Перечень персональных данных:</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Фамилия, имя, отчество</li>
                <li>Номер контактного телефона</li>
                <li>Адрес электронной почты</li>
                <li>Адрес доставки товаров</li>
                <li>Платежные реквизиты</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Цели обработки данных:</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Регистрация и авторизация на сайте</li>
                <li>Оформление и доставка заказов</li>
                <li>Обратная связь с пользователем</li>
                <li>Информирование о статусе заказа</li>
                <li>Улучшение качества обслуживания</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Срок действия согласия:</h2>
              <p>Настоящее согласие действует бессрочно с момента регистрации на сайте. Отзыв согласия осуществляется путем направления письменного уведомления на электронную почту privacy@plantio.com.</p>
            </section>

            <div className="bg-green-50 p-4 rounded-xl mt-6">
              <p className="text-green-800">✅ Нажимая "Зарегистрироваться" или "Войти", вы подтверждаете, что ознакомлены с условиями и даете согласие на обработку персональных данных.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
