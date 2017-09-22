# Bower consolidator
Takes a bunch of bower packages and finds their version from `bower.json` or `.bower.json`, then makes one big bower file with frozen versions.

##### What is this for?
✅ older projects that need dependencies consolidated <br/>
✅ older projects that you want to freeze deps for (point this at `bower_components`)  <br/>
✅ projects that have a bunch of bower files which you want to merge into one  <br/>
✅ projects that have source and 3rd party deps in the same dir (use excludePaths, but ask yourself why did you get in this situation first)

## Usage (packaged)
### Windows
```bash
PowerShell ./bower-consolidator.exe [options]
```
### Mac / Linux
```bash
./bower-consolidator [options]
```

## Options
```bash
Usage: index [options]

Options:

  -V, --version          output the version number
  --cwd, --workingDir    Current working directory (where your many
                         bower packages are).
  --e, --excludePaths    One or many paths (or globs) you want to
                         exclude, i.e. `-e "prefix-*"`. Can be
                         applied multiple times: `-e "one" -e "two"`.
  --o, --outputFile      The output file name (in your cwd).
                         Defaults to `new.bower.json`
  --tf, --templateFile   (optional) A JSON file you want to use as
                         template. You *need* to supply a path to
                         write in that file (see --templatePathtp).
  --tp, --templatePath   (optional) An object path, like
                         `path.to.something` to insert packages at.
                         Required if template file provided
                         (see --templateFile).
  -h, --help             output usage information
```
-----------------------------------------

## Getting started (unpacked)

### Run with node
Install dependencies first
```bash
yarn
```

```bash
babel-node index.js [options]
```

> Requires node v8.5.0+

#### Run a demo
```bash
npm run demo # outputs consolidated packages to ./custom.bower.json
```

## Developing
Start by installing all dependencies.
```bash
yarn
npm run dev # continuous tests, watches files
```

### Run tests once
```bash
npm run test
```

### Publish new build
```bash
npm run publish:windows
npm run publish:all # node on win, darwin, linux
```
