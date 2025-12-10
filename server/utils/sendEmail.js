import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // For development, if no email creds are provided, we can log the messageUrl.
    // Ideally user provides SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD in .env

    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail', // Default to gmail or check host
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Saha AI'} <${process.env.FROM_EMAIL || 'noreply@sahaai.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // could add HTML support later
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
