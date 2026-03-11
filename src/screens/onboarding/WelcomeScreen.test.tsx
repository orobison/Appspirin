import React from 'react';
import { render } from '@testing-library/react-native';
import WelcomeScreen from './WelcomeScreen';
import { ThemeProvider } from '../../theme/ThemeContext';

jest.mock('../../hooks/useDatabase', () => ({
  useDatabase: () => ({}),
}));

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'Welcome', name: 'Welcome' as const, params: undefined };

describe('WelcomeScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <ThemeProvider>
        <WelcomeScreen navigation={mockNavigation} route={mockRoute} />
      </ThemeProvider>,
    );
    expect(getByText('Appspirin')).toBeTruthy();
    expect(getByText('Get started')).toBeTruthy();
    expect(getByText('Skip for now')).toBeTruthy();
  });
});
