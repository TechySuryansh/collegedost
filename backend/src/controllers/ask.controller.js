const sendEmail = require('../utils/sendEmail');

exports.postQuestion = async (req, res) => {
    try {
        const { question, userEmail, userName } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, message: 'Please provide a question' });
        }

        // Use the SMTP_EMAIL from env as the Manager's email to receive inquiries
        // If there's a specific MANAGER_EMAIL, we could use that, but defaulting to SMTP_EMAIL is safe based on available envs.
        const managerEmail = process.env.MANAGER_EMAIL || process.env.SMTP_EMAIL;

        if (!managerEmail) {
            console.warn("Manager email not configured. Using mock logging.");
        }

        const subject = `New Question from CollegeDost: ${userName || 'Guest'}`;
        const message = `You have received a new question from ${userName || 'Guest'} (${userEmail || 'No email provided'}).\n\nQuestion:\n${question}`;

        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #ea580c;">New Question Received</h2>
                <p><strong>From:</strong> ${userName || 'Guest'} (<a href="mailto:${userEmail}">${userEmail || 'No email'}</a>)</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <h3 style="color: #333;">Question:</h3>
                <p style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; font-size: 16px; line-height: 1.5;">
                    ${question.replace(/\n/g, '<br>')}
                </p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">This message was sent from the CollegeDost "Ask" form.</p>
            </div>
        `;

        await sendEmail({
            email: managerEmail, // Send TO the manager
            subject,
            message,
            html
        });

        res.status(200).json({ success: true, message: 'Question sent successfully' });

    } catch (error) {
        console.error("Ask Controller Error:", error);
        res.status(500).json({ success: false, message: 'Failed to send question' });
    }
};
