import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import "./Login.css";
import { Formik } from "formik";
import { Input, Button, Card } from 'react-rainbow-components';
import { doLogin, getUser } from "../../data/auth/AuthData";

export const Login: React.FC<any> = (props: any) => {

    const history = useHistory();

    const [ loginError, setLoginError ] = useState('')

    let user = getUser()

    if ( user != null ){
        return <Redirect to="/home"/>
    }

    return (
        <div className="loginContainer">
            <Card className="rainbow-m-around_large rainbow-p-around_large rainbow-align-content_center rainbow-flex_wrap">
                <div className="rainbow-p-around_large loginForm">
                    <Formik
                    initialValues={{ username: '', password: '' }}
                    validate={values => {
                        const errors: any = {};
                        if (!values.username) {
                        errors.username = 'Required';
                        } 

                        if (!values.password) {
                            errors.password = 'Required';
                        } 

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        
                        doLogin(values.username, values.password, 
                            () => {
                                setSubmitting(false)
                                history.push("/home")
                            }, 
                            (response) => {
                                if ( response.status == 401){
                                    setLoginError('Username or password does not match any record')
                                }
                                setSubmitting(false)
                            })
                    }}
                    >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit}>
                        <Input
                            className="rainbow-p-bottom_large"
                            label="Username"
                            name="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                        />
                        <div className="error-label">
                            {errors.username && touched.username && errors.username}
                        </div>
                        
                        <Input
                            className="rainbow-p-bottom_large"
                            label="Password"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        <div className="error-label">
                            {errors.password && touched.password && errors.password}
                        </div>

                        <div className="error-label">
                            {loginError}
                        </div>

                        <div className="rainbow-p-vertical_large rainbow-align-content_center rainbow-flex_wrap">
                            <Button isLoading={isSubmitting} type="submit" size='large' disabled={isSubmitting}>
                                Login
                            </Button>
                        </div>
                        </form>
                    )}
                    </Formik>
                </div>
            </Card>
        </div>
);
}