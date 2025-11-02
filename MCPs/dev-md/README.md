# Dev-MD MCP Server

Custom MCP server for accessing and querying your development documentation knowledge base.

## Features

### 🔧 Tools

1. **search_docs** - Search across all documentation
   - Query: Keywords, project names, commands, error messages
   - Returns: Contextual results with surrounding lines

2. **get_project_config** - Get project-specific configuration
   - Projects: betelgeuse, poohnet, tigger-swap
   - Returns: Complete setup and deployment instructions

3. **get_setup_guide** - Mac development environment setup
   - Categories: tools, config, shortcuts, vscode, hardhat, foundry, or 'all'
   - Returns: Specific or complete setup guide

4. **list_projects** - List all available projects
   - Returns: Project names, descriptions, and keywords

5. **get_error_solutions** - Search error solutions
   - Query: Error messages or keywords
   - Returns: Solutions from error.md

### 📚 Resources

- **dev://main** - Complete dev.md documentation
- **dev://work-env** - Work environment setup guide
- **dev://errors** - Common errors and solutions
- **dev://projects** - Projects overview (JSON)

## Installation

1. Install dependencies:
```bash
cd ~/work/web/MCPs/dev-md
npm install
```

2. Build the server:
```bash
npm run build
```

3. Add to Claude Code MCP configuration (`~/.claude/.mcp.json`):
```json
{
  "mcpServers": {
    "dev-md": {
      "command": "node",
      "args": ["/Users/jay/work/web/MCPs/dev-md/dist/index.js"]
    }
  }
}
```

Or it has already been added automatically!

4. Restart Claude Code

## Usage Examples

### Search Documentation
```
"Search for betelgeuse deployment steps"
→ Uses: search_docs with query="betelgeuse deployment"
```

### Get Project Config
```
"Show me the poohnet configuration"
→ Uses: get_project_config with project_name="poohnet"
```

### Setup Guide
```
"How do I setup VS Code?"
→ Uses: get_setup_guide with category="vscode"
```

### Error Solutions
```
"Find solutions for fsevents error"
→ Uses: get_error_solutions with error_keyword="fsevents"
```

## Development

- **Watch mode**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm start`

## File Structure

```
dev-md/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## Documentation Sources

- **dev.md**: `/Users/jay/work/web/dev.md` (3,259 lines)
- **zsub folder**: `/Users/jay/work/web/zsub/`
  - work-env.md - Mac environment setup
  - error.md - Error solutions
  - dev2.md - Additional notes

## Projects Indexed

1. **Betelgeuse** - NFT marketplace with Seaport integration
2. **Poohnet** - Ethereum-based blockchain project
3. **Tigger Swap** - DEX/swap contracts

## Notes

- Server runs on stdio transport
- Automatic error handling and graceful shutdown
- Context-aware search with configurable context lines
- Project-specific configuration extraction
