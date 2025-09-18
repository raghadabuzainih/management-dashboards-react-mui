import {screen} from '@testing-library/react'
import { AppBarAndDrawer } from '../AppBarAndDrawer'
import {renderWithProviders} from '../../shared/test-utils'
import userEvent from '@testing-library/user-event'

test('click on drawer will open or close', async()=> {
    renderWithProviders(<AppBarAndDrawer />)
    //default is closed
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument()

    //show-drawer-icon selected from aria-label
    await userEvent.click(screen.getByRole('button', {name: 'show-drawer-icon'}))
    expect(screen.queryByRole("presentation")).toBeInTheDocument()
})