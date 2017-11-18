import mailgun from 'mailgun-js';
import { detect } from 'gender-detection';

/**
 * @method gender
 * @param {String} name
 * @return {String}
 */
function gender(name) {

    switch (detect(name)) {
        case 'male': return 'his';
        case 'female': return 'her';
        default: return 'their';
    }

}

/**
 * @method sendMail
 * @param {Object} request
 * @param {Object} response
 * @return {void}
 */
export default function sendMail(request, response) {

    try {

        const apiKey = process.env.CARPETBASE_SMTP_KEY;
        const mail = mailgun({ apiKey, domain: 'sandbox5c634282fac543aa8ab43c9558a6c3c6.mailgun.org' });
        const { firstName, lastName, email, message } = request.body;
        const fullName = `${firstName} ${lastName}`;
        const body = {
            from: email,
            to: process.env.CARPETBASE_EMAIL,
            replyTo: `${firstName} ${lastName} ${email}`,
            subject: 'CarpetBase - General Enquiry',
            text: `
                You have received a new general enquiry from ${fullName}.
    
                Message reads:
    
                ---
                ${message}
                ---
    
                You can hit "reply" to respond to ${firstName} directly, or you can use ${gender(fullName)} e-mail address: ${email}.
    
                Regards,
                CarpetBot.
            `
        };

        // Send the e-mail, and respond with whether it succeeded or not.
        mail.messages().send(body, err => response.send({ sent: !err }));

    } catch (err) {

        // Unable to send the e-mail to an error, which we'll send in the response.
        response.send({ sent: false, error: err });

    }

}
