import React from 'react';
import { render } from '@testing-library/react-native';
import WelcomeScreen from './WelcomeScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'Welcome', name: 'Welcome' as const, params: undefined };

describe('WelcomeScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <WelcomeScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('WelcomeScreen')).toBeTruthy();
  });
});
