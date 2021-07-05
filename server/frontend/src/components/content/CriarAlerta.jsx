import React, { useState, useEffect } from 'react'
import { Formik } from 'formik';
import './CriarAlerta.css'
import Map from '../google/Leaflet'
import axios from 'axios'
import swal from 'sweetalert'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom';

export default function CriarAlerta(props) {
    const [latitude, setLat] = useState(null)
    const [longitude, setLng] = useState(null)
    const [coordenadas, setCoordenadas] = useState("null")
    const history = useHistory();
    const handleClick = () => {
        history.push("/App/Feed");
    }

    useEffect(() => {
        setLat(coordenadas.lat)
        setLng(coordenadas.lng)
    }, [coordenadas]);

    function showPreviewImage(values) {
        return (
            <div>
                <img
                    id='postImgs'
                    src={
                        values.post_imgAvatar != null
                            ? values.post_imgAvatar
                            : '/defaultimgpost'
                    }
                    className='previewPostImgs'
                />
            </div>
        )
    }

    const submitForm = async formData => {
        await axios
            .post('/CriarAlerta', formData, { headers: { Authorization: localStorage.getItem('TOKEN_KEY') } })
            .then(res => {
                if (res.data.result === 'success') {
                    swal('Sucesso!', res.data.message, 'success').then(value => {
                        handleClick();
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

    const iduser = props.userid
    return (
        <motion.div
            exit={{ x: -1000 }}
            initial={{ x: -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 0.75 }}

            transition={{ duration: 0.75 }}
            className='criarAlerta'>
            <Formik
                initialValues={{ post_title: null, post_description: null, post_imgs: null }}
           
                onSubmit={(values, { setSubmitting }) => {
                    let formData = new FormData()
                    formData.append('post_title', values.post_title)
                    formData.append('post_description', values.post_description)
                    formData.append('post_imgs', values.post_imgs)
                    formData.append('user_id', iduser)
                    {latitude && formData.append('post_lat', latitude)}
                    {longitude && formData.append('post_lng', longitude)}
                    if(values.post_description == null & values.post_title == null & values.post_imgs == null){
                        swal('Erro!', 'Precisa de inserir dados', 'error').then(()=> {
                            setSubmitting(false);
                        })
                    }
                    else if(values.post_description == null){
                        swal('Erro!', 'Precisa de inserir uma descrição', 'error').then(()=> {
                            setSubmitting(false);
                        })
                    }
                    else if(values.post_title == null){
                        swal('Erro!', 'Precisa de inserir um titulo', 'error').then(()=> {
                            setSubmitting(false);
                        })
                    }
                    else if(values.post_imgs == null){
                        swal('Erro!', 'Precisa de inserir uma Imagem', 'error').then(()=> {
                            setSubmitting(false);
                        })
                    }
                    
                    else{
                        submitForm(formData);
                        setSubmitting(false);
                    }
                    
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue

                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='criarAlertaTop'>
                            <div className='previewImage'>{showPreviewImage(values)}
                            <motion.label
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            htmlFor="post_img" className="carregarFotos">
                                Carregar Foto
                            </motion.label> 
                            </div>            
                            <input
                                type='file'
                                onChange={e => {
                                    e.preventDefault()
                                    setFieldValue('post_imgs', e.target.files[0])
                                    setFieldValue(
                                        'post_imgAvatar',
                                        URL.createObjectURL(e.target.files[0])
                                    )
                                }}
                                accept='image/*|video/*'
                                id='post_img'
                            />
                            <div className="alertMap" style={{width:'800px',height:'400px'}}>
                                <Map cords={coordenadas => setCoordenadas(coordenadas)} />
                            </div>
                        </div>
                        
                        <input
                            id='post_title'
                            type="text"
                            name="post_title"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.titulo}
                            placeholder='Titulo'
                        />
                        {errors.post_titleo && touched.post_title && errors.post_title}
                        <input
                            id='post_description'
                            type="text"
                            name="post_description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            placeholder='Descrição'
                        />

                        {errors.post_description && touched.post_description && errors.post_description}
                     
                             <motion.div
                             className="ButtonSubmit_container"
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}>
                        <button
                         type="submit" disabled={isSubmitting} className='buttonSubmit'>
                            Submeter
                        </button>
                        </motion.div>
                    </form>

                )}
            </Formik>

        </motion.div>
    )
}

