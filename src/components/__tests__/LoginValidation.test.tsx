import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Login } from '../../pages/Login'
import users from '../../data/users.json'
import { renderWithProviders } from '../../shared/test-utils'
import { Role, User } from '../../types/User'
import { waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

const allUsers = users as User[]

describe('Login component', () => {
  const fakeLogin = jest.fn()
  const renderLogin = () =>
    renderWithProviders(<Login />, { userRole: Role.Guest, login: fakeLogin })

  const fillAndSubmitForm = async (email: string, password: string) => {
    const emailInput = screen.getByLabelText(/email feild/i)
    const passwordInput = screen.getByLabelText(/password field/i)
    const submitButton = screen.getByRole('button', { name: /submit login/i })

    await userEvent.type(emailInput, email)
    await userEvent.type(passwordInput, password)
    await userEvent.click(submitButton)
  }

  test('renders form fields', () => {
    renderLogin()
    expect(screen.getByLabelText(/email feild/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password field/i)).toBeInTheDocument()
  })

  test('shows validation error for invalid email', async () => {
    renderLogin()
    await fillAndSubmitForm('wrongemail@example.com', '123456')

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })
test('calls login for valid user', async () => {
    const validUser = users[0]
    if(!validUser) throw new Error('user not found')
  const fakeLogin = jest.fn()
  renderWithProviders(<Login />, { userRole: Role.Guest, login: fakeLogin })

  const emailInput = screen.getByLabelText(/email feild/i)
  const passwordInput = screen.getByLabelText(/password field/i)
  const submitButton = screen.getByRole('button', { name: /submit login/i })

  await act(async () => {
    await userEvent.type(emailInput, validUser.email)
    await userEvent.type(passwordInput, validUser.password)
    await userEvent.click(submitButton)
  })

  await waitFor(() => {
    expect(fakeLogin).toHaveBeenCalledTimes(1)
    expect(fakeLogin).toHaveBeenCalledWith(validUser.email)
  })
})


})
