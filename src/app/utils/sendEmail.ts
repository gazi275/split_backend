import nodemailer from "nodemailer"
import config from "../../config"

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!config.smtp.user || !config.smtp.pass) {
      throw new Error("Missing SMTP credentials")
    }

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    })

    const mailOptions = {
      from: `"Support Team" <${config.smtp.from}>`,
      to,
      subject,
      text: html.replace(/<[^>]+>/g, ""),
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent:  ${info.messageId}`)
    return info.messageId
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email error"
    console.error(`Error sending email: ${errorMessage}`)
    throw new Error(`Failed to send email. ${errorMessage}`)
  }
}
