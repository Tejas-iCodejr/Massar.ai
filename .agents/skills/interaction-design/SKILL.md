---
name: interaction-design
description: "Design and implement microinteractions, motion design, transitions, and user feedback patterns. Use when adding polish to UI interactions, implementing loading states, or creating delightful user experiences."
---

# Interaction Design Skill

Create engaging, intuitive interactions through motion, feedback, and thoughtful state transitions that enhance usability and delight users.

## Timing & Easing Guidelines

- **100–150ms**: Micro-feedback (button hovers, clicks, active presses).
- **200–300ms**: Small transitions (toggles, dropdowns, tooltips).
- **300–500ms**: Medium transitions (modals, page route changes).
- **Easing**: Use cubic-bezier decelerate `cubic-bezier(0.16, 1, 0.3, 1)` or spring physics `stiffness: 380, damping: 25`.

## Core Interaction Patterns

1. **Tactile Button Feedback (`whileTap={{ scale: 0.98 }}`)**:
   ```tsx
   import { motion } from "motion/react";

   export function InteractiveButton({ children, onClick, className }) {
     return (
       <motion.button
         onClick={onClick}
         whileHover={{ scale: 1.02, y: -1 }}
         whileTap={{ scale: 0.97 }}
         transition={{ type: "spring", stiffness: 400, damping: 20 }}
         className={className}
       >
         {children}
       </motion.button>
     );
   }
   ```

2. **Skeleton Screen Loader**:
   ```tsx
   export function CardSkeleton() {
     return (
       <div className="animate-pulse bg-white/70 border border-hairline-mist rounded-3xl p-6">
         <div className="h-40 bg-stone-200/60 rounded-2xl mb-4" />
         <div className="h-5 bg-stone-200/80 rounded w-3/4 mb-2" />
         <div className="h-4 bg-stone-200/60 rounded w-1/2" />
       </div>
     );
   }
   ```

3. **Accessibility (`prefers-reduced-motion`)**:
   Always respect user motion preferences in CSS and Motion animation configs.
