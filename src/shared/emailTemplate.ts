import config from '../config';
import { USER_ROLES } from '../enums/user';
import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Toothlens Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const supportMessage = (values: {email:string,message:string}) => {
  const adminEmail = config.super_admin?.email!
  const data = {
    to: adminEmail,
    subject: "Support Message",
    html: `   <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #121212; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e1e1e; border-radius: 10px; padding: 20px; color: #ffffff;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <h2 style="margin: 0; color: #00c6ff; font-size: 24px;">Customer Support Message</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 20px;">
                <p style="margin: 0 0 5px; font-size: 16px; color: #bbbbbb;">From:</p>
                <p style="margin: 0; font-size: 16px; color: #ffffff;">${values.email}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 20px;">
                <p style="margin: 0 0 5px; font-size: 16px; color: #bbbbbb;">Message:</p>
                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #ffffff;">${values.message}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0;">
                <a href="mailto:${values.email}" 
                  style="display: inline-block; background-color: #00c6ff; color: #000000; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                  Reply to Customer
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px 0; font-size: 12px; color: #888888;">
                <p style="margin: 0;">© 2025 Your Company Name</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`
  }
  return data

}


const createAccountData = (values:{name:string, email:string, password:string,role:USER_ROLES}) => {
  const data = {
    to:values.email,
    subject: 'Welcome to Your Academy!!',
    html: `
   <body style="margin: 0; padding: 0; background-color: #1c1c1c; color: #ffffff; font-family: Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #2b2b2b; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #111;">
          <img src="https://res.cloudinary.com/dkbcx9amc/image/upload/v1753865710/Frame_1000004518_u5xdq7.png" alt="Football Academy Logo" style="width: 80px; height: auto;" />
          <h1 style="margin: 10px 0 0; color: #ffffff;">Your Football Academy</h1>
        </td>
      </tr>

      <!-- Welcome Message -->
      <tr>
        <td style="padding: 20px;">
          <h2 style="color:  #2E7A8A;">Welcome to the Team!</h2>
          <p>Hello <strong style="color:#2E7A8A">${values.name}</strong>,</p>
          <p style="color:#fff">
            You have been successfully assigned as a <strong>${values.role.toUpperCase()}</strong> of our football academy.
            We’re excited to have you onboard.
          </p>

          <!-- Credentials -->
          <div style="margin: 20px 0; background-color: #1f1f1f;color:#fff; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; font-size: 15px;">
              <strong>Login Email:</strong> ${values.email}<br />
              <strong>Password:</strong> ${values.password}
            </p>
          </div>

          <p style="margin-top: 20px;color:#fff">If you have any questions, feel free to contact us.</p>
          <p style="color:#fff">Best regards,<br />The Football Academy Team</p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 15px; text-align: center; font-size: 12px; color: #888888; background-color: #111;">
          &copy; 2025 Your Football Academy. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
    `
  }

  return data
}

export const emailTemplate = {
  createAccount,
  resetPassword,
  supportMessage,
  createAccountData
};
