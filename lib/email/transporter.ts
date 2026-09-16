import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    try {
        await transporter.sendMail({
            from: `"AnserTech" <${process.env.EMAIL_HOST_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        // Email sent successfully
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

export default transporter;
