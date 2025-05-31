# MCP Servers Configuration

This directory contains configuration and documentation for Model Context Protocol (MCP) servers used by HUMANITYZERO.

> **🎯 CRITICAL**: MCP servers extend the AI agent's capabilities by providing real-time tools. Once configured, Claude can directly use these tools during conversations.

## 🚀 Quick Start (Filesystem Server)

**For the impatient - complete setup in 5 steps:**

1. Open Settings → MCP tab
2. Click "Load Preset"
3. Click "Register Server"
4. Click "Start Proxy"
5. Ask Claude: "Read the package.json file"

## 📚 Complete Guide

### Understanding the Architecture

```
User Request → Claude → MCP Tool Call → MCP Proxy → MCP Server → File System
                ↑                                                      ↓
            Tool Result ← MCP Proxy ← Tool Response ← MCP Server ← File Operation
```

### The Process (4 Main Steps)

1. **Register MCP Server** - Tell the system about a new tool provider
2. **Start MCP Proxy** - Launch the bridge between Claude and tools
3. **Verify Integration** - Ensure tools appear in Claude's capabilities
4. **Test with Claude** - Ask Claude to use the tools

## Available Servers

### 1. Filesystem MCP Server

**Purpose**: Provides file system access capabilities to AI agents, including reading, writing, and managing files and directories.

**Package**: `@modelcontextprotocol/server-filesystem`

**Security**: The server is sandboxed to only access directories you explicitly specify as arguments.

#### Tools Provided:
- `read_file` - Read complete contents of a file
- `read_multiple_files` - Read multiple files simultaneously  
- `write_file` - Create new file or overwrite existing
- `edit_file` - Make selective edits with pattern matching
- `create_directory` - Create new directory
- `list_directory` - List directory contents
- `move_file` - Move or rename files/directories
- `search_files` - Recursively search for files
- `get_file_info` - Get file metadata
- `list_allowed_directories` - List accessible directories

#### Complete Setup Process:

**Step 1: Register the Server**
1. Open HUMANITYZERO
2. Click Settings (gear icon, top-right)
3. Click "MCP" tab
4. Click "Load Preset" (auto-fills form)
5. Click "Register Server"
6. ✅ Server should appear in "Registered Servers" list as "stopped"

**Step 2: Start the MCP Proxy**
1. In the "Proxy Configuration" section
2. Leave port as 8081 (default)
3. Leave server type as "both" (default)
4. Click "Start Proxy"
5. ✅ Should see "Running Proxy Instances" section appear
6. ✅ Filesystem server status should change to "running"

**Step 3: Verify Tool Integration**
1. Look for "Available Tools" section at bottom
2. ✅ Should see filesystem tools listed (read_file, write_file, etc.)
3. ✅ Each tool should show "From: filesystem"

**Step 4: Test with Claude**
Try these commands:
- "Read the package.json file and tell me about the dependencies"
- "List all files in the src directory"
- "Create a test file called hello.txt with the content 'Hello World'"
- "Search for all TypeScript files in the project"

## 🔧 Configuration Methods

### Method 1: Configuration File (Recommended)

The preset uses a **configuration file approach** that's much cleaner for managing multiple directories:

**Preset Configuration:**
- **Server ID**: `filesystem`
- **Server Name**: `File System Access`
- **Command**: `node`
- **Arguments**: `mcp-servers/start-filesystem.js`
- **Environment Variables**: `{}` (leave empty)

**Directory Management:**
1. Edit `humanityzero/mcp-servers/filesystem-config.json`
2. Add/remove directories in the `allowedDirectories` array
3. Restart the MCP proxy to apply changes

**Example Configuration:**
```json
{
  "filesystem": {
    "name": "File System Access",
    "allowedDirectories": [
      "/Users/sidnewby/Prog/automaker",
      "/Users/sidnewby/Documents/Projects",
      "/Users/sidnewby/Desktop"
    ],
    "description": "Provides read/write access to specified directories"
  }
}
```

### Method 2: Direct Command (Simple)

For quick setup or single directory access:
- **Server ID**: `filesystem-direct`
- **Server Name**: `File System Direct`
- **Command**: `bunx`
- **Arguments**: `@modelcontextprotocol/server-filesystem /Users/sidnewby/Prog/automaker`
- **Environment Variables**: `{}` (leave empty)

**Security Notes:**
- **Config Method**: Edit `filesystem-config.json` to add/remove directories
- **Direct Method**: Add more directories as arguments: `@modelcontextprotocol/server-filesystem /path1 /path2 /path3`
- Always use absolute paths
- Consider read-only access for sensitive directories
- Server validates all paths are within allowed directories

#### Example Usage:
Once configured, you can ask the AI things like:
- "Read the package.json file and tell me about the dependencies"
- "Create a new component file in the components directory"
- "Search for all TypeScript files in the project"
- "Show me the contents of the README file"

## 🔧 Adding New MCP Servers (Step-by-Step)

