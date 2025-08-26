import React from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { IoPersonCircle } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { Button } from '@mui/material';
import { useFormik } from 'formik'
import { registerPageSchema } from '../schemas/RegisterPageSchema';
import '../css/LoginPage.css'
import loginPageService from '../services/LoginPageService';
import { useDispatch } from 'react-redux';
import { setCurrentUser, setLoading } from '../redux/appSlice';
import type { UserType } from '../types/Types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface CheckUserType {
    result: boolean,
    currentUser: UserType | null
}

function LoginPage() {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const checkUser = (userList: UserType[], username: string, password: string): CheckUserType => {
        const response: CheckUserType = { result: false, currentUser: null }
        userList.forEach((user: UserType) => {
            if (user.username === username && user.password === password) {
                response.result = true
                response.currentUser = user
            }
        })

        return response
    }

    const submit = async (values: any, actions: any) => {
        try {
            dispatch(setLoading(true))
            const response: UserType[] = await loginPageService.login()
            if (response) {
                const checkUserResponse: CheckUserType = checkUser(response, values.username, values.password)
                if (checkUserResponse.result && checkUserResponse.currentUser) {
                    //Kullanıcı Adı ve Şifre Doğru
                    dispatch(setCurrentUser(checkUserResponse.currentUser))
                    localStorage.setItem("currentUser", JSON.stringify(checkUserResponse.currentUser))
                    navigate("/")
                }
                else {
                    //kullanıcı adı ve/veya şifre yanlış
                    toast.error("Kullanıcı Adı veya Şifre Hatalı")
                }
            }
        } catch (error) {
            toast.error("Giriş Yapılırken Hata Oluştu :" + error)

        }
        finally {
            dispatch(setLoading(false))
        }
    }

    const { values, handleSubmit, handleChange, errors, resetForm } = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: submit,
        validationSchema: registerPageSchema
    });

    const clear = () => {
        resetForm()
    }


    return (
        <div className='login'>
            <div className='main' >
                <form onSubmit={handleSubmit}>
                    <div className='form-div'>
                        <TextField
                            sx={{ width: '300px', marginBottom: '25px' }}
                            id="username"
                            value={values.username}
                            onChange={handleChange}
                            placeholder='Kullanıcı Adı'
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IoPersonCircle />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            variant="standard"
                            helperText={errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
                        />
                        <TextField
                            sx={{ width: '300px', marginBottom: '25px' }}
                            id="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder='Şifre'
                            type='password'
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FaLock />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            variant="standard"
                            helperText={errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                        />
                        <div>
                            <Button type='submit' sx={{ textTransform: 'none', height: '28px', marginRight: '10px' }} variant='contained' color='info' >Giriş Yap</Button>
                            <Button sx={{ textTransform: 'none', height: '28px' }} variant='contained' color='inherit' onClick={clear} >Temizle</Button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default LoginPage