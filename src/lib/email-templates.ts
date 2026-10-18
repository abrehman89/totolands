interface OrderItem {
  name: string
  image: string
  price: number
  qty: number
}

interface OrderEmailData {
  orderId: string
  fullName: string
  phone: string
  address: string
  city: string
  province?: string | null
  paymentMethod: string
  items: OrderItem[]
  total: number
  deliveryFee: number
}

export function buildOrderConfirmationEmail(data: OrderEmailData): string {
  const { orderId, fullName, phone, address, city, province, paymentMethod, items, total, deliveryFee } = data
  const shortId = orderId.slice(-8).toUpperCase()
  const subtotal = total - deliveryFee

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f4f6;">
        <div style="font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:600;color:#0f1f28;">${item.name}</div>
        <div style="font-family:'Nunito',Arial,sans-serif;font-size:12px;color:#6b8c98;margin-top:2px;">Qty × ${item.qty}</div>
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f4f6;text-align:right;font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:700;color:#2E6B7A;white-space:nowrap;">
        Rs. ${(item.price * item.qty).toLocaleString()}
      </td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Order Confirmed — Totolands</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f6;font-family:'Nunito',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="background:#2E6B7A;border-radius:16px;padding:24px 32px;text-align:center;">
                <div style="font-size:32px;margin-bottom:8px;">🧸</div>
                <div style="font-family:Arial,sans-serif;font-size:24px;font-weight:700;color:#F5C842;letter-spacing:1px;">TOTOLANDS</div>
                <div style="font-family:'Nunito',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.75);margin-top:4px;">Your Kids Toy Store</div>
              </div>
            </td>
          </tr>

          <!-- Confirmation banner -->
          <tr>
            <td style="background:#6AAF3D;border-radius:16px;padding:24px 32px;text-align:center;margin-bottom:20px;">
              <div style="font-size:40px;margin-bottom:8px;">🎉</div>
              <div style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#fff;">Order Confirmed!</div>
              <div style="font-family:'Nunito',Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.9);margin-top:6px;">
                Thank you, ${fullName}! Your order is on its way.
              </div>
              <div style="background:rgba(255,255,255,0.2);border-radius:8px;display:inline-block;padding:6px 20px;margin-top:12px;">
                <span style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#fff;letter-spacing:1px;">Order #${shortId}</span>
              </div>
            </td>
          </tr>

          <tr><td style="height:20px;"></td></tr>

          <!-- Order items -->
          <tr>
            <td style="background:#fff;border-radius:16px;overflow:hidden;">
              <div style="padding:20px 24px 12px;border-bottom:2px solid #f0f4f6;">
                <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1E4F5A;">Items Ordered</div>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 24px;">
                ${itemRows}
              </table>
              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:12px 24px 20px;">
                <tr>
                  <td style="font-family:'Nunito',Arial,sans-serif;font-size:13px;color:#6b8c98;padding:4px 0;">Subtotal</td>
                  <td style="text-align:right;font-family:'Nunito',Arial,sans-serif;font-size:13px;color:#6b8c98;padding:4px 0;">Rs. ${subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-family:'Nunito',Arial,sans-serif;font-size:13px;color:#6b8c98;padding:4px 0;">Delivery</td>
                  <td style="text-align:right;font-family:'Nunito',Arial,sans-serif;font-size:13px;color:#6b8c98;padding:4px 0;">${deliveryFee === 0 ? 'Free 🎁' : `Rs. ${deliveryFee}`}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#0f1f28;padding-top:10px;border-top:2px solid #f0f4f6;">Total</td>
                  <td style="text-align:right;font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#2E6B7A;padding-top:10px;border-top:2px solid #f0f4f6;">Rs. ${total.toLocaleString()}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:16px;"></td></tr>

          <!-- Delivery & Payment info -->
          <tr>
            <td style="background:#fff;border-radius:16px;padding:20px 24px;">
              <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1E4F5A;margin-bottom:14px;">Delivery Details</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:6px 0;vertical-align:top;">
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#6b8c98;font-weight:700;">Name</div>
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:600;color:#0f1f28;margin-top:2px;">${fullName}</div>
                  </td>
                  <td width="50%" style="padding:6px 0;vertical-align:top;">
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#6b8c98;font-weight:700;">Phone</div>
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:600;color:#0f1f28;margin-top:2px;">${phone}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:6px 0;">
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#6b8c98;font-weight:700;">Address</div>
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:600;color:#0f1f28;margin-top:2px;">${address}, ${city}${province ? ', ' + province : ''}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:6px 0;">
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#6b8c98;font-weight:700;">Payment Method</div>
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:600;color:#0f1f28;margin-top:2px;">${paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 PayFast'}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:16px;"></td></tr>

          <!-- What happens next -->
          <tr>
            <td style="background:#E4F3F7;border-radius:16px;padding:20px 24px;">
              <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1E4F5A;margin-bottom:14px;">What happens next?</div>
              ${[
                ['✅', 'Order Confirmed', 'We\'ve received your order and are preparing it.'],
                ['📦', 'Packed & Ready', 'Your items will be carefully packed within 24 hours.'],
                ['🚚', 'Out for Delivery', 'Our courier will deliver to your address within 2–5 days.'],
                ['🎁', 'Enjoy!', 'Unbox the joy and let the play begin!'],
              ].map(([icon, title, desc]) => `
                <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
                  <span style="font-size:20px;flex-shrink:0;">${icon}</span>
                  <div>
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:700;color:#1E4F5A;">${title}</div>
                    <div style="font-family:'Nunito',Arial,sans-serif;font-size:13px;color:#4a7a8a;margin-top:2px;">${desc}</div>
                  </div>
                </div>
              `).join('')}
            </td>
          </tr>

          <tr><td style="height:16px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:16px 0;">
              <a href="https://totolands.com/products"
                style="display:inline-block;background:#2E6B7A;color:#fff;font-family:Arial,sans-serif;
                       font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;
                       border-radius:50px;letter-spacing:0.5px;">
                Continue Shopping 🛍️
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 0;text-align:center;">
              <div style="font-family:'Nunito',Arial,sans-serif;font-size:12px;color:#9ab0b8;">
                Questions? WhatsApp or call us · totolands.com
              </div>
              <div style="font-family:'Nunito',Arial,sans-serif;font-size:11px;color:#b0c4cc;margin-top:6px;">
                © ${new Date().getFullYear()} Totolands — Pakistan's Favourite Kids Toy Store
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}
