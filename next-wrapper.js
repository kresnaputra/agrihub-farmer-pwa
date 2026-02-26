#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');

// Filter out --webpack from args
const args = process.argv.slice(2).filter(arg => arg !== '--webpack');

// Get actual next binary
const nextBin = require.resolve('next/dist/bin/next');

// Run actual next with filtered args
const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code || 0);
});