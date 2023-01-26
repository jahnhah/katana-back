export default {
    port: 5000,
    appUrl: "http://localhost",
    dbUri: "mongodb://localhost:27017/katana",
    // should be in custom-environment-variables
    accessTokenPublicKey: 'ACCESS_TOKEN_PUBLIC_KEY',
    accessTokenPrivateKey: 'ACCESS_TOKEN_PRIVATE_KEY',
    refreshTokenPublickey: 'REFRESH_TOKEN_PUBLIC_KEY',
    refreshTokenPrivatekey: 'REFRESH_TOKEN_PRIVATE_KEY',
    smtp: {
        user: 'w266ureknkdddtlh@ethereal.email',
        pass: 'TV5gs6X1pH2e7kMNgn',
        host: 'smtp.ethereal.email',
        secure: false
    }
};