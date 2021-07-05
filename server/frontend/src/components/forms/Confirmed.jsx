import React from 'react'
import logo from '../../logo.png'
import {Link} from 'react-router-dom'

export default function Confirmed() {
    return (
        <div>
              <div className='passwordReset'>
              <img className='logoReset' src={logo} />
              <h2>NatureFriend</h2>
              <p style={{fontSize:22}}>
                A sua conta foi confirmada com sucesso!
              </p>
              <p className="inicial">
                 <Link to="/">Voltar á pagina inicial</Link>
              </p>
  
            </div>
        </div>
    )
}
