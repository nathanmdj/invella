## 🎨 Animation System Refactor: CSS to Framer Motion

This PR refactors the invitation system's animation layer from CSS-based animations to Framer Motion for enhanced performance, better developer experience, and more sophisticated animation capabilities.

### 🚀 What's Changed

#### **Dependencies**
- Added `framer-motion` v12.23.0 to UI package
- Updated package dependencies and lock file

#### **Components Refactored**

**1. Invitation Loading Component** (`packages/features/invitations/src/components/invitation-loading.tsx`)
- Replaced static skeleton loading with animated Framer Motion variants
- Added staggered children animations for smooth loading sequence
- Implemented fade-in and slide-up animations with configurable timing

**2. Invitation Frames Component** (`packages/ui/src/makerkit/invitation-frames.tsx`)
- **Major refactor**: Migrated from CSS scroll animations to Framer Motion
- Added smooth scroll tracking with `useScroll` and `useSpring`
- Implemented `AnimatePresence` for frame transitions
- Enhanced scroll-to-frame functionality with smooth easing
- Added intersection observer animations with `useInView`
- Improved performance with optimized animation triggers

**3. Template Renderer Component** (`packages/ui/src/makerkit/template-renderer.tsx`)
- Updated to use Framer Motion animations for template transitions
- Enhanced visual feedback during template rendering

### 🎯 Benefits

- **Better Performance**: Framer Motion's optimized animation engine
- **Enhanced UX**: Smoother, more natural animations with proper easing
- **Developer Experience**: Declarative animation API with better debugging
- **Accessibility**: Built-in support for reduced motion preferences
- **Maintainability**: Centralized animation logic with reusable variants

### 📊 Technical Details

- **Files Changed**: 6 files
- **Lines Added**: 916 insertions
- **Lines Removed**: 489 deletions
- **Net Change**: +427 lines

### 🧪 Testing

- All existing functionality preserved
- Animations tested across different screen sizes
- Performance impact assessed and optimized

### 📝 Commit History

1. `268bc0f` - Add framer-motion dependency
2. `2c43cec` - Update invitation loading component
3. `a4fedc4` - Migrate invitation frames to Framer Motion
4. `7ef643b` - Update template renderer animations
5. `c3e3be8` - Update dependencies and lock file

### 🔄 Migration Notes

This is a **non-breaking change** that enhances the existing animation system. All existing functionality remains intact while providing a more robust animation foundation for future features.

---

**Type**: Refactor  
**Breaking Change**: No  
**Performance Impact**: Positive (optimized animations) 