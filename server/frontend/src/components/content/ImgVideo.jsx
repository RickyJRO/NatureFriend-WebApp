import React,{useState} from 'react'

function ImgVideo(props) {
    const [foto, setFoto] = useState(null);

    var array = props.img.split(".")
    console.log(isNaN(parseInt(array[0])));

    if(isNaN(parseInt(array[0])) == true){
        setFoto(props.img)
    }

    return (
        <div>
            <div>
            {props.format == "mp4" ? <video src={'/' + props.img} autoPlay muted loop></video> 
            : <img className='UsersPostsImg' src={foto != null ?  '/' + props.img : 'https://naturefriend-mobile.herokuapp.com/' + props.img} />}
            </div>
        </div>
    )
}

export default ImgVideo
