const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        const photo = profile.photos[0]?.value || null;

        let user = await User.findOne({
          "authProviders.provider": "google",
          "authProviders.providerId": googleId,
        });

        if (user) {
          if (!user.photo && photo) {
            user.photo = photo;
            await user.save();
          }
          return done(null, user);
        }

        user = await User.findOne({
          "authProviders.provider": "google",
          "authProviders.email": email,
        });

        if (user) {
          const googleProvider = user.authProviders.find(
            (ap) => ap.provider === "google" && ap.email === email,
          );
          if (googleProvider && !googleProvider.providerId) {
            googleProvider.providerId = googleId;
          }
          if (!user.photo && photo) {
            user.photo = photo;
          }
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          name,
          email, // Canonical email
          photo,
          authProviders: [
            {
              provider: "google",
              providerId: googleId,
              email,
            },
          ],
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

module.exports = passport;
