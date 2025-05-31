
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { AnthropicConfig } from "@/types/anthropic";

interface SettingsDrawerProps {
  config: AnthropicConfig;
  onConfigChange: (config: AnthropicConfig) => void;
}

export const SettingsDrawer = ({ config, onConfigChange }: SettingsDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateConfig = (updates: Partial<AnthropicConfig>) => {
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
        className="w-80 bg-black border-white border-r text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-white">Settings</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="model" className="text-white">Model</Label>
            <Select value={config.model} onValueChange={(value) => updateConfig({ model: value as AnthropicConfig['model'] })}>
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
