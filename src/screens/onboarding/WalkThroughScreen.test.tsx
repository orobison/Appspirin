import React from 'react';
import { render } from '@testing-library/react-native';
import WalkThroughScreen from './WalkThroughScreen';
import { ThemeProvider } from '../../theme/ThemeContext';

jest.mock('../../hooks/useDatabase', () => ({
  useDatabase: () => ({}),
}));

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'WalkThrough', name: 'WalkThrough' as const, params: undefined };

describe('WalkThroughScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <ThemeProvider>
        <WalkThroughScreen navigation={mockNavigation} route={mockRoute} />
      </ThemeProvider>,
    );
    expect(getByText('Guided setup')).toBeTruthy();
    expect(getByText('Use quick setup instead')).toBeTruthy();
    expect(getByText('Skip for now')).toBeTruthy();
  });
});
