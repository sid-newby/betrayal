#!/usr/bin/env node

/**
 * Filesystem MCP Server Wrapper
 * Reads configuration from filesystem-config.json and starts the MCP server
 * with the specified allowed directories.
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadConfig() {
  try {
    const configPath = join(__dirname, 'filesystem-config.json');
    const configData = readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    return config.filesystem;
  } catch (error) {
    console.error('Error loading filesystem config:', error.message);
    console.error('Make sure filesystem-config.json exists and is valid JSON');
    process.exit(1);
  }
}

function startFilesystemServer() {
  const config = loadConfig();
  
  console.error(`Starting Filesystem MCP Server: ${config.name}`);
  console.error(`Description: ${config.description}`);
  console.error(`Allowed directories: ${config.allowedDirectories.join(', ')}`);
  
  // Build command arguments
  const args = [
    '@modelcontextprotocol/server-filesystem',
    ...config.allowedDirectories
  ];
  
  console.error(`Running: bunx ${args.join(' ')}`);
  
  // Spawn the MCP server
  const child = spawn('bunx', args, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  child.on('error', (error) => {
    console.error('Failed to start filesystem MCP server:', error);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    console.error(`Filesystem MCP server exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle shutdown gracefully
  process.on('SIGINT', () => {
    console.error('Shutting down filesystem MCP server...');
    child.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.error('Shutting down filesystem MCP server...');
    child.kill('SIGTERM');
  });
}

startFilesystemServer();
