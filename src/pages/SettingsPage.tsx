
import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Save, RefreshCw } from 'lucide-react';

// Define settings interface
interface AppSettings {
  general: {
    refreshInterval: number;
    darkMode: boolean;
    notifications: boolean;
  };
  api: {
    heliusKey: string;
  };
  display: {
    showLabels: boolean;
    animateTransactions: boolean;
    highContrast: boolean;
  };
}

const defaultSettings: AppSettings = {
  general: {
    refreshInterval: 60,
    darkMode: true,
    notifications: true,
  },
  api: {
    heliusKey: "",
  },
  display: {
    showLabels: true,
    animateTransactions: true,
    highContrast: false,
  }
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (err) {
        console.error("Error parsing saved settings:", err);
        // If parsing fails, use defaults
        setSettings(defaultSettings);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      toast({
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings saved`,
        description: "Your settings have been updated successfully",
      });
      
      setIsSaving(false);
    }, 600);
  };

  // Update general settings
  const updateGeneralSettings = (key: keyof typeof settings.general, value: any) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value
      }
    }));
  };

  // Update API settings
  const updateApiSettings = (key: keyof typeof settings.api, value: string) => {
    setSettings(prev => ({
      ...prev,
      api: {
        ...prev.api,
        [key]: value
      }
    }));
  };

  // Update display settings
  const updateDisplaySettings = (key: keyof typeof settings.display, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value
      }
    }));
  };

  // Reset settings to default
  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings(defaultSettings);
      localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
      
      toast({
        title: "Settings reset",
        description: "All settings have been reset to their default values",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <Button 
            variant="outline" 
            onClick={resetSettings} 
            className="mt-2 md:mt-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    value={settings.general.refreshInterval} 
                    onChange={(e) => updateGeneralSettings('refreshInterval', parseInt(e.target.value) || 30)}
                    min="30"
                    max="300"
                  />
                  <p className="text-xs text-gray-500">
                    Minimum: 30 seconds. Current: {settings.general.refreshInterval} seconds.
                  </p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <Switch 
                    id="darkMode" 
                    checked={settings.general.darkMode} 
                    onCheckedChange={(checked) => updateGeneralSettings('darkMode', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch 
                    id="notifications" 
                    checked={settings.general.notifications} 
                    onCheckedChange={(checked) => updateGeneralSettings('notifications', checked)} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
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
                    value={settings.api.heliusKey} 
                    onChange={(e) => updateApiSettings('heliusKey', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Get a Helius API key from <a href="https://helius.xyz" target="_blank" rel="noreferrer" className="text-solana-purple">helius.xyz</a>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save API Settings
                    </>
                  )}
                </Button>
              </CardFooter>
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
                  <Switch 
                    id="showLabels" 
                    checked={settings.display.showLabels}
                    onCheckedChange={(checked) => updateDisplaySettings('showLabels', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="animateTransactions">Animate Transaction Flow</Label>
                  <Switch 
                    id="animateTransactions" 
                    checked={settings.display.animateTransactions}
                    onCheckedChange={(checked) => updateDisplaySettings('animateTransactions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="highContrast">High Contrast Mode</Label>
                  <Switch 
                    id="highContrast" 
                    checked={settings.display.highContrast}
                    onCheckedChange={(checked) => updateDisplaySettings('highContrast', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Display Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
