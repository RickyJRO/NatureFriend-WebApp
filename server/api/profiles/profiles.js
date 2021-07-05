const express = require("express");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");
require('dotenv').config();
const db = require("../../dbconnection");
const filespath = require("../../filesconnection");
const checkauth = require("../../middleware/check-auth")
const jwt = require('jsonwebtoken');
const perfil = express.Router();
var cron = require('node-cron');


cron.schedule('0 */6 * * *',async () => {
    console.log('Correu script');
    const sql = "SELECT user_id FROM users";
    await db.query(sql).then((resp) => {
      const users = resp.rows;
          users.sort(async (val)=>{
                const sql = "SELECT * FROM posts WHERE user_id=$1";
                await db.query(sql, [val.user_id]).then((resp) => {
                    const qnt = resp.rows.length;
                    if (qnt > 4){
                        const Bronze = "Bronze"
                        const sql = 'UPDATE users SET user_rank=$1 WHERE user_id=$2;'
                         db.query(sql, [Bronze, val.user_id])
                    }else if(qnt > 14){
                        const sql = 'UPDATE users SET user_rank=$1 WHERE user_id=$2;'
                         db.query(sql, ["Silver", val.user_id])
                    }else if(qnt > 29){
                        const sql = 'UPDATE users SET user_rank=$1 WHERE user_id=$2;'
                         db.query(sql, ["Gold", val.user_id])
                    }else if(qnt > 49){
                        const sql = 'UPDATE users SET user_rank=$1 WHERE user_id=$2;'
                         db.query(sql, ["Platinum", val.user_id])
                    }else if (qnt > 99){
                        const sql = 'UPDATE users SET user_rank=$1 WHERE user_id=$2;'
                         db.query(sql, ["Diamond", val.user_id])
                    }
                }).catch((err) => {
                    console.log(err)
                })
          })
    }).catch((err) => {
        console.log(err)
    })
});

uploadUserImage = async (files, doc) => {
    if (files.user_img != null) {
        var fileExtention = files.user_img.name.split(".").pop();
        doc.user_img = `${
            doc.user_name
        }.${fileExtention}`;
        var newpath = path.resolve(filespath) + "/" + doc.user_img;
        console.log("NEWPATH")
        console.log(newpath);

        var pathjpg = path.resolve(filespath) + "/" + doc.user_name + '.jpg';
        var pathpng = path.resolve(filespath) + "/" + doc.user_name + '.png';
        var pathgif = path.resolve(filespath) + "/" + doc.user_name + '.gif';
        var pathjfif = path.resolve(filespath) + "/" + doc.user_name + '.jfif';

        if (fs.stat(newpath)) {
            await fs.remove(newpath);
        }
        else if (fs.stat(pathjpg)) {
            await fs.remove(pathjpg);
        }
        else if (fs.stat(pathpng)) {
            await fs.remove(pathpng);
        }
        else if (fs.stat(pathgif)) {
            await fs.remove(pathgif);
        }
        else if (fs.stat(pathjfif)) {
            await fs.remove(pathjfif);
        }
        await fs.move(files.user_img.path, newpath);
        const dados = [doc.user_img, doc.user_id];
        const sql = 'UPDATE users SET user_img=$1 WHERE user_id=$2;';
        await db.query(sql, dados);
        console.log('imagem uploaded')
    }
};


perfil.put("/Perfil", checkauth, async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            console.log(fields.user_img);
            try{
                var string = (fields.user_img.split(":"))
                const token = req.headers.authorization;
                jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
                    if (err) {
                        res.redirect("/")
                    } else {
                        const userid = [fields.user_id]
                        if (decoded.id != userid) {
                            return res.status(401).json({message: 'Cross requests não funcionam!'})
                        } else {
                            async function sql(){
                            const dados = [fields.user_name, fields.user_phone, fields.user_description, fields.user_id]
                            const sql1 = 'SELECT user_id FROM users WHERE user_name=$1'
                            const dado1 = [fields.user_name]
                            const doc = await db.query(sql1, dado1)
                            if (doc.rowCount > 0) {
                                const obj = doc.rows[0];
                                if (fields.user_id != obj.user_id) {
                                    res.json({result: "error", message: "Username em uso!"});
                                } else {
                                    const sql = 'UPDATE users SET user_name=$1,user_phone=$2,user_description=$3,changed_photo=0 WHERE user_id=$4;'
                                    await db.query(sql, dados)
                                    await uploadUserImage(files, fields);
                                    res.json({result: "success", message: "Alterações Guardadas com sucesso!"});
                                }
                            } else {
                                const sql = 'UPDATE users SET user_name=$1,user_phone=$2, user_description=$3,changed_photo=0 WHERE user_id=$4;'
                                await db.query(sql, dados)
                                await uploadUserImage(files, fields);
                                res.json({result: "success", message: "Alterações Guardadas com sucesso!"});
                            }
                        }sql();
                        }
                    }
                });
            }catch{
                const token = req.headers.authorization;
                jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
                    if (err) {
                        res.redirect("/")
                    } else {
                        const userid = [fields.user_id]
                        if (decoded.id != userid) {
                            return res.status(401).json({message: 'Cross requests não funcionam!'})
                        } else {
                            async function sql(){
                            const dados = [fields.user_name, fields.user_phone, fields.user_description, fields.user_id]
                            const sql1 = 'SELECT user_id FROM users WHERE user_name=$1'
                            const dado1 = [fields.user_name]
                            const doc = await db.query(sql1, dado1)
                            if (doc.rowCount > 0) {
                                const obj = doc.rows[0];
                                if (fields.user_id != obj.user_id) {
                                    res.json({result: "error", message: "Username em uso!"});
                                } else {
                                    const sql = 'UPDATE users SET user_name=$1,user_phone=$2,user_description=$3,changed_photo=1 WHERE user_id=$4;'
                                    await db.query(sql, dados)
                                    await uploadUserImage(files, fields);
                                    res.json({result: "success", message: "Alterações Guardadas com sucesso!"});
                                }
                            } else {
                                const sql = 'UPDATE users SET user_name=$1,user_phone=$2, user_description=$3,changed_photo=1 WHERE user_id=$4;'
                                await db.query(sql, dados)
                                await uploadUserImage(files, fields);
                                res.json({result: "success", message: "Alterações Guardadas com sucesso!"});
                            }
                        }sql();
                        }
                    }
                });
            }
        
               
              
        });
    } catch (err) {
        console.log(err)
        res.json({result: "error", message: "Username ou Contacto Telefónico em uso!"});
    }
});




perfil.get("/Perfil/id/:id", checkauth, async (req, res) => {
    const sql = "SELECT user_name,user_email,user_phone,user_img,user_description,user_id,changed_photo,user_rank FROM users WHERE user_id=$1";
    await db.query(sql, [req.params.id]).then((resp) => {
        const obj = resp.rows[0];
        return  res.json(obj);
    }).catch((err) => {
        console.log(err)
    })
    
})


module.exports = perfil;
