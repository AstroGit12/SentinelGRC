# SentinelGRC - Getting Started Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

The app will automatically redirect to `/dashboard`.

---

## 📁 Project Structure

```
SentinelGRC/
├── app/
│   ├── (platform)/          # Main application routes
│   │   ├── dashboard/       # Command center with KPIs
│   │   ├── risk-register/   # Risk management
│   │   ├── vendor-risk/     # Vendor assessments
│   │   ├── iso-controls/    # ISO 27001 controls
│   │   ├── gdpr-tracker/    # GDPR fines tracker
│   │   ├── cloud-simulator/ # AWS security simulator
│   │   └── incidents/       # Incident tracking
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── sidebar.tsx          # Navigation sidebar
│   ├── topbar.tsx           # Top navigation bar
│   └── empty-state.tsx      # Reusable empty state
├── store/
│   ├── risk-store.ts        # Risk management state
│   ├── vendor-store.ts      # Vendor assessment state
│   └── iso-store.ts         # ISO controls state
└── lib/
    └── utils.ts             # Utility functions
```

---

## 🔐 **NEW: Authentication System**

### Login & Signup (`/login`, `/signup`)
- **Full authentication flow** with login/signup pages
- **Demo mode**: Use any email/password to sign in
- **Persistent sessions**: Stays logged in across browser refreshes
- **Try it**: `demo@sentinelgrc.com` / `password123`

### Profile Page (`/profile`)
- Click the **avatar in top-right** corner
- **Edit your profile**: Name, email, role, department
- **3 tabs**: General, Security, Preferences
- **Sign out** functionality
- **Avatar with initials** (e.g., "Alex Davis" → "AD")

### Improved "Simulate Audit" Button
Now actually **reads your real data**:
- Counts critical risks from Risk Register
- Calculates compliance % from ISO controls
- Shows **accurate audit results** like:
  - ✅ "87% compliance score"
  - ⚠️ "3 critical risks • 5 controls pending"

**See AUTH_SYSTEM_GUIDE.md for detailed documentation!**

---

## 🎯 Key Features

### 1. **Dashboard** (`/dashboard`)
- **Compliance Score**: Real-time tracking with radial progress
- **Risk Distribution Matrix**: Interactive scatter plot (Likelihood vs Impact)
- **Compliance Velocity**: 6-month trend line chart
- **System Health**: Quick stats overview
- **Recent Activity**: Latest risks requiring attention

**Pro Tips:**
- The dashboard auto-loads when data is present in stores
- Scores are calculated in real-time from Zustand stores
- Click "Load Demo Data" on empty pages to populate

### 2. **Risk Register** (`/risk-register`)
- **Full CRUD Operations**: Add, view, edit risks
- **Auto-calculated Risk Scores**: Likelihood × Impact
- **Color-coded Severity**: 
  - 🔴 Critical (20-25)
  - 🟠 High (15-19)
  - 🟡 Medium (8-14)
  - 🟢 Low (<8)
- **Search & Filter**: Real-time table filtering
- **Risk Detail Drawer**: Click any risk to view mitigation plans

**Pro Tips:**
- All data is persisted to `localStorage` via Zustand
- Risk IDs use monospace font (as per spec)
- Status badges are consistent across the app

### 3. **Vendor Risk Assessment** (`/vendor-risk`)
- **12-Question Security Questionnaire**
- **Real-time Score Calculation**
- **PDF Certification Export**: Professional PDF with jsPDF
- **Compliance Status Tracking**:
  - ✅ Compliant (80%+)
  - ⚠️ Under Review (60-79%)
  - ❌ Non-Compliant (<60%)

**Pro Tips:**
- Answers are Yes/No/N/A format
- Click "Export PDF" to generate vendor certification
- Demo data includes AWS, Stripe, Datadog, etc.

### 4. **ISO 27001 Controls** (`/iso-controls`)
- **20 Core Controls** from Annex A
- **Accordion Layout** for easy navigation
- **Implementation Tracking**: Click checkboxes to mark as implemented
- **Progress Indicators**: Per-category completion badges
- **Filter Tabs**: View All / Implemented / Pending

**Pro Tips:**
- State persists across sessions
- Categories include: Organizational, Asset Management, Access Control, etc.
- Click the checkbox OR the "Mark as Implemented" button

### 5. **Cloud Simulator** (`/cloud-simulator`)
- **Split-Screen Interface**:
  - Left: Configuration panel (S3, IAM, RDS)
  - Right: Terminal output (live scanning)
- **Real-world Scenarios**:
  - Public S3 bucket detection
  - Overly permissive IAM policies
  - Unencrypted RDS databases
- **Remediation Guides**: AWS CLI, Python, Terraform examples

**Pro Tips:**
- Try setting S3 to "Public" and run the scan
- Terminal uses monospace font with color-coded output
- Scan is animated with realistic timing

### 6. **GDPR Tracker** (`/gdpr-tracker`)
- **8 Largest Fines** since 2020
- **Year-over-year Bar Chart**
- **Detailed Violation Descriptions**
- **Key Compliance Insights**

**Pro Tips:**
- Data is real (Meta €1.2B fine, Amazon €746M, etc.)
- Includes DPA authority and violation type
- Great for understanding regulatory trends

---

## 🎨 Design System

