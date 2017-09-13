import globby from 'globby'
import readFile from 'fs-readfile-promise'

const error = (componentName, errorMessage) => new Error(`💥 ${componentName} Panic! ${errorMessage}`)

/**
 * Reads bower files provided a working directory.
 * 
 * @param {object} options
 * @param {string} options.workingDir
 * @param {array} options.exclude
 */
export function reader({ workingDir, exclude } = {}) {
  const name = 'Reader'
  const _formatExcludes = (globList) => {
    return globList.map((glob) => `${workingDir}/${glob}/**`)
  }

  if (!workingDir) {
    return Promise.reject(error(name, 'Please provide a workingDirectory.'))
  } 

  if (exclude && !Array.isArray(exclude)) {
    return Promise.reject(error(name, 'Excludes should be an array of strings, like ["glob/to/exclude"]'))
  }
    
  return globby(
    [
      `${workingDir}/**/bower.json`,
      `${workingDir}/**/.bower.json`
    ],
    {
      ignore: [...exclude ? _formatExcludes(exclude) : [] ]
    }
  )
}

/**
 * Parses versions and names of packages provded as a file list.
 *
 * @param {array} fileList
 */
export async function parser({ fileList } = {}) {
  const name = 'Parser'
  const _readFiles = (paths) => Promise.all(
    paths.map((path) => readFile(path, { encoding: 'utf8'}))
  )

  if (!fileList) {
    return Promise.reject(error(name, 'Please provide a fileList to parse.'))
  }

  if (fileList && !Array.isArray(fileList)) {
    return Promise.reject(error(name, 'Filelist should be an array.'))
  }

  const files = await _readFiles(fileList)
  
  try {
    const determineVersion = (currentVersion, nextVersion) => {
      // TODO: the version is determined on a first come - first saved basis, which means that the order of the provided `fileList` could produce different results. Not great. 
      if (!currentVersion) {
        return nextVersion
      } else {
        return currentVersion
      }
    }

    return files.reduce((acc, cur) => {
      const { name, version, _release } = JSON.parse(cur)

      acc = {
        ...acc,
        [name]: {
          version: determineVersion(
            acc[name] ? acc[name].version : null,
            version ? version : _release
          )
        }
      }

      return acc
    }, {})
  } catch (e) {
    throw error(name, `There was a problem parsing one or more files ${JSON.stringify(files)}`)
  }
}

export function outputer({ outputFile } = {}) {
  const name = 'Outputer'
}