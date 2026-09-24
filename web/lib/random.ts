

export const Name = (length: number) => {

    const result = []

    for(let index = 0; index < length; index++) result.push(String.fromCharCode(Math.floor(Math.random() * (122 - 97) + 97)))

    return result.join('')

}