import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Maps from '../google/LeafletFeed'
import './Feed.css'
import Likes from './Likes'
import UserData from './UserData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons'
import swal from 'sweetalert'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ImgVideo from './ImgVideo'
import { motion } from 'framer-motion'
import { Button } from '@material-ui/core'
import { useInView } from 'react-intersection-observer';
import logo from '../../logo.png'
export default function Feed(props) {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false)
    const [imagevideo, setimagevideo] = useState(null);
    const [postdescription, setPostdescription] = useState(null);
    const [photoPlaced, setPhotoplaced] = useState(null)
    const [trigger,setTrigger] = useState(null)
  
    useEffect(() => {
        loadPosts();
    }, [page,trigger])

    const loadPosts = async () => {
        console.log(page)
        await axios.get("/" + 'Feed?page=' + page + '&limit=20').then((res) => {
            console.log(res.data.rows)
            if (res.data.rows < 1){
                swal('Alerta!', 'Nao existem mais posts para ser Vizualizados!').then(
                )
            }
            else{
                setPosts([...posts, ...res.data.rows])  
                setLoading(false);
            }
            
        }).catch(() => {
            swal('Erro!', 'Erro na Conexão!').then(
                )
        });
    }

    async function submitForm(formData) {
        await axios
            .post('/CriarPost', formData,{ headers: { Authorization:localStorage.getItem('TOKEN_KEY') } })
            .then(res => {
                if (res.data.result === 'success') {
                    swal('Sucesso!', 'Post publicado com sucesso!', 'success').then(
                        setTrigger(trigger + 1),
                        setPostdescription("")
                    )
                } else if (res.data.result === 'error') {
                    swal('Erro!', res.data.message, 'error')
                }
            })
            .catch(error => {
                swal('Erro!', 'Erro inesperado', 'error')
            })
    }


    const postPost = (e) => {
        if(postdescription == ""){
            e.preventDefault();
            swal('Erro!', 'Precisa de inserir uma descrição!', 'error');
                return
            
        }else if(postdescription == null){
            e.preventDefault();
            swal('Erro!', 'Precisa de inserir uma descrição!', 'error');
                return
        }else{
            e.preventDefault();
            let formData = new FormData();
            formData.append('user_id', props.userid)
            formData.append('post_description', postdescription)
            formData.append('post_imgs', imagevideo)
            submitForm(formData)    
        }
        
    };


    if(loading == true){
        return (
            <div className='loader'>
            </div>
        )
    }
    return (
        <>
        <div className='Feed' >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            id='scrollableDiv'
            className="postsfeed__container"
            >
            <div className='writePostContainer'>
                <form>
                    <div className='writePostCard'>
                        <div className='writePostTop'>
                            <div className="write__post">
                                <img className='postUserImg' src={props.googleImage ? props.googleImage : props.avatar}/>
                            </div>
                            <div className='writePostInputContainer'>
                                <input type='textt' className='writePostInput' placeholder={"Partilhe a sua notícia, " + props.user} onChange={(event) => setPostdescription(event.target.value)} />
                            </div>
                        </div>

                        <hr></hr>
                        <div className='writePostButtonContainer'>
                            <div className='writePostFotoVideo'>
                                <FontAwesomeIcon icon={faPhotoVideo} size="lg" color="#77ce20" />
                                <label htmlFor="post_imgvideo" className='label_imgvideo' >
                                   {photoPlaced ==null ? "Foto/Video" : "Foto Selecionada"}
                              </label>
                                <input
                                    type='file'
                                    className='buttonFotoVideo'
                                    onChange={e => {
                                        e.preventDefault()
                                        setimagevideo(e.target.files[0])
                                        setPhotoplaced(true)
                                    }}
                                    accept='image/*|video/*'
                                    id='post_imgvideo'
                                />
                            </div>
                            <div className='writePostPublicar'>
                                <button type="submit" onClick={postPost}>Publicar</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {posts &&
                posts.map(post => (
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
                                    {post.post_title }
                                </div>
                                <div className='PostDescription'>
                                    {post.post_description}
                                </div>
                                <div className='UsersPostsImg'>

                                    {post.post_img != undefined ? <ImgVideo format={post.post_img.split(".").pop()} img={post.post_img} /> : ""}

                                </div>
                            </div>
                           
                            {post.post_lat != undefined ? <div className="postMap"><Maps  lat={post.post_lat} lng={post.post_lng} /></div>: ""}
                            
                           
                                    <Likes postid={post.post_id} userid={props.userid}/>
                        </motion.div>
                    </div>
                )
                )
            }
            <div className="button__container">
                <motion.button
                whileHover={{scale:1.1}}
                onTap={{scale:0.9}}
                className="buttonload" onClick={()=> setPage(page + 1)}>Carregar Posts</motion.button>
            </div>
        
            {loading2 && <div className='loader'></div>}
      
        </motion.div>
       
        </div>
        
        </>
    )
}
