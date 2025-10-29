const nodemailer = require("nodemailer");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Create transporter - lazy initialization to avoid blocking server start
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

const sendAppointmentReminders = async () => {
  try {
    /* 
    const now = new Date(); const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1); const twoDaysLater = new Date(now); twoDaysLater.setDate(twoDaysLater.getDate() + 2); // Find appointments in the next 2 days that haven't been reminded const appointments = await Appointment.find({ appointmentDate: { $gte: now, $lte: twoDaysLater }, status: 'scheduled', reminderSent: false }) .populate('doctor') .populate('user');
    */
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    console.log("Now:", now);
    console.log("Tomorrow:", tomorrow);
    console.log("End of Tomorrow:", endOfTomorrow);

    // Find appointments exactly one day before their date that haven't been reminded
    const appointments = await Appointment.find({
      appointmentDate: { $gte: tomorrow, $lte: endOfTomorrow },

      status: "scheduled",
      reminderSent: false,
    })
      .populate("doctor")

      .populate("user")
      .populate("documents");

    console.log(
      `Found ${appointments.length} appointments to send reminders for`
    );

    for (const appointment of appointments) {
      try {
        const appointmentDate = new Date(appointment.appointmentDate);
        const formattedDate = appointmentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        let documentLinks = "";
        if (appointment.documents && appointment.documents.length > 0) {
          documentLinks = `
            <div style="margin-top: 15px;">
              <p><strong>Attached Reports:</strong></p>
              <ul>
                ${appointment.documents
                  .map(
                    (doc) => `
                  <li>
                    <a href="${
                      doc.fileUrl
                    }" target="_blank" style="color:#007BFF;">
                      ${doc.title || doc.fileUrl.split("/").pop()}
                    </a>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          `;
        }

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.user.email,
          subject: "HealthSync: Upcoming Appointment Reminder",
          html: `
            <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0D1B2A;">Appointment Reminder</h2>
              <p>Hello ${appointment.user.name},</p>
              <p>This is a reminder about your upcoming appointment:</p>
              <div style="background-color: #F8F9FA; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
                <p><strong>Doctor:</strong> ${appointment.doctor.name}</p>
                <p><strong>Specialty:</strong> ${appointment.doctor.specialty}</p>
                <p><strong>Clinic:</strong> ${appointment.doctor.clinic}</p>
                <p><strong>Reason:</strong> ${appointment.reason}</p>
                ${documentLinks}
              </div>
              <p>Please make sure to arrive 15 minutes early.</p>
              <p style="color: #6C757D; font-size: 14px; margin-top: 30px;">
                This is an automated reminder from HealthSync.
              </p>
            </div>
          `,
        };

        await getTransporter().sendMail(mailOptions);

        // Mark as reminded
        appointment.reminderSent = true;
        appointment.lastReminderSent = new Date();
        await appointment.save();

        console.log(`Reminder sent for appointment ${appointment._id}`);
      } catch (error) {
        console.error(
          `Error sending reminder for appointment ${appointment._id}:`,
          error
        );
      }
    }

    return { sent: appointments.length };
  } catch (error) {
    console.error("Error in sendAppointmentReminders:", error);
    throw error;
  }
};

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use your custom SMTP
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASSWORD, // app password (not normal password)
      },
    });

    const mailOptions = {
      from: `"HealthSync" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendAppointmentReminders, sendEmail };
