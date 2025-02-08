const ESEWA_CONFIG = {
  merchantId: 'EPAYTEST',
  merchantSecret: '8gBm/:&EnhH.1/q',
  testUrl: 'https://uat.esewa.com.np/epay/main',
  verifyUrl: 'https://uat.esewa.com.np/epay/transrec',
  successUrl: `${process.env.FRONTEND_URL}/payment/success`,
  failureUrl: `${process.env.FRONTEND_URL}/payment/failure`
};

module.exports = ESEWA_CONFIG; 