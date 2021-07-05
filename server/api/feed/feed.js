const path = require("path");
const fs = require("fs-extra");
const formidable = require("formidable");
const express = require("express");
const db = require("../../dbconnection");
require('dotenv').config();
const postspath = require("../../postsconnection");
const feed = express.Router();
const checkauth = require("../../middleware/check-auth")
const jwt = require('jsonwebtoken');

feed.get("/getLikes/:post_id/:userid", checkauth, async (req, res) => {
    const sqllike = "SELECT * FROM likes where user_id=$1 AND post_id=$2"
    const dados = [req.params.userid, req.params.post_id,];
    const doclikes = await db.query(sqllike, dados);
    if (doclikes.rowCount > 0) {
        const sqllike = "SELECT * FROM dislikes where user_id=$1 AND post_id=$2"
        const dados = [req.params.userid, req.params.post_id,];
        const docdislikes = await db.query(sqllike, dados);
        if (docdislikes.rowCount > 0) {
            const sql = "SELECT * FROM likes where post_id=$1"
            const doc = await db.query(sql, [req.params.post_id]);
            const sql1 = "SELECT * FROM dislikes where post_id=$1"
            const doc1 = await db.query(sql1, [req.params.post_id])
            res.json({likes: doc.rowCount, dislikes: doc1.rowCount, like:"dado", dislike:"dado"})
        } else {
            const sql = "SELECT * FROM likes where post_id=$1"
            const doc = await db.query(sql, [req.params.post_id]);
            const sql1 = "SELECT * FROM dislikes where post_id=$1"
            const doc1 = await db.query(sql1, [req.params.post_id])
            res.json({likes: doc.rowCount, dislikes: doc1.rowCount, like:"dado"})
        }
    } else {
        const sqllike = "SELECT * FROM dislikes where user_id=$1 AND post_id=$2"
        const dados = [req.params.userid, req.params.post_id,];
        const docdislikes = await db.query(sqllike, dados);
        if (docdislikes.rowCount > 0) {
            const sql = "SELECT * FROM likes where post_id=$1"
            const doc = await db.query(sql, [req.params.post_id]);
            const sql1 = "SELECT * FROM dislikes where post_id=$1"
            const doc1 = await db.query(sql1, [req.params.post_id])
            res.json({likes: doc.rowCount, dislikes: doc1.rowCount, dislike:"dado"})
        } else {
            const sql = "SELECT * FROM likes where post_id=$1"
            const doc = await db.query(sql, [req.params.post_id]);
            const sql1 = "SELECT * FROM dislikes where post_id=$1"
            const doc1 = await db.query(sql1, [req.params.post_id])
            res.json({likes: doc.rowCount, dislikes: doc1.rowCount})
        }
    }
})

feed.get("/PostsUtilizador/id/:id", checkauth, async (req, res) => {
    const sql = "SELECT * FROM posts WHERE user_id=$1 ORDER BY post_id DESC"
    const doc = await db.query(sql, [req.params.id]);
    res.json(doc);
})

feed.post("/DislikePost/:postid/:userid", async (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
            res.redirect("/")
        } else {
            const userid = [req.params.userid]
            if (decoded.id != userid) {
                return res.status(401).json({message: 'Cross requests não funcionam!'})
            } else {
                async function checkdislike() {
                    const dados = [req.params.userid, req.params.postid,];
                    const sql = "SELECT * FROM dislikes where user_id=$1 AND post_id=$2"
                    const doc = await db.query(sql, dados);
                    if (doc.rowCount > 0) {
                        const sql = "DELETE FROM dislikes WHERE user_id=$1 AND post_id=$2"
                        const dados = [req.params.userid, req.params.postid,];
                        await db.query(sql, dados)
                        return res.json({result: "dislikedado"})
                    } else {
                        const dados = [req.params.userid, req.params.postid,];
                        const sql = "INSERT INTO dislikes (user_id,post_id) values ($1,$2)";
                        await db.query(sql, dados);
                        return res.json({result: "success", message: `Dislike com sucesso`});
                    }
                }
                checkdislike();
            }
        }
    })

});

