import * as yup from 'yup'

export const registerPageSchema = yup.object().shape({
    username: yup.string().required("Kullanıcı Adını Giriniz"),
    password: yup.string().required("Lütfen Şifrenizi Giriniz")
})