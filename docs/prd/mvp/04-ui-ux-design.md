# UI/UX Design Specifications

**Version**: 1.0 | **Part**: 4 of 6
**Timeline**: 12 Weeks | **Budget**: $175,000
**Target Launch**: January 15, 2025

[← Previous: Technical Specs](./03-technical-specs.md) | [↑ Index](./README.md) | [Next: Development & Testing →](./05-development-testing.md)

---

## 5. UI/UX SPECIFICATIONS

### 5.1 Design Principles

#### Core Principles

1. **Simple**: No training required
   - Self-explanatory interface
   - Progressive disclosure
   - Clear CTAs

2. **Fast**: Every action < 3 clicks
   - Minimize navigation depth
   - Quick actions always visible
   - Keyboard shortcuts for power users

3. **Mobile-First**: 60% mobile usage expected
   - Touch-optimized controls
   - Responsive breakpoints
   - PWA installable

4. **Professional**: Build trust immediately
   - Clean, modern design
   - Professional color palette
   - High-quality imagery

5. **Accessible**: WCAG 2.1 AA minimum
   - Screen reader support
   - Keyboard navigation
   - Color contrast compliance
   - Focus indicators

#### Design Philosophy

**Tax preparers are not tech-savvy**. The interface must be:
- **Obvious**: No hidden features
- **Forgiving**: Easy to undo mistakes
- **Helpful**: Contextual help always available
- **Consistent**: Same patterns throughout

---

### 5.2 Key Screens

#### Dashboard (Preparer View)

```
┌────────────────────────────────────┐
│  Welcome, [Name]!                  │
│                                    │
│  New Leads        Active Clients   │
│  [  12  ]         [  47  ]         │
│                                    │
│  This Week's Revenue               │
│  $3,450                            │
│                                    │
│  Quick Actions:                    │
│  [+ Add Client] [View Website]    │
│  [Send Email]   [View Analytics]  │
└────────────────────────────────────┘
```

**Key Elements**:
- **Hero Stats**: Large, colorful metric cards
- **Quick Actions**: 4 most-used actions prominent
- **Recent Activity**: Last 5 leads/clients
- **Action Items**: Overdue tasks highlighted

**Component Structure**:
```tsx
// components/Dashboard.tsx
export function Dashboard({ preparer }: { preparer: Preparer }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <WelcomeHeader preparer={preparer} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <MetricCard
          title="New Leads"
          value={12}
          change="+3 from last week"
          icon={<UsersIcon />}
          color="blue"
        />
        <MetricCard
          title="Active Clients"
          value={47}
          change="+5 from last week"
          icon={<BriefcaseIcon />}
          color="green"
        />
        <MetricCard
          title="This Week's Revenue"
          value="$3,450"
          change="+12% from last week"
          icon={<DollarSignIcon />}
          color="purple"
        />
      </div>

      <QuickActions />
      <RecentActivity />
    </div>
  );
}
```

---

#### Website Builder

```
┌────────────────────────────────────┐
│  Choose Your Template              │
│                                    │
│  [Professional] [Modern] [Classic] │
│                                    │
│  Customize:                        │
│  - Business Name: [___________]    │
│  - Tagline: [______________]       │
│  - Primary Color: [■]              │
│                                    │
│  Preview:                          │
│  [────────────────]                │
│  │                │                │
│  │  Your Preview  │                │
│  │                │                │
│  [────────────────]                │
│                                    │
│  [Save & Publish]                  │
└────────────────────────────────────┘
```

**Template Features**:
- **Professional**: Conservative, trust-focused
- **Modern**: Clean, minimalist
- **Classic**: Traditional, warm

**Customization Options** (MVP):
- Business name
- Tagline (50 chars max)
- Primary color
- Logo upload
- Hero image

**Post-MVP Customization**:
- Custom sections
- Service pricing table
- Testimonials section
- Blog integration

---

