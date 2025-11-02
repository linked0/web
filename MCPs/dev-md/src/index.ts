#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to documentation root
const DEV_MD_PATH = path.join(
  process.env.HOME || "",
  "work",
  "web",
  "dev.md"
);
const ZSUB_PATH = path.join(process.env.HOME || "", "work", "web", "zsub");

interface ProjectInfo {
  name: string;
  description: string;
  keywords: string[];
}

// Known projects from the documentation
const PROJECTS: ProjectInfo[] = [
  {
    name: "betelgeuse",
    description: "NFT marketplace with Seaport integration",
    keywords: ["nft", "seaport", "marketplace", "weth", "multicall"],
  },
  {
    name: "poohnet",
    description: "Ethereum-based blockchain project",
    keywords: ["blockchain", "ethereum", "geth", "pooh-geth"],
  },
  {
    name: "tigger-swap",
    description: "DEX/swap contracts",
    keywords: ["dex", "swap", "contracts", "defi"],
  },
];

class DevMdServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "dev-md-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "soonguri",
          description:
            "Soonguri Dangdang",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Greeting message with Soonguri Dangdang",
              },
              context_lines: {
                type: "number",
                description: "Number of context lines to include (default: 3)",
                default: 3,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "search_docs",
          description:
            "Search across all development documentation (dev.md and zsub folder) for specific keywords or topics",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query (keywords, project names, commands, etc.)",
              },
              context_lines: {
                type: "number",
                description: "Number of context lines to include (default: 3)",
                default: 3,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "get_project_config",
          description:
            "Get configuration and setup instructions for a specific project (betelgeuse, poohnet, tigger-swap)",
          inputSchema: {
            type: "object",
            properties: {
              project_name: {
                type: "string",
                description: "Project name (betelgeuse, poohnet, tigger-swap)",
                enum: ["betelgeuse", "poohnet", "tigger-swap"],
              },
            },
            required: ["project_name"],
          },
        },
        {
          name: "get_setup_guide",
          description:
            "Get environment setup guide for Mac development environment",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description:
                  "Specific category (tools, config, shortcuts, vscode, hardhat, foundry, etc.) or 'all'",
                default: "all",
              },
            },
          },
        },
        {
          name: "list_projects",
          description: "List all available projects in the knowledge base",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_error_solutions",
          description:
            "Search error.md for solutions to common development errors",
          inputSchema: {
            type: "object",
            properties: {
              error_keyword: {
                type: "string",
                description: "Error message or keyword to search for",
              },
            },
            required: ["error_keyword"],
          },
        },
      ],
    }));

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: "dev://main",
          name: "Main Dev Documentation",
          description: "Complete dev.md documentation",
          mimeType: "text/markdown",
        },
        {
          uri: "dev://work-env",
          name: "Work Environment Setup",
          description: "Mac development environment setup guide",
          mimeType: "text/markdown",
        },
        {
          uri: "dev://errors",
          name: "Error Solutions",
          description: "Common errors and solutions",
          mimeType: "text/markdown",
        },
        {
          uri: "dev://projects",
          name: "Projects Overview",
          description: "List of all projects and their details",
          mimeType: "application/json",
        },
      ],
    }));

    // Read resource handler
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      switch (uri) {
        case "dev://main":
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: await this.readFile(DEV_MD_PATH),
              },
            ],
          };

        case "dev://work-env":
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: await this.readFile(path.join(ZSUB_PATH, "work-env.md")),
              },
            ],
          };

        case "dev://errors":
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: await this.readFile(path.join(ZSUB_PATH, "error.md")),
              },
            ],
          };

        case "dev://projects":
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(PROJECTS, null, 2),
              },
            ],
          };

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    // Tool execution handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!args) {
          throw new Error("No arguments provided");
        }

        switch (name) {
          case "soonguri":
            return await this.soonguri(
              args.query as string,
              (args.context_lines as number) || 3
            );
          case "search_docs":
            return await this.searchDocs(
              args.query as string,
              (args.context_lines as number) || 3
            );

          case "get_project_config":
            return await this.getProjectConfig(args.project_name as string);

          case "get_setup_guide":
            return await this.getSetupGuide((args.category as string) || "all");

          case "list_projects":
            return await this.listProjects();

          case "get_error_solutions":
            return await this.getErrorSolutions(args.error_keyword as string);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async readFile(filePath: string): Promise<string> {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
      throw new Error(`Failed to read ${filePath}: ${error}`);
    }
  }

  private async soonguri(
    query: string,
    contextLines: number
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    return {
      content: [
        {
          type: "text",
          text: `Soonguri dangdang! You said: "${query}"`,
        },
      ],
    };
  }

  private async searchDocs(
    query: string,
    contextLines: number
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    const results: string[] = [];
    const searchTerm = query.toLowerCase();

    // Search dev.md
    const devContent = await this.readFile(DEV_MD_PATH);
    const devLines = devContent.split("\n");
    results.push("## 🔍 Results from dev.md\n");

    for (let i = 0; i < devLines.length; i++) {
      if (devLines[i].toLowerCase().includes(searchTerm)) {
        const start = Math.max(0, i - contextLines);
        const end = Math.min(devLines.length, i + contextLines + 1);
        const context = devLines.slice(start, end).join("\n");
        results.push(`\n**Line ${i + 1}:**\n\`\`\`\n${context}\n\`\`\`\n`);
      }
    }

    // Search zsub files
    const zsubFiles = ["work-env.md", "error.md", "dev2.md"];
    for (const file of zsubFiles) {
      try {
        const content = await this.readFile(path.join(ZSUB_PATH, file));
        const lines = content.split("\n");
        const fileResults: string[] = [];

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(searchTerm)) {
            const start = Math.max(0, i - contextLines);
            const end = Math.min(lines.length, i + contextLines + 1);
            const context = lines.slice(start, end).join("\n");
            fileResults.push(`\n**Line ${i + 1}:**\n\`\`\`\n${context}\n\`\`\`\n`);
          }
        }

        if (fileResults.length > 0) {
          results.push(`\n## 🔍 Results from ${file}\n`);
          results.push(...fileResults);
        }
      } catch (error) {
        // Skip files that don't exist
      }
    }

    if (results.length === 1) {
      results.push("\n❌ No results found for your query.");
    }

    return {
      content: [
        {
          type: "text",
          text: results.join("\n"),
        },
      ],
    };
  }

  private async getProjectConfig(
    projectName: string
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    const devContent = await this.readFile(DEV_MD_PATH);
    const lines = devContent.split("\n");
    const results: string[] = [];
    let capturing = false;
    let captureDepth = 0;

    // Find project section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Start capturing at project heading
      if (
        line.toLowerCase().includes(`## ${projectName}`) ||
        line.toLowerCase().includes(`### ${projectName}`)
      ) {
        capturing = true;
        captureDepth = line.match(/^#+/)?.[0].length || 0;
        results.push(line);
        continue;
      }

      if (capturing) {
        const currentDepth = line.match(/^#+/)?.[0].length || 0;

        // Stop if we hit a heading of same or higher level
        if (currentDepth > 0 && currentDepth <= captureDepth) {
          break;
        }

        results.push(line);
      }
    }

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Project "${projectName}" not found in documentation.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `# 📋 ${projectName.toUpperCase()} Configuration\n\n${results.join("\n")}`,
        },
      ],
    };
  }

  private async getSetupGuide(
    category: string
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    const workEnvContent = await this.readFile(
      path.join(ZSUB_PATH, "work-env.md")
    );

    if (category === "all") {
      return {
        content: [
          {
            type: "text",
            text: `# 🛠️ Complete Work Environment Setup\n\n${workEnvContent}`,
          },
        ],
      };
    }

    // Extract specific category
    const lines = workEnvContent.split("\n");
    const results: string[] = [];
    let capturing = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.toLowerCase().includes(category.toLowerCase()) && line.startsWith("##")) {
        capturing = true;
        results.push(line);
        continue;
      }

      if (capturing) {
        if (line.startsWith("##") && !line.toLowerCase().includes(category.toLowerCase())) {
          break;
        }
        results.push(line);
      }
    }

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Category "${category}" not found. Try: tools, config, shortcuts, vscode, hardhat, foundry, or 'all'`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `# 🛠️ ${category.toUpperCase()} Setup\n\n${results.join("\n")}`,
        },
      ],
    };
  }

  private async listProjects(): Promise<{
    content: Array<{ type: string; text: string }>;
  }> {
    const projectList = PROJECTS.map(
      (p) =>
        `## ${p.name}\n**Description:** ${p.description}\n**Keywords:** ${p.keywords.join(", ")}\n`
    ).join("\n");

    return {
      content: [
        {
          type: "text",
          text: `# 📚 Available Projects\n\n${projectList}`,
        },
      ],
    };
  }

  private async getErrorSolutions(
    errorKeyword: string
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const errorContent = await this.readFile(path.join(ZSUB_PATH, "error.md"));
      const lines = errorContent.split("\n");
      const results: string[] = [];
      const searchTerm = errorKeyword.toLowerCase();

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(searchTerm)) {
          const start = Math.max(0, i - 5);
          const end = Math.min(lines.length, i + 10);
          const context = lines.slice(start, end).join("\n");
          results.push(`\n**Line ${i + 1}:**\n\`\`\`\n${context}\n\`\`\`\n`);
        }
      }

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `❌ No error solutions found for "${errorKeyword}".`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `# 🔧 Error Solutions for "${errorKeyword}"\n\n${results.join("\n")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ error.md file not found.`,
          },
        ],
      };
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Dev-MD MCP Server running on stdio");
  }
}

const server = new DevMdServer();
server.run().catch(console.error);
