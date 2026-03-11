import React from 'react';
import { render } from '@testing-library/react-native';
import PathSelectionScreen from './PathSelectionScreen';
import { ThemeProvider } from '../../theme/ThemeContext';

jest.mock('../../hooks/useDatabase', () => ({
  useDatabase: () => ({}),
}));

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'PathSelection', name: 'PathSelection' as const, params: undefined };

describe('PathSelectionScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <ThemeProvider>
        <PathSelectionScreen navigation={mockNavigation} route={mockRoute} />
      </ThemeProvider>,
    );
    expect(getByText('Quick setup')).toBeTruthy();
    expect(getByText('Walk me through it')).toBeTruthy();
    expect(getByText('Skip for now')).toBeTruthy();
  });
});
