import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password (or App Password for Gmail)
    }
});

export const sendInquiryEmail = async (inquiry) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Skipping email notification: EMAIL_USER or EMAIL_PASS not set.');
        return false;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to Admin (default to sender)
            subject: `New Inquiry from ${inquiry.name} - StarX Properties`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Property Inquiry</h2>
          <p>You have received a new inquiry from the website.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> ${inquiry.email}</p>
            <p><strong>Phone:</strong> ${inquiry.phone}</p>
            <p><strong>Property ID:</strong> ${inquiry.propertyId}</p>
          </div>
          
          <h3>Message:</h3>
          <p style="background-color: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px;">
            ${inquiry.message}
          </p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Inquiry email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
