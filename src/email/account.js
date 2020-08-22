const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: 'abiolajohnson20@gmail.com',
        to: email,
        subject: 'Welcome email',
        text: `Welcome to the task app ${name}. Let me know how you are geting along.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'abiolajohnson20@gmail.com',
        subject: 'GoodBye!',
        text: `Good bye ${name}!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}