import React from 'react';
import { render } from '@testing-library/react-native';
import QuickSetupScreen from './QuickSetupScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'QuickSetup', name: 'QuickSetup' as const, params: undefined };

describe('QuickSetupScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <QuickSetupScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('QuickSetupScreen')).toBeTruthy();
  });
});
