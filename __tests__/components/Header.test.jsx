import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '../../app/components/Header/Header'
 
describe('Header', () => {
  it('renders a heading', () => {
    expect.assertions();
    render(<Header />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})