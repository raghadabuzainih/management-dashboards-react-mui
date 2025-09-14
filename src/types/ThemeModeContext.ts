import {Dispatch, SetStateAction} from 'react'

export type ThemeModeContextType = {
    mode: 'light' | 'dark',
    setMode: Dispatch<SetStateAction<'light'|'dark'>>
}