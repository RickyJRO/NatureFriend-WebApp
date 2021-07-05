import React, { useState } from 'react'
import Registo from '../components/forms/registo'
import Login from '../components/forms/login'
import {motion} from 'framer-motion'
import Passwordforgot from '../components/forms/passwordforgot'
import './Auth.css'
import logo from '../logo.png'
import GoogleLogin from'react-google-login'
import swal from "sweetalert";
import axios from 'axios'
import { useHistory } from "react-router-dom";
export default function Auth() {
    let history = useHistory();
    const [registo, setRegisto] = useState(null)
    const [modalRegisto, setModal] = useState(false)
    const [modalForgot, setModalForgot] = useState(false)

    function handleClick() {
        setModal(false)
        setModalForgot(false)
    }
    const responseGoogle =async response => {
        console.log(response)
        await axios
        .post("/" + "googleLogin",response.profileObj)
        .then(res => {
            console.log(res.data)
            if (res.data.result === "success") {
              localStorage.setItem("TOKEN_KEY", res.data.token);
              swal("Sucesso!", res.data.message, "success")
             .then(()  => {
                  history.push("/App");
              });
            } else if (res.data.result === "error") {
              swal("Erro!", res.data.message, "error");
            }
          })
          .catch(error => {
            console.log(error);
            swal("Error!", error, "error");
          });
      };

    return (
        <>
        <div className='homepage'>
        
        <div className={modalRegisto ? 'ModalRegisto' : 'ModalDisplayNone'}>
                <div className='ModalMain'>
                    <Registo onClick={handleClick} />
                </div>
            </div>
            <div className={modalForgot ? 'ModalForgot' : 'ModalForgotDisplayNone'}>
                <div className='ModalMain'>
                    <Passwordforgot onClick={handleClick} />
                </div>
            </div>
        <div className='background'>   
            <div className="home__left">
            <div className="description">
            <motion.img  animate={{
            rotate: [0, 0, 20, -10, 0],
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{duration:4,repeat:Infinity}}
     className='logotop' src={logo}/>
                <h1 className='NatureFriend'>NatureFriend</h1>
                <h2 style={{color:'#fff'}}>A plataforma social mais amiga do ambiente!<br></br> Faça parte da nossa comunidade e faça do nosso planeta um mundo melhor</h2>             
            </div>
            </div>
            <div class="home__right">
            
                <div className="login">
                <div className='loginContainer'>
                    <div className="formLogin">
                    <h2>Faça o seu Login</h2>
                    <h3>Não é um membro? <span style={{color:"#77ce20",fontWeight:"bold",cursor:'pointer'}} onClick={() => setModal(true)}>Registe-se já</span></h3>
                    <GoogleLogin
                    clientId="99287452206-8a2du2c0cdfjlrrj4re40g62t852rg53.apps.googleusercontent.com"
                    className="botaoGoogle"
                    buttonText="Entre com o Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy="single_host_origin"
                    />
                    <div className="loginemail">
                        <h2><span>Ou use o seu email</span></h2>
                    </div>
                    <Login onCreate={() => {setModal(true)}} onForgot={() => { setModalForgot(true) }} />
                    <h2 className='buttonEsqueceuse' onClick={() => setModalForgot(true)}>Esqueceu-se da sua palavra passe?</h2>
                    </div>  
                </div>
                </div>
            </div>
            
        </div>
        <div className='footer'>
            
            <h2>NatureFriend Lda @ 2021 Terms & Conditions
Privacy
Legal</h2>
        </div>
        </div>
        </>
        
    )
}
