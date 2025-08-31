import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setLoading } from '../redux/appSlice'
import { toast } from 'react-toastify'
import productService from '../services/ProductService'
import type { ProductType } from '../types/Types'
import { addProductToBasket } from '../redux/basketSlice'

function ProductDetail() {

    const [product, setProduct] = useState<ProductType | null>()

    const [count, setCount] = useState<number>(0)

    const { productId } = useParams()
    const dispatch = useDispatch()

    const getProductById = async (productId: number) => {
        try {
            dispatch(setLoading(true))
            const product: ProductType = await productService.getProductById(productId)
            setProduct(product)

        } catch (error) {
            toast.error("Ürün Getirilirken Hata Oluştu" + error)
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    const addBasket = () => {
        if (product) {
            const payload: ProductType = {
                ...product,
                count: count
            }
            dispatch(addProductToBasket(payload))
            toast.success("Ürün Sepete Eklendi")
        }
    }

    useEffect(() => {
        getProductById(Number(productId))
    }, [])

    return (
        <Container maxWidth='lg'>
            {
                product && <>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: '60px' }}>
                        <div>
                            <img src={product.image} width={250} height={400} />
                        </div>
                        <div style={{ marginLeft: '60px', marginTop: '60px' }}>
                            <div style={{ fontFamily: 'arial', fontSize: '20px', fontWeight: 'bold' }}>
                                {product.title}
                            </div>
                            <div style={{ fontFamily: 'arial', fontSize: '15px', marginTop: '25px', height: '100px' }}>
                                {product.description}
                            </div>
                            <div style={{ fontFamily: 'arial', fontSize: '35px', fontWeight: 'bold' }}>
                                {product.price}$
                            </div>
                            <div style={{ marginTop: '15px' }}>
                                <span onClick={() => setCount(count + 1)} style={{ fontSize: '40px', fontWeight: 'bold', cursor: 'pointer', marginRight: '30px' }}>+</span>
                                <span style={{ fontSize: '40px', fontFamily: 'arial' }}>{count}</span>
                                <span onClick={() => setCount(count - 1)} style={{ fontSize: '40px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '30px' }}>-</span>
                            </div>
                            <div>
                                <Button onClick={addBasket} color='info' variant='contained' size='small' sx={{ textTransform: 'none', marginTop: '15px' }}>Sepete Ekle</Button>
                            </div>
                        </div>
                    </div>

                </>
            }
        </Container>
    )
}

export default ProductDetail