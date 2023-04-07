require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

const Autor = require('./Autor')

app.get('/', (req, res) => {
    res.status(200).json({msg: "Ola Mundo"})
})

app.post('/auth/login', async (req, res) => {

    const {email, senha} = req.body

    if(!email) {
        return res.status(422).json({msg: "Email obrigatorio"})
    }
    if(!senha) {
        return res.status(422).json({msg: "Senha obrigatorio"})
    }

    const autor = await Autor.findOne({email: email})

    if(!autor){
        return res.status(404).json({msg: "email não cadastrado"})
    }

    const checkSenha = await bcrypt.compare(senha,autor.senha )

    if(!checkSenha){
        return res.status(422).json({msg: "senha incorreta"})
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({id: autor._id}, secret)

        res.status(200).json({msg: "login com sucesso", token})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error})
    }

    
})


app.post('/auth/register', async(req, res) => {

    const {nome, email, senha, confirmesenha} = req.body

    if(!nome) {
        return res.status(422).json({msg: "Nome obrigatorio"})
    }
    if(!email) {
        return res.status(422).json({msg: "Email obrigatorio"})
    }
    if(!senha) {
        return res.status(422).json({msg: "Senha obrigatorio"})
    }
    if(senha !== confirmesenha) {
        return res.status(422).json({msg: "Senhas diferentes"})
    }

    const autorExists = await Autor.findOne({email: email})

    if(autorExists){
        return res.status(422).json({msg: "email cadastrado"})
    }

    const salt = await bcrypt.genSalt(2)
    const senhaHash = await bcrypt.hash(senha, salt)

    const autor = new Autor({nome, email, senha: senhaHash})
    try {
        await autor.save()
        res.status(201).json({msg: "criado com sucesso"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error})
    }


})


mongoose.connect('mongodb://127.0.0.1:27017/teste').then(() => {
    app.listen(3000)
    console.log("Conectado")
}).catch((error) => console.log(error))

