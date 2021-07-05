import React, { Component } from 'react'
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert";
import {withRouter } from "react-router-dom";

const RegistoSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username necessita no minimo de 4 Caracteres!")
    .max(16, "Username pode ter no máximo de 16 Caracteres!")
    .required("Username necessário"),
  email: Yup.string()
    .email("Email inválido")
    .required("Email necessário"),
  password: Yup.string().required("Password necessária")
  .min(8, "Password necessita no minimo de 8 caracteres!")
  .max(24, "Password pode te rno máximo 24 caracteres!"),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "As passwords não coincidem"
  ).required("Confirmar Password necessária")

});
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      values: { name: '' },
      alert: null
    };
    
  }
  
  submitForm = (values) => {
    axios
      .post("/" + "registo", values)
      .then(res => {
        if (res.data.result === "success") {
          swal("Sucesso!", res.data.message, "success").then(() => {
            window.location.reload();
          })
        } else if (res.data.result === "error") {
          swal("Erro!", res.data.message, "error");
        }
      })
      .catch(error => {
        console.log(error);
        swal("Erro!", "Username ou email já existentes", "error");
      });
  };

  showForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting
  }) => {
    return (

      <form onSubmit={handleSubmit} className='formRegisto'>

        <div >
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={values.username}
            placeholder="Username"
            className={
              errors.username && touched.username
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {errors.username && touched.username ? (
            <small id="passwordHelp" >
              {errors.username}
            </small>
          ) : null}
        </div>
        <div >
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={values.email}
            className={
              errors.email && touched.email
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="Email"
          />
          {errors.email && touched.email ? (
            <small id="passwordHelp" >
              {errors.email}
            </small>
          ) : null}
        </div>
        <div >
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            placeholder="Password"
            className={
              errors.password && touched.password
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {errors.password && touched.password ? (
            <small id="passwordHelp" >
              {errors.password}
            </small>
          ) : null}
        </div>
        <div >
          <input
            type="password"
            name="confirm_password"
            onChange={handleChange}
            className={
              errors.confirm_password && touched.confirm_password
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="Confirmar Password"
          />
          {errors.confirm_password && touched.confirm_password ? (
            <small id="passwordHelp" >
              {errors.confirm_password}
            </small>
          ) : null}
        </div>
        <div >
          <div className='buttonCriarConta'>
            <button
              disabled={isSubmitting}
              type="submit"
              className='buttonCriarConta2'
            >
              Criar Conta
              </button>
          </div>
          {/* /.col */}
        </div>
      </form>
    );
  };

  render() {
    return (
      <div className='registo'>
        <div >
          <div>
            <div className='formRegistoContainer'>
              <button onClick={this.props.onClick} className='iconFecharRegisto'>X</button>
              <h1>Regista-te!</h1>
              <h2>Faz parte da nossa comunidade</h2>
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirm_password: ""
                }}
                onSubmit={(values, { setSubmitting }) => {
                  this.submitForm(values, this.props.history);
                  setSubmitting(false);
                }}
                validationSchema={RegistoSchema}
              >
                {props => this.showForm(props)}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Register;