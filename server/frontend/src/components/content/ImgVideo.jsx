import React from 'react'

function ImgVideo(props) {
    return (
        <div>
            <div>
            {props.format == "mp4" ? <video src={'/' + props.img} autoPlay muted loop></video> 
            : <img className='UsersPostsImg' src={'/' + props.img} />}
            </div>
        </div>
    )
}

export default ImgVideo
