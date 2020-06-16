require('dotenv').config();

const axios = require('axios');
const formData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');


const form = new formData()

const getJson = async () => {
   try {
    const response = await axios.get(process.env.GET_URL)
    console.log(response.data)
    fs.writeFileSync('./answer.json', JSON.stringify(response.data, null, 2));

   }
   catch(err) {
       console.error(`error: ${err}`)
   }
}

const pathJson = path.resolve(__dirname, 'answer.json')

const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let decodedLetter = ''
const key = 6
const message = "znk hkyz ktmotkkxy o qtuc gxk gxzoyzy gz nkgxz. znk hkyz jkyomtkxy o qtuc gxk ykixkzre zkintoiogty gy ckrr. gtjxko nkxgyosinaq"

const check = (character, letters) => {
    if(letters.indexOf(character) > -1) {
        return {
            status:true,
            character
        }
    } else {
        return {
            status:false,
            character
        }
    }
}

const getPosition = (letters, key, verify) => {
    const { status, character} = verify
   if(status == true) {
    const position = letters.indexOf(character)
    const search = position - key
    
    if(search < 0) {
       const positionDecoded = letters.length + search
       const characterDecoded = letters[positionDecoded]
       return characterDecoded

   }else {
    const characterDecoded = letters[search]
    return characterDecoded
   }
   } else {
       return character
   }
   
}
 const decrypt = (message, key) => {
    for(let i = 0; i < message.length; i++) {
        const character = message[i]
    
           const verify = check(character,letters)
           const result = getPosition(letters, key, verify)
            decodedLetter += result

    
    }
    return decodedLetter
}


const saveJson = () => {
    fs.readFile(pathJson, (err, data) => {
        if (err) {
          throw err
        }
        const dataJson = JSON.parse(data)
        const result = decrypt(message, key)
        dataJson['decifrado'] = result
        fs.writeFileSync(pathJson, JSON.stringify(dataJson), err => {
          if (err) {
            console.log(err)
          } else {
            console.log('Saved file')
          }
        })
        return result
      })
}

const cryptoText = text => {
    const msg = crypto
    .createHash('sha1')
    .update(text)
    .digest('hex')

  return msg
}


const cryptoSha1 = () => {
    fs.readFile(pathJson, (err, data) => {
        if (err) {
          throw err
        }
        const dataJson = JSON.parse(data)
        const result = cryptoText(dataJson.decifrado)
        dataJson['resumo_criptografico'] = result
        fs.writeFileSync(pathJson, JSON.stringify(dataJson), err => {
          if (err) {
            console.log(err)
          } else {
            console.log('Saved file')
          }
        })
        return result
      })
}

form.append('answer', fs.createReadStream(pathJson), {
  filename: 'answer.json'
})

const sendJson = async () => {
  try {
    const response = await axios.post(process.env.SUBMIT_URL, form, {
      headers: form.getHeaders()
     })
    //  console.log(`Upload successful!  Server responded with: ${response.data}`)
    console.log(response)
  }
  catch(err) {
    console.error(`upload failed: ${err}`)
  }

}

// getJson()
// saveJson()
// cryptoSha1()
sendJson()