import React from 'react';
import { render } from '@testing-library/react-native';
import CheckInScreen from './CheckInScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'CheckIn', name: 'CheckIn' as const, params: {} };

describe('CheckInScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <CheckInScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('CheckInScreen')).toBeTruthy();
  });
});
