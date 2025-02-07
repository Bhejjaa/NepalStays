const ESEWA_CONFIG = {
  merchantId: 'EPAYTEST',
  merchantSecret: '8gBm/:&EnhH.1/q',
  testUrl: 'https://uat.esewa.com.np/epay/main',
  productionUrl: 'https://esewa.com.np/epay/main',
  successUrl: `${process.env.FRONTEND_URL}/booking/success`,
  failureUrl: `${process.env.FRONTEND_URL}/booking/failure`
};

module.exports = ESEWA_CONFIG; 