### Research Phase
1. **Find the server**: [Model Context Protocol](https://modelcontextprotocol.io/) or [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
2. **Check the README**: Look for command, arguments, and environment variables
3. **Note the tools**: What capabilities does it provide?

### Documentation Phase
1. **Create docs**: Add a new section to this README
2. **Include examples**: Show what Claude can do with the tools
3. **Document setup**: Command, args, env vars, and any special requirements

### Implementation Phase
1. **Test manually first**: Run the MCP server command directly to ensure it works
2. **Register in UI**: Use the MCP Settings tab to register the server
3. **Start proxy**: Use the same proxy instance (port 8081)
4. **Verify tools**: Check "Available Tools" section shows new capabilities
5. **Test with Claude**: Ask Claude to use the new tools

### Integration Phase (Optional)
1. **Create preset**: Add a "Load [ServerName] Preset" button if commonly used
2. **Update docs**: Add to this README with examples
3. **Test edge cases**: Error handling, permission issues, etc.

### Template for New Servers

```markdown
### N. [Server Name] MCP Server

**Purpose**: [What it does]

**Package**: `[npm package name]`

**Security**: [Any security considerations]

#### Tools Provided:
- `tool_name` - Description

#### Setup Instructions:
- **Server ID**: `[unique-id]`
- **Server Name**: `[Display Name]`
- **Command**: `[command]`
- **Arguments**: `[args]`
- **Environment Variables**: `[env vars as JSON]`

#### Example Usage:
- "[Natural language example]"
```

## Common MCP Servers

- **@modelcontextprotocol/server-filesystem** - File system operations
- **@modelcontextprotocol/server-fetch** - HTTP requests and web scraping
- **@modelcontextprotocol/server-sqlite** - SQLite database operations
- **@modelcontextprotocol/server-brave-search** - Web search via Brave API
- **@modelcontextprotocol/server-github** - GitHub repository operations

## 🔧 Troubleshooting

### 🚨 Common Issues & Solutions

#### "Server Won't Start"
**Symptoms**: Server status stays "stopped" after registering

**Solutions**:
1. ✅ Check command syntax: `bunx @package-name args`
2. ✅ Test manually: `cd humanityzero && bunx @modelcontextprotocol/server-filesystem /Users/sidnewby/Prog/automaker`
3. ✅ Verify package exists: `bunx @modelcontextprotocol/server-filesystem --help`
4. ✅ Check paths are absolute and exist
5. ✅ Look for error messages in browser console (F12)

#### "Proxy Won't Start"
**Symptoms**: "Start Proxy" button fails or no "Running Proxy Instances" appear

**Solutions**:
1. ✅ Check port 8081 isn't in use: `lsof -i :8081`
2. ✅ Try different port (8082, 8083)
3. ✅ Restart the web app
4. ✅ Check browser console for errors

#### "No Tools Appear"
**Symptoms**: Proxy running, server running, but "Available Tools" empty

**Solutions**:
1. ✅ Wait 5-10 seconds (tools update every 5 seconds)
2. ✅ Refresh the page
3. ✅ Stop and restart the proxy
4. ✅ Check that server status shows "running" not just "stopped"

#### "Claude Can't Use Tools"
**Symptoms**: Tools appear but Claude says "I don't have access to that tool"

**Solutions**:
1. ✅ Start a new conversation (tools added to system prompt)
2. ✅ Check that tools show "From: [server-id]" in Available Tools
3. ✅ Try asking more directly: "Use the read_file tool to read package.json"
4. ✅ Verify you have a valid Anthropic API key

#### "Permission Errors"
**Symptoms**: Tools run but return permission denied errors

**Solutions**:
1. ✅ Check directory permissions: `ls -la /path/to/directory`
2. ✅ Use absolute paths, not relative
3. ✅ Ensure the user can read/write the directories
4. ✅ For filesystem: check that paths in arguments are accessible

### 🔍 Debugging Steps

1. **Check the flow**:
   - Settings → MCP tab ✅
   - Server registered ✅
   - Proxy started ✅
   - Server status "running" ✅
   - Tools appear in "Available Tools" ✅
   - Claude can use tools ✅

2. **Test manually**:
   ```bash
   cd humanityzero
   bunx @modelcontextprotocol/server-filesystem /Users/sidnewby/Prog/automaker
   # Should start without errors
   ```

3. **Check browser console** (F12 → Console):
   - Look for red error messages
   - MCP-related errors will mention "mcp" or "proxy"

4. **Verify dependencies**:
   ```bash
   cd humanityzero
   bun install
   # Ensure mcp-proxy is installed
   ```

### 💡 Pro Tips

- **Always test the MCP server command manually first**
- **Use absolute paths for directories**
- **Start with one server, add more later**
- **Check "Available Tools" section to confirm integration**
- **Ask Claude directly: "What tools do you have access to?"**
- **When in doubt, restart the proxy**
