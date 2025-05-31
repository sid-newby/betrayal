# Code Smell Report

## High Severity (8-10)

### God Components
1. **ChatInterface**
- **Severity**: 9/10
- **Location**: Multiple components tightly coupled
- **Issues**:
  - Manages too many responsibilities
  - Direct provider dependencies
  - State management scattered
- **Fix Pattern**: Extract into smaller, focused components

2. **App.tsx**
- **Severity**: 8/10
- **Location**: [`App.tsx`](humanityzero/src/App.tsx)
- **Issues**:
  - Multiple initialization responsibilities
  - Theme and routing mixed
  - Layout concerns not separated
- **Fix Pattern**: Extract providers and layout components

### Inappropriate Intimacy
1. **ChatInput ↔ useAnthropicChat**
- **Severity**: 9/10
- **Location**: [`ChatInput.tsx`](humanityzero/src/components/ChatInput.tsx)
- **Issues**:
  - Direct knowledge of Anthropic implementation
  - Tightly coupled to provider details
- **Fix Pattern**: Introduce provider interface

2. **Speech Services Coupling**
- **Severity**: 8/10
- **Location**: [`speech-recognition.ts`](humanityzero/src/services/speech-recognition.ts), [`speech-synthesis.ts`](humanityzero/src/services/speech-synthesis.ts)
- **Issues**:
  - Direct browser API coupling
  - Shared implementation details
- **Fix Pattern**: Create speech provider interface

## Medium Severity (5-7)

### Feature Envy
1. **MicrophoneButton**
- **Severity**: 7/10
- **Location**: [`MicrophoneButton.tsx`](humanityzero/src/components/MicrophoneButton.tsx)
- **Issues**:
  - Too much knowledge of speech services
  - Handles speech state management
- **Fix Pattern**: Move speech logic to dedicated hook

2. **SettingsDrawer**
- **Severity**: 6/10
- **Location**: [`SettingsDrawer.tsx`](humanityzero/src/components/SettingsDrawer.tsx)
- **Issues**:
  - Manages multiple settings domains
  - Direct toast implementation knowledge
- **Fix Pattern**: Split into domain-specific settings

### Divergent Change
1. **ChatMessage**
- **Severity**: 6/10
- **Location**: [`ChatMessage.tsx`](humanityzero/src/components/ChatMessage.tsx)
- **Issues**:
  - Changes for both styling and content
  - Mixed rendering responsibilities
- **Fix Pattern**: Separate content and presentation

2. **useAnthropicChat**
- **Severity**: 7/10
- **Location**: [`useAnthropicChat.ts`](humanityzero/src/hooks/useAnthropicChat.ts)
- **Issues**:
  - Changes for API updates and UI state
  - Mixed error handling
- **Fix Pattern**: Split into API and UI layers

## Low Severity (1-4)

### Shotgun Surgery
1. **Theme Changes**
- **Severity**: 4/10
- **Location**: Multiple style files
- **Issues**:
  - Theme changes require multiple file updates
  - No centralized theme management
- **Fix Pattern**: Create theme provider

2. **Toast Notifications**
- **Severity**: 3/10
- **Location**: Multiple components
- **Issues**:
  - Scattered toast implementations
  - Inconsistent error handling
- **Fix Pattern**: Centralize toast management

### Data Clumps
1. **Speech Options**
- **Severity**: 3/10
- **Location**: Speech service files
- **Issues**:
  - Repeated configuration objects
  - Duplicated option types
- **Fix Pattern**: Create shared configuration types

## Refactoring Priorities

### P0 (Immediate)
1. Extract provider interfaces
2. Break ChatInterface into smaller components
3. Implement proper state management

### P1 (High Priority)
1. Separate App.tsx concerns
2. Create speech service abstraction
3. Centralize error handling

### P2 (Medium Priority)
1. Split settings by domain
2. Extract theme management
3. Standardize toast notifications

### P3 (Low Priority)
1. Consolidate configuration types
2. Improve component composition
3. Enhance error boundaries

## Impact Analysis

### High Impact Areas
- Chat functionality
- Speech recognition
- Provider integration
- User settings

### Low Impact Areas
- Theme configuration
- Toast notifications
- Error boundaries
- Type definitions

## Success Metrics

### Code Quality
- Max component size: 200 lines
- Max file responsibilities: 3
- Test coverage: > 80%
- TypeScript strictness: 100%

### Maintainability
- Clear component boundaries
- Standardized error handling
- Centralized state management
- Provider-agnostic interfaces

### Performance
- Reduced bundle size
- Faster component updates
- Efficient error recovery
- Optimized re-renders