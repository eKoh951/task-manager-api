const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'greatekoh@gmail.com',
		subject: 'Thanks for joining in!',
		text: `Welcome to the app ${name}! Let me know hou you get along with the app`
	})
}

const sendGoodbyeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'greatekoh@gmail.com',
		subject: 'This is the goodbye...',
		text: `We are not sorry for letting you go ${name}, but we have to be "polite", well, ggs.`
	})
}

module.exports = {
	sendWelcomeEmail,
	sendGoodbyeEmail
}