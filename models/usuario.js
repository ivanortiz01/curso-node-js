var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var uniqueValidator = require("mongoose-unique-validator");
var mailer = require("../mailer");
var Token = require("./token");
var crypto= require("crypto");

const saltRound = 10;

const validateEmail = function (email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

var usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        require: [true, 'El correo electronico es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor, ingrese un correo electronico valido'],
        match: [/\S+@\S+\.\S+/]
    },
    password: {
        type: String,
        requierd: [true, 'La contraseña es obligatoria']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario' });

usuarioSchema.pre("save", function (next) {
    if (this.isModified["password"]) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.enviarMensajeBienvenida = function (cb) {
    const token = new Token({
        _userID: this.id,
        token: crypto.randomBytes(16).toString('hex')
    });
    
    token.save();    

    mailer.sendMail({
        email: this.email,
        subject: 'Verificación de cuenta',
        body: `Hola, <br/> <br />
                Por favor, verificar su cuenta haga click en este enlace: <br /><br />
                http://localhost:3000/token/confirmation/${token.token}`
    });
}

module.exports = mongoose.model("usuario", usuarioSchema);