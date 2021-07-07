import React,{useState} from 'react'

function ImgVideo(props) {
    const [foto, setFoto] = useState(null);

    
    console.log(props.img)
    function setPhoto(photo){
        try{
            console.log(photo.split("_").length)
            if(photo.split("_").length > 1){
                return 'https://naturefriend-mobile.herokuapp.com/' + photo
            }else{
                return '/' + photo
            }
        }catch{
            return '/' + photo
        }
        
    }
  

    return (
        <div>
            <div>
            {props.format == "mp4" ? <video src={'/' + props.img} autoPlay muted loop></video> 
            : <img className='UsersPostsImg' src={setPhoto(props.img)} />}
            </div>
        </div>
    )
}

export default ImgVideo
