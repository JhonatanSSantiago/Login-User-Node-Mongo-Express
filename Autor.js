const mongoose = require('mongoose')

const Autor = mongoose.model('Autor', {
    name: String,
    email: String,
    senha: String
})

module.exports = Autor

