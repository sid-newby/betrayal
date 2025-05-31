# HUMANITYZERO

![BETRAY](humanityzero/public/Into-my-flesh-we-shall-grow-as-one.gif)

An agentic chat application with voice interaction, semantic memory, and thinking capabilities.

## Features

### Core Functionality
- **Chat Interface**: Clean, responsive messaging with real-time responses
- **Voice Interaction**: Toggle microphone for speech-to-text and text-to-speech
- **AI Models**: Anthropic Claude Sonnet 4 and Opus 4 with thinking modes
- **Semantic Memory**: Automatic context storage and retrieval using vector embeddings
- **MCP Integration**: Model Context Protocol support for extensible tool connectivity

### User Interface
- **Dark Theme**: Black background, white text, #00b6dd accent
- **Settings Drawer**: Gear icon access to model selection, system prompts, credentials
- **Interactive Elements**: 1px white stroke borders, satisfying click animations
- **Responsive Design**: Clean layout optimized for chat interaction

### Model Configuration
- **Sonnet 4**: Default model, 64k tokens, temperature 0/1 (thinking mode)
- **Opus 4**: Alternative model, 32k tokens, temperature 0/1 (thinking mode)
- **Thinking Mode**: Real-time thinking display with configurable token budgets
- **System Prompts**: Customizable system prompts for all models

### Advanced Features
- **Semantic Context**: Automatic ⛧⃝ context injection from conversation history
- **Thinking Display**: Blue italicized real-time thinking bubbles
- **Vector Storage**: Supabase-powered semantic search and retrieval
- **MCP Proxy**: Streaming/stdio transport support for MCP servers

## Quick Start

### Prerequisites
- Node.js 18+
- Bun package manager
- Supabase account
- Anthropic API key

### Installation
```bash
cd humanityzero
bun install
```

### Environment Setup
Create `.env` file in project root:
```
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_key # for embeddings
```

### Development
```bash
bun dev
```

## Architecture

### Technical Stack
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety throughout
- **React** - UI framework
- **Radix UI** - Accessible primitives
- **shadcn/ui** - Component library
- **TailwindCSS** - Utility-first styling
- **Supabase** - Backend and vector storage
- **Anthropic SDK** - AI model integration

### Documentation
For technical details, architecture decisions, and development guidelines, see:

- **[Latest Cartography](cartography/latest.md)** - Current system overview
- **[Architecture Analysis](cartography/)** - Complete technical documentation
- **[Development Rules](.clinerules/rules/clinerules.md)** - Code standards and principles

## Usage

### Basic Chat
1. Type messages in the input field
2. Use the microphone button for voice input
3. View responses with automatic semantic context

### Settings Configuration
1. Click the gear icon (upper right)
2. Select model (Sonnet 4 / Opus 4)
3. Enable thinking mode with token budget
4. Configure system prompt
5. Manage authentication credentials

### Voice Interaction
- **Toggle Microphone**: Click to start/stop voice recognition
- **Automatic Speech**: Responses are spoken automatically
- **Browser Gesture**: Microphone serves as speaker control gesture

### Semantic Memory
- **Automatic**: Context automatically stored and retrieved
- **Visual Indicators**: ⛧⃝ symbols show injected context
- **Clickable Context**: Click symbols to view full context details

## Development

### Module Structure
The application follows strict modular architecture:
- `src/app.tsx` - Crossroads only
- `src/modules/` - All features organized by domain
- Clear module boundaries and interfaces

### Code Standards
- TypeScript everywhere, no JavaScript files
- Modular or die - no god files
- Documentation is not optional
- Clean separation of concerns

See [.clinerules](.clinerules/rules/clinerules.md) for complete development guidelines.

## Support

For technical issues, architecture questions, or development guidance, consult the cartography documentation in the `cartography/` directory.

---

**Stay canonical. Modular or die.**
