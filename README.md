# HUMANITYZERO

![BETRAY](humanityzero/public/Into-my-flesh-we-shall-grow-as-one.gif)

An agentic chat application with voice interaction, semantic memory, and thinking capabilities.

## Features
### BETRAYER Chat Interface

A modern AI chat interface with SOTA models, tools, thinking, memory, web search and  advanced voice input capabilities.

## Features

### 🎤 **Advanced Voice Input**
- **Toggle Recording**: Click microphone to start/stop continuous voice recording
- **Real-time Transcription**: Speech converts to text and appears in input field for editing
- **Continuous Mode**: Stay in recording mode to build up messages phrase by phrase
- **Smart Appending**: Multiple spoken phrases automatically append with proper spacing
- **Edit Before Send**: Review, modify, and enhance transcribed text before submission

### 💬 **Chat Features**
- Real-time conversation with AI models
- Markdown rendering for rich text responses
- Message history and context preservation
- Loading states and smooth animations

### ⚙️ **Configuration**
- Multiple AI model selection (Sonnet 4, Opus 4)
- Thinking mode toggle for detailed reasoning
- Persistent settings storage

## How to Use Voice Input

1. **Start Recording**: Click the microphone button (turns red and pulsing)
2. **Speak Naturally**: Say your message in phrases or sentences
3. **Continue Speaking**: Each completed phrase appears in the text box
4. **Stop Recording**: Click the microphone again to finish
5. **Edit & Send**: Modify the transcribed text as needed, then send

## Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety and developer experience
- **React** - UI framework with hooks and modern patterns
- **shadcn-ui** - High-quality component library
- **Tailwind CSS** - Utility-first styling
- **Web Speech API** - Browser-native speech recognition

## Architecture

- **Modular Design**: Features organized in self-contained modules
- **TypeScript Strict**: Full type safety throughout
- **Direct Ref Communication**: Efficient state management for voice input
- **Error Handling**: Graceful fallbacks for unsupported browsers

### Core Functionality
- **Chat Interface**: Clean, responsive messaging with real-time responses
- **Voice Interaction**: Toggle microphone for speech-to-text and text-to-speech
- **AI Models**: Anthropic Claude Sonnet 4 and Opus 4 with thinking modes
- **Web Search**: Native internet access through Anthropic's canonical web search tools
- **Semantic Memory**: Automatic context storage and retrieval using vector embeddings
- **🔧 MCP Integration**: Model Context Protocol support for real-time tool execution
  - **Filesystem Access**: Read, write, search, and manage project files
  - **Extensible Tools**: Add any MCP server for new capabilities
  - **Real-time Execution**: Tools execute instantly during conversations
  - **Automatic Integration**: Tools appear in Claude's capabilities automatically

### User Interface
- **Dark Theme**: Black background, white text, #00b6dd accent
- **Settings Drawer**: Gear icon access to model selection, system prompts, credentials
- **Interactive Elements**: 1px white stroke borders, satisfying click animations
- **Responsive Design**: Clean layout optimized for chat interaction

### Model Configuration
- **Sonnet 4**: Default model, 64k tokens, temperature 0/1 (thinking mode)
- **Opus 4**: Alternative model, 32k tokens, temperature 0/1 (thinking mode)
- **Web Search**: All models equipped with real-time internet search capabilities
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

### Web Search Integration
- **Automatic Search**: Models decide when to search based on context
- **Real-time Results**: Up-to-date information with source citations
- **Location Aware**: Search results localized to Chicago timezone
- **Rate Limited**: Maximum 5 searches per conversation for optimal performance

### 🔧 MCP (Model Context Protocol) Integration

> **What is MCP?** MCP extends Claude's capabilities with real-time tools. Instead of just text, Claude can read files, execute commands, access databases, and more.

#### Quick Setup (Filesystem Tools)
1. **Open Settings** → Click gear icon → MCP tab
2. **Load Preset** → Click "Load Preset"
3. **Register** → Click "Register Server"
4. **Start Proxy** → Click "Start Proxy"
5. **Test** → Ask Claude: "Read the package.json file"

#### What Claude Can Do With MCP
- **File Operations**: "Read the README", "Create a new component", "Search for TypeScript files"
- **Project Analysis**: "Show me the project structure", "Find all TODO comments"
- **Code Management**: "Move this file", "Create a backup", "List all dependencies"
- **Real-time Execution**: Tools run immediately, results fed back to Claude

#### Available Tools (When Configured)
- `read_file` - Read any project file
- `write_file` - Create or modify files
- `list_directory` - Show directory contents
- `search_files` - Find files by pattern
- `create_directory` - Make new folders
- `move_file` - Rename/move files
- `get_file_info` - File metadata

#### Security
- **Sandboxed**: MCP servers only access directories you specify
- **Explicit Permission**: Each server requires manual registration
- **Transparent**: All tool usage visible in conversation

#### Adding More Servers
See **[MCP Servers Documentation](humanityzero/mcp-servers/README.md)** for:
- Complete setup guide
- Adding new MCP servers (GitHub, SQLite, web search, etc.)
- Troubleshooting common issues
- Step-by-step processes

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
