const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authProviderSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ['local', 'google'],
    required: true
  },
  providerId: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    default: null
  }
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: '',
    maxlength: [250, 'Bio cannot be more than 250 characters']
  },
  phone: {
    type: String,
    default: ''
  },
  authProviders: {
    type: [authProviderSchema],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient lookups
UserSchema.index({ 'authProviders.provider': 1, 'authProviders.providerId': 1 });
UserSchema.index({ 'authProviders.provider': 1, 'authProviders.email': 1 });

UserSchema.virtual('providers').get(function() {
  return this.authProviders.map(ap => ap.provider);
});

// Pre-save middleware for local provider entries - hash passwords
UserSchema.pre('save', async function(next) {
  if (!this.isModified('authProviders')) return next();

  for (let provider of this.authProviders) {
    if (provider.provider === 'local' && provider.passwordHash && provider.isModified('passwordHash')) {
      provider.passwordHash = await bcrypt.hash(provider.passwordHash, 10);
    }
  }
  next();
});

// Validation for duplicate emails in authProviders
UserSchema.pre('save', async function(next) {
  if (this.isNew) {
    const localProviderWithEmail = this.authProviders.find(ap => ap.provider === 'local');
    
    if (localProviderWithEmail) {
      const existingUser = await this.constructor.findOne({
        'authProviders.provider': 'local',
        'authProviders.email': localProviderWithEmail.email
      });
      
      if (existingUser) {
        return next(new Error('Email already in use.'));
      }
    }
  }
  next();
});

UserSchema.statics.compareLocalPassword = async function(candidatePassword, passwordHash) {
  return await bcrypt.compare(candidatePassword, passwordHash);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