#### Pipeline View (Kanban)

```
┌───────┬───────┬───────┬───────┬───────┐
│  New  │Contact│ Docs  │Prepare│Complete│
│  (5)  │  (8)  │ (12)  │  (3)  │  (47) │
├───────┼───────┼───────┼───────┼───────┤
│┌─────┐│┌─────┐│┌─────┐│┌─────┐│┌─────┐│
││John ││││Maria││││Tom  ││││Lisa ││││Past││
││Doe  ││││Smith││││Brown││││Jones││││    ││
│└─────┘│└─────┘│└─────┘│└─────┘│└─────┘│
│       │       │       │       │       │
│┌─────┐│┌─────┐│┌─────┐│       │       │
││Jane ││││Bob  ││││Amy  ││       │       │
││Smith││││Wilson││││Lee ││       │       │
│└─────┘│└─────┘│└─────┘│       │       │
└───────┴───────┴───────┴───────┴───────┘
```

**Interaction**:
- **Drag & Drop**: Move cards between stages
- **Click Card**: Open client details
- **Badge Indicators**: Priority, days in stage
- **Filters**: By urgency, date, tags

**Component Implementation**:
```tsx
// components/Pipeline.tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function Pipeline({ clients, onStageChange }: PipelineProps) {
  const stages: PipelineStage[] = ['new', 'contacted', 'documents', 'preparing', 'complete'];

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => (
          <PipelineColumn
            key={stage}
            stage={stage}
            clients={clients.filter(c => c.pipeline_stage === stage)}
          />
        ))}
      </div>
    </DndContext>
  );
}
```

---

#### Lead Intake Form (Client-Facing)

```
┌────────────────────────────────────┐
│  Get Your Free Tax Estimate        │
│                                    │
│  Name: [___________________]       │
│  Email: [__________________]       │
│  Phone: [__________________]       │
│                                    │
│  Employment Type:                  │
│  ( ) W-2 Employee                  │
│  ( ) Self-Employed (1099)          │
│  ( ) Both                          │
│  ( ) Business Owner                │
│                                    │
│  Do you have dependents?           │
│  ( ) Yes [_] How many?             │
│  ( ) No                            │
│                                    │
│  Do you own a home?                │
│  ( ) Yes  ( ) No                   │
│                                    │
│  When do you need help?            │
│  ( ) Urgent (ASAP)                 │
│  ( ) This week                     │
│  ( ) This month                    │
│  ( ) No rush                       │
│                                    │
│  [Submit Request]                  │
│                                    │
│  Your information is secure 🔒     │
└────────────────────────────────────┘
```

**Form Optimizations**:
- **Progress Indicator**: Shows completion %
- **Smart Defaults**: Pre-fill based on analytics
- **Inline Validation**: Real-time error checking
- **Mobile Optimized**: Large touch targets
- **Auto-Save**: Preserves progress on reload

---

#### Client Detail View

```
┌────────────────────────────────────┐
│  ← Back to Pipeline                │
│                                    │
│  John Doe                          │
│  john.doe@email.com | 555-1234     │
│  Lead Score: 85                    │
│                                    │
│  [Send Email] [Schedule] [Move]    │
│                                    │
│  Documents (3):                    │
│  📄 W-2.pdf           2.1 MB       │
│  📄 1099.pdf          1.5 MB       │
│  📄 Mortgage.pdf      3.2 MB       │
│  [+ Upload More]                   │
│                                    │
│  Activity Timeline:                │
│  Today    - Document uploaded      │
│  2 days   - Email sent             │
│  3 days   - Lead submitted         │
│                                    │
│  Notes:                            │
│  [____________________________]    │
│  [____________________________]    │
│                                    │
│  [Save Changes]                    │
└────────────────────────────────────┘
```

**Key Features**:
- **Quick Actions**: Always visible at top
- **Document Management**: Preview + download
- **Activity Timeline**: Chronological history
- **Notes**: Rich text editor
- **Tags**: Visual categorization

