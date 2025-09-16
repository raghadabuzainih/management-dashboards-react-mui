import { screen, fireEvent, waitFor } from '@testing-library/react'
import { Login } from '../../pages/Login'
import { renderWithProviders } from '../../shared/test-utils'
import userEvent from '@testing-library/user-event'

describe('Login component (Formik + Yup)', () => {
  const fillAndSubmitForm = async (email: string, password: string) => {
    const emailInput = screen.getByLabelText(/email field/i)
    const passwordInput = screen.getByLabelText(/password field/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    if (email) await userEvent.type(emailInput, email)
    if (password) await userEvent.type(passwordInput, password)

    await userEvent.click(submitButton)
  }

  const testField = async(message: string, email: string, password: string, textName: string) => {
    it(message, async () => {
      renderWithProviders(<Login />)
      await fillAndSubmitForm(email, password)
      await waitFor(() => {
        expect(screen.getByText(textName)).toBeInTheDocument()
      })
    })
  }

  describe('Login validation', () => {
    testField('shows required email error when email is null', '', '123456', 'email is required')
    testField('shows incorrect email error when email not found', 'notfound@example.com', '123456', 'email is required')
    testField('shows invalid email error for wrong format','not-an-email','123456','email is required')
    testField('shows required error when password is empty','sara.khaled@gmail.com','','password is required')
    testField('shows incorrect password error when password is wrong','sara.khaled@gmail.com','wrongpassword','password is required')
  })
})
