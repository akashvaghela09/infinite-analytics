import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit3, Phone, FileText, Shield, Key, Globe } from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const hasLocalProvider = user?.providers?.includes('local');
  const hasGoogleProvider = user?.providers?.includes('google');

  return (
    <PageWrapper title="Profile" description="View and manage your profile">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar 
              src={user?.photo} 
              name={user?.name} 
              size="2xl"
              className="ring-4 ring-(--bg-secondary)"
            />
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-(--text-primary)">
                {user?.name || 'User'}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-(--text-secondary)">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm">{user?.email || 'user@example.com'}</span>
              </div>
              <p className="text-(--text-muted) mt-2 max-w-md">
                {user?.bio || 'No bio added yet. Tell us about yourself!'}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                <span className="text-xs text-(--text-muted)">Connected:</span>
                {hasLocalProvider && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-(--accent-500)/20 text-(--accent-400) border border-(--accent-500)/30">
                    <Key className="w-3 h-3" />
                    Local
                  </span>
                )}
                {hasGoogleProvider && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#4285f4]/20 text-[#4285f4] border border-[#4285f4]/30">
                    <Globe className="w-3 h-3" />
                    Google
                  </span>
                )}
              </div>
            </div>
            
            <Button 
              variant="secondary"
              leftIcon={Edit3}
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
              About
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-(--text-muted) mb-1">Bio</p>
                <p className={`text-(--text-primary) ${!user?.bio ? 'italic text-(--text-muted)' : ''}`}>
                  {user?.bio || 'No bio added yet'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-(--text-muted)" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-(--text-muted)">Email</p>
                  <p className="text-(--text-primary)">{user?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-(--text-muted)" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-(--text-muted)">Phone</p>
                  <p className={`text-(--text-primary) ${!user?.phone ? 'italic text-(--text-muted)' : ''}`}>
                    {user?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
              Authentication Methods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${hasLocalProvider ? 'bg-(--accent-500)/10 border-(--accent-500)/30' : 'bg-(--bg-secondary) border-(--border-subtle)'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasLocalProvider ? 'bg-(--accent-500)/20' : 'bg-(--bg-primary)'}`}>
                    <Key className={`w-5 h-5 ${hasLocalProvider ? 'text-(--accent-400)' : 'text-(--text-muted)'}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-(--text-primary)">Password</p>
                    <p className="text-sm text-(--text-muted)">
                      {hasLocalProvider ? 'Password login enabled' : 'Not set up'}
                    </p>
                  </div>
                  {hasLocalProvider && (
                    <span className="text-xs font-medium text-(--accent-400)">Active</span>
                  )}
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${hasGoogleProvider ? 'bg-[#4285f4]/10 border-[#4285f4]/30' : 'bg-(--bg-secondary) border-(--border-subtle)'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasGoogleProvider ? 'bg-[#4285f4]/20' : 'bg-(--bg-primary)'}`}>
                    <Globe className={`w-5 h-5 ${hasGoogleProvider ? 'text-[#4285f4]' : 'text-(--text-muted)'}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-(--text-primary)">Google</p>
                    <p className="text-sm text-(--text-muted)">
                      {hasGoogleProvider ? 'Google login enabled' : 'Not connected'}
                    </p>
                  </div>
                  {hasGoogleProvider && (
                    <span className="text-xs font-medium text-[#4285f4]">Active</span>
                  )}
                </div>
              </div>
            </div>
            
            {!hasLocalProvider && hasGoogleProvider && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-400">
                  <strong>Tip:</strong> You can add a password to enable local login. Go to Edit Profile to set up a password.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
