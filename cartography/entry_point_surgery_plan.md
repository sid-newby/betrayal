# Entry Point Surgery Plan: App.tsx

## Current Analysis

### Metrics
- Total Lines: 27
- Active Code Lines: 17
- Complexity Score: 2 (low)
- Change Frequency: Likely low (routing changes only)

### Current Responsibilities
1. Query client initialization
2. Toast notifications setup (dual providers)
3. Tooltip provider configuration
4. Router initialization
5. Route definitions

### Code Smells
1. Duplicate Toast Providers
   - [`Toaster`](humanityzero/src/components/ui/toaster.tsx) and [`Sonner`](humanityzero/src/components/ui/sonner.tsx) both present
   - Potential user confusion and state conflicts

2. Provider Nesting
   - Multiple providers without clear organization
   - No explicit provider composition strategy

3. Route Management
   - Inline route definitions
   - TODO comment for route placement guidance

## Extraction Candidates

### 1. Provider Configuration Hub
```typescript
Target: src/providers/AppProviders.tsx
Pattern: Composite Provider Pattern
Complexity: Low (2/5)
Time: 1 hour
Risk: 20%
Dependencies:
- QueryClientProvider
- TooltipProvider
- Toast providers
Rollback: Git revert, single file
```

### 2. Route Configuration Module
```typescript
Target: src/routes/AppRoutes.tsx
Pattern: Route Registry Pattern
Complexity: Low (1/5)
Time: 1 hour
Risk: 15%
Dependencies:
- BrowserRouter
- Route components
Rollback: Git revert, single file
```

### 3. Toast Management Consolidation
```typescript
Target: src/providers/ToastProvider.tsx
Pattern: Adapter Pattern
Complexity: Medium (3/5)
Time: 2 hours
Risk: 40%
Dependencies:
- Existing toast implementations
- Toast state management
Rollback: Feature flag toggle
```

## Post-Surgery Architecture

### Target Metrics
- Lines: < 20
- Complexity: 1
- Responsibilities: 2 (app initialization, provider/router composition)

### Proposed Structure
```typescript
// App.tsx
import { AppProviders } from "@/providers/AppProviders";
import { AppRoutes } from "@/routes/AppRoutes";

const App = () => (
  <AppProviders>
    <AppRoutes />
  </AppProviders>
);
```

## Migration Strategy

### Phase 1: Provider Extraction
1. Create AppProviders component
2. Move all providers
3. Test provider state preservation
4. Validate toast functionality

### Phase 2: Route Extraction
1. Create AppRoutes component
2. Move route definitions
3. Add route type safety
4. Validate navigation

### Phase 3: Toast Consolidation
1. Create unified ToastProvider
2. Implement adapter layer
3. Add feature flag
4. Migrate consumers
5. Remove duplicate provider

## Breaking Change Analysis

### Provider Extraction
- Risk: Low
- Scope: Internal refactor
- Testing: Provider order verification
- Fallback: Git revert

### Route Extraction
- Risk: Low
- Scope: Internal refactor
- Testing: Route matching verification
- Fallback: Git revert

### Toast Consolidation
- Risk: Medium
- Scope: Toast API consumers
- Testing: Toast behavior parity
- Fallback: Feature flag

## Success Metrics

### Code Quality
- Single responsibility per file
- Clear provider composition
- Type-safe routing
- Unified toast interface

### Performance
- No additional re-renders
- Maintained bundle size
- Preserved initialization speed

### Maintainability
- Reduced file coupling
- Improved provider organization
- Simplified route management
- Eliminated duplicate toast logic

## Implementation Notes

1. Provider Order
   - QueryClient must wrap application
   - Toast provider should be root-adjacent
   - Router must wrap routes

2. Type Safety
   - Add route type definitions
   - Enforce provider prop types
   - Document provider requirements

3. Error Boundaries
   - Add boundaries per provider
   - Implement fallback UI
   - Log provider failures

4. Testing Strategy
   - Unit tests per provider
   - Route matching tests
   - Toast integration tests
   - Provider order tests