### Colors
- **Primary**: `blue-600` (#2563eb) - Enterprise blue for CTAs
- **Background**: `slate-50` (#f8fafc) - Main background
- **Cards**: `white` - All card components
- **Sidebar**: `slate-900` - Dark contrast sidebar
- **Critical**: `red-500/50` - High-priority items
- **Success**: `emerald-600/50` - Compliant/completed items
- **Warning**: `amber-500/50` - Medium-priority items

### Typography
- **Headings**: Bold, tight tracking
- **Body**: Inter font family
- **Technical IDs**: Monospace font (Risk IDs, Control IDs)

### Components
- **Badges**: Color-coded status indicators (consistent variants)
- **Cards**: 1px borders, no heavy shadows
- **Buttons**: Solid primary, outline secondary
- **Empty States**: Encouraging CTAs with demo data option

---

## 🔧 State Management

### Zustand Stores
All stores use `persist` middleware to save to `localStorage`:

```typescript
// Risk Store
useRiskStore() // risks, addRisk(), updateRisk(), deleteRisk(), loadDemoData()

// Vendor Store
useVendorStore() // vendors, addVendor(), updateVendor(), deleteVendor(), loadDemoData()

// ISO Store
useISOStore() // controls, toggleImplemented(), loadControls()
```

**Storage Keys:**
- `sentinel-risk-storage`
- `sentinel-vendor-storage`
- `sentinel-iso-storage`

To reset data: Clear localStorage in DevTools > Application > Local Storage

---

## 📊 Charts & Visualization

### Recharts Configuration
- **Line Chart**: Compliance velocity (Dashboard)
- **Scatter Chart**: Risk heatmap (Dashboard)
- **Bar Chart**: GDPR fines by year (GDPR Tracker)

**Customizations:**
- Responsive containers
- Custom tooltips with white background + border
- Color-coded data points based on severity
- Professional grid styling

---

## 🚨 Interactive Features

### Simulate Audit Button (Topbar)
- Triggers loading toast for 2 seconds
- Shows success toast with mock compliance score
- Great for demos!

### Empty States
Every page has a beautiful empty state:
- Encouraging message
- "Add First [Item]" CTA
- "Load Demo Data" secondary button

### Framer Motion
- Page transitions: `opacity` + `y` transform
- Duration: 300ms
- Applied to all platform routes

---

## 🔐 Security Best Practices Demonstrated

1. **Least Privilege**: IAM policy examples
2. **Encryption at Rest**: S3 and RDS configurations
3. **Access Control**: Role-based permissions
4. **Data Classification**: Risk categorization
5. **Vendor Management**: Third-party risk assessments
6. **Compliance Frameworks**: ISO 27001, GDPR
7. **Incident Response**: Placeholder for IR workflow

---

## 🎯 Pro Features Implemented

✅ **Monospace Fonts**: Risk IDs, Control IDs, Terminal  
✅ **Badge System**: Consistent color-coded statuses  
✅ **Empty States**: "Load Demo Data" functionality  
✅ **PDF Export**: Vendor certification download  
✅ **Real-time Calculations**: Risk scores, compliance %  
✅ **Persistent State**: localStorage via Zustand  
✅ **Responsive Design**: Mobile-friendly layouts  
✅ **Collapsible Sidebar**: Better screen real estate  
✅ **Toast Notifications**: Sonner for user feedback  
✅ **Interactive Simulator**: Live cloud security testing  

---

## 🛠️ Customization Guide

### Adding a New Risk
1. Navigate to `/risk-register`
2. Click "Add Risk"
3. Fill in: Title, Category, Owner (required)
4. Set Likelihood & Impact (1-5)
5. Score auto-calculates (L × I)

### Modifying Demo Data
Edit the arrays in:
- `store/risk-store.ts` → `demoRisks`
- `store/vendor-store.ts` → `demoVendors`
- `store/iso-store.ts` → `iso27001Controls`

### Changing Theme Colors
Edit `app/globals.css` CSS variables:
```css
:root {
  --primary: 217.2 91.2% 59.8%; /* HSL for blue-600 */
}
```

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

Optimized static build ready for deployment to:
- Vercel
- Netlify
- AWS Amplify
- Any Node.js hosting

---

## 🎓 Learning Resources

This project demonstrates:
- **Next.js 14 App Router**: File-based routing, layouts
- **Server vs Client Components**: Strategic use of "use client"
- **Zustand**: Lightweight state management
- **Recharts**: D3-based React charting
- **shadcn/ui**: Accessible, customizable components
- **Framer Motion**: Smooth page transitions
- **jsPDF**: Client-side PDF generation

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Styles not loading
```bash
npm run dev
# Hard refresh browser (Ctrl+Shift+R)
```

### Data not persisting
Check browser localStorage:
1. Open DevTools (F12)
2. Application > Local Storage
3. Verify `sentinel-*-storage` keys exist

### Charts not rendering
Ensure window is resized at least once after mount (Recharts responsive container issue)

---

## 🎉 You're Ready!

Start the dev server and explore SentinelGRC:

```bash
npm run dev
```

**Recommended First Steps:**
1. Visit `/dashboard` → Click "Load Demo Data" on empty pages
2. Explore `/risk-register` → Add a custom risk
3. Try `/vendor-risk` → Complete an assessment, export PDF
4. Test `/cloud-simulator` → Set S3 to "Public", run scan
5. Check `/iso-controls` → Mark controls as implemented

---

**Built with ❤️ for Enterprise Security & Compliance**

*SentinelGRC - Production-Grade GRC Platform*

