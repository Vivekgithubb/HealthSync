# HealthSync Style Guide

## Color Palette

### Primary Colors
- **Deep Navy**: `#0D1B2A` - Main brand color, navigation, headers
- **Accent Gold**: `#C09A53` - Buttons, links, highlights
- **Off-White**: `#F8F9FA` - Main content background
- **Pure White**: `#FFFFFF` - Cards, form backgrounds

### Supporting Colors
- **Light Gray**: `#E9ECEF` - Borders, dividers
- **Medium Gray**: `#6C757D` - Secondary text
- **Success Green**: `#28A745` - Success states
- **Error Red**: `#DC3545` - Error states
- **Warning Orange**: `#FFC107` - Warning states

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes
- **Heading 1**: 2.5rem (40px) - Page titles
- **Heading 2**: 2rem (32px) - Section headers
- **Heading 3**: 1.5rem (24px) - Card headers
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Helper text, labels

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Layout

### Structure
- **3-Column Layout**:
  - **Left Sidebar**: `#0D1B2A` background, fixed width 240px
  - **Content Area**: `#F8F9FA` background, flexible width
  - **Right Sidebar** (optional): 280px for widgets/notifications

### Spacing
- **Container padding**: 2rem (32px)
- **Section spacing**: 1.5rem (24px)
- **Element spacing**: 1rem (16px)
- **Compact spacing**: 0.5rem (8px)

### Max Widths
- **Content container**: 1280px
- **Form containers**: 600px
- **Card max-width**: 100%

## Components

### Buttons

#### Primary Button
```css
Background: #C09A53
Color: #FFFFFF
Padding: 0.75rem 1.5rem
Border-radius: 0.375rem (rounded-md)
Font-weight: 600
Hover: Darken by 10%
Shadow: shadow-sm
```

#### Secondary Button
```css
Background: transparent
Border: 2px solid #C09A53
Color: #C09A53
Padding: 0.75rem 1.5rem
Border-radius: 0.375rem
Font-weight: 600
Hover: Background #C09A53, Color #FFFFFF
```

#### Danger Button
```css
Background: #DC3545
Color: #FFFFFF
Padding: 0.75rem 1.5rem
Border-radius: 0.375rem
Font-weight: 600
```

### Cards
```css
Background: #FFFFFF
Border-radius: 0.5rem (rounded-lg)
Padding: 1.5rem
Shadow: shadow-md
Border: 1px solid #E9ECEF
```

### Forms

#### Input Fields
```css
Background: #FFFFFF
Border: 1px solid #E9ECEF
Border-radius: 0.375rem
Padding: 0.75rem 1rem
Font-size: 1rem
Focus: Border #C09A53, Ring 2px #C09A53 with opacity
```

#### Labels
```css
Color: #0D1B2A
Font-weight: 500
Font-size: 0.875rem
Margin-bottom: 0.5rem
```

### Navigation

#### Sidebar Navigation
```css
Background: #0D1B2A
Width: 240px
Padding: 1.5rem 1rem
Item padding: 0.75rem 1rem
Item radius: 0.375rem
Active item background: #C09A53
Inactive item hover: rgba(192, 154, 83, 0.1)
```

### Icons
- Use **lucide-react** for all icons
- Icon size: 20px for nav items, 24px for headers
- Icon color: Match text color

## Specific Page Guidelines

### Dashboard
- Use card grid layout (2-3 columns)
- Show key metrics in prominent cards
- Use subtle animations for hover states

### Forms
- Stack labels above inputs
- Use consistent spacing (1rem between fields)
- Group related fields together
- Show validation errors below inputs in red

### Tables
- Striped rows with alternating backgrounds
- Hover highlight on rows
- Sticky header for long tables
- Actions column on the right

## Accessibility
- Minimum contrast ratio: 4.5:1 for text
- Focus indicators on all interactive elements
- Proper ARIA labels
- Keyboard navigation support
