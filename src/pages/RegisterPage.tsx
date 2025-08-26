import React from 'react'
import '../css/RegisterPage.css'
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { IoPersonCircle } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import Button from '@mui/material/Button';
import { useFormik } from 'formik'
import { registerPageSchema } from '../schemas/RegisterPageSchema';
import registerPageService from '../services/RegisterPageService';
import type { UserType } from '../types/Types';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';


function RegisterPage() {

    const navigate = useNavigate()

    const submit = async (values: any, actions: any) => {
        try {
            const payload: UserType = {
                id: String(Math.floor(Math.random() * 999999)),
                username: values.username,
                password: values.password,
                balance: 1000
            }
            const response = await registerPageService.register(payload)
            if (response) {
                clear()
                toast.success("Kullanıcı Kaydedildi")
                navigate('/login')
            }

        } catch (error) {
            toast.error("Kullanıcı Kaydedilirken Hata Oluştu")
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
        <div className='register'>
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
                            <Button type='submit' sx={{ textTransform: 'none', height: '28px', marginRight: '10px' }} variant='contained' color='info' >Kaydol</Button>
                            <Button sx={{ textTransform: 'none', height: '28px' }} variant='contained' color='inherit' onClick={clear} >Temizle</Button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default RegisterPage