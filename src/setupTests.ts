import '@testing-library/jest-dom'
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util'

(global as any).TextEncoder = NodeTextEncoder;
(global as any).TextDecoder = NodeTextDecoder
