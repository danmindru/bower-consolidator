# Bower consolidator
Takes a bunch of bower packages and finds their version from `bower.json` or `.bower.json`, then makes one big bower file with frozen versions.

### Getting started
```bash
yarn --production
babel-node index.js --help # See options
```

```bash
  Usage: index [options]


  Options:

    -V, --version                        output the version number
    --cwd, --workingDir <workingDir>     Current working directory (where your many bower packages are).
    --e, --excludePaths [excludePaths]   One or many paths (or globs) you want to exclude, i.e. `-e "prefix-*"`. Can be applied multiple times: `-e "one" -e "two"`.
    --o, --outputFile <outputFile>       The output file name (in your cwd). Defaults to `new.bower.json`
    --tf, --templateFile <templateFile>  (optional) A JSON file you want to use as template. You *need* to supply a path to write in that file (see --templatePathtp).
    --tp, --templatePath <templatePath>  (optional) An object path, like `path.to.something` to insert packages at. Required if template file provided (see --templateFile).
    -h, --help                           output usage information
```


## Developing
Start by installing all dependencies.
```bash
yarn # install all dependencies
```

### Testing
```bash
npm test
npm dev # continuous tests, watches files
```

