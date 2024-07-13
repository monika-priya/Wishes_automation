var greetings_SENT = "WISHED";

var Image_Url ='https://res.cloudinary.com/dewqtbz3g/image/upload/v1720872883/WhatsApp_Image_2024-07-13_at_5.38.54_PM_fdtlla.jpg';

function sendMessages() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var dataRange = sheet.getRange(1, 1, lastRow, 5);
  var data = dataRange.getValues();
  var todayDate = new Date();
  var todayDay = todayDate.getDate();
  var todayMonth = todayDate.getMonth() + 1;

  for (var i = 1; i < data.length; ++i) {
    var row = data[i];
    var date = row[3];
    var event = row[4];
    var sheetDate = new Date(date);
    var sheetDay = sheetDate.getDate();
    var sheetMonth = sheetDate.getMonth() + 1;

    if (todayDay === sheetDay && todayMonth === sheetMonth && row[5] !== greetings_SENT) {
      var name = row[2];
      var message = "Happy Krishna Conscious blissful " + (event === "BD" ? "Birthday " : "Wedding Anniversary ") + name + "!";
      var imageUrl = _processImage(name, message);
      sendWhatsAppMessage(row[1], message, imageUrl);
      sendEmail(row[0], message, imageUrl);
      sheet.getRange(i + 1, 5).setValue(greetings_SENT);
      SpreadsheetApp.flush();
    }
  }
}

function _processImage(name, message) {
  var baseUrl = Image_Url;
  var text = message;
  // Use an image processing API to overlay text on image
  var processedImageUrl = UrlFetchApp.fetch(`https://api.image-processing-service.com/overlay?image=${encodeURIComponent(baseUrl)}&text=${encodeURIComponent(text)}&bgColor=black`).getContentText();
  return processedImageUrl;
}

function sendWhatsAppMessage(phoneNumber, message, imageUrl) {
  var url = "https://api.whatsapp.com/send?phone=" + encodeURIComponent(phoneNumber) + "&text=" + encodeURIComponent(message);
  UrlFetchApp.fetch(url); 
}

function sendEmail(email, message, imageUrl) {
  MailApp.sendEmail({
    to: email,
    subject: "Greetings from NRJD",
    htmlBody: "<html><body>" +
              "<p>" + message + "</p>" +
              "<img src='" + imageUrl + "' width='80%' height='90%'><br><br>" +
              "<p>With regards,</p>" +
              "<p>NRJD</p>" +
              "</body></html>"
  });
}
