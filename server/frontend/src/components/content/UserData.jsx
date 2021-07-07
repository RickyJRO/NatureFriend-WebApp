import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import { faLeaf} from '@fortawesome/free-solid-svg-icons'
import { faSmog} from '@fortawesome/free-solid-svg-icons'
import { faHiking} from '@fortawesome/free-solid-svg-icons'
import { faGem} from '@fortawesome/free-solid-svg-icons'


function UserData(props) {

    const [username, setUsername] = useState(null)
    const [userImg, setUserImg] = useState(null)
    const [googleImg, setGoogleImg] = useState(null)
    const[rank, setUserRank] = useState(null)
    const[fotoMobile, setFotoMobile] = useState(null)

    async function getData(id) {
        const response = await axios.get("/" + 'Perfil/id/' + id, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } });
        setUsername(response.data.user_name)
        setUserRank(response.data.user_rank)
        setUserImg("/" + response.data.user_img)
        
        try{
            let array = response.data.user_img
            if(array.split("_")){
            setFotoMobile('https://naturefriend-mobile.herokuapp.com/' + array)
            }  
        }catch{

        }
        
    }

    useEffect(() => {
        getData(props.userid)
    })
    
    const split = props.postdate.split('T')
    const days = split[0]
    const hours = split[1]
    const hour = hours.split(":")
    const time = hour[0] +":"+ hour[1];




    return (
        <div className='userDataContainer'>

            <div className='userDataImg'
            ><Link to={{ pathname: `/App/Perfil/${props.userid}` }}>
                    <img className='postUserImg' src={fotoMobile != null ? fotoMobile : userImg} />
                </Link>
            </div>
            <div className='userDataNameContainer'>
                <Link to={{ pathname: `/App/Perfis/${props.userid}` }} className='userDataName'>
                    {username}
                    {rank =="bronze" && <span style={{color:"rgba(201, 80, 0, 0.76)"}} > <FontAwesomeIcon className="user_rank" icon={faTree}/></span>}
                        {rank =="silver" && <span style={{color:"rgb(131, 131, 131)"}}> <FontAwesomeIcon className="user_rank" icon={faLeaf}/></span>}
                        {rank =="gold" && <span style={{color:"#f7de00"}}> <FontAwesomeIcon className="user_rank" icon={faSmog}/></span>}
                        {rank =="platinum" && <span style={{color:"#00ffcf"}} ><FontAwesomeIcon className="user_rank" icon={faHiking}/></span>}
                        {rank =="diamond" && <span style={{color:"#00e0fd"}}><FontAwesomeIcon className="user_rank" icon={faGem}/></span>}
                </Link>
                <div className='userDataDateContainer'>
                    <p className='userDataDate'>{days + " às " + time}</p>
                </div>
                
            </div>

        </div>
    )
}

export default UserData
