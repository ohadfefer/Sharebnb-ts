import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import type { RootState } from './store.js'  

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch = () => useDispatch()