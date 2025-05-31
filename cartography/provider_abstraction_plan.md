# Provider Abstraction Plan

## Current Architecture Issues

### Direct Anthropic Coupling
- [`useAnthropicChat.ts`](humanityzero/src/hooks/useAnthropicChat.ts) directly implements Anthropic API
- No abstraction layer for different AI providers
- Tight coupling between UI and specific provider implementation

### Speech Service Integration
- Direct browser API usage in speech services
- No provider-agnostic interface
- Duplicate error handling logic

## Proposed Provider Interface

### AI Provider Interface
```typescript
interface AIProvider {
  chat(message: string, options?: ChatOptions): Promise<ChatResponse>;
  stream(message: string, options?: StreamOptions): AsyncIterator<StreamChunk>;
  abort(): void;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

interface ChatResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

### Speech Provider Interface
```typescript
interface SpeechProvider {
  recognize(options?: RecognitionOptions): Promise<string>;
  speak(text: string, options?: SpeechOptions): Promise<void>;
  abort(): void;
}

interface RecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface SpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
}
```

## Implementation Strategy

### Phase 1: Interface Creation
1. Create provider interfaces
2. Define common types
3. Document provider requirements

### Phase 2: Adapter Implementation
1. Anthropic Adapter
```typescript
class AnthropicAdapter implements AIProvider {
  // Wrap existing Anthropic implementation
}
```

2. Browser Speech Adapter
```typescript
class BrowserSpeechAdapter implements SpeechProvider {
  // Wrap existing browser APIs
}
```

### Phase 3: Provider Factory
```typescript
class AIProviderFactory {
  static create(type: 'anthropic' | 'other'): AIProvider;
}

class SpeechProviderFactory {
  static create(type: 'browser' | 'other'): SpeechProvider;
}
```

### Phase 4: Hook Refactoring
```typescript
function useAIChat(provider: AIProvider) {
  // Provider-agnostic chat implementation
}

function useSpeech(provider: SpeechProvider) {
  // Provider-agnostic speech implementation
}
```

## Migration Path

### Step 1: Interface Layer (XS)
- Create interfaces directory
- Define provider contracts
- Add type documentation

### Step 2: Adapter Layer (S)
- Create adapters directory
- Implement Anthropic adapter
- Implement browser speech adapter
- Add unit tests

### Step 3: Factory Layer (XS)
- Create factories
- Add provider configuration
- Implement provider selection

### Step 4: Hook Migration (M)
- Update useAnthropicChat
- Update speech hooks
- Add integration tests

### Step 5: Component Updates (M)
- Refactor ChatInput
- Update MicrophoneButton
- Modify speech service usage

## Success Metrics

### Code Quality
- Interface coverage: 100%
- Adapter test coverage: > 90%
- No direct provider imports in components
- Zero TypeScript any types

### Maintainability
- Single responsibility per file
- Clear dependency boundaries
- Documented provider interfaces
- Easy provider swapping

### Performance
- No regression in response times
- Minimal adapter overhead
- Efficient resource cleanup

## Risk Assessment

### High Risk
- Breaking changes to chat functionality
- Speech recognition interruptions
- Stream handling modifications

### Mitigation
1. Feature flags for new implementation
2. Parallel provider support
3. Comprehensive integration tests
4. Gradual component migration
5. Rollback procedures documented

## Future Expansion

### Additional Providers
- OpenAI integration ready
- Azure Speech Services support
- Local model capabilities

### Enhanced Features
- Provider fallback chains
- Automatic provider selection
- Performance monitoring
- Usage analytics