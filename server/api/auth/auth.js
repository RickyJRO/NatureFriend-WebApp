const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const db = require("../../dbconnection");
require('dotenv').config();



const router = express.Router();

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

router.get("/activation/:token", async (req, res) => {
    let token = req.params.token;
    if (token) {
        const dados = ["active", "", token];
        const sql = 'UPDATE users SET status=$1,activated_token=$2 WHERE activated_token = $3;';
        await db.query(sql, dados);
        return res.redirect("http://localhost:5000");
    }
});

router.post("/registo", async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const {username, email} = req.body

        const token = jwt.sign({
            username,
            email
        }, process.env.JWT_ACCOUNT_ACTIVATION);

        const sql1 = "SELECT 1 FROM users WHERE user_name=$1"
        const dadosqli1 = [req.body.username]
        const checkuser = await db.query(sql1,dadosqli1);
        console.log(checkuser)
        if (checkuser.rowCount > 0){
            res.json({result: "error", message: "Username em uso!"});
        }else{
        const sql2 = "SELECT 1 FROM users WHERE user_email=$1"
        const dadosql2= [req.body.email]
        const checkemail = await db.query(sql2,dadosql2);

        if (checkemail.rowCount > 0){
            res.json({result: "error", message: "Email em uso!"});
        }else{
            const tokenuser = token;
            const dados = [req.body.username, req.body.email, req.body.password, tokenuser]
            const sql = 'INSERT INTO users(user_name, user_email, user_password, activated_token) VAlUES ($1,$2,$3,$4);'
            await db.query(sql, dados)

            let mailOptions = {
                from: process.env.MAIL_FROM,
                to: email,
                subject: 'Confirmação do Registo',
                text: "Geolert",
                html: `<div className="email" style="
                        font-family: sans-serif;
                        ">
                        <h2>Bem vindo à NatureFriend</h2>
                        <h3>O seu registo está quase!</h3>
                        <p>Carregue no link seguinte para confirmar a sua conta!</p>
                        <a href="http://localhost:5000/activation/${token}">Confirmação do Registo</a>
                    
                        </div>
            `
            };
            
            transport.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log("Error " + err);
                } else {
                    console.log("Email enviado com sucesso");
                }
            });

            res.json({result: "success", message: `Email enviado para (${email}) Por favor confirme a sua conta!`});
            }
            }
    } catch (err) {
        console.log(err)
        res.json({result: "error", message: "Erro no Servidor"});
    }
})
router.post("/googleLogin", async(req,res)=>{
    console.log(req.body)
    const sql = "SELECT * FROM users WHERE user_email=$1";
    const doc = await db.query(sql, [req.body.email]);
    
    if (doc.rowCount > 0) {
        const obj = doc.rows[0];
        if(req.body.googleId == null){
            return
        }else if (doc.rows[0].google_id == null){
            const sql = "UPDATE users SET google_id=$1 WHERE user_id=$2"
            await db.query(sql, [req.body.googleId,doc.rows[0].user_id]).then((resc)=>{
                const payload = {
                    id: obj.user_id,
                    username: obj.user_name
                };
                let token = jwt.sign(payload, process.env.JWT_ACCOUNT_ACTIVATION);
                res.json({result: "success", token, message: "Login efetuado com sucesso!"});
            }).catch(err=>{
                console.log(err)
            })
        }
        else{
            const payload = {
                id: obj.user_id,
                username: obj.user_name
            };
            let token = jwt.sign(payload, process.env.JWT_ACCOUNT_ACTIVATION);
            res.json({result: "success", token, message: "Login efetuado com sucesso!"});
        }
    } else { 
        const dados = [req.body.name, req.body.email, req.body.imageUrl, req.body.googleId,0 ]
            const sql = 'INSERT INTO users(user_name, user_email,user_img,google_id,changed_photo ) VAlUES ($1,$2,$3,$4,$5);'
            const obj = await db.query(sql, dados).then(async ()=>{
                const sql = "SELECT * FROM users WHERE user_email=$1";
                const doc = await db.query(sql, [req.body.email]).then((ress)=>{
                    console.log(ress.rows[0])
                    const obj = ress.rows[0];
                    const payload = {
                        id: obj.user_id,
                        username: obj.user_name
                    };
                    let token = jwt.sign(payload, process.env.JWT_ACCOUNT_ACTIVATION);
                    res.json({result: "success", token, message: "Login efetuado com sucesso!"});
                }).catch((res)=>{
                    console.log(res)
                })
                
            })
    }
});
router.post("/login", async (req, res) => {
    console.log(req.body)
    const sql = "SELECT * FROM users WHERE user_email=$1";
    const doc = await db.query(sql, [req.body.email]);
    if (doc.rowCount > 0) {
        const obj = doc.rows[0];
        if (bcrypt.compareSync(req.body.password, obj.user_password)) {
            if (obj.status != "not_activated") {
                const payload = {
                    id: obj.user_id,
                    username: obj.user_name
                };
                let token = jwt.sign(payload, process.env.JWT_ACCOUNT_ACTIVATION);
                res.json({result: "success", token, message: "Login efetuado com sucesso!"});
            } else {
                return res.json({result: 'error', message: 'Precisa de ativar a sua conta primeiro'})
            }
        } else { 
            res.json({result: "error", message: "Email ou Password Incorretos"});
        }
    } else { 
        res.json({result: "error", message: "Email ou Password Incorretos"});
    }
});


