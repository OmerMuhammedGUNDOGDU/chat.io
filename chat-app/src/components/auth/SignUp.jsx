import React, { useState, useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import { Link } from "react-router-dom";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import styles from "../../components/auth/signUp.module.css";

const SignUp = () => {

    const firebase = useFirebase();

    const { register, errors, handleSubmit, setValue } = useForm();

    const [fbErrors, setFbErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        register({ name: "username" }, { required: true });
        register({ name: "email" }, { required: true });
        register({ name: "password" }, { required: true, minLength: 6 });
    }, []);

    const onSubmit = ({ username, email, password }, e) => {
        setSubmitting(true);
        setFbErrors([]);

        const [first, last] = username.split('');

        firebase
            .createUser(
                { email, password },
                {
                    name: username,
                    avatar: `https://ui-avatars.com/api/?name=${first}+${last}&background=random&color=fff` // avatar oluştururken İsmin ilk harfi ve soyadın ilk harfi olacak şekilde ve renkleri rastgele olacak ve yazısı beyaz renkte olacak 
                }
            )
            .then((user) => {
                console.log(user);
            })
            .catch((error) => {
                setFbErrors([{ message: error.message }]);
            })
            .finally(() => {
                setSubmitting(false);
            })

    };

    const displayErrors = () =>
        fbErrors.map((error, index) => <p key={index}>{error.message} </p>);

    return (
        <Grid
            textAlign="center"
            verticalAlign="middle"
            className={styles.container}
        >
            <Grid.Column style={{ maxWidth: 450 }}>

                <h1 className={styles.formHeader}>
                    Blackice
                    <span>.io</span>
                </h1>

                <Form
                    size="large"
                    className={styles.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Segment>
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="Kullanıcı Adı"
                            name="username"
                            onChange={(e, { name, value }) => {
                                setValue(name, value);
                            }}
                            type="text"
                            error={errors.username ? true : false}
                        />

                        <Form.Input
                            fluid
                            icon="mail"
                            iconPosition="left"
                            placeholder="Email Adresi"
                            name="email"
                            onChange={(e, { name, value }) => {
                                setValue(name, value);
                            }}
                            type="email"
                            error={errors.email ? true : false}
                        />
                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="Şifre"
                            name="password"
                            onChange={(e, { name, value }) => {
                                setValue(name, value);
                            }}
                            type="password"
                            error={errors.password ? true : false}
                        />

                        <Button
                            color="purple"
                            fluid
                            size="large"
                            disabled={submitting}
                        >
                            Kaydol
                        </Button>

                    </Segment>
                </Form>

                {
                    fbErrors.length > 0 && < Message error> {displayErrors()}</Message>
                }

                <Message>
                    Zaten bir hesabın var mı?
                    <Link to="/login">
                        Giriş Yap
                    </Link>
                </Message>

            </Grid.Column>
        </Grid>
    );
};

export default SignUp;