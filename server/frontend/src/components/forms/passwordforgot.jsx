import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert";


const PasswordForgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("E-mail inválido")
    .required("Email necessário!")
});
 
class Passwordforgot extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      error_message: null,
    };
  }
 
  submitForm = async formData => {
    await axios
      .post("/"  + "password-reset", formData)
      .then(res => {
        console.log(res.data.result);
        if (res.data.result === "success") {
          swal("Sucesso!", res.data.message, "success")
        } else if (res.data.result === "error") {
          swal("Erro!", res.data.message, "error");
        }
      })
      .catch(error => {
        console.log(error);
        swal("Erro!", "Erro!", "error");
      });
  };
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
      <form role="form" onSubmit={handleSubmit}>
        <div >
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              onChange={handleChange}
              value={values.email}
              type="email"
              className={
                errors.email && touched.email
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="email"
              placeholder="Introduzir e-mail"
            />
            {errors.email && touched.email ? (
              <small id="passwordHelp" class="text-danger">
                {errors.email}
              </small>
            ) : null}
          </div>
        </div>
      
        <div >
          <div class="passeNovaContainer">
            <button
              type="submit"
              disable={isSubmitting}
              className='buttonPasseNova'
            >
              Pedir palavra passe nova
            </button>
          </div>
        </div>
      </form>
    );
  };
 
  render() {
    return (
          <div >
          <button className='buttonFecharForgot' onClick={this.props.onClick}>X</button>
            <div>
              <p style={{textAlign:'center', fontSize:22}}>
                Esqueceu-se da sua palavra passe? Introduza o seu email!
              </p>
              <Formik
                initialValues={{
                  username: ""
                }}
                onSubmit={(values, { setSubmitting }) => {
                  this.submitForm(values, this.props.history);
                  setSubmitting(false);
                }}
                validationSchema={PasswordForgotSchema}
              >
                {props => this.showForm(props)}
              </Formik>
            </div>
          </div>
    );
  }
}


export default Passwordforgot;