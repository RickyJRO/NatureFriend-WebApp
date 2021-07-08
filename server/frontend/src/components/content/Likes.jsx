import React, { useState, useEffect } from 'react'
import axios from 'axios'
import WarningIcon from '@material-ui/icons/Warning';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import {motion} from "framer-motion"

function Likes(props) {
    const [likes, setLikes] = useState(null);
    const [dislikes, setDislikes] = useState(null);
    const [liked, setLiked] = useState(null);
    const [disliked, setDisliked] = useState(null)

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

    const getPostLikes = async (postid, userid) => {
        await axios
            .get('/getLikes/' + postid + '/' + userid, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } })
            .then(res => {
                if (res.data.like == "dado" && res.data.dislike == "dado") {
                    setLikes(res.data.likes)
                    setDislikes(res.data.dislikes)
                    setLiked(true)
                    setDisliked(true)
                } else if (res.data.like == "dado") {
                    setLikes(res.data.likes)
                    setDislikes(res.data.dislikes)
                    setLiked(true)
                } else if (res.data.dislike == "dado") {
                    setLikes(res.data.likes)
                    setDislikes(res.data.dislikes)
                    setDisliked(true)
                } else {
                    setLikes(res.data.likes)
                    setDislikes(res.data.dislikes)
                }

            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        let { id } = parseJwt();
        getPostLikes(props.postid, id)
    }, [])


    async function setPostLike(postid, userid) {
        if(props.useridd){
            await axios.post("/" + 'LikePost/' + postid + '/' + props.useridd, {}, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } })
            .then(res => {
                if (res.data.result == "likedado") {
                    setLikes(likes - 1)
                    setLiked(false)
                } else {
                    setLikes(likes + 1)
                    setLiked(true)
                }
                
            })
            .catch(error => { console.log(error) })
        }else{
            await axios.post("/" + 'LikePost/' + postid + '/' + userid, {}, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } })
            .then(res => {
                if (res.data.result == "likedado") {
                    setLikes(likes - 1)
                    setLiked(false)
                } else {
                    setLikes(likes + 1)
                    setLiked(true)
                }
              
            })
            .catch(error => { console.log(error) })
        }
            
        
        
    }
    async function setPostDislike(postid, userid) {
       if(props.useridd){
        await axios.post("/" + 'DislikePost/' + postid + '/' + props.useridd, {}, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } })
        .then(res => {
            if (res.data.result == "dislikedado") {
                setDislikes(dislikes - 1)
                setDisliked(false)
            } else {
                setDislikes(dislikes + 1)
                setDisliked(true)
            }
            
        })
        .catch(error => { console.log(error) })
    }else{
        await axios.post("/" + 'DislikePost/' + postid + '/' + userid, {}, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } })
            .then(res => {
                if (res.data.result == "dislikedado") {
                    setDislikes(dislikes - 1)
                    setDisliked(false)
                } else {
                    setDislikes(dislikes + 1)
                    setDisliked(true)
                }
                
            })
            .catch(error => { console.log(error) })
    }
            
       
        
    }

    return (
        <div>

            <div className="post__bottom">
                {liked == true ?
                    <div className="postbottom_left" >
                        <motion.div
                        whileHover={{ scale: 1.25, cursor:"pointer" }}
                        whileTap={{ scale: 0.5 }}
                        >
                        <ThumbUpAltIcon style={{ fontSize: 38, color: '#6fc41a', }}  onClick={() => setPostLike(props.postid, props.userid)}/>
                        </motion.div>
                        <div className="likes_left">
                            <p classname='likes' onClick={() => setPostLike(props.postid, props.userid)}>{likes}</p>
                        </div>
                    </div> : <div className="postbottom_left" onClick={() => setPostLike(props.postid, props.userid)}>
                        <motion.div
                        whileHover={{ scale: 1.25, cursor:"pointer" }}
                        whileTap={{ scale: 0.5 }}
                        >
                        <ThumbUpAltIcon style={{ fontSize: 38, color: 'grey', }} />
                        </motion.div>
                        <div className="likes_left">
                            <p classname='likes'>{likes}</p>
                        </div>

                    </div>}
                {disliked == true ? <div className="postbottom_right" >
                <motion.div
                        whileHover={{ scale: 1.25, cursor:"pointer" }}
                        whileTap={{ scale: 0.5 }}
                        >
                    <ThumbDownAltIcon style={{ fontSize: 38, color: 'red', }} classname='posticon_alert' onClick={() => setPostDislike(props.postid, props.userid)} />
                    </motion.div>
                    <div className="likes_right" onClick={() => setPostDislike(props.postid, props.userid)}>
                        <p classname='likes'>{dislikes}</p>
                    </div>

                </div> : <div className="postbottom_right" onClick={() => setPostDislike(props.postid, props.userid)}>
                    <motion.div
                        whileHover={{ scale: 1.25, cursor:"pointer" }}
                        whileTap={{ scale: 0.5 }}
                        >
                    <ThumbDownAltIcon style={{ fontSize: 38, color: 'grey', }}  classname='posticon_alert' />
                    </motion.div>
                    <div className="likes_right">
                        <p classname='likes'>{dislikes}</p>
                    </div>

                </div>}

            </div>
        </div>


    )
}

export default Likes
