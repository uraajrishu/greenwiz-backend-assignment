const Axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const mime = require('mime-types')
const http = require('https')

async function getImagesFromUrl() {  //return images from url
  const url = 'https://www.growpital.com/'
  const response = await Axios.get(url)
  // console.log(response.data)
  const $ = cheerio.load(response.data);
  let temp = [];
  $("img").each((i, e) => {
    temp.push($(e).attr('src'))
  })
  // return temp
  return [...new Set(temp)]
}

async function downloadFile(url) {//Each images from url
  try {
    var resource = http.get(url, (res, err) => {
      if (err) return console.log(err.message);
      //console.log(res["_httpMessage"])
      let contentType = mime.extension(res.headers["content-type"]);
      console.log(contentType)
      let fileType = res.headers["content-type"].split("/")
      if (fileType[0] != "image") return console.log("Invalid Url");
      let rootePath = `./Downloads/imageFile_${new Date().getTime()}.${contentType}`
      console.log("Images downloaded successfully")
      return res.pipe(fs.createWriteStream(rootePath))
    })
  } catch (err) {
    return console.log(err)
  }
}

async function root() {
  let arr = await getImagesFromUrl()
  for (let img of arr) {
    await downloadFile(img)
  }
}
root()