feed.post("/LikePost/:postid/:userid", async (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
            res.redirect("/")
        } else {
            const userid = [req.params.userid]
            if (decoded.id != userid) {
                return res.status(401).json({message: 'Cross requests não funcionam!'})
            } else {
                async function checklike() {
                    const dados = [req.params.userid, req.params.postid,];
                    const sql = "SELECT * FROM likes where user_id=$1 AND post_id=$2"
                    const doc = await db.query(sql, dados);
                    if (doc.rowCount > 0) {
                        const sql = "DELETE FROM likes WHERE user_id=$1 AND post_id=$2"
                        const dados = [req.params.userid, req.params.postid,];
                        await db.query(sql, dados)
                        return res.json({result: "likedado"})
                    } else {
                        const dados = [req.params.userid, req.params.postid,];
                        const sql = "INSERT INTO likes (user_id,post_id) values ($1,$2)";
                        await db.query(sql, dados);
                        return res.json({result: "success", message: `Like com sucesso`});
                    }
                }
                checklike();
            }
        }
    })

});



feed.delete("/DeletePost/:id/:userid/:postimg", async (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
            res.redirect("/")
        } else {
            const userid = [req.params.userid]
            const img=req.params.postimg
            if (decoded.id != userid) {
                return res.status(401).json({message: 'Cross requests não funcionam!'})
            } else {
                async function sql() {
                    const sql = "DELETE FROM posts WHERE post_id=$1"
                    const doc = await db.query(sql, [req.params.id]);
                    if (doc) {
                        var newpath = path.resolve(postspath) + "/" + img;
                        if (fs.stat(newpath)) {
                            await fs.remove(newpath);
                        }
                        return res.json({result: "success", message: `Post apagado com sucesso`});
                    } else {
                        return res.json({result: "error", message: `Erro`});
                    }
                }
                sql();
            }
        }
    })
});

feed.get("/Feed", async (req, res) => {
    try {
            const page = req.query.page
            const limit = req.query.limit
            const startIndex = (page - 1) * limit
            const dados = [limit, startIndex]
            const sql = "SELECT * FROM posts ORDER BY post_id DESC LIMIT $1 OFFSET $2"
            const doc = await db.query(sql, dados).then((resp) => {
                return res.json(resp);
            }).catch((err)=>{
                console.log(err)
            })   
        } catch(err){
            console.log(err)}}
);

feed.post("/CriarPost", async (req, res) => {
    try {
    var form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                const token = req.headers.authorization;
                    if (token) {
                        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
                            if (err) {
                                    res.redirect("/")
                                } else {
                                    if (decoded.id != fields.user_id) {
                                        return res.status(401).json({message: 'Cross requests não funcionam!'})
                                    } else {
                                        try {
                                            async function execute() {
                                                const dados = [fields.post_description, fields.user_id, new Date(),];
                                                const sql = "INSERT INTO posts(post_description,user_id,post_date) VALUES ($1,$2,$3)";
                                                await db.query(sql, dados);
                                                const dados2 = [fields.user_id, fields.post_description]
                                                const sql1 = "SELECT post_id from posts WHERE user_id=$1 AND post_description=$2";
                                                const postidquery = await db.query(sql1, dados2);
                                                const obj = postidquery.rows[0]
                                                const idpost = obj["post_id"]
                                                await uploadPostImage(files, fields, idpost);
                                                res.json({result: "success", message: `Alerta publicado com sucesso!`});
                                            }
                                            execute();
                                        } catch {
                                            res.json(
                                                {result: "error", message: "Erro ao publicar!"}
                                            );
                                        }}
                                }
                            }
                        )} else {
                        return res.status(401).json({message: 'Autenticação Falhada2'})
                    }
                }
            )} catch {
            return res.status(401).json(
                {message: 'Autenticação Falhada1'}
            )
        }}
);
uploadPostImage = async (files, doc, postid) => {
    if (files.post_imgs != null) {
        var fileExtention = files.post_imgs.name.split(".").pop();
        doc.post_imgs = `${postid}.${fileExtention}`;
        var newpath = path.resolve(postspath) + "/" + doc.post_imgs;
        if (fs.stat(newpath)) {
            await fs.remove(newpath);
        }
        await fs.move(files.post_imgs.path, newpath);
        const dados = [doc.post_imgs, postid];
        const sql = 'UPDATE posts SET post_img=$1 WHERE post_id=$2;';
        await db.query(sql, dados);
        console.log('imagem uploaded')
    }
};
module.exports = feed;