router.post("/password-reset", async (req, res) => {
    const email = [req.body.email];
    const sql = "Select * from users WHERE user_email=$1"
    const doc = await db.query(sql, email)
    const obj = doc.rows[0];
    if (doc.rowCount > 0) {
        const token = jwt.sign({
            id: obj.user_id,
            username: obj.user_name
        }, process.env.JWT_RESET_PASSWORD, {expiresIn: "60m"})

        let mailOptions = {
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Pedido de alteração da password',
            text: "Geolert",
            html: `<div className="email" style="
                    font-family: sans-serif;
                    ">
                    <h3>Use o link seguinte para mudar a sua password!</h3>
                    <a href="https://naturefriend.herokuapp.com/password/reset/${token}">Alterar Password</p></a>
                    <hr />
                    <p>Este link tem a validade de 1 dia</p>
                    </div>
                `
        };
        const sql1 = "UPDATE users SET resetpassword_token=$1 where user_id=$2"
        const dados2 = [token, obj.user_id]
        const doc1 = await db.query(sql1, dados2)
        console.log(doc1)
        if (doc1) {
            transport.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log("Error " + err);
                    return res.json({result: "error", message: err.message});
                } else {
                    console.log("Email enviado com sucesso");
                    return res.json({result: "success", message: `E-mail enviado para ${email} , Siga as instruções para alterar a sua palavra-passe`});
                }
            });
        } else {
            return res.status(400).json({result: "error", message: "Erro!"});
        }
    } else {
        return res.json({result: "error", message: "Email não encontrado!"});
    }
})

router.put("/password/reset", async (req, res) => {
    const {password} = req.body;
    let resetPasswordToken = req.query.token;
    if (resetPasswordToken) {
        jwt.verify(resetPasswordToken, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
            if (err) {
                return res.json({result: "error", message: "Link expirado. Tente novamente"});
            }
        });
        let encrypt_pass = await bcrypt.hash(password, 8);
        const dados = [encrypt_pass, "", resetPasswordToken];
        const sql = "UPDATE users SET user_password=$1, resetpassword_token=$2 WHERE resetpassword_token=$3"
        const doc = await db.query(sql, dados)
        if (doc) {
            return res.json({result: "success", message: "Password alterada com sucesso!"})
        } else {
            return res.json({result: "error", message: "Utilizador não encontrado"});
        }
    } else {
        return res.json({result: "error", message: "Utilizador não encontrado"});
    }
});

module.exports = router;