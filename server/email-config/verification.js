Accounts.emailTemplates.siteName = "DDV - Software de gestión ";
Accounts.emailTemplates.from     = "DDV <daniel@grupoddv.com>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Verifica tu dirección de correo electronico";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "daniel@grupoddv.com",
        emailBody      = `Para verificar tu dirección de correo electronico (${emailAddress}) visita el siguiente link:\n\n${urlWithoutHash}\n\n Si no solicitaste esta verificación, por favor ignora este email. Si sientes que hubo un error, por favor contactate con nuestro equipo de soporte: ${supportEmail}.`;

    return emailBody;
  }
};
