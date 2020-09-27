import nodemailer from "nodemailer";

export async function sendMail(to: string, text: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // let testAccount = await nodemailer.createTestAccount();
    // console.log(testAccount);

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'pjdykpmolj34xmfc@ethereal.email', // generated ethereal user
            pass: 'Cdzr5dxdPvEHqa3B78', // generated ethereal password
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
