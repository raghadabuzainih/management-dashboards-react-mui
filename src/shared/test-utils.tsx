import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeModeContext } from "../contexts/ThemeModeContext";
import { ReactNode } from "react";
import { useState } from "react";
import { render } from "@testing-library/react";
import { Role } from "../types/User";
import { Provider } from "react-redux";
import { store } from "../store";

type customRenderOptions={ 
    children: ReactNode
    userRole?: Role|undefined
    login?: ((email: string) => void) | undefined
}

const Providers = ({children, userRole= Role.Admin, login}: customRenderOptions) => {
    const [mode, setMode] = useState<"light" | "dark">("light");
    const fakeUser = { value: "test@example.com", role: userRole, expiry: Date.now() + 10000 };

    return(
        <BrowserRouter>
            <Provider store={store}>
                <ThemeModeContext.Provider value={{mode: mode, setMode: setMode}}>
                    <AuthContext.Provider value={{ userEmail: fakeUser, login: login ?? jest.fn(), logout: jest.fn() }}>
                        {children}
                    </AuthContext.Provider>         
                           </ThemeModeContext.Provider>
            </Provider>
        </BrowserRouter>
    )
}

export const renderWithProviders = (ui: ReactNode, options?: {userRole?: Role, login?: (email: string) => void}) =>
  render(<Providers userRole={options?.userRole} login={options?.login}>{ui}</Providers>)
