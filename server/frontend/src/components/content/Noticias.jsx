import React,{useEffect,useState} from 'react'
import './Noticias.css'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import swal from 'sweetalert'
import axios from 'axios'

function Noticias() {
    const [noticias, setNoticias] = useState()
    const [loading,setLoading] = useState(true)
    useEffect(()=> {
        loadNews();
        
    },[])
    const loadNews = async () => {
        var url = 'http://api.mediastack.com/v1/news?access_key=00018cb1aa69c235f607b2e56c93259a&sources=cnn,-bbc' ;
          
        await axios.get(url).then((res) => {
            console.log(res.data.data)
            setNoticias(res.data.data)
            console.log(noticias)
            setLoading(false)
        }).catch(() => {
            swal('Erro!', 'News Api Error!').then(
                )
        });
    }
 
    return (
        <motion.div
        initial={{x: 500, opacity:0}}
        animate={{x: 0, opacity:1}}
        transition={{duration:1}}
        className='MenuNoticias'>

            <h1 className='tituloNoticias'>Ultimas Notícias</h1>
            <hr></hr>
            {loading == true && <div className='loader'>
            </div>}
            {noticias && noticias.map(post => (
                
                <div>
                    {post.description && <><div className='noticia'>
                        <h3>{post.source}</h3>
                        <h2>{post.title}</h2>
                        {post.description && <p className='descNoticia'>{post.description}</p>}
                        {post.image && <div className='containerImgNoticia'><br></br>
                        <img className='imgNoticia' src={post.image} />
                        <br></br>
                        <a href={post.url} target="blank" style={{textDecoration:"none",color:'rgb(59, 201, 16)'}}>Saber Mais</a>
                        </div>}
                        
                           
                    </div>
                    <hr></hr></>}
                    
                </div>
            ))}
            
            
         
        </motion.div>
    )
}

export default Noticias


