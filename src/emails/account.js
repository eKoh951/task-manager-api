const sgMail = require('@sendgrid/mail')

const sendgrindAPIKey = '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'

sgMail.setApiKey(sendgrindAPIKey)

sgMail.send({
	to: 'greatekoh@gmail.com',
	from: 'greatekoh@gmail.com',
	subject: 'This is my first mail',
	text: 'An this is the content'
})