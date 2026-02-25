import { Handler, HandlerEvent } from '@netlify/functions';
import { success, error } from './_lib/response';

interface ParticipantInfo {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  profession: string;
  companyName: string;
  address: string;
  message: string;
}

interface BookingData {
  seminarTitle: string;
  destination: string;
  tripDates: string;
  participantsCount: number;
  pricePerPerson: number;
  totalAmount: number;
  currency: string;
  promoCode?: string;
  promoDiscount?: number;
  participants: ParticipantInfo[];
}

// Format participants for email
function formatParticipants(participants: ParticipantInfo[]): string {
  return participants
    .map(
      (p, i) => `
<h3>Participant ${i + 1}</h3>
<ul>
  <li><strong>Nom:</strong> ${p.lastName}</li>
  <li><strong>Prénom:</strong> ${p.firstName}</li>
  <li><strong>Email:</strong> ${p.email}</li>
  <li><strong>Téléphone:</strong> ${p.countryCode}${p.phone}</li>
  <li><strong>Profession:</strong> ${p.profession}</li>
  <li><strong>Société:</strong> ${p.companyName}</li>
  <li><strong>Adresse:</strong> ${p.address}</li>
  ${p.message ? `<li><strong>Message:</strong> ${p.message}</li>` : ''}
</ul>
`
    )
    .join('');
}

// Send email using Resend
async function sendEmailWithResend(booking: BookingData) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gli-international.com';
  const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@gli-international.com';

  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const currencySymbol = booking.currency === 'EUR' ? '€' : booking.currency;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; }
    .summary { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #1a1a1a; }
    .summary-item { margin: 10px 0; }
    .total { font-size: 1.2em; font-weight: bold; color: #1a1a1a; }
    ul { list-style: none; padding-left: 0; }
    li { margin: 5px 0; }
    h3 { color: #1a1a1a; border-bottom: 2px solid #e7e3d8; padding-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Nouvelle demande de réservation</h1>
    </div>

    <div class="content">
      <div class="summary">
        <h2>Détails de la formation</h2>
        <div class="summary-item"><strong>Formation:</strong> ${booking.seminarTitle}</div>
        <div class="summary-item"><strong>Destination:</strong> ${booking.destination}</div>
        <div class="summary-item"><strong>Dates du voyage:</strong> ${booking.tripDates}</div>
        <div class="summary-item"><strong>Nombre de participants:</strong> ${booking.participantsCount}</div>
        <div class="summary-item"><strong>Prix par personne:</strong> ${booking.pricePerPerson}${currencySymbol}</div>
        ${
          booking.promoCode
            ? `
        <div class="summary-item"><strong>Code promo:</strong> ${booking.promoCode}</div>
        <div class="summary-item" style="color: #16a34a;"><strong>Réduction:</strong> -${booking.promoDiscount?.toFixed(2)}${currencySymbol}</div>
        `
            : ''
        }
        <div class="summary-item total">💰 Total: ${booking.totalAmount.toFixed(2)}${currencySymbol}</div>
      </div>

      <h2>Informations des participants</h2>
      ${formatParticipants(booking.participants)}

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

      <p style="color: #666; font-size: 0.9em;">
        Cette demande a été envoyée depuis le site web GLI International.<br>
        Pour répondre au client, utilisez l'email du premier participant: <strong>${booking.participants[0].email}</strong>
      </p>
    </div>
  </div>
</body>
</html>
`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🎓 Nouvelle réservation - ${booking.seminarTitle}`,
      html: emailHtml,
      reply_to: booking.participants[0].email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Resend API error:', errorData);
    throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

// Alternative: Send email using SendGrid (commented out - uncomment if you prefer SendGrid)
/*
async function sendEmailWithSendGrid(booking: BookingData) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gli-international.com';
  const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@gli-international.com';

  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not configured');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: ADMIN_EMAIL }],
        subject: `🎓 Nouvelle réservation - ${booking.seminarTitle}`,
      }],
      from: { email: FROM_EMAIL },
      reply_to: { email: booking.participants[0].email },
      content: [{
        type: 'text/html',
        value: emailHtml,
      }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('SendGrid API error:', errorData);
    throw new Error(`Failed to send email: ${errorData}`);
  }

  return { success: true };
}
*/

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    // Parse request body
    const booking: BookingData = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!booking.seminarTitle || !booking.participants || booking.participants.length === 0) {
      return error('Missing required booking information', 400);
    }

    // Validate participants data
    for (const participant of booking.participants) {
      if (!participant.firstName || !participant.lastName || !participant.email) {
        return error('All participants must have first name, last name, and email', 400);
      }
    }

    // Send email notification
    console.log('Sending booking notification email...');
    const result = await sendEmailWithResend(booking);
    console.log('Email sent successfully:', result);

    // TODO: Store booking in database if needed
    // const supabase = createSupabaseClient();
    // await supabase.from('bookings').insert({ ... });

    return success({
      success: true,
      message: 'Booking request submitted successfully',
      emailId: result.id,
    });
  } catch (err: any) {
    console.error('Error processing booking:', err);
    return error(err.message || 'Failed to process booking request', 500);
  }
};
