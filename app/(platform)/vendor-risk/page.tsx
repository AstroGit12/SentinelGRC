"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVendorStore } from "@/store/vendor-store";
import { EmptyState } from "@/components/empty-state";
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Download,
  Plus,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const securityQuestions = [
  { id: 1, question: "Does the vendor enforce Multi-Factor Authentication (MFA)?" },
  { id: 2, question: "Is data encrypted at rest and in transit?" },
  { id: 3, question: "Does the vendor have ISO 27001 certification?" },
  { id: 4, question: "Are regular security audits and penetration tests conducted?" },
  { id: 5, question: "Is there a formal incident response plan?" },
  { id: 6, question: "Does the vendor comply with GDPR/CCPA requirements?" },
  { id: 7, question: "Are access controls role-based with least privilege?" },
  { id: 8, question: "Is customer data logically segregated?" },
  { id: 9, question: "Are data backups encrypted and tested regularly?" },
  { id: 10, question: "Does the vendor provide SOC 2 Type II reports?" },
  { id: 11, question: "Is there 24/7 security monitoring and alerting?" },
  { id: 12, question: "Are all employees required to complete security training?" },
];

export default function VendorRiskPage() {
  const { vendors, addVendor, loadDemoData } = useVendorStore();
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [vendorName, setVendorName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [criticality, setCriticality] = useState<"Critical" | "High" | "Medium" | "Low">("Medium");

  const calculateScore = () => {
    const yesCount = Object.values(assessmentAnswers).filter(a => a === "yes").length;
    return Math.round((yesCount / securityQuestions.length) * 100);
  };

  const handleSubmitAssessment = () => {
    if (!vendorName || !serviceType) {
      toast.error("Please enter vendor name and service type");
      return;
    }

    const score = calculateScore();
    const complianceStatus: "Compliant" | "Non-Compliant" | "Under Review" = 
      score >= 80 ? "Compliant" : score >= 60 ? "Under Review" : "Non-Compliant";

    addVendor({
      name: vendorName,
      criticality,
      serviceType,
      assessmentScore: score,
      complianceStatus,
    });

    toast.success(`Vendor assessment completed! Score: ${score}%`);
    
    // Reset
    setShowAssessment(false);
    setAssessmentAnswers({});
    setVendorName("");
    setServiceType("");
    setCriticality("Medium");
  };

  const handleExportPDF = (vendor: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("SentinelGRC", 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Vendor Security Assessment Certification", 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 42);
    
    // Vendor Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Vendor Information", 20, 55);
    
    autoTable(doc, {
      startY: 60,
      head: [['Field', 'Value']],
      body: [
        ['Vendor Name', vendor.name],
        ['Service Type', vendor.serviceType],
        ['Criticality', vendor.criticality],
        ['Assessment Score', `${vendor.assessmentScore}%`],
        ['Compliance Status', vendor.complianceStatus],
        ['Last Assessment', new Date(vendor.lastAssessment).toLocaleDateString()],
      ],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });
    
    // Score Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Assessment Summary", 20, finalY);
    
    doc.setFontSize(10);
    const status = vendor.complianceStatus === "Compliant" ? "PASSED" : 
                   vendor.complianceStatus === "Under Review" ? "NEEDS REVIEW" : "FAILED";
    doc.text(`Overall Status: ${status}`, 20, finalY + 10);
    doc.text(`This vendor has been assessed according to SentinelGRC security standards.`, 20, finalY + 20);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("SentinelGRC - Enterprise Governance, Risk & Compliance Platform", 20, 280);
    
    doc.save(`${vendor.name.replace(/\s+/g, '_')}_Assessment.pdf`);
    toast.success("PDF certification exported successfully");
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Compliant": return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "Non-Compliant": return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Compliant": return "success";
      case "Non-Compliant": return "destructive";
      default: return "warning";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vendor Risk Assessment</h1>
          <p className="text-slate-500 mt-1">Third-party security questionnaire and compliance tracking</p>
        </div>
        <Button size="sm" onClick={() => setShowAssessment(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Assessment
        </Button>
      </div>

      {!showAssessment && vendors.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Vendor Assessments"
          description="Begin tracking third-party risk by conducting your first vendor security assessment."
          actionLabel="Start Assessment"
          onAction={() => setShowAssessment(true)}
          secondaryActionLabel="Load Demo Data"
          onSecondaryAction={() => {
            loadDemoData();
            toast.success("Demo data loaded successfully");
          }}
        />
      ) : showAssessment ? (
        <div className="space-y-6">
          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
              <CardDescription>Enter basic details about the vendor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendorName">Vendor Name *</Label>
                  <Input
                    id="vendorName"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g., Acme Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    placeholder="e.g., Cloud Storage"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="criticality">Criticality Level</Label>
                <Select value={criticality} onValueChange={(value: any) => setCriticality(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Questionnaire */}
          <Card>
            <CardHeader>
              <CardTitle>Security Questionnaire</CardTitle>
              <CardDescription>
                Answer the following questions based on vendor documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityQuestions.map((q) => (
                  <div key={q.id} className="flex items-start justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {q.id}. {q.question}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant={assessmentAnswers[q.id] === "yes" ? "default" : "outline"}
                        onClick={() => setAssessmentAnswers({ ...assessmentAnswers, [q.id]: "yes" })}
                      >
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant={assessmentAnswers[q.id] === "no" ? "destructive" : "outline"}
                        onClick={() => setAssessmentAnswers({ ...assessmentAnswers, [q.id]: "no" })}
                      >
                        No
                      </Button>
                      <Button
                        size="sm"
                        variant={assessmentAnswers[q.id] === "na" ? "secondary" : "outline"}
                        onClick={() => setAssessmentAnswers({ ...assessmentAnswers, [q.id]: "na" })}
                      >
                        N/A
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Current Score</p>
                  <p className="text-2xl font-bold text-blue-600">{calculateScore()}%</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAssessment(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitAssessment}>
                    Submit Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(vendor.complianceStatus)}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{vendor.name}</h3>
                      <p className="text-sm text-slate-500 font-mono mt-1">{vendor.id}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-slate-600">{vendor.serviceType}</span>
                        <span className="text-slate-300">•</span>
                        <Badge variant="outline" className="text-xs">
                          {vendor.criticality}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase">Assessment Score</p>
                      <p className="text-2xl font-bold text-slate-900">{vendor.assessmentScore}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase mb-1">Status</p>
                      <Badge variant={getStatusBadge(vendor.complianceStatus) as any}>
                        {vendor.complianceStatus}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(vendor)}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Last assessed: {new Date(vendor.lastAssessment).toLocaleDateString()}</span>
                    {vendor.contact && <span>Contact: {vendor.contact}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

