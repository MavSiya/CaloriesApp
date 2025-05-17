class MailService {
    async sendActivationMail(to, link) {
      const response = await fetch("https://notify.cx/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NOTIFY_API_KEY,
        },
        body: JSON.stringify({
          to,
          subject: "Активація акаунта на " + process.env.API_URL,
          message: "Для активації акаунта перейдіть за посиланням: " + link,
        }),
      });
  
      const data = await response.json();
      console.log(data);
    }
  }
  
export default new MailService();