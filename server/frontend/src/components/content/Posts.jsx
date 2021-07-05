import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import './Posts.css'
import Maps from '../google/LeafletFeed'
import swal from 'sweetalert'
import ImgVideo from './ImgVideo'
import Likes from './Likes'
import UserData from './UserData'
import sad from '../google/icon.png'
export default function Posts(props) {

    const [post, setPost] = useState(false)
    const [loader, setLoader] = useState(true)
    const[trigger, setTrigger] = useState(null)

    function parseJwt() {
        let token = localStorage.getItem('TOKEN_KEY')
        var base64Url = token.split('.')[1]
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        var jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join('')
        )

        return JSON.parse(jsonPayload)
    }

    useEffect(() => {
        let { id } = parseJwt();
        fetchData(id);
        
    }, [trigger]);

    async function fetchData(iduser) {
        console.log("fetched")
        await axios.get("/" + 'PostsUtilizador/id/' + iduser, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } }).then((res)=> {
            setPost(res.data.rows)
            setLoader(false)
        }).catch(()=> {
            swal('Erro!', 'Erro inesperado', 'error')
        });
    }

    if(loader == true){
        return(
            <>
            <div className='loader'></div>
            
            </>
        )
    }

    return (
        <div>
            <div className='userposts_container'>
                {post != false ?
                    post.map(post => (
                        <div className='PostContainer'>
                            <motion.div
                                className='PostCard'>
                                <div className="post__top" >
                                    <div>
                                        <UserData postdate={post.post_date} userid={post.user_id} />
                                        <br></br>
                                        <hr></hr>
                                    </div>
                                    <div className='PostName'>
                                        {post.post_title}
                                    </div>
                                    <div className='PostDescription'>
                                        {post.post_description}
                                    </div>
                                    <div className='UsersPostsImg'>

                                        {post.post_img != undefined ? <ImgVideo format={post.post_img.split(".").pop()} img={post.post_img} /> : ""}

                                    </div>
                                </div>
                                <div>
                                    {post.post_lat != undefined ? <Maps lat={post.post_lat} lng={post.post_lng} /> : ""}
                                </div>

                                <Likes postid={post.post_id} userid={props.userid} />

                                <motion.div
                               
                                className='Button_eliminar'>
                                <motion.button  whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }} className='Button_eliminarr' onClick={async () => {
                                    swal("Tem a certeza que deseja apagar este post?", {
                                        buttons: {
                                            nope: {
                                                text: "Voltar atrás",
                                                value: "nope"
                                            },
                                            sure: {
                                                text: "Sim, tenho a certeza",
                                                value: "sure"
                                            }
                                        }
                                    }).then(value => {
                                        switch (value) {
                                            case "sure":
                                                console.log(post.post_img)
                                                 axios
                                                    .delete("/" + 'DeletePost/' + post.post_id + '/' + post.user_id + '/' + post.post_img, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } })
                                                    .then(res => {
                                                        swal('Sucesso!', res.data.message, 'success').then(value => {
                                                            setTrigger(trigger +1)
                                                        })
                                                    })
                                                    .catch(error => {
                                                        console.log(error)
                                                        swal('Erro!', 'Erro inesperado', 'error')
                                                    })
                                        }
                                    });
                                }}>Eliminar</motion.button>
                                </motion.div>

                            </motion.div>
                        </div>
                    )
                    )
                    : <div className="semposts"><h1>Sem Posts</h1><img src={sad} className="sad" /></div>
                }

            </div>
        </div >
    )
}

