import program from 'commander'
import nodePackage from './package.json'
import { reader, parser, outputer } from './lib'

let allExcludes = [] 
const collectExcludes = (value, list) => allExcludes = [...allExcludes, value]

program
    .version(nodePackage.version)
    .option('--cwd, --workingDir <workingDir>', 'Current working directory (where your many bower packages are).', program)
    .option('--e, --excludePaths [excludePaths]', 'One or many paths (or globs) you want to exclude, i.e. `-e "prefix-*"`. Can be applied multiple times: `-e "one" -e "two"`.', collectExcludes)
    .option('--o, --outputFile <outputFile>', 'The output file name (in your cwd). Defaults to `new.bower.json`')
    .option('--tf, --templateFile <templateFile>', '(optional) A JSON file you want to use as template. You *need* to supply a path to write in that file (see --templatePathtp).')
    .option('--tp, --templatePath <templatePath>', '(optional) An object path, like `path.to.something` to insert packages at. Required if template file provided (see --templateFile).')
    .parse(process.argv)

async function runtime () {
    const { workingDir, excludePaths, outputFile, templateFile, templatePath } = program

    const fileList = await reader({ workingDir, excludePaths: allExcludes })
    const content = await parser({ fileList })
    const output = await outputer({ content, outputFile, templateFile, templatePath })

    console.log('\n', output.message)
}

try {
    runtime()
} catch (e) {
    console.error(e)
    console.error('Consolidator failed misserably ☹. ')
}

