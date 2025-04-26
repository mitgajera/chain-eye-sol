
import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [apiKey, setApiKey] = useState("");

  const handleSaveGeneralSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated",
    });
  };

  const handleSaveApiSettings = () => {
    toast({
      title: "API settings saved",
      description: "Your API settings have been updated",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Data refresh interval (seconds)</Label>
                  <Input 
                    id="refreshInterval" 
                    type="number" 
                    value={refreshInterval} 
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    min="30"
                    max="300"
                  />
                  <p className="text-xs text-gray-500">Minimum: 30 seconds. Current: 60 seconds.</p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <Switch 
                    id="darkMode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch 
                    id="notifications" 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                  />
                </div>

                <Button onClick={handleSaveGeneralSettings}>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure API keys for enhanced functionality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heliusKey">Helius API Key</Label>
                  <Input 
                    id="heliusKey" 
                    type="password" 
                    placeholder="Enter your Helius API key" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Get a Helius API key from <a href="https://helius.xyz" target="_blank" rel="noreferrer" className="text-solana-purple">helius.xyz</a>
                  </p>
                </div>

                <Button onClick={handleSaveApiSettings}>Save API Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Configure visualization preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="showLabels">Show Transaction Labels</Label>
                  <Switch id="showLabels" defaultChecked />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="animateTransactions">Animate Transaction Flow</Label>
                  <Switch id="animateTransactions" defaultChecked />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="highContrast">High Contrast Mode</Label>
                  <Switch id="highContrast" />
                </div>

                <Button>Save Display Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
