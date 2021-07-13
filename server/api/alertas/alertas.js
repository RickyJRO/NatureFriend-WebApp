const path = require("path");
const fs = require("fs-extra");
const express = require("express");
const formidable = require("formidable");
const db = require("../../dbconnection");
require('dotenv').config();
const postspath = require("../../postsconnection");
const jwt = require('jsonwebtoken');
const { json } = require("express");
const alerta = express.Router();

uploadPostImage = async (files, doc, postid) => {
    if (files.post_imgs != null) {
        try{
        //Definir nome do Ficheiro
        var fileExtention = files.post_imgs.name.split(".").pop();
        doc.post_imgs = `${postid}.${fileExtention}`;

        //Definir o local onde se vai guardar
        var newpath = path.resolve(postspath) + "/" + doc.post_imgs;

        //Guardo o Ficheiro
        await fs.move(files.post_imgs.path, newpath);

        //Atualizo o Path na base de dados
        const dados = [doc.post_imgs, postid];
        const sql = 'UPDATE posts SET post_img=$1 WHERE post_id=$2;';
        await db.query(sql, dados);
        console.log('imagem uploaded')
        }catch{
            console.log("error")
        }
       
    }
};

async function sql(fields,files) {
        console.log(new Date());
        
        const dados = [
            fields.post_title,
            fields.post_description,
            fields.post_lat,
            fields.post_lng,
            fields.user_id,
            new Date(),
        ];

        const sql = "INSERT INTO posts(post_title,post_description,post_lat,post_lng,user_id,post_date) VALUES ($1,$2,$3,$4,$5,$6)";
        await db.query(sql, dados);
        const dados2 = [fields.user_id, fields.post_title, fields.post_lat, fields.post_lng];
        if(fields.post_lat != null){
            const sql1 = "SELECT post_id from posts WHERE user_id=$1 AND post_title=$2 AND post_lat=$3 AND post_lng=$4";
            const postidquery = await db.query(sql1, dados2);
            const obj = postidquery.rows[0]
            const idpost = obj["post_id"]
            await uploadPostImage(files, fields, idpost);
            return json({submitted:"true"})
        }else{
            const dados3= [fields.user_id, fields.post_description]
            const sql1 = "SELECT post_id from posts WHERE user_id=$1 AND post_description=$2";
            const postidquery = await db.query(sql1, dados3);
            const obj = postidquery.rows[0]
            const idpost = obj["post_id"]
            await uploadPostImage(files, fields, idpost);
            return json({submitted:"true"})
        } 
    }


alerta.get("/defaultimgpost", async (req, res) => {
    res.sendFile(path.join(postspath, "/grey.jpg"))
})

alerta.post("/CriarAlerta", async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const token = req.headers.authorization;
            jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
                if (err) {
                    res.redirect("/")
                } else {
                    const userid = [fields.user_id]
                    if (decoded.id != userid) {
                        return res.status(401).json({message: 'Cross requests não funcionam!'})
                    } else {
                        sql(fields,files).then((resp) => {
                            console.log(resp)
                            res.json({result: "success", message: `Alerta publicado com sucesso!`});
                        }).catch((err) => {
                            console.log(err)
                        })
                    }  
                }
            });
        });
    } catch (err) {
        res.json({result: "error", message: "Username ou Contacto Telefónico em uso!"});
    }
});


module.exports = alerta
