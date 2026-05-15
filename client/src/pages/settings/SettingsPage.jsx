import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Globe, ArrowRight, User } from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const hasLocalProvider = user?.providers?.includes('local');
  const hasGoogleProvider = user?.providers?.includes('google');

  return (
    <PageWrapper title="Settings" description="Manage your account settings">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
            Account Security
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-(--bg-secondary)">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasLocalProvider ? 'bg-(--accent-500)/20' : 'bg-(--bg-primary)'}`}>
                  <Key className={`w-5 h-5 ${hasLocalProvider ? 'text-(--accent-400)' : 'text-(--text-muted)'}`} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-(--text-primary)">Password Login</p>
                  <p className="text-sm text-(--text-muted)">
                    {hasLocalProvider 
                      ? 'You can sign in with your email and password' 
                      : 'Not set up - you can add a password for local login'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${hasLocalProvider ? 'bg-(--accent-500)/20 text-(--accent-400)' : 'bg-(--text-muted)/20 text-(--text-muted)'}`}>
                {hasLocalProvider ? 'Active' : 'Not Connected'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-(--bg-secondary)">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasGoogleProvider ? 'bg-[#4285f4]/20' : 'bg-(--bg-primary)'}`}>
                  <Globe className={`w-5 h-5 ${hasGoogleProvider ? 'text-[#4285f4]' : 'text-(--text-muted)'}`} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-(--text-primary)">Google Login</p>
                  <p className="text-sm text-(--text-muted)">
                    {hasGoogleProvider 
                      ? 'You can sign in with your Google account' 
                      : 'Not connected - sign in with Google to enable'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${hasGoogleProvider ? 'bg-[#4285f4]/20 text-[#4285f4]' : 'bg-(--text-muted)/20 text-(--text-muted)'}`}>
                {hasGoogleProvider ? 'Active' : 'Not Connected'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-(--border-subtle)">
            <Button 
              variant="secondary"
              leftIcon={User}
              rightIcon={ArrowRight}
              onClick={() => navigate('/profile/edit')}
            >
              Manage in Profile Settings
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-(--text-primary) mb-4">
            Connected Methods Summary
          </h3>
          <div className="text-sm text-(--text-secondary) space-y-2">
            <p>
              You currently have <strong className="text-(--text-primary)">{user?.providers?.length || 0}</strong> authentication method(s) connected:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {hasLocalProvider && (
                <li>Local account with password</li>
              )}
              {hasGoogleProvider && (
                <li>Google OAuth account</li>
              )}
              {!hasLocalProvider && !hasGoogleProvider && (
                <li className="text-(--text-muted) italic">No authentication methods connected</li>
              )}
            </ul>
            <p className="mt-4 text-(--text-muted)">
              You can add or manage these methods from the Profile Edit page.
            </p>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
