# 🚀 Complete MCP Setup for Cursor with Claude Code

## Prerequisites
- Cursor IDE installed
- Node.js 18+ installed
- Claude Code extension enabled in Cursor

## Step 1: Install MCP Server Package

```bash
# Install the MCP server globally
npm install -g @modelcontextprotocol/server-everything

# Or install locally in your project
npm install @modelcontextprotocol/server-everything
```

## Step 2: Configure MCP Settings in Cursor

### Open Cursor Settings
1. Open Cursor
2. Go to `Settings` (Ctrl/Cmd + ,)
3. Search for "MCP" or "Model Context Protocol"
4. Enable MCP support

### Alternative: Manual Configuration File
Create or edit your Cursor configuration file:

**Location**: 
- Windows: `%APPDATA%\Cursor\User\settings.json`
- macOS: `~/Library/Application Support/Cursor/User/settings.json`
- Linux: `~/.config/Cursor/User/settings.json`

## Step 3: MCP Configuration

Add this configuration to your `settings.json`:

```json
{
  "claude.mcp": {
    "servers": {
      "playwright": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-playwright"],
        "env": {},
        "capabilities": {
          "tools": true,
          "resources": true
        }
      },
      "shadcn-ui": {
        "command": "npx",
        "args": ["shadcn-ui-mcp"],
        "env": {},
        "capabilities": {
          "tools": true,
          "prompts": true
        }
      },
      "exa": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-exa"],
        "env": {
          "EXA_API_KEY": "your-exa-api-key-here"
        },
        "capabilities": {
          "tools": true
        }
      },
      "firecrawl": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-firecrawl"],
        "env": {
          "FIRECRAWL_API_KEY": "your-firecrawl-api-key-here"
        },
        "capabilities": {
          "tools": true
        }
      },
      "ref-tools": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-ref"],
        "env": {},
        "capabilities": {
          "tools": true,
          "prompts": true
        }
      },
      "context7": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-context"],
        "env": {},
        "capabilities": {
          "tools": true
        }
      },
      "git": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-git"],
        "env": {},
        "capabilities": {
          "tools": true
        }
      }
    }
  }
}
```

## Step 4: Install Individual MCP Packages

Run these commands in your project directory or globally:

```bash
# Playwright MCP (Browser automation & visual testing)
npm install @modelcontextprotocol/server-playwright

# Shadcn-ui MCP (UI components)
npm install shadcn-ui-mcp

# Exa MCP (Advanced search)
npm install @modelcontextprotocol/server-exa

# Firecrawl MCP (Web scraping)
npm install @modelcontextprotocol/server-firecrawl

# Ref-tools MCP (Reference management)
npm install @modelcontextprotocol/server-ref

# Context7 MCP (Context management)
npm install @modelcontextprotocol/server-context

# Git MCP (Git operations)
npm install @modelcontextprotocol/server-git
```

## Step 5: Environment Variables Setup

Create a `.env` file in your project root:

```env
# Exa API Key (get from https://exa.ai)
EXA_API_KEY=your_exa_api_key_here

# Firecrawl API Key (get from https://firecrawl.dev)
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# Optional: Configure other API keys as needed
```

## Step 6: Verify Installation

### Test MCP Servers
Run this command to test if MCP servers are working:

```bash
# Test Playwright MCP
npx @modelcontextprotocol/server-playwright --help

# Test Git MCP
npx @modelcontextprotocol/server-git --help

# Test other MCPs similarly
```

### Test in Claude Code
1. Open a new chat in Cursor with Claude Code
2. Try using MCP tools with prompts like:
   - "Use Playwright to take a screenshot of this page"
   - "Use shadcn-ui to add a button component"
   - "Use git MCP to check the current branch status"

## Step 7: BMAD Method Integration

Create a `.claude/` directory in your project with this structure:

```
.claude/
├── claude.md              # Main configuration
├── agents/
│   ├── ui-designer.md     # Uses shadcn-ui MCP
│   ├── tester.md          # Uses playwright MCP
│   ├── researcher.md      # Uses exa & firecrawl MCP
│   └── developer.md       # Uses git & ref-tools MCP
└── mcp-config.json        # MCP-specific settings
```

### Sample `.claude/claude.md`:

```markdown
# BMAD Method with MCP Integration

## Available MCP Tools:
- **Playwright**: Browser automation, screenshots, testing
- **Shadcn-ui**: UI component management
- **Exa**: Advanced web search
- **Firecrawl**: Web scraping and data extraction
- **Ref-tools**: Reference and documentation management
- **Context7**: Context and memory management
- **Git**: Version control operations

## Agent Assignments:
- **UI Designer Agent**: Primary use of shadcn-ui MCP
- **QA Tester Agent**: Primary use of playwright MCP
- **Research Agent**: Primary use of exa & firecrawl MCP
- **Developer Agent**: Primary use of git & ref-tools MCP

## Workflow:
When working on tasks, automatically determine which MCP tools are most appropriate and use them seamlessly.
```

## Step 8: Restart and Test

1. **Restart Cursor** completely
2. **Open a new project** or reload your current one
3. **Test Claude Code** with MCP integration:

```
Hey Claude, I need you to:
1. Use git MCP to show me the current repository status
2. Use shadcn-ui MCP to list available components
3. Use playwright MCP to take a screenshot of localhost:3000
```

## Troubleshooting

### Common Issues:

1. **MCP servers not found**:
   ```bash
   # Install globally if local installation fails
   npm install -g @modelcontextprotocol/server-playwright
   npm install -g @modelcontextprotocol/server-git
   ```

2. **Permission errors**:
   ```bash
   # On macOS/Linux, you might need to make scripts executable
   chmod +x node_modules/.bin/*
   ```

3. **API Key issues**:
   - Make sure your `.env` file is in the project root
   - Verify API keys are valid and have proper permissions

4. **Cursor not recognizing MCP**:
   - Check if Claude Code extension is enabled
   - Restart Cursor completely
   - Check settings.json syntax is valid JSON

## Verification Checklist

- [ ] All MCP packages installed
- [ ] settings.json configured correctly
- [ ] Environment variables set
- [ ] Cursor restarted
- [ ] Claude Code can access MCP tools
- [ ] Test commands work in Claude Code
- [ ] BMAD agents can use appropriate MCP tools

## Success Confirmation

You'll know everything is working when Claude Code can respond to prompts like:

> "Use the appropriate MCP tools to help me build a new React component, test it visually, and commit the changes to git"

And Claude automatically uses:
- shadcn-ui MCP for component creation
- playwright MCP for visual testing  
- git MCP for version control

Your MCP setup is now complete and ready for BMAD Method integration! 🎉