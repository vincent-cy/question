let a = []

const moment = require('moment')

const b = a.map(i=>({
    name:i.name,
    address: i.address,
    phone: i.phoneNumber,
    date: moment(new Date(i.meta.createAt)).format("YYYY,M,D, h:mm:ss a")
}))

const fs = require('fs')

fs.writeFile('./jj.json',JSON.stringify(b),{},(e)=>console.log('e', e))
