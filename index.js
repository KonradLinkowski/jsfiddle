const axios = require('axios')
const express = require('express')
const app = express()
const { resolve } = require('path')

const base = 'https://jsfiddle.net'

app.get('/public/:file', (req, res) => {
  const path = resolve(__dirname, 'public', req.params.file)
  res.sendFile(path)
})

app.get('/jshell/:id', async (req, res) => {
  const url = `http://fiddle.jshell.net/${req.params.id}/show/?editor_console=`
  console.log(url)
  try {
    const { data } = await axios.get(url, {
      headers: {
        referer: 'https://jsfiddle.net/'
      }
    })
    res.send(data)
  } catch (error) {
    console.error(error.response.statusText)
    res.sendStatus(error.response.status)
  }
})

app.get('*', async (req, res) => {
  const url = base + req.originalUrl
  try {
    const { data, headers } = await axios.get(url)
    res.set(headers)
    if (headers['content-type'].includes('html')) {
      const html = data
        .replace(/<head>/, `<head>\n<script defer src="/public/iframe.js"></script>`)
        .replace(/<\/head>/, `\n<link rel="stylesheet" type="text/css" href="/public/style.css"\n</head>`)
      res.send(html)
    } else {
      res.send(data)
    }
  } catch (error) {
    console.error('cannot get', url)
    res.sendStatus(error.response.status)
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('started')
})
