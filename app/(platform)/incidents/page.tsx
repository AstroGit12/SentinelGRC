"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell } from "lucide-react";
import { toast } from "sonner";

export default function IncidentsPage() {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    category: "",
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Incident reported successfully", {
      description: "The security team has been notified and will investigate.",
      duration: 4000,
    });

    setIsReportDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      severity: "medium",
      category: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Security Incidents</h1>
        <p className="text-slate-500 mt-1">Incident response tracking and management</p>
      </div>

      <EmptyState
        icon={Bell}
        title="No Active Incidents"
        description="This module tracks security incidents, breaches, and response activities. Fortunately, there are no incidents to report at this time."
        actionLabel="Report Incident"
        onAction={() => setIsReportDialogOpen(true)}
      />

      {/* Report Incident Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Security Incident</DialogTitle>
            <DialogDescription>
              Provide details about the security incident or suspicious activity
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Incident Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Suspicious login attempts detected"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Unauthorized Access"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what happened, when it was discovered, and any immediate actions taken..."
                rows={5}
              />
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> For critical incidents requiring immediate attention, 
                please contact the Security Operations Center (SOC) directly at ext. 2911 or 
                email soc@company.com
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

