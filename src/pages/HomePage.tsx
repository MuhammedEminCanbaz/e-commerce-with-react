import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { UserType } from '../types/Types'
import { setCurrentUser } from '../redux/appSlice'
import { current } from '@reduxjs/toolkit'

function HomePage() {

    const dispatch = useDispatch()

    useEffect(() => {
        const result = localStorage.getItem("currentUser")
        if (result) {
            const currentUser: UserType = JSON.parse(result) as UserType
            dispatch(setCurrentUser(currentUser))
        }
    }, [])

    return (
        <div>HomePage</div>
    )
}

export default HomePage