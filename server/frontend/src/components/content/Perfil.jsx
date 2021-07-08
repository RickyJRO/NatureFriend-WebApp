import React, { Component } from 'react'
import { Formik } from 'formik'
import axios from 'axios'
import swal from 'sweetalert'
import './Perfil.css'
import {withRouter } from "react-router-dom";

import {motion, AnimatePresence} from 'framer-motion'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      response: {},
      error_message: null,
      avatar: '',
      user_email: ""
    }
  }

  parseJwt() {
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

  componentDidMount() {
    let { id } = this.parseJwt()
    this.getData(id)
  }

  showPreviewImage = values => {
    return (
      <div >
        {this.props.googleImage != null ? (<img
          id='avatarPerfil'
            src={values.user_avatar != null ? values.user_avatar : "/"+  values.user_img
            }
          className='previewImg'
        />) : (<img
          id='avatarPerfil'
            src={values.user_avatar != null ? values.user_avatar : "/" + values.user_img
            }
          className='previewImg'
        />)}
        
      </div>
    )
  }
  getData = async id => {
    await axios
      .get("/" + 'Perfil/id/' + id,{ headers: { Authorization:localStorage.getItem('TOKEN_KEY') } })
      .then(response => {
        document.getElementById('avatarPerfil').src =
          '/' + response.data.user_img
          console.log(response.data.user_img)
        this.setState({ response: response.data })
      })
      .catch(error => {
        this.setState({ error_message: error.message })
      })
  }
  submitForm = async formData => {
    console.log("Inicio Form")
    await axios
      .put('/Perfil', formData,{ headers: { Authorization:localStorage.getItem('TOKEN_KEY') } })
      .then(res => {
        if (res.data.result === 'success') {
          swal('Sucesso!', res.data.message, 'success').then(value => {
           this.props.alt(res);
                    })
        } else if (res.data.result === 'error') {
          swal('Erro!', res.data.message, 'error')
        }
      })
      .catch(error => {
        console.log(error)
        swal('Erro!', 'Erro inesperado', 'error')
      })
  }
  showForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    onSubmit,
    isSubmitting,
    setFieldValue
  }) => {
    return (
      <form role='form' onSubmit={handleSubmit} className="formperfil">
        <div className="formperfil__left">
          <div className='containerAvatar'>{this.showPreviewImage(values)}</div>
          <div className='containerUpload'>
            <label htmlFor="user_img" className="cssInput">
              Alterar Foto
            </label>
            <input
              type='file'
              onChange={e => {
                e.preventDefault()
                setFieldValue('user_img', e.target.files[0])
                setFieldValue(
                  'user_avatar',
                  URL.createObjectURL(e.target.files[0])
                )
              }}
              accept='image/*'
              id='user_img'
            />
          </div>
          </div>
          <div className="formperfil__right">
          <div >
            <label htmlFor='username' className='LabelProfile'>Username</label>
            <input
              onChange={handleChange}
              value={values.user_name}
              type='text'
              id='user_name'
            />

          </div>
          <div>
            <label htmlFor='phone' className='LabelProfile'>Contacto Telefónico</label>
            <input
              onChange={handleChange}
              value={values.user_phone}
              type='text'
              id='user_phone'
              pattern="[0-9]*"
            />
          </div>
          <div >
            <label htmlFor='user_description' className='LabelProfile'>Descrição</label>
            <textarea
              onChange={handleChange}
              value={values.user_description}
              type='description'
              id='user_description'
              className='inputDesc'
            />
          </div>
       
        <div className='containerGuardar'>
          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
            type='submit'
            disabled={isSubmitting}
            className='guardarAlt'
          >
            Guardar Alterações
          </motion.button>
        </div>
        </div>
      </form>
    )
  }

  render() {
    let result = this.state.response
    return (
      <AnimatePresence>
      <motion.div 
      initial={{ x: -1000,opacity:0 }}
      animate={{ x: 0 , opacity:1}}
      exit={{ x:-1000 }}
      transition={{ duration: 0.75 }}
      exitBeforeEnter
      className='flexPerfil'>
        <div >
          <div >
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={
              result
                ? result
                : {
                  user_name: " ",
                  user_email: " ",
                  user_phone: " ",
                  user_description: " "
                }
            }
            onSubmit={(values, { setSubmitting }) => {
              console.log("form submited")
              let formData = new FormData()
              formData.append('user_id', values.user_id)
              formData.append('user_name', values.user_name)
              formData.append('user_phone', values.user_phone)
              formData.append('user_description', values.user_description)
              console.log(values.user_img)
              if (values.user_img) {
                console.log("cona")
                formData.append('user_img', values.user_img)
                this.submitForm(formData, this.props.history);
                  setSubmitting(false);
              }
              else if(values.user_description.length > 182){
                swal('Erro!', 'Numero máximo de caracteres para a descrição ultrapassado! Permitido 182 apenas', 'error').then(()=> {
                  setSubmitting(false);
              })
              }
              else if(values.user_name.length > 22){
                swal('Erro!', 'Numero máximo de caracteres para o nome ultrapassado! Permitido 22 apenas', 'error').then(()=> {
                  setSubmitting(false);
              })
              }
              else if(values.user_phone.length > 9){
                swal('Erro!', 'Numero máximo de caracteres para o telefone ultrapassado! Permitido 9 apenas', 'error').then(()=> {
                  setSubmitting(false);
              })
              }
              else{
                console.log("ui")
                  this.submitForm(formData, this.props.history);
                  setSubmitting(false);
              }
              
            }}
          >
            {props => this.showForm(props)}
          </Formik>
        </div>
      </motion.div>
      </AnimatePresence>
    )
  }
}

export default withRouter(Profile)