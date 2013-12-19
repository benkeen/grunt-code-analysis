## grunt-codebase-stats

A grunt plugin to generate stats about your codebase. This is incomplete right now, but here's what I'm planning:
the plugin will be separated into the *core*, and optional *language-specific modules*. The core will contain the
basic stuff: showing the total number of files, folders, breakdown of file types: number of lines per each. It'll
also contain some sort of built-in graphing tool to show the breakdown clearly (maybe something with d3).

The interesting part will be the next phase: adding language-specific modules to run more detailed analysis of the
file types. For JS, I was hoping to get stats about the following:
- average function lengths (showing outliers)
- cyclomatic complexity
- # of function params

Anyway, just tinkering right now. Let's see where it goes.