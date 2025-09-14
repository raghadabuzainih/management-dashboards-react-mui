export const storage = {
    getItem: (key: string) => {
        try{
            return JSON.parse(localStorage.getItem(key) || 'null')
        }catch{
            return null
        }
    },
    // | string because mode value is string -> ('light' | 'dark')
    setItem: (key: string, value: object | string) => {
        localStorage.setItem(key, JSON.stringify(value))
    },
    removeItem: (key: string) => {
        localStorage.removeItem(key)
    }
}