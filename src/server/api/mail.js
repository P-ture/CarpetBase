import mailgun from 'mailgun-js';

/**
 * @method sendMail
 * @param {Object} request
 * @param {Object} response
 * @return {void}
 */
export default function sendMail(request, response) {

    const apiKey = process.env.CARPETBASE_SMTP_KEY;
    const mail = mailgun({ apiKey, domain: 'sandbox5c634282fac543aa8ab43c9558a6c3c6.mailgun.org' });
    const { firstName, lastName, email, message } = request.body;
    const data = {
        from: email,
        to: process.env.CARPETBASE_EMAIL,
        replyTo: `${firstName} ${lastName} ${email}`,
        subject: 'CarpetBase - General Enquiry',
        text: `
            You have received a new general enquiry from ${firstName} ${lastName}.

            Message reads:

            ---
            ${message}
            ---

            You can hit "reply" to respond to ${firstName} directly, or you can use their e-mail address: ${email}.

            With love,
            CarpetBot.
        `
    };

    mail.messages().send(data, (err, body) => {
        return void (err ? response.redirect('/contact.html?error=failed') : response.send({ ok: true }));
    });

}
