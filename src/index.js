import { writeFile, readFileSync } from 'fs'

const files = [
    '23052021.txt.phps',
    '26052021.txt.phps',
    '24052021.txt.phps',
    '25052021.txt.phps'
]

const pattern = 'Hora:Minuto:Segundo:pa:pb:pc:pt:qa:qb:qc:qt:sa:sb:sc:st:uarms:ubrms:ucrms:iarms:ibrms:icrms:itrms:pfa:pfb:pfc:pft:pga:pgb:pgc:freq:epa:epb:epc:ept:eqa:eqb:eqc:eqt:yuaub:yuauc:yubuc:tpsd'

const getParams = pattern => {
    return pattern.split(':')
}

const readFile = fileName => {
    try {
        const data = readFileSync(fileName, 'utf8')
        return data.toString()
    } catch(err) {
        console.log(`Error: ${err.message}`)
    }
}

const splitData = dataString => {
    const splittedData = dataString.split('\n')
    return splittedData
}

const cleanStringArray = (dataArray, stringToRemove) => {
    return dataArray.map(item => item.replace(stringToRemove, ''))
}

const getFrames = (stringArray, params) => {
    let dataObjectArray = []

    stringArray.forEach(dataString => {
        if (dataString.length) {
            let dataObject = {}
            const values = dataString.split(':')

            for (let i = 0; i < params.length; i++) {
                dataObject[params[i]] = values[i]
            }

            dataObjectArray.push(dataObject)
        }
    })

    return dataObjectArray
}

const storeData = data => {
    writeFile('frames.txt', JSON.stringify(data), err => {
        if (err) {
            console.log(`Error: ${err.message}`)
        } else {
            console.log('Convertido com sucesso')
        }
        
    })
}

(() => {
    const dataString = readFile(files[0])
    const dataArray = splitData(dataString)
    const cleanedDataArray = cleanStringArray(dataArray, '\r')
    const frames = getFrames(cleanedDataArray, getParams(pattern))
    storeData(frames)
})()