import { writeFile, readFileSync } from 'fs'

const getParams = pattern => {
    return pattern.split(':')
}

const readFile = fileName => {
    try {
        const data = readFileSync(fileName, 'utf8', err => {
            if (err) {
                console.log(`Erro abrindo arquivo: ${err.message}`)
            }
        })
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

const storeData = (data, fileName) => {
    writeFile(fileName, JSON.stringify(data), err => {
        if (err) {
            console.log(`Erro salvando arquivo: ${err.message}`)
        } else {
            console.log('Convertido com sucesso')
        }
    })
}

const insertTimestamp = (frames, dateString) =>
    frames.map(frame => {
        const { Hora, Minuto, Segundo } = frame
        const splitDate = dateString.split('')
        const date = new Date()
        date.setHours(Hora)
        date.setMinutes(Minuto)
        date.setSeconds(Segundo)
        date.setDate(`${splitDate[0]}${splitDate[1]}`)
        date.setMonth(`${splitDate[2]}${splitDate[3]}`)
        date.setMonth(date.getMonth() - 1)
        date.setFullYear(
            `${
                splitDate[4]
            }${
                splitDate[5]
            }${
                splitDate[6]
            }${
                splitDate[7]
            }`
        )
        
        const timestamp = date.toISOString()

        delete frame.Hora
        delete frame.Minuto
        delete frame.Segundo

        frame.timestamp = timestamp
        return frame
    })

;(() => {
    try {
        const { argv } = process
        const fileName = argv[2]
        const pattern = argv[3] ?? 'Hora:Minuto:Segundo:pa:pb:pc:pt:qa:qb:qc:qt:sa:sb:sc:st:uarms:ubrms:ucrms:iarms:ibrms:icrms:itrms:pfa:pfb:pfc:pft:pga:pgb:pgc:freq:epa:epb:epc:ept:eqa:eqb:eqc:eqt:yuaub:yuauc:yubuc:tpsd'
        const saveAs = `Convertido em: ${
            new Date().getDate()
        }-${
            new Date().getMonth() + 1
        }-${
            new Date().getFullYear()
        }-${
            new Date().getHours()
        }-${
            new Date().getMinutes()
        }-${
            new Date().getSeconds()
        }.txt`

        const date = fileName.split('.')[0]

        const dataString = readFile(fileName)
        const dataArray = splitData(dataString)
        const cleanedDataArray = cleanStringArray(dataArray, '\r')
        const frames = getFrames(cleanedDataArray, getParams(pattern))
        const framesWithTimestamp = insertTimestamp(frames, date)
        
        storeData(framesWithTimestamp, saveAs)
       
    } catch (err) {
        console.log(`Erro: ${err.message}`)
    }
})()
