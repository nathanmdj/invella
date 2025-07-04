# UI and Styling Rules

## Tailwind CSS
- Use Tailwind CSS v4 for all styling
- Follow mobile-first responsive design principles
- Use the established color palette and spacing scale
- Prefer utility classes over custom CSS
- Use semantic color tokens when available

## Component Library
- Use Shadcn UI components from `packages/ui/src/shadcn/`
- Extend with custom Makerkit components from `packages/ui/src/makerkit/`
- Follow the established design system patterns
- Ensure accessibility compliance (ARIA labels, keyboard navigation)

## Responsive Design
- Mobile-first approach for all components
- Test on various screen sizes (sm, md, lg, xl, 2xl)
- Ensure touch-friendly interactions (min 44px touch targets)
- Optimize for mobile performance

## Design Patterns
- Use consistent spacing and typography
- Follow established color schemes
- Implement proper loading states and skeletons
- Use appropriate icons from Lucide React
- Maintain design consistency across components

## Accessibility
- Include proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain proper color contrast ratios
- Use semantic HTML elements
- Test with screen readers when possible