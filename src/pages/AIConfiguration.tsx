import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Plus, Trash2, AlertTriangle, MapPin, Car, Armchair, Accessibility, Bus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIConfiguration = () => {
  const { toast } = useToast();
  const [greeting, setGreeting] = useState(
    "Thank you for calling Valentis Dental. I'm your AI assistant. How can I help you today?"
  );
  const [tone, setTone] = useState("friendly");
  const [faqs, setFaqs] = useState([
    { question: "What are your office hours?", answer: "We're open Monday through Friday, 9 AM to 5 PM." },
    { question: "Do you accept walk-ins?", answer: "We primarily see patients by appointment, but we do accommodate emergencies." },
    { question: "What insurance do you accept?", answer: "We accept most major dental insurance plans. Please call for specifics." },
  ]);

  // Emergency Notice state
  const [emergencyNoticeEnabled, setEmergencyNoticeEnabled] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState(
    "We are currently experiencing temporary closure. Please call back during regular business hours."
  );
  const [emergencyUntil, setEmergencyUntil] = useState("");

  // Location Details state
  const [parking, setParking] = useState("Free parking available in our rear lot. Street parking also available on Main Street.");
  const [waitingRoom, setWaitingRoom] = useState("Comfortable waiting area with 12 seats, complimentary refreshments, and a children's play corner.");
  const [accessibility, setAccessibility] = useState("Fully wheelchair accessible. Elevator available to all floors.");
  const [publicTransport, setPublicTransport] = useState("Bus routes 12 and 15 stop nearby. 5-minute walk from Central Metro station.");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Your AI settings have been updated successfully.",
    });
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Configuration"
        description="Customize how your AI receptionist interacts with callers"
      >
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>

      <Tabs defaultValue="greeting" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="greeting">Greeting & Tone</TabsTrigger>
          <TabsTrigger value="rules">Business Rules</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="location">Location Details</TabsTrigger>
        </TabsList>

        {/* Greeting & Tone */}
        <TabsContent value="greeting" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50 space-y-6">
            <div>
              <Label htmlFor="greeting" className="text-sm font-medium">
                Greeting Script
              </Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                This is what callers hear when they first connect
              </p>
              <Textarea
                id="greeting"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Tone</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Set the overall communication style
              </p>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">
                    <div>
                      <p className="font-medium">Friendly</p>
                      <p className="text-xs text-muted-foreground">
                        Warm and approachable
                      </p>
                    </div>
                  </SelectItem>
                  <SelectItem value="professional">
                    <div>
                      <p className="font-medium">Professional</p>
                      <p className="text-xs text-muted-foreground">
                        Formal and business-like
                      </p>
                    </div>
                  </SelectItem>
                  <SelectItem value="direct">
                    <div>
                      <p className="font-medium">Direct</p>
                      <p className="text-xs text-muted-foreground">
                        Efficient and to-the-point
                      </p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        {/* Business Rules */}
        <TabsContent value="rules" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50 space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-4">Transfer Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Transfer on low confidence</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically transfer to human when AI confidence is below 60%
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Emergency detection</p>
                    <p className="text-xs text-muted-foreground">
                      Immediately transfer calls detected as emergencies
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Caller requests human</p>
                    <p className="text-xs text-muted-foreground">
                      Transfer when caller explicitly asks for a person
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-base font-semibold mb-4">Office Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Opening Time</Label>
                  <Input type="time" defaultValue="09:00" className="mt-2" />
                </div>
                <div>
                  <Label className="text-sm">Closing Time</Label>
                  <Input type="time" defaultValue="17:00" className="mt-2" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mt-4">
                <div>
                  <p className="text-sm font-medium">After-hours voicemail</p>
                  <p className="text-xs text-muted-foreground">
                    Send calls to voicemail outside office hours
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            {/* Emergency Notice Section */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h3 className="text-base font-semibold">Emergency Notice</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Display a special notice when your clinic is temporarily closed or has important announcements
              </p>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
                <div>
                  <p className="text-sm font-medium">Enable Emergency Notice</p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, callers will hear this message before the greeting
                  </p>
                </div>
                <Switch
                  checked={emergencyNoticeEnabled}
                  onCheckedChange={setEmergencyNoticeEnabled}
                />
              </div>

              {emergencyNoticeEnabled && (
                <div className="space-y-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Notice Message</Label>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      This message will be played to callers when the notice is active
                    </p>
                    <Textarea
                      value={emergencyMessage}
                      onChange={(e) => setEmergencyMessage(e.target.value)}
                      className="min-h-[100px] resize-none"
                      placeholder="e.g., We are currently closed due to inclement weather. Please call back tomorrow."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Active Until</Label>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">
                        The notice will automatically disable after this date
                      </p>
                      <Input
                        type="date"
                        value={emergencyUntil}
                        onChange={(e) => setEmergencyUntil(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Knowledge Base */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold">Frequently Asked Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Add common questions and answers for your AI to reference
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={addFaq} className="gap-2">
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/50 rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Question
                        </Label>
                        <Input
                          value={faq.question}
                          onChange={(e) =>
                            updateFaq(index, "question", e.target.value)
                          }
                          className="mt-1"
                          placeholder="e.g., What are your office hours?"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Answer
                        </Label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) =>
                            updateFaq(index, "answer", e.target.value)
                          }
                          className="mt-1 min-h-[80px] resize-none"
                          placeholder="Enter the answer..."
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaq(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Location Details */}
        <TabsContent value="location" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-base font-semibold">Location Information</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Provide details about your location that the AI can share with callers
            </p>

            {/* Parking */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Parking Information</Label>
              </div>
              <Textarea
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="e.g., Free parking available in rear lot, Street parking on Main St..."
              />
            </div>

            {/* Waiting Room */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Armchair className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Waiting Room Details</Label>
              </div>
              <Textarea
                value={waitingRoom}
                onChange={(e) => setWaitingRoom(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="e.g., 12 seats, magazines, children's play area..."
              />
            </div>

            {/* Accessibility */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Accessibility</Label>
              </div>
              <Textarea
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="e.g., Wheelchair accessible, elevator to 2nd floor..."
              />
            </div>

            {/* Public Transport */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bus className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Public Transport</Label>
              </div>
              <Textarea
                value={publicTransport}
                onChange={(e) => setPublicTransport(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="e.g., Bus routes 12, 15 stop nearby, 5 min walk from Metro..."
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2 border-t border-border pt-6">
              <Label className="text-sm font-medium">Additional Location Notes</Label>
              <p className="text-xs text-muted-foreground">
                Any other location-specific information callers might need
              </p>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="e.g., We're located on the 3rd floor of the Medical Plaza building..."
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AIConfiguration;
