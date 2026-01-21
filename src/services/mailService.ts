import nodemailer from 'nodemailer';

type MailProps = {
    to: string;
    invitationId?: string;
};

// interface ResetPasswordEmailProps extends MailProps {
//     token: string;
// }

// interface SendInviteEmailOptions extends MailProps {
//     invitedBy: string;
//     tenantName: string;
//     inviteLink: string;
// }

export class MailService {
    private transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io', // ou 'smtp.gmail.com'
        port: 2525,
        auth: {
            user: 'aac5ddcbdf1585',
            pass: 'dd7b65e7e5db79',
        },
    });

    // async sendEmailWithResetPasswordToken({ to, token }: MailProps) {
    //     const resetLink = `${process.env.FRONT_URL!}/reset-password/${token}`;

    //     const mailOptions = {
    //         from: 'FeedbackLoop <no-reply@feedbackloop.com>',
    //         to,
    //         subject: 'Redefinição de senha',
    //         html: `
    //             <p>Olá,</p>
    //             <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
    //             <p>Para criar uma nova senha, clique no link abaixo:</p>
    //             <a href="${resetLink}">Redefinir minha senha</a>
    //             <p>Esse link é válido por 15 minutos. Se você não solicitou essa alteração, pode ignorar este e-mail.</p>
    //             <p>Atenciosamente,<br>Equipe FeedbackLoop</p>
    //         `,
    //         text: `
    //             Olá,

    //             Recebemos uma solicitação para redefinir a senha da sua conta.
    //             Para criar uma nova senha, acesse o link abaixo:

    //             ${resetLink}

    //             Esse link é válido por 15 minutos. Se você não solicitou essa alteração, pode ignorar este e-mail.

    //             Atenciosamente,
    //             Equipe FeedbackLoop
    //         `,
    //     };

    //     await this.transporter.sendMail(mailOptions);
    // }

    async sendEmailWithFeedbackNotification({ to }: MailProps) {
        const mailOptions = {
            from: 'FeedbackLoop <no-reply@feedbackloop.com>',
            to,
            subject: 'Você recebeu um novo feedback!',
            html: `
                <p>Olá,</p>
                <p>Você recebeu um novo feedback de um colega.</p>
                <p>Para visualizar o feedback acesse a plataforma</p>
                <p>Se você não esperava este e-mail, pode ignorá-lo com segurança.</p>
                <p>Atenciosamente,<br>Equipe FeedbackLoop</p>
            `,
            text: `
                Olá,

                Você recebeu um novo feedback de um colega.

                Para visualizar o feedback acesse a plataforma

                Se você não esperava este e-mail, pode ignorá-lo com segurança.

                Atenciosamente,
                Equipe FeedbackLoop
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendInviteEmail({ to, invitationId }: MailProps) {
        const inviteLink = `http://localhost:3000/signUp/${invitationId}`;
        const mailOptions = {
            from: 'FeedbackLoop <no-reply@feedbackloop.com>',
            to,
            subject: 'Você foi foi convidado para se juntar ao FeedbackLoop',
            html: `
                <div style="font-family: sans-serif; padding: 24px; background: #f9f9f9;">
                    <h2 style="color: #333;">Olá,</h2>
                    <p>Você foi foi convidado para participar do FeedbackLoop, nosso novo espaço dedicado ao compartilhamento de feedbacks e crescimento profissional.</p>
                    <p>Acreditamos que feedbacks honestos e construtivos são a melhor ferramenta para evoluirmos juntos. Queremos que você faça parte disso!</p>
                    <p>Para começar, basta clicar no botão abaixo e fazer seu cadastro:</p>
                    <a href="${inviteLink}" style="display: inline-block; margin-top: 16px; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
                        Aceitar convite e Criar Conta
                    </a>
                    <p style="margin-top: 24px; font-size: 12px; color: #777;">Se você não esperava esse convite, pode ignorar este email.</p>
                </div>
    `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
