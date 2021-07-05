
import React, { useEffect, useState } from 'react'
import swal from "sweetalert";
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import './Menu.css'
import FilterIcon from '@material-ui/icons/Filter';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Darkmode from './DarkMode'
import {motion} from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import { faLeaf} from '@fortawesome/free-solid-svg-icons'
import { faSmog} from '@fortawesome/free-solid-svg-icons'
import { faHiking} from '@fortawesome/free-solid-svg-icons'
import { faGem} from '@fortawesome/free-solid-svg-icons'
const Menu = (props) => {
    const [feedActive, setFeedActive] = useState(null)
    const [PostsActive, setPostsActive] = useState(null)
    const [Definicoes, setDefinicoesActive] = useState(null)
    const [PerfilActive, setPerfilActive] = useState(null)
    const [GuiaActive, setGuiaActive] = useState(null)
    const [CriarPostActive, setCriarPostActive] = useState(null)
    const[darkmode, setDarkMode] = useState(false)
    const [rank, setRank] = useState(null)
    
    console.log(props.userrank)

    useEffect(()=>{
        if(props.activeFeed){
            setFeedActive(true)
        }else if(props.activePosts){
            setPostsActive(true)
        }else if(props.activePerfil){
            setDefinicoesActive(true)
        }else if(props.activeGuia){
            setGuiaActive(true)
        }else if(props.activeAlerta){
            setCriarPostActive(true)
        }
    })
    useEffect(()=>{
        if(props.userrank){
            setRank(capitalizeFirstLetter(props.userrank))
        }
    })

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      

    return (
        <aside className="Menu">
            <nav>
                <section>
                    <div className='company'>
                        <h1 className='Geolert'>NatureFriend</h1>
                    </div>
                    <div className='user'>
                        <motion.div
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.5 }}
                        className='containerAvatarMenu'>
                            <Link to={{ pathname: `/App/Perfil/${props.userid}` }} onClick={() => {
                        setFeedActive(false)
                        setPostsActive(false)
                        setPerfilActive(true)
                        setGuiaActive(false)
                        setCriarPostActive(false)
                        setDefinicoesActive(false)
                    }}><img src={props.googleImage ? props.googleImage : props.avatar} className='avatar' id='avatars' /></Link>
                        </motion.div>
                        <Link to={{ pathname: `/App/Perfis/${props.userid}` }} className='userName' onClick={() => {
                        setFeedActive(false)
                        setPostsActive(false)
                        setPerfilActive(true)
                        setGuiaActive(false)
                        setCriarPostActive(false)
                        setDefinicoesActive(false)
                    }}><h1 className='userNameh1'>{props.username}</h1></Link>
                    <h2 className='userNameh2'>
                        {rank =="Bronze" && <span style={{color:"rgba(201, 80, 0, 0.76)"}} className="rank">{rank}  <FontAwesomeIcon icon={faTree}/></span>}
                        {rank =="Silver" && <span style={{color:"rgb(131, 131, 131)"}}className="rank">{rank}  <FontAwesomeIcon icon={faLeaf}/></span>}
                        {rank =="Gold" && <span style={{color:"#f7de00"}}className="rank">{rank}  <FontAwesomeIcon icon={faSmog}/></span>}
                        {rank =="Platinum" && <span style={{color:"#00ffc8"}} className="rank">{rank}  <FontAwesomeIcon icon={faHiking}/></span>}
                        {rank =="Diamond" && <span style={{color:"#00e0fd"}}className="rank">{rank}  <FontAwesomeIcon icon={faGem}/></span>}
                    </h2>

                    </div>

                </section>

                <ul>

                    <li className={feedActive ? 'active' : ''} onClick={() => {
                        setCriarPostActive(false)
                        setPerfilActive(false)
                        setGuiaActive(false)
                        setPostsActive(false)
                        setDefinicoesActive(false)
                        setFeedActive(true)
                    }}>
                        <Link to="/App/Feed" className='menuLink'> <HomeIcon  style={{ fontSize: 40 }} className='icons' /><span className='textoLink'>Página Inicial</span></Link>
                    </li>
                    <li className={PostsActive ? 'active' : ''} onClick={() => {
                        setCriarPostActive(false)
                        setGuiaActive(false)
                        setPerfilActive(false)
                        setFeedActive(false)
                        setDefinicoesActive(false)
                        setPostsActive(true)
                    }}>
                        <Link to="/App/Posts" className='menuLink'><FilterIcon  style={{ fontSize: 40 }} className='icons' /><span className='textoLink'>Os Meus Alertas</span></Link>
                    </li>
                    <li className={PerfilActive ? 'active' : ''} onClick={() => {
                        setCriarPostActive(false)
                        setGuiaActive(false)
                        setPerfilActive(true)
                        setFeedActive(false)
                        setPostsActive(false)
                        setDefinicoesActive(false)
                    }}>
                        
                        <Link  to={{ pathname: `/App/Perfil/${props.userid}` }} className='menuLink'><PersonIcon  style={{ fontSize: 40 }} className='icons' /><span className='textoLink'>Perfil</span></Link>
                    </li>
                    <li className={Definicoes ? 'active' : ''} onClick={() => {
                        setCriarPostActive(false)
                        setGuiaActive(false)
                        setFeedActive(false)
                        setPostsActive(false)
                        setPerfilActive(false)
                        setDefinicoesActive(true)
                    }}>
                        <Link to="/App/Definições" className='menuLink'><SettingsIcon  style={{ fontSize: 40 }} className='icons' /><span className='textoLink'> Definições</span></Link>
                    </li>
                    <li className={GuiaActive ? 'active' : ''} onClick={() => {
                        setCriarPostActive(false)
                        setFeedActive(false)
                        setPostsActive(false)
                        setPerfilActive(false)
                        setDefinicoesActive(false)
                        setGuiaActive(true)
                    }}>
                        <Link to="/App/Guia" className='menuLink'> <HelpIcon  style={{ fontSize: 40 }} className='icons' /><span className='textoLink'>Guia</span></Link>
                    </li>
              
                    <li id='createPost' className={CriarPostActive ? 'active' : ''} onClick={() => {
                        setFeedActive(false)
                        setPostsActive(false)
                        setPerfilActive(false)
                        setGuiaActive(false)
                        setDefinicoesActive(false)
                        setCriarPostActive(true)
                    }}>
                        <Link to="/App/CriarAlerta" className='menuLink' ><ExitToAppIcon style={{ fontSize: 40 }} className='icons'/><span className='textoLink' >Criar Alerta</span></Link>
                    </li>
                    <li >
                        <a className='menuLink'
                            href="#"
                            onClick={() => {
                                swal("Tem a certeza que deseja sair da conta?", {
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
                                            swal("Logout efetuado com sucesso!").then(val => {
                                                localStorage.removeItem("TOKEN_KEY");
                                                return props.history.push("/");
                                            });
                                            break;
                                    }
                                });
                            }
                            }
                        >
                            <i /><ExitToAppIcon style={{ fontSize: 40 }} className='icons' /> <span className='textoLink'>Logout</span>
                        </a>
                    </li>
                   
                    <div className='containerBtn'>
                        <Link to='/App/CriarAlerta'>
                            <button className='btnCreate' onClick={()=>{
                             setFeedActive(false)
                             setPostsActive(false)
                             setPerfilActive(false)
                             setGuiaActive(false)
                             setCriarPostActive(true)
                        }}>Criar Alerta</button>
                        </Link>
                    </div>
                    
                    
                </ul>
                <Darkmode darkmode={darkmode =>setDarkMode(darkmode)} />
            </nav>
        </aside>
    )
}
export default withRouter(Menu)