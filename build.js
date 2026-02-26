#!/usr/bin/env node
// Wrapper untuk next build yang ignore --webpack flag

const args = process.argv.slice(2);
const filteredArgs = args.filter(arg => arg !== '--webpack');

const { spawn } = require('child_process');
const nextBuild = spawn('npx', ['next', 'build', ...filteredArgs], {
  stdio: 'inherit',
  shell: true
});

nextBuild.on('exit', (code) => {
  process.exit(code);
});