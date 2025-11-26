import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import ProductList from './ProductList'

afterEach(cleanup)

describe('ProductList', () => {
  it('should render successfully', () => {
    render(<ProductList />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/Product List/i)
  })
})
