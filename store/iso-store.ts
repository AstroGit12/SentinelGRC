import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ISOControl {
  id: string;
  category: string;
  title: string;
  description: string;
  implemented: boolean;
}

interface ISOStore {
  controls: ISOControl[];
  toggleImplemented: (id: string) => void;
  loadControls: () => void;
}

const iso27001Controls: ISOControl[] = [
  {
    id: 'A.5.1',
    category: 'Organizational Controls',
    title: 'Policies for Information Security',
    description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals.',
    implemented: false
  },
  {
    id: 'A.5.2',
    category: 'Organizational Controls',
    title: 'Information Security Roles and Responsibilities',
    description: 'Information security roles and responsibilities shall be defined and allocated according to the organization needs.',
    implemented: false
  },
  {
    id: 'A.5.3',
    category: 'Organizational Controls',
    title: 'Segregation of Duties',
    description: 'Conflicting duties and conflicting areas of responsibility shall be segregated.',
    implemented: false
  },
  {
    id: 'A.8.1',
    category: 'Asset Management',
    title: 'Inventory of Assets',
    description: 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.',
    implemented: true
  },
  {
    id: 'A.8.2',
    category: 'Asset Management',
    title: 'Ownership of Assets',
    description: 'Assets maintained in the inventory shall be owned.',
    implemented: true
  },
  {
    id: 'A.8.3',
    category: 'Asset Management',
    title: 'Acceptable Use of Assets',
    description: 'Rules for the acceptable use of information and of assets associated with information and information processing facilities shall be identified, documented and implemented.',
    implemented: false
  },
  {
    id: 'A.9.1',
    category: 'Access Control',
    title: 'Access Control Policy',
    description: 'An access control policy shall be established, documented and reviewed based on business and information security requirements.',
    implemented: true
  },
  {
    id: 'A.9.2',
    category: 'Access Control',
    title: 'User Access Management',
    description: 'A user access management process shall be implemented to assign or revoke access rights for all user types to all systems and services.',
    implemented: true
  },
  {
    id: 'A.9.3',
    category: 'Access Control',
    title: 'User Responsibilities',
    description: 'Users shall be required to follow the organization\'s practices in the use of authentication information.',
    implemented: false
  },
  {
    id: 'A.9.4',
    category: 'Access Control',
    title: 'System and Application Access Control',
    description: 'Access to systems and applications shall be controlled in accordance with the access control policy.',
    implemented: true
  },
  {
    id: 'A.12.1',
    category: 'Operations Security',
    title: 'Operational Procedures and Responsibilities',
    description: 'Operational procedures shall be documented and made available to personnel who need them.',
    implemented: false
  },
  {
    id: 'A.12.2',
    category: 'Operations Security',
    title: 'Protection from Malware',
    description: 'Protection against malware shall be implemented and supported by appropriate user awareness.',
    implemented: true
  },
  {
    id: 'A.12.3',
    category: 'Operations Security',
    title: 'Backup',
    description: 'Backup copies of information, software and systems shall be maintained and regularly tested in accordance with the agreed backup policy.',
    implemented: true
  },
  {
    id: 'A.12.4',
    category: 'Operations Security',
    title: 'Logging and Monitoring',
    description: 'Event logs recording user activities, exceptions, faults and information security events shall be produced, kept and regularly reviewed.',
    implemented: false
  },
  {
    id: 'A.14.1',
    category: 'System Acquisition & Development',
    title: 'Security Requirements of Information Systems',
    description: 'Information security requirements shall be included in the requirements for new information systems or enhancements to existing information systems.',
    implemented: false
  },
  {
    id: 'A.14.2',
    category: 'System Acquisition & Development',
    title: 'Security in Development and Support Processes',
    description: 'Rules for the secure development of software and systems shall be established and applied.',
    implemented: true
  },
  {
    id: 'A.17.1',
    category: 'Business Continuity',
    title: 'Planning Information Security Continuity',
    description: 'Requirements for information security and the continuity of information security management shall be determined and planned.',
    implemented: false
  },
  {
    id: 'A.17.2',
    category: 'Business Continuity',
    title: 'Redundancies',
    description: 'Information processing facilities shall be implemented with redundancy sufficient to meet availability requirements.',
    implemented: true
  },
  {
    id: 'A.18.1',
    category: 'Compliance',
    title: 'Compliance with Legal Requirements',
    description: 'All relevant legislative statutory, regulatory, contractual requirements and the organization\'s approach to meet these requirements shall be explicitly identified, documented and kept up to date.',
    implemented: false
  },
  {
    id: 'A.18.2',
    category: 'Compliance',
    title: 'Information Security Reviews',
    description: 'The organization\'s approach to managing information security and its implementation shall be reviewed independently at planned intervals.',
    implemented: false
  }
];

export const useISOStore = create<ISOStore>()(
  persist(
    (set) => ({
      controls: iso27001Controls,
      toggleImplemented: (id) =>
        set((state) => ({
          controls: state.controls.map((control) =>
            control.id === id ? { ...control, implemented: !control.implemented } : control
          ),
        })),
      loadControls: () => set({ controls: iso27001Controls }),
    }),
    {
      name: 'sentinel-iso-storage',
    }
  )
);