---

### 5.3 Mobile Experience

#### Responsive Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

#### Mobile-First Design Approach

**Dashboard (Mobile)**:
```
┌─────────────────┐
│ ☰  Dashboard    │
├─────────────────┤
│                 │
│  New Leads      │
│     [12]        │
│                 │
│  Active Clients │
│     [47]        │
│                 │
│  This Week      │
│    $3,450       │
│                 │
├─────────────────┤
│ [+ Add Client]  │
│ [View Website]  │
├─────────────────┤
│ Recent Activity │
│ • John Doe      │
│ • Jane Smith    │
│ • Bob Wilson    │
└─────────────────┘
```

**Mobile Optimizations**:
- **Bottom Navigation**: Thumb-friendly menu
- **Swipe Gestures**: Navigate pipeline stages
- **Pull-to-Refresh**: Update data
- **Floating Action Button**: Primary action always accessible
- **Touch Targets**: Minimum 44px × 44px
- **Camera Integration**: Direct photo upload
- **Click-to-Call**: Tap phone numbers

#### PWA Features

**Manifest.json**:
```json
{
  "name": "Tax Genius Pro",
  "short_name": "TaxGenius",
  "description": "Professional tax preparation platform",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker**:
- **Offline Support**: Cache dashboard for offline access
- **Background Sync**: Queue actions when offline
- **Push Notifications**: Lead alerts even when closed

---

### 5.4 Color Scheme

```css
:root {
  /* Primary Colors */
  --primary: #2563eb;        /* Blue - Primary actions */
  --primary-hover: #1d4ed8;  /* Darker blue - Hover state */
  --primary-light: #dbeafe;  /* Light blue - Backgrounds */

  /* Secondary Colors */
  --secondary: #f59e0b;      /* Amber - Highlights */
  --secondary-hover: #d97706;

  /* Semantic Colors */
  --success: #10b981;        /* Green - Success states */
  --danger: #ef4444;         /* Red - Errors, delete */
  --warning: #f59e0b;        /* Amber - Warnings */
  --info: #3b82f6;           /* Blue - Info messages */

  /* Neutral Colors */
  --background: #ffffff;
  --foreground: #1f2937;     /* Dark gray - Text */
  --muted: #f3f4f6;          /* Light gray - Backgrounds */
  --muted-foreground: #6b7280; /* Medium gray - Secondary text */
  --border: #e5e7eb;         /* Light gray - Borders */

  /* Interactive States */
  --focus-ring: #2563eb;     /* Focus indicator */
  --disabled: #d1d5db;       /* Disabled elements */
}

/* Dark Mode (Post-MVP) */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1f2937;
    --foreground: #f9fafb;
    --muted: #374151;
    --border: #4b5563;
  }
}
```

#### Color Usage Guidelines

| Element | Color | Usage |
|---------|-------|-------|
| Primary Button | Blue (#2563eb) | Main CTAs |
| Secondary Button | Gray border | Less important actions |
| Danger Button | Red (#ef4444) | Delete, cancel |
| Success Badge | Green (#10b981) | Completed, active |
| Warning Badge | Amber (#f59e0b) | Pending, attention |
| Links | Blue (#2563eb) | Underlined on hover |
| Text Primary | Dark gray (#1f2937) | Body text |
| Text Secondary | Medium gray (#6b7280) | Helper text |

---

### 5.5 Typography

```css
/* Font Stack */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* Typography Scale */
.text-xs    { font-size: 0.75rem; }   /* 12px */
.text-sm    { font-size: 0.875rem; }  /* 14px */
.text-base  { font-size: 1rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; }  /* 18px */
.text-xl    { font-size: 1.25rem; }   /* 20px */
.text-2xl   { font-size: 1.5rem; }    /* 24px */
.text-3xl   { font-size: 1.875rem; }  /* 30px */
.text-4xl   { font-size: 2.25rem; }   /* 36px */

