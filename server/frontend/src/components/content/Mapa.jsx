import React,{useState, useEffect} from 'react'
import Maps from '../google/Maps'
import './Mapa.css'
import axios from 'axios'
import swal from 'sweetalert'

export default function Mapa() {
    const [posts, setPosts]= useState(null)
    const [loading, setLoading]= useState(true)

    useEffect(() => {
        loadPosts();
    },[])

    const loadPosts = async () => {
        await axios.get('/FeedMapa').then((res) => {
            setPosts(res.data.rows)  
            setLoading(false);
        }).catch(() => {
            swal('Erro!', 'Erro na Conexão!').then(
                )
        });
    }

    
    if(loading == true){
        return (
            <div className='loader'>
            </div>
        )
    }

    return (
        <div className="Mapa">
            <Maps markers={posts}/>
        </div>
    )
}
