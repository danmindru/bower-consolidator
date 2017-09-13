import globby from 'globby'

const error = (componentName, errorMessage) => new Error(`💥 ${componentName} Panic! ${errorMessage}`)

export function reader({ workingDir, exclude } = {}) {
  const name = 'Reader'
  const _formatExcludes = (globList) => {
    return globList.map((glob) => `${glob}/**`)
  }

  if (!workingDir) {
    return Promise.reject(error(name, 'Please provide a workingDirectory.'))
  } 

  if (exclude && !Array.isArray(exclude)) {
    return Promise.reject(error(name, 'Excludes should be an array of strings, like ["glob/to/exclude"]'))
  }
    
  return globby(
    [
      `**/.bower.json`,
      `**/bower.json`
    ],
    {
      cwd: workingDir,
      ignore: [...exclude ? _formatExcludes(exclude) : [] ]
    }
  )
}

export function parser({ exclude } = {}) {
  const name = 'Parser'
}

export function outputer({ outputFile } = {}) {
  const name = 'Outputer'
}