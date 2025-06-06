import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Cpu, Network } from "lucide-react";
import { AppConfig } from "../types";
import { MCPServerManager } from "../../mcp";

interface SettingsDrawerProps {
  config: AppConfig;
  onConfigChange: (config: AppConfig) => void;
}

export const SettingsDrawer = ({ config, onConfigChange }: SettingsDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const updateConfig = (updates: Partial<AppConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 right-4 z-50 bg-black border-white text-white hover:bg-accent hover:text-white squish-button"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-96 bg-black border-white border-r text-white overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-white">Settings</SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger 
              value="general" 
              className="text-white data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              <Cpu className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="mcp" 
              className="text-white data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              <Network className="h-4 w-4 mr-2" />
              MCP
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-white">Model</Label>
              <Select value={config.model} onValueChange={(value) => updateConfig({ model: value as AppConfig['model'] })}>
                <SelectTrigger className="bg-black border-white text-white focus:ring-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white">
                  <SelectItem value="claude-sonnet-4-20250514" className="text-white hover:bg-accent">
                    Sonnet 4
                  </SelectItem>
                  <SelectItem value="claude-opus-4-20250514" className="text-white hover:bg-accent">
                    Opus 4
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="thinking"
                  checked={config.thinking}
                  onCheckedChange={(checked) => updateConfig({ thinking: !!checked })}
                  className="border-white data-[state=checked]:bg-accent"
                />
                <Label htmlFor="thinking" className="text-white">Enable Thinking</Label>
              </div>
              
              {config.thinking && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="thinkingBudget" className="text-white">Thinking Budget (tokens)</Label>
                  <Input
                    id="thinkingBudget"
                    type="number"
                    value={config.thinkingBudget}
                    onChange={(e) => updateConfig({ thinkingBudget: parseInt(e.target.value) || 5000 })}
                    className="bg-black border-white text-white focus:ring-accent"
                    min="1000"
                    max="50000"
                    step="1000"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt" className="text-white">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={config.systemPrompt}
                onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                className="bg-black border-white text-white focus:ring-accent min-h-32"
                placeholder="Enter your system prompt here..."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="mcp" className="mt-6">
            <div className="text-white">
              <MCPServerManager className="space-y-4" />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
