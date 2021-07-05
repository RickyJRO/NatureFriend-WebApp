import React, { Component } from "react";
import {Link} from 'react-router-dom'
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert";
import logo from '../../logo.png'
const PasswordresetSchema = Yup.object().shape({
  password: Yup.string().required("Password nova necessária!")
  .min(8, "Password necessita no minimo de 8 caracteres!")
  .max(24, "Password pode te rno máximo 24 caracteres!"),

  confirm_password: Yup.string().required("Confirmar Password nova necessária!")
  .oneOf(
    [Yup.ref("password"), null],
    "Ambas as passwords têm de ser iguais"
  )
  .min(8, "Confirmar Password necessita no minimo de 8 caracteres!")
  .max(24, "Confirmar Password pode te rno máximo 24 caracteres!"),
});

class Passwordreset extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      response: {},
      error_message: null,
    };
  }
 
  submitForm = async (values, history,token) => {
 
    await axios
   
      .put("/" + "password/reset?token=" + token, values)
      .then(res => {
        if (res.data.result === "success") {
          swal("Success!", res.data.message, "success")
          .then(value => {
            history.push("/login");
          });
        } else if (res.data.result === "error") {
          swal("Error!", res.data.message, "error");
        }
      })
      .catch(error => {
        console.log(error);
        swal("Error!", "Erro!", "error");
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
        <div className="card-body">
          <div className="form-group  has-feedback">
            <label htmlFor="password">Password:</label>
            <input
              name="password"
              onChange={handleChange}
              value={values.password}
              type="password"
              className={
                errors.password && touched.password
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="password"
              placeholder="Nova password"
            />
            {errors.password && touched.password ? (
              <small id="passwordHelp" class="text-danger">
                {errors.password}
              </small>
            ) : null}
          </div>
          <div className="form-group  has-feedback">
            <label htmlFor="password">Confirmar Password:</label>
 
            <input
              onChange={handleChange}
              value={values.confirm_password}
              type="password"
              className={
                errors.confirm_password && touched.confirm_password
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirmar nova password"
            />
            {errors.confirm_password && touched.confirm_password ? (
              <small id="passwordHelp" class="text-danger">
                {errors.confirm_password}
              </small>
            ) : null}
          </div>
        </div>
 
        <div >
          <div class="containerGuardar">
            <button
              type="submit"
              disabled={isSubmitting}
              className='buttonGuardar'
            >
              Guardar Alterações
            </button>
          </div>
        </div>
      </form>
    );
  };
 
  render() {
    return (
            <div className='passwordReset'>
              <img className='logoReset' src={logo} />
              <h2>NatureFriend</h2>
              <p style={{fontSize:22}}>
                Está apenas a um passo de alterar a sua palavra-passe!
              </p>
              <Formik
                initialValues={{
                  password: ""
                }}
                onSubmit={(values, { setSubmitting}) => {
                  this.submitForm(values, this.props.history, this.props.match.params["token"]);
                  setSubmitting(false);
                }}
                 validationSchema={PasswordresetSchema}
              >
                {props => this.showForm(props)}
              </Formik>
              <p className="inicial">
                 <Link to="/">Voltar á pagina inicial</Link>
              </p>
  
            </div>
    );
  }
}
 
export default Passwordreset;