import React, {Component} from 'react'
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert";
import {withRouter } from "react-router-dom";

const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email inválido")
      .required("Email necessário"),
    password: Yup.string().required("Password necessária"),
    confirm_password: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "As passwords não coincidem"
    )
  });


class Login extends Component {
    constructor(props) {
      super(props);
  
      this.state = { 
          name: '',
          values: {name: ''},
        alert: null
      };
    }
    

    submitForm = (values, history) => {
      axios
        .post("/" + "login", values)
        .then(res => {
          if (res.data.result === "success") {
            localStorage.setItem("TOKEN_KEY", res.data.token);
            swal("Sucesso!", res.data.message, "success")
           .then(()  => {
                history.push("/App");
            });
          } else if (res.data.result === "error") {
            swal("Erro!", res.data.message, "error");
          }
        })
        .catch(error => {
          console.log(error);
          swal("Error!", error, "error");
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
        <form onSubmit={handleSubmit} >
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
          <div className=''>
            <div className='iniciarSessao'>
              <button
                className='btnLogin'
                disabled={isSubmitting}
                type="submit"
              >
                Iniciar Sessão
              </button>
            </div>
           
          </div>
         
        </form>
      );
    };

    render() {
      return (
        <div>
          <div >
            <div>
              <div >
 
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    try{
                      this.submitForm(values, this.props.history);
                      setSubmitting(false);
                    }catch{

                    }
                  }}
                  validationSchema={LoginSchema}
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
export default withRouter(Login);