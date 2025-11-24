import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateRiskScore } from '@/lib/utils';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  inherentLikelihood: number;
  inherentImpact: number;
  inherentScore: number;
  status: 'Open' | 'Mitigated' | 'Closed';
  owner: string;
  mitigation?: string;
  createdAt: Date;
}

interface RiskStore {
  risks: Risk[];
  addRisk: (risk: Omit<Risk, 'id' | 'inherentScore' | 'createdAt'>) => void;
  updateRisk: (id: string, risk: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  loadDemoData: () => void;
}

const demoRisks: Omit<Risk, 'createdAt'>[] = [
  {
    id: 'RSK-001',
    title: 'Unencrypted Data at Rest',
    description: 'Customer PII stored in S3 buckets without server-side encryption enabled',
    category: 'Data Security',
    inherentLikelihood: 4,
    inherentImpact: 5,
    inherentScore: 20,
    status: 'Open',
    owner: 'Security Team',
    mitigation: 'Enable AWS S3 server-side encryption (SSE-KMS) across all buckets containing sensitive data.'
  },
  {
    id: 'RSK-002',
    title: 'Missing MFA for Admin Accounts',
    description: 'Administrative accounts lack multi-factor authentication enforcement',
    category: 'Access Control',
    inherentLikelihood: 5,
    inherentImpact: 4,
    inherentScore: 20,
    status: 'Open',
    owner: 'IAM Team'
  },
  {
    id: 'RSK-003',
    title: 'Outdated Third-Party Dependencies',
    description: 'Production application using npm packages with known CVEs',
    category: 'Application Security',
    inherentLikelihood: 4,
    inherentImpact: 4,
    inherentScore: 16,
    status: 'Mitigated',
    owner: 'DevOps Team',
    mitigation: 'Implemented Dependabot and Snyk scanning. Quarterly dependency update cycle established.'
  },
  {
    id: 'RSK-004',
    title: 'No Disaster Recovery Testing',
    description: 'DR plan exists but has never been tested end-to-end',
    category: 'Business Continuity',
    inherentLikelihood: 3,
    inherentImpact: 5,
    inherentScore: 15,
    status: 'Open',
    owner: 'Infrastructure Team'
  },
  {
    id: 'RSK-005',
    title: 'Public S3 Bucket Exposure',
    description: 'Three S3 buckets configured with public read access for legacy reasons',
    category: 'Cloud Security',
    inherentLikelihood: 5,
    inherentImpact: 5,
    inherentScore: 25,
    status: 'Open',
    owner: 'Cloud Security Team',
    mitigation: 'Migrate to CloudFront with OAI. Block all public S3 access at the organization level.'
  },
  {
    id: 'RSK-006',
    title: 'Lack of Security Awareness Training',
    description: 'Employees have not received security training in over 18 months',
    category: 'Human Risk',
    inherentLikelihood: 4,
    inherentImpact: 3,
    inherentScore: 12,
    status: 'Mitigated',
    owner: 'HR / Compliance',
    mitigation: 'Launched mandatory quarterly security awareness training via KnowBe4.'
  },
  {
    id: 'RSK-007',
    title: 'Insufficient Logging and Monitoring',
    description: 'CloudTrail logs not centralized; no alerting on critical events',
    category: 'Detection & Response',
    inherentLikelihood: 3,
    inherentImpact: 4,
    inherentScore: 12,
    status: 'Open',
    owner: 'SecOps Team'
  },
  {
    id: 'RSK-008',
    title: 'Vendor SLA Non-Compliance',
    description: 'Critical vendor failed to meet uptime SLA for Q3',
    category: 'Third-Party Risk',
    inherentLikelihood: 2,
    inherentImpact: 4,
    inherentScore: 8,
    status: 'Closed',
    owner: 'Procurement',
    mitigation: 'Renegotiated contract with penalty clauses and monthly SLA reviews.'
  }
];

export const useRiskStore = create<RiskStore>()(
  persist(
    (set) => ({
      risks: [],
      addRisk: (risk) =>
        set((state) => ({
          risks: [
            ...state.risks,
            {
              ...risk,
              id: `RSK-${String(state.risks.length + 1).padStart(3, '0')}`,
              inherentScore: calculateRiskScore(risk.inherentLikelihood, risk.inherentImpact),
              createdAt: new Date(),
            },
          ],
        })),
      updateRisk: (id, updatedRisk) =>
        set((state) => ({
          risks: state.risks.map((risk) =>
            risk.id === id
              ? {
                  ...risk,
                  ...updatedRisk,
                  inherentScore:
                    updatedRisk.inherentLikelihood || updatedRisk.inherentImpact
                      ? calculateRiskScore(
                          updatedRisk.inherentLikelihood || risk.inherentLikelihood,
                          updatedRisk.inherentImpact || risk.inherentImpact
                        )
                      : risk.inherentScore,
                }
              : risk
          ),
        })),
      deleteRisk: (id) =>
        set((state) => ({
          risks: state.risks.filter((risk) => risk.id !== id),
        })),
      loadDemoData: () =>
        set({
          risks: demoRisks.map(risk => ({ ...risk, createdAt: new Date() })),
        }),
    }),
    {
      name: 'sentinel-risk-storage',
    }
  )
);

