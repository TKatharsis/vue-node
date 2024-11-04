const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const {logger} = require("firebase-functions");

const THRESHOLD_TEMP = 30; // Set your threshold value
const THRESHOLD_HUMIDITY = 70; // Set your threshold value

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com", // Replace with your email
    pass: "YOUR_EMAIL_PASSWORD", // Replace with your email password
  },
});

exports.sendNotificationEmail = functions.database
    .ref("/sensorData/{pushId}")
    .onCreate((snapshot, context) => {
      const data = snapshot.val();
      const temperature = data.temperature;
      const humidity = data.humidity;

      if (temperature > THRESHOLD_TEMP || humidity > THRESHOLD_HUMIDITY) {
        const mailOptions = {
          from: "YOUR_EMAIL@gmail.com", // Replace with your email
          to: "USER_EMAIL@gmail.com", // Replace with the recipient's email
          subject: "Alert: Temperature/Humidity Threshold Exceeded",
          text: `The temperature is ${temperature}°C and 
               humidity is ${humidity}%.`,
        };

        return transporter.sendMail(mailOptions)
            .then(() => logger.log("Email sent"))
            .catch((error) => logger.error("Error sending email:", error));
      } else {
        return null;
      }
    });
