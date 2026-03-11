import React from 'react';
import { render } from '@testing-library/react-native';
import AppAppearanceScreen from './AppAppearanceScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'AppAppearance', name: 'AppAppearance' as const, params: undefined };

describe('AppAppearanceScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <AppAppearanceScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('AppAppearanceScreen')).toBeTruthy();
  });
});
