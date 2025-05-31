# Provider Abstraction Plan: Anthropic Integration

## Current Issues

### Architecture Violations
1. Direct API coupling in hook layer
2. Missing provider abstraction
3. Hardcoded model configuration
4. Unsafe type assertions
5. Inconsistent error handling

### Implementation Gaps
1. Missing real API integration
2. No response type safety
3. Absent error boundaries
4. Missing state persistence
5. Incomplete speech integration

## Provider Interface

### Core Types
```typescript
interface ModelProvider {
  sendMessage(message: string): Promise<ModelResponse>;
  getConfig(): ModelConfig;
  updateConfig(config: Partial<ModelConfig>): void;
  clearContext(): void;
}

interface ModelConfig {
  model: string;
  thinking: boolean;
  thinkingBudget?: number;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

interface ModelResponse {
  id: string;
  content: string;
  role: 'assistant';
  timestamp: Date;
  usage?: TokenUsage;
}
```

### Implementation Strategy

#### 1. Provider Factory
```typescript
Location: src/services/model/providerFactory.ts
Purpose: Create provider instances
Pattern: Factory + Strategy
Dependencies: Provider implementations
```

#### 2. Base Provider
```typescript
Location: src/services/model/baseProvider.ts
Purpose: Common provider functionality
Pattern: Abstract class
Dependencies: Core types
```

#### 3. Anthropic Provider
```typescript
Location: src/services/model/providers/anthropic.ts
Purpose: Anthropic-specific implementation
Pattern: Concrete provider
Dependencies: Anthropic SDK
```

## Service Layer

### 1. Message Service
```typescript
Location: src/services/message/messageService.ts
Purpose: Message handling and formatting
Pattern: Service class
Dependencies: Provider interface
```

### 2. Config Service
```typescript
Location: src/services/config/configService.ts
Purpose: Model configuration management
Pattern: Service class
Dependencies: Local storage
```

### 3. Speech Service
```typescript
Location: src/services/speech/speechService.ts
Purpose: Voice interaction handling
Pattern: Service class
Dependencies: Web Speech API
```

## State Management

### 1. Model Store
```typescript
Location: src/stores/modelStore.ts
Purpose: Provider state management
Pattern: Zustand store
Dependencies: Provider interface
```

### 2. Message Store
```typescript
Location: src/stores/messageStore.ts
Purpose: Chat history management
Pattern: Zustand store
Dependencies: Message types
```

### 3. Config Store
```typescript
Location: src/stores/configStore.ts
Purpose: Configuration persistence
Pattern: Zustand store
Dependencies: Config service
```

## Error Handling

### 1. Error Types
```typescript
Location: src/types/errors.ts
Purpose: Custom error definitions
Pattern: Error classes
Dependencies: None
```

### 2. Error Boundaries
```typescript
Location: src/components/ErrorBoundary.tsx
Purpose: React error catching
Pattern: Error boundary
Dependencies: Error types
```

### 3. Error Service
```typescript
Location: src/services/error/errorService.ts
Purpose: Error tracking and reporting
Pattern: Service class
Dependencies: Error tracking
```

## Migration Strategy

### Phase 1: Core Infrastructure
1. Create provider interface
2. Implement base provider
3. Add error handling
4. Setup state management

### Phase 2: Anthropic Integration
1. Implement Anthropic provider
2. Add message handling
3. Setup configuration
4. Add error tracking

### Phase 3: Feature Integration
1. Add speech service
2. Implement persistence
3. Add error boundaries
4. Setup monitoring

### Phase 4: Hook Migration
1. Update useAnthropicChat
2. Add provider selection
3. Implement error handling
4. Add state management

## Success Metrics

### Code Quality
- 100% TypeScript coverage
- No any types
- Full error handling
- Complete test coverage

### Performance
- < 100ms provider initialization
- < 200ms message processing
- < 50ms state updates
- Zero uncaught errors

### Maintainability
- Clear provider boundaries
- Centralized configuration
- Consistent error handling
- Proper type safety

## Implementation Notes

### Provider Setup
```typescript
// Example provider initialization
const provider = ProviderFactory.create({
  type: 'anthropic',
  config: {
    model: 'claude-sonnet-4',
    thinking: false,
    systemPrompt: defaultPrompt
  }
});
```

### Error Handling
```typescript
// Example error boundary usage
<ModelErrorBoundary
  fallback={ErrorDisplay}
  onError={errorService.track}
>
  <ModelProvider />
</ModelErrorBoundary>
```

### State Management
```typescript
// Example store integration
const useModelStore = create<ModelState>((set) => ({
  provider: null,
  setProvider: (provider) => set({ provider }),
  config: defaultConfig,
  updateConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  }))
}));
```

## Breaking Changes

### High Risk
1. Provider interface changes
2. Message format updates
3. Configuration structure
4. Error handling patterns

### Medium Risk
1. State management
2. Speech integration
3. Storage format
4. Type definitions

### Low Risk
1. UI components
2. Error displays
3. Loading states
4. Helper functions

## Rollback Strategy

### Feature Flags
1. Provider selection
2. Speech integration
3. Error tracking
4. State persistence

### Backup Points
1. Pre-provider extraction
2. Pre-state migration
3. Pre-speech integration
4. Pre-error handling

### Recovery Steps
1. Revert provider changes
2. Restore state handling
3. Disable features
4. Enable fallbacks