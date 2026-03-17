import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Kodemy logo', () => {
  render(<App />);
  const linkElement = screen.getByText(/Kodemy/i);
  expect(linkElement).toBeInTheDocument();
});
