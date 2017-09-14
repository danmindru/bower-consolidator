import _ from 'lodash'
import globby from 'globby'
import readFile from 'fs-readfile-promise'
import writeFile from 'fs-writefile-promise'
import isJSON from 'is-valid-json'
import jsonFormat from 'json-format'
import sortObjectKeys from 'sort-object-keys'

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
        [name]: determineVersion(
          acc[name],
          version ? version : _release
        )
      }

      return acc
    }, {})
  } catch (e) {
    throw error(name, `There was a problem parsing one or more files ${JSON.stringify(files)}`)
  }
}

/**
 * Outputs content to a file. 
 * 
 * @param {object} options 
 * @param {*} options.content The content to output.
 * @param {string} options.outputFile File path to output to. 
 * @param {string} options.templateFile JSON template file to use.
 * @param {string} options.templatePath Path in the template to write.
 */
export async function outputer({ content, outputFile, templateFile, templatePath } = {}) {
  const name = 'Outputer'
  const formatConfig = {
    type: 'space',
    size: 2
  }
  const _outputMessage = (result, path, message) => {
    const icon = result === 'success' ? '✅' : '⚠' 

    return {
      result,
      message: `${icon} ${message} to ${path}`
    }
  }
  const _insertObjectAtPath = (object, path, newContent) => {
    const objectCopy = { ...object }
    const currentContent = _.get(objectCopy, path)
    _.set(
      objectCopy, 
      path, 
      sortObjectKeys({ ...currentContent, ...newContent })
    )

    return objectCopy
  }

  if (!outputFile) {
    outputFile = 'new.bower.json'
  }

  if (!content) {
    return _outputMessage('warning', outputFile, 'Did nothing, because there was nothing to output')
  }

  if (!isJSON(content)){
    console.error(`Content that failed: ${JSON.stringify(content)}`)
    return Promise.reject(error(name, `Invalid content provided to ${outputFile}`))
  }

  if (!templateFile) {
    try {
      await writeFile(outputFile, jsonFormat(content, formatConfig)) 
    } catch (e) {
      console.error(e)
      return Promise.reject(error(name, `Failed to write to ${outputFile}`))
    }
  } else {
    if (!templatePath) {
      return Promise.reject(error(name, 'Provide a templatePath to know where to output in your templateFile.'))
    }

    const templateFileContents = await readFile(templateFile, { encoding: 'utf8' })
    
    if (!isJSON(templateFileContents)) {
      return Promise.reject(error(name, 'Could not parse the provided templateFile.'))
    }

    const fileContentsWithInsertion = _insertObjectAtPath(JSON.parse(templateFileContents), templatePath, content)

    try {
      await writeFile(outputFile, jsonFormat(fileContentsWithInsertion, formatConfig))
    } catch (e) {
      console.error(e)
      return Promise.reject(error(name, `Failed to write to ${outputFile}`))
    }
  }

  return _outputMessage('success', outputFile, 'Outputed content')
}