/* Font Weights */
.font-normal  { font-weight: 400; }
.font-medium  { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold    { font-weight: 700; }
```

#### Typography Guidelines

| Element | Style | Example |
|---------|-------|---------|
| H1 Page Title | 2xl, Bold | Dashboard |
| H2 Section | xl, Semibold | Recent Activity |
| H3 Subsection | lg, Semibold | Documents |
| Body Text | base, Normal | Paragraph text |
| Caption | sm, Normal | Helper text |
| Label | sm, Medium | Form labels |
| Button | base, Medium | Submit |

---

### 5.6 Component Library (shadcn/ui)

**Core Components Used**:
- `Button` - Primary, secondary, danger variants
- `Card` - Container for metric cards, forms
- `Input` - Text, email, tel inputs
- `Select` - Dropdowns for filters
- `Dialog` - Modals for confirmations
- `DropdownMenu` - Action menus
- `Badge` - Status indicators
- `Table` - Client/lead lists
- `Tabs` - Navigation within sections
- `Toast` - Success/error notifications

**Example Button Variants**:
```tsx
import { Button } from '@/components/ui/button';

// Primary action
<Button>Save Changes</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Danger action
<Button variant="destructive">Delete</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Saving...
</Button>
```

---

### 5.7 Accessibility Standards

#### WCAG 2.1 AA Compliance

**Color Contrast**:
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

**Keyboard Navigation**:
- Tab order follows visual order
- Focus indicators always visible
- Skip links for main content
- Keyboard shortcuts documented

**Screen Readers**:
- Semantic HTML (header, nav, main, footer)
- ARIA labels for icons
- Alt text for images
- Form labels associated with inputs

**Testing Checklist**:
- [ ] Color contrast verified (Lighthouse)
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Forms have proper labels
- [ ] Error messages are descriptive
- [ ] Focus indicators visible

---

### 5.8 Animation & Interactions

**Micro-interactions**:
```css
/* Button Hover */
.button {
  transition: all 0.2s ease;
}
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Card Hover */
.card {
  transition: box-shadow 0.3s ease;
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Page Transitions */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
}
```

**Loading States**:
- Skeleton screens for initial load
- Progress indicators for uploads
- Spinner for async actions
- Optimistic UI updates

---

### 5.9 Error Handling

**Error Message Patterns**:

```tsx
// Form Validation Error
<div className="text-sm text-red-600 mt-1">
  Please enter a valid email address
</div>

// Toast Error
toast.error('Failed to save changes. Please try again.');

// Empty State
<div className="text-center py-12">
  <Inbox className="mx-auto h-12 w-12 text-gray-400" />
  <h3 className="mt-2 text-sm font-medium">No leads yet</h3>
  <p className="mt-1 text-sm text-gray-500">
    Share your website to start receiving leads
  </p>
  <Button className="mt-4">Share Website</Button>
</div>
```

---

## Design Deliverables

### For MVP Launch
- ✅ Component library setup (shadcn/ui)
- ✅ Design tokens (colors, typography)
- ✅ Key screen wireframes (5 screens)
- ✅ Mobile responsive layouts
- ✅ PWA manifest and icons

### Post-MVP
- Dark mode theme
- Advanced animations
- Custom illustrations
- Onboarding tutorial
- Help documentation

---

## Related Documentation

- [Technical Specifications](./03-technical-specs.md) - Frontend tech stack details
- [User Stories](./02-user-stories.md) - Feature requirements for each screen
- [Development Plan](./05-development-testing.md) - UI implementation timeline

---

[← Previous: Technical Specs](./03-technical-specs.md) | [↑ Index](./README.md) | [Next: Development & Testing →](./05-development-testing.md)

**Document Status**: ✅ Design System Approved
**Last Updated**: 2025-10-09
