const sgMail = require('@sendgrid/mail')

const sendgrindAPIKey = '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'

sgMail.setApiKey(sendgrindAPIKey)

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