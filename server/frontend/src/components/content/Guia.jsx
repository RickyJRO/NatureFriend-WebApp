import React,{useState} from 'react'
import {motion} from 'framer-motion'
import './Guia.css'
import logo from '../../logo.png'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import gif1 from '../../AlertaGif.gif'
import gif2 from '../../DefinicoesGif.gif'
import gif3 from '../../DarkModeGif.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import { faLeaf} from '@fortawesome/free-solid-svg-icons'
import { faSmog} from '@fortawesome/free-solid-svg-icons'
import { faHiking} from '@fortawesome/free-solid-svg-icons'
import { faGem} from '@fortawesome/free-solid-svg-icons'


export default function Guia() {
    const [page,setPage] = useState(0)

    function changePage(sentido){
      if(sentido == "left"){
        if(page==0){
          setPage(4)
        }
        else if(page==1){
          setPage(0)
        }
        else if(page==2){
          setPage(1)
        }else if(page==3){
          setPage(2)
        }else if(page==4){
          setPage(3)
        }
      }else{
        if(page==0){
          setPage(1)
        }
        else if(page==1){
          setPage(2)
        }else if(page==2){
          setPage(3)
        }else if(page==3){
          setPage(4)
        }
        else if(page==4){
          setPage(0)
        }
      }
    }

    return (
        <motion.div
            exit={{ x: -1000 }}
          initial={{ x: -1000,opacity:0 }}
          animate={{ x: 0 , opacity:1}}
          transition={{ duration: 0.75 }}>
          <div className="guia">
          <div className="guia__container">
          <div className="guia__card">
            <div className="guia__text">
            {page == 0 && <>
            <h2>Bem Vindo ao NatureFriend</h2>
            <img src={logo} className="logo__guia"/>
            <div className="guia__description">
            <h2>Queremos agradecer-lhe ter-se juntado à nossa comunidade!</h2>
            <h3>
            Esperemos que tenha lido as normas e regras da nossa aplicação, tenha uma postura respeitosa e que o seu foco seja sempre reportar maus tratos ao nosso planeta.<br></br>
            Esta aplicação foi criada pelos alunos da Universidade Autónoma de Lisboa, Ricardo Oliveira, Rafael Rocha e David Oliveira e supervisionada pelo professor Gonçalo Valadão.
            </h3>
            </div>
            </>}
            {page==1 && <>
            <h2>Como criar um alerta:
            </h2>
            <div className="guia__descriptionGif">
            <h3>Carregar no Botão "Criar Alerta" no Menu<br></br>
            Selecionar a fotografia do incidente e as suas respetivas informações<br></br>
            Carregar no botão Submeter<br></br><br></br>
              Exemplo:
            </h3>
            <img src={gif1} className="guia__gif" />
            </div>
            </>}
            {page==2 && <>
            <h2>Como alterar o seu Perfil:
            </h2>
            <div className="guia__descriptionGif">
            <h3>Carregar no Botão "Definições" no Menu<br></br>
            Selecionar uma fotografia ou outras informações ao seu critério<br></br>
            Carregar no botão Guardar Alterações<br></br><br></br>
              Exemplo:
            </h3>
            <img src={gif2} className="guia__gif" />
            </div>
            </>}
            {page==3 && <>
            <h2>Dark Mode:
            </h2>
            <div className="guia__descriptionGif">
            <h3>A NatureFriend tem disponivel o Dark mode para puder usufruir de uma experiência completamente saudável para o ambiente em que se encontra!<br></br>
            Para isso basta clicar no botão Toggle na parte inferior do menu.<br></br>
            <br></br>
              Exemplo:
            </h3>
            <img src={gif3} className="guia__gif" />
            </div>
            </>}
            {page==4 && <>
            <h2>Ranking:
            </h2>
            <div className="guia__descriptionGif">
            <h3>Na NatureFriend recompensamos o sue esforço, e para isso desenvolvemos um sistema de ranking para poder classificar os membros que mais ajudam o planeta.<br></br>
            <br></br>
            De tal modo que o sistema de ranking é composto:<br></br><br></br>
            </h3>
            <h2 style={{color:"rgba(201, 80, 0, 0.76)"}}>Bronze <FontAwesomeIcon style={{color:"rgba(201, 80, 0, 0.76)"}} icon={faTree}/><br></br></h2><h5 style={{marginTop:'-15px'}}>Até 5 alertas</h5>
            <h2 style={{color:"rgb(131, 131, 131)"}}>Silver <FontAwesomeIcon icon={faLeaf}/><br></br></h2><h5 style={{marginTop:'-15px'}}>Ter 15 alertas</h5>
            <h2 style={{color:"#f7de00"}}>Gold <FontAwesomeIcon icon={faSmog}/><br></br></h2><h5 style={{marginTop:'-15px'}}>Ter 30 alertas</h5>
            <h2 style={{color:"#00ffcf"}}>Platinum <FontAwesomeIcon icon={faHiking}/><br></br></h2><h5 style={{marginTop:'-15px'}}>Ter 50 alertas</h5>
            <h2 style={{color:"#00e0fd"}}>Diamond <FontAwesomeIcon  icon={faGem}/><br></br></h2><h5 style={{marginTop:'-15px'}}>Ter 100 alertas</h5>
            </div>
            </>}
            </div>
            <div className="arroeleft" onClick={()=> changePage("left")}>
            <KeyboardArrowLeftIcon className="arrow__left"/>
            </div>
            <div className="arrowright" onClick={()=> changePage("right")}>
            <KeyboardArrowRightIcon className="arrow__right"/>
            </div>
          </div>
        </div>
          </div>
            
        </motion.div>
    )
}
