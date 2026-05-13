'use client'

interface Order {
  id: string
  total: number
  status: string
  items: any[]
  createdAt: string
}

interface User {
  name: string
  email: string
  phone: string
  city: string
}

export function printInvoice(order: Order, user: User) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.listing?.title || 'Товар'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price} €</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price * item.quantity} €</td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Чек #${order.id.slice(-8)}</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2e7d32;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2e7d32;
        }
        .order-info {
          margin-bottom: 20px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #2e7d32;
          color: white;
          padding: 10px;
          text-align: left;
        }
        .total {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 2px solid #ddd;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; padding: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🌱 Plantio</div>
        <div>Маркетплейс растений</div>
      </div>
      
      <div class="order-info">
        <p><strong>Заказ #${order.id.slice(-8)}</strong></p>
        <p>Дата: ${new Date(order.createdAt).toLocaleString('ru-RU')}</p>
        <p>Статус: ${order.status === 'paid' ? 'Оплачен' : order.status}</p>
        <p>Клиент: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Телефон: ${user.phone}</p>
        <p>Город: ${user.city}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Товар</th>
            <th>Кол-во</th>
            <th>Цена</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div class="total">
        Итого: ${order.total.toFixed(2)} €
      </div>
      
      <div class="footer">
        <p>Спасибо за покупку!</p>
        <p>По всем вопросам: support@plantio.com</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer;">
          🖨️ Печать чека
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
          ✕ Закрыть
        </button>
      </div>
    </body>
    </html>
  `
  
  printWindow.document.write(html)
  printWindow.document.close()
}
