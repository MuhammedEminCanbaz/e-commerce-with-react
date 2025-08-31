import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MagaraIcon from '../images/magara.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterProducts, setCurrentUser, setDrawer, setProducts } from '../redux/appSlice';
import { toast } from 'react-toastify';
import type { ProductType } from '../types/Types';
import productService from '../services/ProductService';
import { FaBasketShopping } from "react-icons/fa6";
import Badge from '@mui/material/Badge';
import type { RootState } from '../redux/store';



function Navbar() {

    const { basket } = useSelector((state: RootState) => state.basket)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logout = () => {
        localStorage.removeItem("currentUser")
        dispatch(setCurrentUser(null))
        navigate("/login")
        toast.success("Başarıyla Çıkış Yapıldı")
    }

    const handleFilter = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.value) {
                dispatch(filterProducts(e.target.value))
            }
            else {
                const products: ProductType[] = await productService.getAllProducts()
                dispatch(setProducts(products))
            }
        } catch (error) {
            toast.error("Filtreleme Yaparken Hata Oluştu")
        }
    }

    const openDrawer = () => {
        dispatch(setDrawer(true))
    }
    return (

        <AppBar position="static" sx={{ backgroundColor: '#454242' }}>
            <Toolbar>
                <IconButton onClick={() => navigate("/")}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <img src={MagaraIcon} width={60} height={60} />
                </IconButton>
                <Typography onClick={() => navigate("/")} variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }}>
                    E-Shop
                </Typography>
                <div style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}>
                    <TextField
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilter(e)}
                        sx={{ width: '300px', marginBottom: '25px', marginRight: '20px' }}
                        id="searchInput"
                        placeholder='Bir Şey Ara...'
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                                style: { color: 'lightgray', borderBottom: '1px solid lightgray' }
                            },
                        }}
                        variant="standard"
                    />

                    <Badge onClick={openDrawer} badgeContent={basket.length} color="warning" sx={{ margin: '0px 10px', cursor: 'pointer' }}>
                        <FaBasketShopping style={{ fontSize: '18px', cursor: 'pointer' }} />
                    </Badge>

                    <Button onClick={logout} sx={{ color: 'lightgray' }} color="inherit">Çıkış Yap</Button>
                </div>
            </Toolbar>
        </AppBar>)
}

export default Navbar