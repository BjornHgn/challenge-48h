import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from './RegisterPage';
import '@testing-library/jest-dom';

describe('RegisterPage', () => {
  test('renders RegisterPage component', () => {
    render(<RegisterPage />);
    // Example: Check if a heading or form element is present
    const heading = screen.getByRole('heading', { name: /register/i });
    expect(heading).toBeInTheDocument();
  });
});
