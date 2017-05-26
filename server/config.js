module.exports = {
	port: process.env.PORT || 3000,
	db: process.env.MONGODB || 'mongodb://localhost:27017/global-data-app',

	facebookAuth : {
        clientID      : '124183928156798', // your App ID
        clientSecret  : 'd94a0b126f6c537957c904ab8f46baf7', // your App Secret
        callbackURL   : 'http://localhost:3000/auth/facebook/callback',
        profileFields : ['id', 'emails', 'name'] //This
    },

    googleAuth : {
        clientID      : '792793798470-9e7br5voj8650nqc8ga19spdltprn4h0.apps.googleusercontent.com',
        clientSecret  : 'OAGGPMAlmf_00FGEVaJGXMWm',
        callbackURL   : 'http://localhost:3000/auth/google/callback'
    }
}