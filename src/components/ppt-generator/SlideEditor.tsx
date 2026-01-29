
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { SlideContent } from "@/lib/types";

interface SlideEditorProps {
  slide: SlideContent;
  slideIndex: number;
  onSave: (slideIndex: number, modification: string) => Promise<void>;
  onCancel: () => void;
}

export function SlideEditor({ slide, slideIndex, onSave, onCancel }: SlideEditorProps) {
  const [modification, setModification] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    if (!modification.trim()) return;
    
    setLoading(true);
    try {
      await onSave(slideIndex, modification);
      setModification("");
    } catch (error) {
      console.error("Failed to save slide:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <EditIcon className="h-5 w-5" />
          Edit Slide {slideIndex + 1}: {slide.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Current Content:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {slide.content.map((point, index) => (
              <li key={index}>• {point}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <label htmlFor="modification" className="block text-sm font-medium mb-2">
            How would you like to modify this slide?
          </label>
          <Input
            id="modification"
            value={modification}
            onChange={(e) => setModification(e.target.value)}
            placeholder="e.g., 'Add more details about benefits', 'Make it more technical', 'Include statistics'"
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={!modification.trim() || loading}
            className="flex-1"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
