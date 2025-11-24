"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Cloud, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal,
  Play,
  RotateCcw,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface SimulationLog {
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: Date;
}

export default function CloudSimulatorPage() {
  const [s3Access, setS3Access] = useState("private");
  const [iamPolicy, setIamPolicy] = useState("least-privilege");
  const [dbEncryption, setDbEncryption] = useState("enabled");
  const [logs, setLogs] = useState<SimulationLog[]>([
    {
      type: "info",
      message: "Cloud Security Simulator initialized",
      timestamp: new Date()
    }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (type: SimulationLog["type"], message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const runSimulation = () => {
    setIsRunning(true);
    setLogs([]);
    
    addLog("info", "$ aws-security-scan --profile production");
    addLog("info", "Scanning AWS infrastructure...");
    
    setTimeout(() => {
      addLog("info", "");
      addLog("info", "[SCANNER] Analyzing S3 bucket configurations...");
      
      setTimeout(() => {
        if (s3Access === "public") {
          addLog("error", "[ALERT] GUARDDUTY: Unprotected S3 Bucket Detected!");
          addLog("error", "  ├─ Bucket: sensitive-customer-data");
          addLog("error", "  ├─ Issue: Public Read Access Enabled");
          addLog("error", "  ├─ Risk Level: CRITICAL");
          addLog("error", "  └─ Recommendation: Enable bucket versioning and private ACL");
          toast.error("Critical vulnerability detected!");
        } else {
          addLog("success", "[OK] S3 Buckets: All buckets are private");
        }

        setTimeout(() => {
          addLog("info", "");
          addLog("info", "[SCANNER] Checking IAM policies...");
          
          setTimeout(() => {
            if (iamPolicy === "admin-all") {
              addLog("warning", "[WARNING] IAM: Overly Permissive Policies Detected");
              addLog("warning", "  ├─ User: dev-team@company.com");
              addLog("warning", "  ├─ Issue: AdministratorAccess attached");
              addLog("warning", "  ├─ Risk Level: HIGH");
              addLog("warning", "  └─ Recommendation: Apply least privilege principle");
              toast.warning("IAM policy issue detected");
            } else {
              addLog("success", "[OK] IAM Policies: Least privilege enforced");
            }

            setTimeout(() => {
              addLog("info", "");
              addLog("info", "[SCANNER] Verifying database encryption...");
              
              setTimeout(() => {
                if (dbEncryption === "disabled") {
                  addLog("error", "[ALERT] RDS: Encryption at Rest DISABLED");
                  addLog("error", "  ├─ Database: prod-mysql-cluster");
                  addLog("error", "  ├─ Issue: No encryption configured");
                  addLog("error", "  ├─ Risk Level: CRITICAL");
                  addLog("error", "  └─ Recommendation: Enable KMS encryption");
                  toast.error("Database encryption disabled!");
                } else {
                  addLog("success", "[OK] RDS Databases: Encryption at rest enabled");
                }

                setTimeout(() => {
                  addLog("info", "");
                  addLog("success", "╔═══════════════════════════════════════╗");
                  addLog("success", "║   SCAN COMPLETE                        ║");
                  addLog("success", "╚═══════════════════════════════════════╝");
                  
                  const criticalCount = logs.filter(l => l.type === "error").length + (s3Access === "public" ? 1 : 0) + (dbEncryption === "disabled" ? 1 : 0);
                  const warningCount = logs.filter(l => l.type === "warning").length + (iamPolicy === "admin-all" ? 1 : 0);
                  
                  addLog("info", `Critical Issues: ${criticalCount}`);
                  addLog("info", `Warnings: ${warningCount}`);
                  addLog("info", "");
                  
                  if (criticalCount === 0 && warningCount === 0) {
                    addLog("success", "✓ All checks passed! Infrastructure is secure.");
                    toast.success("Security scan completed - No issues found!");
                  } else {
                    addLog("error", "✗ Action required: Review findings above");
                    toast.error(`Scan completed with ${criticalCount} critical issues`);
                  }
                  
                  setIsRunning(false);
                }, 800);
              }, 800);
            }, 800);
          }, 800);
        }, 800);
      }, 1000);
    }, 500);
  };

  const resetSimulation = () => {
    setS3Access("private");
    setIamPolicy("least-privilege");
    setDbEncryption("enabled");
    setLogs([
      {
        type: "info",
        message: "Cloud Security Simulator reset",
        timestamp: new Date()
      }
    ]);
    toast.info("Configuration reset to defaults");
  };

  const getLogIcon = (type: SimulationLog["type"]) => {
    switch(type) {
      case "error": return "✗";
      case "warning": return "⚠";
      case "success": return "✓";
      default: return "›";
    }
  };

  const getLogColor = (type: SimulationLog["type"]) => {
    switch(type) {
      case "error": return "text-red-600";
      case "warning": return "text-amber-600";
      case "success": return "text-emerald-600";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Cloud Security Simulator</h1>
        <p className="text-slate-500 mt-1">Interactive AWS security misconfiguration testing environment</p>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration Panel */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-600" />
              Infrastructure Configuration
            </CardTitle>
            <CardDescription>
              Adjust settings to simulate different security scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* S3 Configuration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="s3">S3 Bucket Access</Label>
                <Badge variant={s3Access === "public" ? "destructive" : "success"}>
                  {s3Access === "public" ? "Public" : "Private"}
                </Badge>
              </div>
              <Select value={s3Access} onValueChange={setS3Access}>
                <SelectTrigger id="s3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private (Recommended)</SelectItem>
                  <SelectItem value="public">Public Read Access ⚠️</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Controls whether S3 buckets allow public internet access
              </p>
            </div>

            {/* IAM Configuration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="iam">IAM Policy Level</Label>
                <Badge variant={iamPolicy === "admin-all" ? "warning" : "success"}>
                  {iamPolicy === "admin-all" ? "Admin" : "Least Privilege"}
                </Badge>
              </div>
              <Select value={iamPolicy} onValueChange={setIamPolicy}>
                <SelectTrigger id="iam">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="least-privilege">Least Privilege (Recommended)</SelectItem>
                  <SelectItem value="admin-all">Administrator Access ⚠️</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Defines the permission scope for IAM users and roles
              </p>
            </div>

            {/* Database Encryption */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="db">RDS Encryption</Label>
                <Badge variant={dbEncryption === "disabled" ? "destructive" : "success"}>
                  {dbEncryption === "disabled" ? "Disabled" : "Enabled"}
                </Badge>
              </div>
              <Select value={dbEncryption} onValueChange={setDbEncryption}>
                <SelectTrigger id="db">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Encryption Enabled (Recommended)</SelectItem>
                  <SelectItem value="disabled">Encryption Disabled ⚠️</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Enables AES-256 encryption at rest for RDS databases
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={runSimulation} 
                disabled={isRunning}
                className="flex-1 gap-2"
              >
                <Play className="h-4 w-4" />
                Run Security Scan
              </Button>
              <Button 
                variant="outline" 
                onClick={resetSimulation}
                disabled={isRunning}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Terminal Output */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-600" />
              Terminal Output
            </CardTitle>
            <CardDescription>Real-time security scan results</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-slate-900 text-slate-100 font-mono text-sm h-[500px] overflow-y-auto">
              <div className="p-4 space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className={getLogColor(log.type)}>{getLogIcon(log.type)}</span>
                    <span className={`flex-1 ${getLogColor(log.type)}`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                {isRunning && (
                  <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                    <span>›</span>
                    <span>Scanning...</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remediation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Remediation Guides
          </CardTitle>
          <CardDescription>How to fix common misconfigurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* S3 Remediation */}
          <div className="p-4 border border-slate-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">🔒 Securing S3 Buckets</h4>
            <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs overflow-x-auto">
              <pre>{`# Block all public access
aws s3api put-public-access-block \\
  --bucket sensitive-customer-data \\
  --public-access-block-configuration \\
  "BlockPublicAcls=true,IgnorePublicAcls=true,\\
   BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning
aws s3api put-bucket-versioning \\
  --bucket sensitive-customer-data \\
  --versioning-configuration Status=Enabled`}</pre>
            </div>
          </div>

          {/* IAM Remediation */}
          <div className="p-4 border border-slate-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">👤 Implementing Least Privilege IAM</h4>
            <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs overflow-x-auto">
              <pre>{`# Python: Create restricted policy
import boto3

iam = boto3.client('iam')
policy = {
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": ["s3:GetObject", "s3:ListBucket"],
        "Resource": "arn:aws:s3:::my-bucket/*"
    }]
}
iam.create_policy(PolicyName='RestrictedS3Access', 
                  PolicyDocument=json.dumps(policy))`}</pre>
            </div>
          </div>

          {/* RDS Remediation */}
          <div className="p-4 border border-slate-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">🗄️ Enabling RDS Encryption</h4>
            <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs overflow-x-auto">
              <pre>{`# Terraform: Enable RDS encryption
resource "aws_db_instance" "production" {
  identifier = "prod-mysql-cluster"
  engine     = "mysql"
  
  storage_encrypted = true
  kms_key_id       = aws_kms_key.rds.arn
  
  # Note: Cannot enable encryption on existing unencrypted DB
  # Must create snapshot → copy with encryption → restore
}`}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

