try {
  var configVars = require('./.server_settings')
} catch(e) { }

configVars = configVars || {}
var recipeId = configVars.recipeId || process.env['ARTDROP_RECIPE_ID']
var firebaseUrl = configVars.firebaseUrl || process.env['ARTDROP_FIREBASE_URL']
var firebaseUsername = configVars.firebaseUsername || process.env['ARTDROP_FIREBASE_USERNAME']
var firebasePassword = configVars.firebasePassword || process.env['ARTDROP_FIREBASE_PASSWORD']
var stripeSecretKey = configVars.stripeSecretKey || process.env['ARTDROP_STRIPE_SECRET_KEY']

function exitIfValMissing(val, name) {
  if (val == null) {
    console.log(name + ' is not set, exiting...')
    process.exit(1)
  }
}

exitIfValMissing(recipeId, 'Printio recipe Id')
exitIfValMissing(firebaseUrl, 'Firebase URL')
exitIfValMissing(firebaseUsername, 'Firebase username')
exitIfValMissing(firebasePassword, 'Firebase password')
exitIfValMissing(stripeSecretKey, 'Stripe secret key')

module.exports = {
  firebaseUrl: firebaseUrl,
  firebaseUsername: firebaseUsername,
  firebasePassword: firebasePassword,
  recipeId: recipeId,
  stripeSecretKey: stripeSecretKey
}
