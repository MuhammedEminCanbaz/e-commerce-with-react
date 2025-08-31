import { Button, Drawer } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { setDrawer, updateBalance } from "../redux/appSlice"
import type { ProductType } from "../types/Types"
import { useEffect } from "react"
import { calculateBasket, removeProductFromBasket, setBasket } from "../redux/basketSlice"
import { toast } from "react-toastify"
import { current } from "@reduxjs/toolkit"
import type { UserType } from "../types/Types"

function BasketDetails() {


    const { drawer, currentUser } = useSelector((state: RootState) => state.app)
    const { basket, totalAmount } = useSelector((state: RootState) => state.basket)


    const dispatch = useDispatch()

    const closeDrawer = () => {
        dispatch(setDrawer(false))
    }

    useEffect(() => {
        dispatch(calculateBasket());
    }, [dispatch, basket]);

    const removeProduct = (productId: number) => {
        dispatch(removeProductFromBasket(productId))
    }

    const buy = () => {
        if (currentUser?.balance && currentUser.balance < totalAmount) {
            toast.warn("Bakiyeniz Yeterli Değildir")
            return;
        }
        if (currentUser?.balance) {
            const remainingTotal = currentUser.balance - totalAmount
            const payload: UserType = {
                ...currentUser,
                balance: remainingTotal
            }
            dispatch(updateBalance(payload))
            dispatch(setBasket([]))
            localStorage.removeItem("basket")
            toast.success("Ürünler Başarıyla Satın Alınmıştır")
        }


    }

    return (
        <Drawer open={drawer} anchor="right" onClose={closeDrawer}>
            {
                basket && basket.map((product: ProductType) => (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: '20px 30px' }}>
                            <div style={{ marginRight: '15px' }}>
                                <img src={product.image} width={60} height={60} alt="" />
                                <div style={{ width: '300px' }}>
                                    <div style={{ fontFamily: 'arial', fontWeight: 'bold' }}>{product.title.substring(0, 30)}</div>
                                    <div>{product.description.substring(0, 40)}</div>
                                </div>
                            </div>
                            <div style={{ marginRight: '40px' }}>{product.count}</div>
                            <div style={{ fontFamily: 'arial', fontSize: '15px', fontWeight: 'bold', width: '70px' }}>{product.price}$</div>
                            <div><Button onClick={() => removeProduct(product.id)} size="small" variant="outlined" sx={{ textTransform: 'none', height: '25px' }}>Çıkar</Button></div>
                        </div>

                    </>
                ))
            }
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '18px', fontFamily: 'arial' }}>
                    Toplam Tutar: {totalAmount}$
                </div>
                <div><Button onClick={buy} sx={{ marginTop: '15px' }} size="small" variant="contained" color="success">Satın Al</Button></div>
            </div>
        </Drawer>
    )
}

export default BasketDetails