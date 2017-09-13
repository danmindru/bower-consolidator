import test from 'ava'
import del from 'del'
import { reader, parser, outputer } from '../'

/**
 * Setup.
 */
const workingDir = 'test-assets'

const onlyCollapsibleAssetPaths = [
    `${workingDir}/collapsible-container/bower.json`,
    `${workingDir}/collapsible-container/.bower.json`
]

const nonIronAssetPaths = [
    `${workingDir}/collapsible-container/bower.json`,
    `${workingDir}/date-util/bower.json`,
    `${workingDir}/dom-if-else/bower.json`,
    `${workingDir}/collapsible-container/.bower.json`,
    `${workingDir}/date-util/.bower.json`,
    `${workingDir}/dom-if-else/.bower.json`
]

const allAssetPaths = [
    `${workingDir}/collapsible-container/bower.json`,
    `${workingDir}/date-util/bower.json`,
    `${workingDir}/dom-if-else/bower.json`,
    `${workingDir}/iron-collapse/bower.json`,
    `${workingDir}/iron-meta/bower.json`,
    `${workingDir}/collapsible-container/.bower.json`,
    `${workingDir}/date-util/.bower.json`,
    `${workingDir}/dom-if-else/.bower.json`,
    `${workingDir}/iron-collapse/.bower.json`,
    `${workingDir}/iron-meta/.bower.json`
]

const sample = {
    // Reader samples
    allAssetPaths,
    nonIronAssetPaths,
    onlyCollapsibleAssetPaths,

    // Parser samples
    allParsedAssets: {
        'collapsible-container': {
            version: '1.0.4'
        },
        'date-util': {
            version: '0.5.0'
        },
        'dom-if-else': {
            version: '0.9.0'
        },
        'iron-collapse': {
            version: '1.3.0'
        },
        'iron-meta': {
            version: '1.1.3'
        }
    }
}


/**
 * Clean output files before each test.
 */
test.beforeEach('clean up output', async () => {
    await del(['new.bower.json', 'custom.bower.json'])
})

/**
 *  Reader tests.
 */
test('reader should fail if no workingDir provided', async (t) => {
    t.plan(2)

    const paths = await t.throws(reader())
    t.is(paths.message, '💥 Reader Panic! Please provide a workingDirectory.')
})

test('reader should succeed if workingDir provided', async (t) => {
    t.plan(1)

    const paths = await reader({ workingDir: workingDir })
    t.truthy(paths)
})

test('reader should return an array of paths for workingDir', async (t) => {
    t.plan(1)

    const paths = await reader({ workingDir: workingDir })
    t.deepEqual(paths, sample.allAssetPaths)
})

test('reader should fail if exclude glob not an array', async (t) => {
    t.plan(2)

    const paths = await t.throws(reader({ workingDir: workingDir, exclude: 'iron-*' }))
    t.is(paths.message, '💥 Reader Panic! Excludes should be an array of strings, like ["glob/to/exclude"]')
})

test('reader should return a filtered array for workingDir if exclude glob provided', async (t) => {
    t.plan(1)

    const paths = await reader({ workingDir: workingDir, exclude: ['iron-*'] })
    t.deepEqual(paths, sample.nonIronAssetPaths)
})

test('reader should filter by multiple exclude globs', async (t) => {
    t.plan(1)

    const paths = await reader({ workingDir: workingDir, exclude: ['iron-*', 'd*'] })
    t.deepEqual(paths, sample.onlyCollapsibleAssetPaths)
})

/**
 * Parser tests.
 */
test('parser should fail if no fileList provided', async (t) => {
    t.plan(2)

    const packages = await t.throws(parser())
    t.is(packages.message, '💥 Parser Panic! Please provide a fileList to parse.')
})

test('parser should fail if fileList is not an array', async (t) => {
    t.plan(8)

    const packages = await t.throws(parser({ fileList: true }))
    const packages1 = await t.throws(parser({ fileList: 'hey' }))
    const packages2 = await t.throws(parser({ fileList: {} }))
    const packages3 = await t.throws(parser({ fileList: 9 }))
    t.is(packages.message, '💥 Parser Panic! Filelist should be an array.')
    t.is(packages1.message, '💥 Parser Panic! Filelist should be an array.')
    t.is(packages2.message, '💥 Parser Panic! Filelist should be an array.')
    t.is(packages3.message, '💥 Parser Panic! Filelist should be an array.')
})

test('parser should succeed if fileList provided', (t) => {
    t.plan(1)

    const packages = parser({ fileList: sample.allAssetPaths })
    t.truthy(packages)
})

test('parser should return an object of packages and their versions', async (t) => {
    t.plan(1)

    const packages = await parser({ fileList: sample.allAssetPaths })
    t.deepEqual(packages, sample.allParsedAssets)
})
// TODO: no bower.json file?
// TODO: no .bower.json file?
// TODO: no version specified?
// TODO: bower.json or .bower.json not parsable
// TODO: order of fileList produces different results...

// /**
//  * Outputer tests.
//  */
// test('outputer should fail if no packages provided', (t) => {
//     t.plan(1)

//     const output = t.throws(() => outputer())
//     t.is(output.message, '💥 Outputer Panic! Please provide a list of packages to parse.')
// })

// test('outputer should default to new.bower.json', async (t) => {
//     t.plan(1)

//     const output = outputer({ packages: sample.allParsedAssets })
//     t.is(await output, 'new.bower.json')
// })

// test('outputer should write to a desired path in workingDir', async (t) => {
//     t.plan(1)

//     const output = outputer({ packages: sample.allParsedAssets, outputFile: 'custom.bower.json' })
//     t.is(await output, 'custom.bower.json')
// })