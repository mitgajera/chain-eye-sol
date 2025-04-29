
import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Save, RefreshCw, Moon, Sun, CheckCircle } from 'lucide-react';

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
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Apply dark mode on settings change
  useEffect(() => {
    if (settings.general.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.general.darkMode]);

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
    setSaveSuccess(false);
    
    // Apply settings to the app
    if (settings.general.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Simulate API delay
    setTimeout(() => {
      toast({
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings saved`,
        description: "Your settings have been updated successfully",
      });
      
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
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
      
      // Apply default dark mode setting
      if (defaultSettings.general.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
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
          <h1 className="text-3xl font-bold">Settings</h1>
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
          <TabsList className="mb-4 bg-black/20 border border-gray-800">
            <TabsTrigger value="general" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">General</TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">API Keys</TabsTrigger>
            <TabsTrigger value="display" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Data refresh interval (seconds)</Label>
                  <Input 
                    id="refreshInterval" 
                    type="number" 
                    value={settings.general.refreshInterval} 
                    onChange={(e) => updateGeneralSettings('refreshInterval', parseInt(e.target.value) || 30)}
                    min="30"
                    max="300"
                    className="bg-black/30 border-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    Minimum: 30 seconds. Current: {settings.general.refreshInterval} seconds.
                  </p>
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-md bg-black/30 border border-gray-800">
                  <div className="space-y-1">
                    <Label htmlFor="darkMode" className="text-base flex items-center">
                      <Moon className="h-4 w-4 mr-2 text-purple-400" />
                      Dark Mode
                    </Label>
                    <p className="text-xs text-gray-400">Enable dark mode for the application</p>
                  </div>
                  <Switch 
                    id="darkMode" 
                    checked={settings.general.darkMode} 
                    onCheckedChange={(checked) => updateGeneralSettings('darkMode', checked)} 
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-md bg-black/30 border border-gray-800">
                  <div className="space-y-1">
                    <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                    <p className="text-xs text-gray-400">Show notifications for important events</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={settings.general.notifications} 
                    onCheckedChange={(checked) => updateGeneralSettings('notifications', checked)} 
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4 flex justify-between">
                <div>
                  {saveSuccess && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Settings saved successfully
                    </div>
                  )}
                </div>
                <Button 
                  onClick={saveSettings} 
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
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

          <TabsContent value="api" className="space-y-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
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
                    className="bg-black/30 border-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    Get a Helius API key from <a href="https://helius.xyz" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">helius.xyz</a>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4 flex justify-between">
                <div>
                  {saveSuccess && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Settings saved successfully
                    </div>
                  )}
                </div>
                <Button 
                  onClick={saveSettings} 
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
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

          <TabsContent value="display" className="space-y-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Configure visualization preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 rounded-md bg-black/30 border border-gray-800">
                  <div className="space-y-1">
                    <Label htmlFor="showLabels" className="text-base">Show Transaction Labels</Label>
                    <p className="text-xs text-gray-400">Display labels on transaction flow diagram</p>
                  </div>
                  <Switch 
                    id="showLabels" 
                    checked={settings.display.showLabels}
                    onCheckedChange={(checked) => updateDisplaySettings('showLabels', checked)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-md bg-black/30 border border-gray-800">
                  <div className="space-y-1">
                    <Label htmlFor="animateTransactions" className="text-base">Animate Transaction Flow</Label>
                    <p className="text-xs text-gray-400">Enable animation effects for transaction visualization</p>
                  </div>
                  <Switch 
                    id="animateTransactions" 
                    checked={settings.display.animateTransactions}
                    onCheckedChange={(checked) => updateDisplaySettings('animateTransactions', checked)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-md bg-black/30 border border-gray-800">
                  <div className="space-y-1">
                    <Label htmlFor="highContrast" className="text-base">High Contrast Mode</Label>
                    <p className="text-xs text-gray-400">Increase contrast for better visibility</p>
                  </div>
                  <Switch 
                    id="highContrast" 
                    checked={settings.display.highContrast}
                    onCheckedChange={(checked) => updateDisplaySettings('highContrast', checked)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4 flex justify-between">
                <div>
                  {saveSuccess && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Settings saved successfully
                    </div>
                  )}
                </div>
                <Button 
                  onClick={saveSettings} 
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
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
