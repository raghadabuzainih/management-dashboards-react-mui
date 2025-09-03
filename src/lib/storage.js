export const storage = {
    getItem: (key) => {
        try{
            return JSON.parse(localStorage.getItem(key) || 'null')
        }catch{
            return null
        }
    },
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    },
    removeItem: (key) => {
        localStorage.removeItem(key)
    }
}