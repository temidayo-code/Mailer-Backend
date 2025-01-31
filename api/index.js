require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(
  cors({
    origin: "https://mailer-mauve-beta.vercel.app/",
  })
);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API endpoint to send emails
app.post("/send-email", async (req, res) => {
  const { recipients, subject, htmlContent } = req.body;
  const emailList = recipients.split(",").map((email) => email.trim());

  try {
    // Send emails sequentially
    for (const recipient of emailList) {
      const mailOptions = {
        from: "your-email@gmail.com",
        to: recipient,
        subject: subject,
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${recipient}`);
    }

    res.json({ success: true, message: "All emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ success: false, message: "Error sending emails" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
