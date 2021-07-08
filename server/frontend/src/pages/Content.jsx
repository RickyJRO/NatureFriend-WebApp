import React, {useState, useEffect} from 'react'
import Feed from '../components/content/Feed'
import Posts from '../components/content/Posts'
import Menu from '../components/layout/Menu'
import Perfil from '../components/content/Perfil'
import UserProfiles from '../components/content/UserProfiles'
import Guia from '../components/content/Guia'
import CriarAlerta from '../components/content/CriarAlerta'
import axios from 'axios'
import './Content.css'
import Noticias from '../components/content/Noticias'
import {Route, Switch } from 'react-router-dom'
import logo from '../logo.png'
import {motion} from 'framer-motion'
import Mapa from '../components/content/Mapa'

export default function Content() {
    const [username, setUsername] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userRank, setUserRank] = useState(null)
    const [newValues, setNewValues] = useState(null)
    const [loading, setLoading] = useState(true)
    const [googleImage, setGoogleImage]= useState(null)

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

    const getData = async id => {
        try {
            await axios.get("/" + 'Perfil/id/' + id,{ headers: { Authorization:localStorage.getItem('TOKEN_KEY') } }).then((res) =>{
            console.log(res.data)
         
            setUsername(res.data.user_name);
            setUserId(res.data.user_id)
            setUserRank(res.data.user_rank)
            setAvatar('/' + res.data.user_img)
            
            setTimeout(() => {
                setLoading(false)
              }, 2000);
            
        })
        }catch(err) {
            console.log(err);
        }
    }   
 
    function componentDidMount() {
        let { id } = parseJwt();
        getData(id);
    }
    useEffect(() => {
        componentDidMount();
        
    }, [newValues]);
    
    if(loading == true){
        return (
            <div className='loaderApp'>
                
                <motion.img
                animate={{y:[0,0,20,20,0,0], rotate:[0,0,10,10,0,0,-10,-10,0,0]}}
                
                transition={{duration:2, repeat:Infinity}}
                src={logo} className="loader__logo"/>
            </div>
        )
    }
    return (
        <div className='page'>
            <div className='main'>
            <Switch>
            <Route exact path="/App/Feed" >
            <Menu username={username} avatar={avatar} googleImage={googleImage} userid={userId} userrank={userRank} activeFeed="true"/>
                <Feed avatar={avatar} user={username} googleImage={googleImage} userid={userId}/>
                <Noticias />
            </Route>
            <Route exact path="/App/Posts" >
            <Menu username={username} avatar={avatar} googleImage={googleImage} userid={userId} userrank={userRank} activePosts="true"/>
                <Posts userid={userId}/>
            </Route>
            <Route exact path="/App/Definições" >
            <Menu username={username} avatar={avatar} googleImage={googleImage} userid={userId} userrank={userRank} activePerfil="true"/>
                <Perfil googleImage={googleImage} alt={values => setNewValues(values)}/>
            </Route>
            <Route exact path="/App/Guia" >
            <Menu username={username} avatar={avatar} googleImage={googleImage} userid={userId} userrank={userRank} activeGuia="true"/>
                <Guia />
            </Route>
            <Route exact path="/App/CriarAlerta">
            <Menu username={username} avatar={avatar} googleImage={googleImage} userid={userId} userrank={userRank} activeAlerta="true"/>
                <CriarAlerta userid={userId}/>
            </Route>
            <Route exact path="/App/Perfil/:id">
            <Menu username={username} avatar={avatar} googleImage={googleImage} userrank={userRank} userid={userId} />
                <UserProfiles userid={userId}/>
            </Route>
            <Route exact path="/App/Mapa">
            <Menu username={username} avatar={avatar} googleImage={googleImage} userrank={userRank} userid={userId} />
            <Mapa />
            </Route>
            <Route path="*">
            <Menu username={username} avatar={avatar} googleImage={googleImage} userid={userId} userrank={userRank} activeFeed="true"/>
                <Feed avatar={avatar} user={username} googleImage={googleImage} userid={userId}/>
                <Noticias />
            </Route>
            
            </Switch>
            </div>
        </div>
    )
}
