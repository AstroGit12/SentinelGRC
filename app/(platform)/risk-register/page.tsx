"use client";

import { useState } from "react";
import { useRiskStore } from "@/store/risk-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  AlertTriangle,
  Download,
  Filter
} from "lucide-react";
import { getRiskLevel } from "@/lib/utils";
import { toast } from "sonner";

export default function RiskRegisterPage() {
  const { risks, addRisk, loadDemoData } = useRiskStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    inherentLikelihood: 3,
    inherentImpact: 3,
    status: "Open" as "Open" | "Mitigated" | "Closed",
    owner: "",
    mitigation: "",
  });

  const filteredRisks = risks.filter(risk => 
    risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    risk.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    risk.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.inherentScore - a.inherentScore);

  const handleAddRisk = () => {
    if (!formData.title || !formData.category || !formData.owner) {
      toast.error("Please fill in all required fields");
      return;
    }

    addRisk(formData);
    toast.success("Risk added successfully");
    setIsAddDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      inherentLikelihood: 3,
      inherentImpact: 3,
      status: "Open",
      owner: "",
      mitigation: "",
    });
  };

  const handleLoadDemo = () => {
    loadDemoData();
    toast.success("Demo data loaded successfully");
  };

  const getRiskBadgeVariant = (level: string) => {
    switch(level) {
      case "critical": return "destructive";
      case "high": return "warning";
      case "medium": return "warning";
      default: return "success";
    }
  };

  const selectedRiskData = risks.find(r => r.id === selectedRisk);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Risk Register</h1>
          <p className="text-slate-500 mt-1">Comprehensive risk identification and tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Risk
          </Button>
        </div>
      </div>

      {risks.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No Risks Registered"
          description="Start building your risk register by adding your first risk, or load demo data to explore the platform."
          actionLabel="Add First Risk"
          onAction={() => setIsAddDialogOpen(true)}
          secondaryActionLabel="Load Demo Data"
          onSecondaryAction={handleLoadDemo}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Risks ({risks.length})</CardTitle>
                <CardDescription>Click on a risk to view details</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search risks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Risk Title
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      L
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      I
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRisks.map((risk) => {
                    const level = getRiskLevel(risk.inherentScore);
                    return (
                      <tr
                        key={risk.id}
                        onClick={() => setSelectedRisk(risk.id)}
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-mono text-slate-900">
                          {risk.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                          {risk.title}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {risk.category}
                        </td>
                        <td className="py-3 px-4 text-sm text-center text-slate-900">
                          {risk.inherentLikelihood}
                        </td>
                        <td className="py-3 px-4 text-sm text-center text-slate-900">
                          {risk.inherentImpact}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <span className={`
                              inline-flex items-center justify-center w-10 h-10 rounded font-bold text-sm
                              ${level === "critical" ? "bg-red-500 text-white" :
                                level === "high" ? "bg-orange-500 text-white" :
                                level === "medium" ? "bg-amber-500 text-white" :
                                "bg-emerald-600 text-white"}
                            `}>
                              {risk.inherentScore}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={risk.status === "Open" ? "destructive" : "success"}
                            className="text-xs"
                          >
                            {risk.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {risk.owner}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Risk Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Risk</DialogTitle>
            <DialogDescription>
              Enter the details of the risk to add it to the register
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Risk Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Unencrypted Data at Rest"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the risk..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Data Security"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="owner">Owner *</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g., Security Team"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                <Select
                  value={formData.inherentLikelihood.toString()}
                  onValueChange={(value) => setFormData({ ...formData, inherentLikelihood: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(val => (
                      <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="impact">Impact (1-5)</Label>
                <Select
                  value={formData.inherentImpact.toString()}
                  onValueChange={(value) => setFormData({ ...formData, inherentImpact: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(val => (
                      <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Mitigated">Mitigated</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mitigation">Mitigation Plan</Label>
              <Textarea
                id="mitigation"
                value={formData.mitigation}
                onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
                placeholder="Describe the mitigation strategy..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRisk}>Add Risk</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Risk Detail Drawer */}
      <Dialog open={!!selectedRisk} onOpenChange={() => setSelectedRisk(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRiskData && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedRiskData.title}</DialogTitle>
                    <p className="text-sm text-slate-500 font-mono mt-1">{selectedRiskData.id}</p>
                  </div>
                  <Badge
                    variant={getRiskBadgeVariant(getRiskLevel(selectedRiskData.inherentScore))}
                  >
                    {getRiskLevel(selectedRiskData.inherentScore).toUpperCase()}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-500 uppercase">Description</Label>
                  <p className="text-sm text-slate-900 mt-1">{selectedRiskData.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-slate-500 uppercase">Category</Label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedRiskData.category}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 uppercase">Owner</Label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedRiskData.owner}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 uppercase">Status</Label>
                    <Badge
                      variant={selectedRiskData.status === "Open" ? "destructive" : "success"}
                      className="mt-1"
                    >
                      {selectedRiskData.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <Label className="text-xs text-slate-500 uppercase">Likelihood</Label>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedRiskData.inherentLikelihood}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs text-slate-500 uppercase">Impact</Label>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedRiskData.inherentImpact}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs text-slate-500 uppercase">Risk Score</Label>
                    <p className="text-2xl font-bold text-red-600 mt-1">{selectedRiskData.inherentScore}</p>
                  </div>
                </div>

                {selectedRiskData.mitigation && (
                  <div>
                    <Label className="text-xs text-slate-500 uppercase">Mitigation Plan</Label>
                    <p className="text-sm text-slate-900 mt-1 p-3 bg-blue-50 border border-blue-100 rounded-md">
                      {selectedRiskData.mitigation}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

