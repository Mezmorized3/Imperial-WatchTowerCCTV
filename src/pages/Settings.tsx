
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { SettingsHeader, SettingsTitle } from '@/components/settings/SettingsHeader';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { ApiKeySettings } from '@/components/settings/ApiKeySettings';
import { AdvancedSettings } from '@/components/settings/AdvancedSettings';
import { imperialProtocolBanner } from '@/components/settings/ImperialBanner';

const Settings = () => {
  const handleSave = () => {
    // This function now primarily handles the main settings save action
    // API key saving is handled in the ApiKeySettings component
  };

  return (
    <div className="flex flex-col min-h-screen bg-scanner-dark text-white">
      <SettingsHeader imperialProtocolBanner={imperialProtocolBanner} />

      <div className="container max-w-6xl mx-auto py-8 px-4">
        <SettingsTitle />

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <ApiKeySettings />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8 space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Settings;
