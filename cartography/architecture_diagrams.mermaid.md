```mermaid
graph TD
    %% Current Architecture
    subgraph "Current State"
        %% Core Components
        A[App.tsx] -->|contains| B["SettingsDrawer"]
        A -->|contains| C["ChatInterface"]
        
        %% Direct Dependencies
        C -->|uses| D["useAnthropicChat"]
        D -->|direct access| E["Browser Speech API"]
        D -->|simulated| F["Anthropic API"]
        
        %% Settings Flow
        B -->|updates| G["Local State"]
        G -->|affects| D
        
        %% Message Flow
        C -->|renders| H["ChatMessage"]
        H -->|displays| I["MessageContent"]
        
        %% Critical Issues
        style F fill:#ff6b6b,stroke:#ff0000
        style E fill:#ff6b6b,stroke:#ff0000
        style G fill:#ffd93d,stroke:#ffa500
    end

```

```mermaid
graph TD
    %% Target Architecture
    subgraph "Target State"
        %% Core Layers
        A1[App.tsx] -->|orchestrates| B1["ComponentLayer"]
        B1 -->|uses| C1["ServiceLayer"]
        C1 -->|uses| D1["APILayer"]
        
        %% Component Layer
        subgraph ComponentLayer
            E1["SettingsDrawer"]
            F1["ChatContainer"]
            G1["MessageList"]
        end
        
        %% Service Layer
        subgraph ServiceLayer
            H1["ModelService"]
            I1["SpeechService"]
            J1["VectorService"]
            K1["StateService"]
        end
        
        %% API Layer
        subgraph APILayer
            L1["AnthropicAPI"]
            M1["BrowserAPI"]
            N1["SupabaseAPI"]
        end
        
        %% State Management
        K1 -->|manages| O1["Zustand Store"]
        O1 -.->|updates| B1
        
        %% Service Connections
        H1 -->|uses| L1
        I1 -->|abstracts| M1
        J1 -->|uses| N1
        
        %% Component Dependencies
        F1 -->|uses| H1
        F1 -->|uses| I1
        G1 -->|uses| J1
        E1 -->|uses| K1
    end

```

```mermaid
graph TD
    %% Provider Architecture
    subgraph "Model Integration"
        %% Core Services
        A2["ModelService"] -->|manages| B2["ProviderFactory"]
        B2 -->|creates| C2["AnthropicProvider"]
        
        %% Provider Implementation
        C2 -->|implements| D2["ModelProvider<br/>Interface"]
        C2 -->|uses| E2["Anthropic SDK"]
        
        %% Configuration
        F2["ConfigService"] -->|configures| B2
        F2 -->|validates| G2["API Keys"]
        
        %% Thinking Mode
        H2["ThinkingMode"] -->|extends| C2
        H2 -->|configures| I2["TokenBudget"]
        
        %% Error Handling
        J2["ErrorBoundary"] -->|catches| K2["APIErrors"]
        K2 -->|handles| L2["Recovery"]
        
        %% State Flow
        M2["StateService"] -->|manages| N2["ModelState"]
        N2 -->|affects| C2
    end

```

```mermaid
graph TD
    %% Speech Integration
    subgraph "Speech Services"
        %% Core Services
        A3["SpeechService"] -->|manages| B3["SpeechFactory"]
        
        %% Recognition
        B3 -->|creates| C3["Recognition<br/>Service"]
        C3 -->|implements| D3["Recognition<br/>Interface"]
        C3 -->|uses| E3["Browser<br/>Recognition API"]
        
        %% Synthesis
        B3 -->|creates| F3["Synthesis<br/>Service"]
        F3 -->|implements| G3["Synthesis<br/>Interface"]
        F3 -->|uses| H3["Browser<br/>Synthesis API"]
        
        %% Feature Detection
        I3["FeatureDetection"] -->|checks| E3
        I3 -->|checks| H3
        
        %% Fallbacks
        J3["FallbackService"] -->|provides| K3["Alternative<br/>Implementation"]
        
        %% Error Handling
        L3["ErrorBoundary"] -->|catches| M3["BrowserAPI<br/>Errors"]
        M3 -->|triggers| J3
    end

```

```mermaid
graph TD
    %% Migration Path
    subgraph "Implementation Sequence"
        %% Phase 1
        A4["Current State"] -->|P0| B4["API Integration"]
        B4 -->|P0| C4["Speech Services"]
        C4 -->|P0| D4["Error Handling"]
        
        %% Phase 2
        D4 -->|P1| E4["State Management"]
        E4 -->|P1| F4["Service Layer"]
        
        %% Phase 3
        F4 -->|P1| G4["Component Isolation"]
        G4 -->|P2| H4["Feature Implementation"]
        
        %% Phase 4
        H4 -->|P2| I4["Optimization"]
        I4 -->|P2| J4["Target State"]
        
        %% Risk Levels
        style B4 fill:#ff6b6b,stroke:#ff0000
        style C4 fill:#ff6b6b,stroke:#ff0000
        style E4 fill:#ffd93d,stroke:#ffa500
        style F4 fill:#ffd93d,stroke:#ffa500
        style I4 fill:#87ff87,stroke:#00ff00
    end