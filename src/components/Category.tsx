import React, { useEffect } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import categoryService from '../services/CategoryService';
import { useDispatch } from 'react-redux';
import { setLoading, setProducts } from '../redux/appSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import productService from '../services/ProductService';
import type { ProductType } from '../types/Types';

function Category() {

    const dispatch = useDispatch()

    const [categories, setCategories] = useState<string[]>()

    const getAllCategories = async () => {
        try {
            dispatch(setLoading(true))
            const categories: string[] = await categoryService.getAllCategories()
            setCategories(categories)
            console.log(categories)
        } catch (error) {
            toast.error("Kategori Listesi Alınırken Hata Oluştu" + error)
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    const handleCategory = async (e: React.ChangeEvent<HTMLInputElement>, categoryName: string) => {
        try {
            dispatch(setLoading(true))
            if (e.target.checked) {
                const products: ProductType[] = await categoryService.getProductsByCategoryName(categoryName)
                dispatch(setProducts(products))
            }
            else {
                const products: ProductType[] = await productService.getAllProducts()
                dispatch(setProducts(products))
            }
        } catch (error) {
            toast.error("Kategoriler Alınırken Hata Oluştu")

        }
        finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        getAllCategories()

    }, [])

    return (
        <div style={{ marginTop: '60px', marginLeft: '20px' }}>
            <FormGroup>
                {
                    categories && categories.map((category: string, index: number) => (
                        <FormControlLabel key={index} control={
                            <Checkbox onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCategory(e, category)} />
                        } label={category} />
                    ))
                }

            </FormGroup>
        </div>
    )
}

export default Category