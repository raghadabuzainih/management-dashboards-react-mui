import { createRoot } from 'react-dom/client'
import {App} from './App'

const root = document.getElementById('root') as HTMLElement | null
if(!root) throw new Error('root element not found')

createRoot(root).render(<App />)