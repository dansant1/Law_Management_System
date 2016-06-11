Accounts.emailTemplates.siteName = "ASEP";
Accounts.emailTemplates.from     = "ASEP <admin@grupoddv.pw>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Verifica tu dirección de correo electronico";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "soporte@asep.org",
        emailBody      = `Para verificar tu dirección de correo electronico (${emailAddress}) visita el siguiente link:\n\n${urlWithoutHash}\n\n Si no solicitaste esta verificación, por favor ignora este email. Si sientes que hubo un error, por favor contactate con nuestro equipo de soporte: ${supportEmail}.`;

    return emailBody;
  }
};
