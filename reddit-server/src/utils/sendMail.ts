import nodemailer from "nodemailer";

export async function sendMail(to: string, text: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // let testAccount = await nodemailer.createTestAccount();
    // console.log(testAccount);
    let testAccount = {
        user: 'krcyywzoh5tbom7j@ethereal.email',
        pass: 'tjH4UmFJSM31yW7ydt',
        smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
        imap: { host: 'imap.ethereal.email', port: 993, secure: true },
        pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
        web: 'https://ethereal.email'
    }
      
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: to, // list of receivers
        subject: "Hello ✔", // Subject line
        html: text, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
