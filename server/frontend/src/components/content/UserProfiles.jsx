import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import UserData from './UserData';
import ImgVideo from './ImgVideo';
import Maps from '../google/LeafletFeed';
import Likes from './Likes'
import './UserProfiles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import { faLeaf} from '@fortawesome/free-solid-svg-icons'
import { faSmog} from '@fortawesome/free-solid-svg-icons'
import { faHiking} from '@fortawesome/free-solid-svg-icons'
import { faGem} from '@fortawesome/free-solid-svg-icons'
import sad from '../google/icon.png'

export default function UserProfiles(props) {
    const { id } = useParams();
    const [userName, setUsername] = useState(null)
    const [userEmail, setUserEmail] = useState(null)
    const [userPhone, setUserPhone] = useState(null)
    const [rank,setUserRank]= useState(null)
    const [userDescription, setUserDescription] = useState(null)
    const [posts, setPosts] = useState(null)
    const [loader, setLoader] = useState(true)
    const [userImg,setUserImg]= useState(null)
    const [googleImage, setGoogleImage]= useState(null)

        async function fetchPosts(id) {
            await axios.get("/" + 'PostsUtilizador/id/' + id, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } }).then((res)=> {
                setPosts(res.data.rows)
                setLoader(false)
            }).catch((err)=> {
                console.log(err)
            });
        }        

    const fetchData = async id => {
        try {
            const response = await axios.get('/Perfil/id/' + id, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } }).then((res)=>{
                console.log(res.data.user_rank)
                setUsername(res.data.user_name)
                setUserEmail(res.data.user_email)
                setUserPhone(res.data.user_phone)
                setUserDescription(res.data.user_description)
                setUserRank(res.data.user_rank)
                if(res.data.changed_photo == 0){
                    setGoogleImage(res.data.user_img)
                }else{
                    setUserImg('/' + res.data.user_img)
                }
            }).catch((err)=> {
                console.log(err)
            });
        } catch (err) {
            console.log(err)
        }
    }

    function componentDidMount() {
        fetchData(id);
        fetchPosts(id);
    }

    useEffect(() => {
        componentDidMount();
    }, [id]);

    return (
        <>
        {loader &&  <div className='loader'></div>}
            <motion.div
                exit={{ x: -1000 }}
                initial={{ y: -1000, opacity: -1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className='userprofiles'
            >
                <div className="rowUsers">
                    <div className='columnUsers'>
                        <div className={rank}>
                        <img id='avatarUser' src={googleImage != null ? googleImage : userImg } className='avatarUser'></img>
                        <div className="avatar__badge">
                        {rank =="bronze" && <span style={{color:"rgba(201, 80, 0, 0.76)"}}><FontAwesomeIcon className="userprofilerank" icon={faTree}/></span>}
                        {rank =="silver" && <span style={{color:"rgb(131, 131, 131)"}}> <FontAwesomeIcon className="userprofilerank" icon={faLeaf}/></span>}
                        {rank =="gold" && <span style={{color:"#f7de00"}}><FontAwesomeIcon className="userprofilerank" icon={faSmog}/></span>}
                        {rank =="platinum" && <span style={{color:"#00ffc8"}}> <FontAwesomeIcon className="userprofilerank" icon={faHiking}/></span>}
                        {rank =="diamond" && <span style={{color:"#00e0fd"}}> <FontAwesomeIcon className="userprofilerank" icon={faGem}/></span>}
                        </div>
                        </div>
                        
                    </div>
                    <div className='columnUserDesc'>
                        <h1 className='profileUsername'>{userName}</h1>
                        <h3>E-mail:</h3>
                        <p>{userEmail}</p>
                        <h3>Contacto Telefónico:</h3>
                        <p>{userPhone != "" ? userPhone : "Sem Informação"}</p>
                        <h3>Descrição:</h3>
                        
                        <p>{userDescription != "" ? userDescription : "Sem Informação"}</p>
                       
                        
                      
                    </div>
                </div>
                <div className="userprofile_container">

                    <div className='userprofile_posts'>
                        <br></br>
                        {posts &&
                            posts.map(post => (
                                <div className='UserPostContainer'>
                                    <motion.div
                                        className='UserPostCard'>
                                        <div className="UserPost__top" >
                                            <div>
                                                <UserData postdate={post.post_date} userid={post.user_id} />
                                                <br></br>
                                                <hr></hr>
                                            </div>
                                            <div className='UserPostName'>
                                                {post.post_title && post.post_title, ""}
                                            </div>
                                            <div className='UserPostDescription'>
                                                {post.post_description}
                                            </div>
                                            <div className='UserPostImg'>

                                                {post.post_img != undefined ? <ImgVideo format={post.post_img.split(".").pop()} img={post.post_img} /> : ""}

                                            </div>
                                        </div>
                                        <div>
                                            {post.post_lat != undefined ? <Maps lat={post.post_lat} lng={post.post_lng} /> : ""}
                                        </div>
                                        <Likes useridd={props.userid} postid={post.post_id} userid={post.user_id} />

                                    </motion.div>
                                </div>
                            )
                            )
                        }
                    </div>

                </div>

            </motion.div>

        </>
    )
}
