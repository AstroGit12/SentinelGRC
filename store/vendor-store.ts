import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Vendor {
  id: string;
  name: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  serviceType: string;
  assessmentScore: number;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Under Review';
  lastAssessment: Date;
  contact?: string;
}

interface VendorStore {
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id' | 'lastAssessment'>) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  loadDemoData: () => void;
}

const demoVendors: Omit<Vendor, 'lastAssessment'>[] = [
  {
    id: 'VND-001',
    name: 'AWS (Amazon Web Services)',
    criticality: 'Critical',
    serviceType: 'Cloud Infrastructure',
    assessmentScore: 95,
    complianceStatus: 'Compliant',
    contact: 'cloud-support@aws.amazon.com'
  },
  {
    id: 'VND-002',
    name: 'Datadog',
    criticality: 'High',
    serviceType: 'Monitoring & Observability',
    assessmentScore: 88,
    complianceStatus: 'Compliant',
    contact: 'security@datadog.com'
  },
  {
    id: 'VND-003',
    name: 'Stripe',
    criticality: 'Critical',
    serviceType: 'Payment Processing',
    assessmentScore: 97,
    complianceStatus: 'Compliant',
    contact: 'compliance@stripe.com'
  },
  {
    id: 'VND-004',
    name: 'SendGrid',
    criticality: 'Medium',
    serviceType: 'Email Delivery',
    assessmentScore: 72,
    complianceStatus: 'Under Review',
    contact: 'support@sendgrid.com'
  },
  {
    id: 'VND-005',
    name: 'Acme Analytics Co.',
    criticality: 'Low',
    serviceType: 'Business Intelligence',
    assessmentScore: 58,
    complianceStatus: 'Non-Compliant',
    contact: 'sales@acmeanalytics.example'
  }
];

export const useVendorStore = create<VendorStore>()(
  persist(
    (set) => ({
      vendors: [],
      addVendor: (vendor) =>
        set((state) => ({
          vendors: [
            ...state.vendors,
            {
              ...vendor,
              id: `VND-${String(state.vendors.length + 1).padStart(3, '0')}`,
              lastAssessment: new Date(),
            },
          ],
        })),
      updateVendor: (id, updatedVendor) =>
        set((state) => ({
          vendors: state.vendors.map((vendor) =>
            vendor.id === id ? { ...vendor, ...updatedVendor } : vendor
          ),
        })),
      deleteVendor: (id) =>
        set((state) => ({
          vendors: state.vendors.filter((vendor) => vendor.id !== id),
        })),
      loadDemoData: () =>
        set({
          vendors: demoVendors.map(vendor => ({ ...vendor, lastAssessment: new Date() })),
        }),
    }),
    {
      name: 'sentinel-vendor-storage',
    }
  )
);

