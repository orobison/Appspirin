import React from 'react';
import { render } from '@testing-library/react-native';
import CheckInHistoryScreen from './CheckInHistoryScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'CheckInHistory', name: 'CheckInHistory' as const, params: undefined };

describe('CheckInHistoryScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <CheckInHistoryScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('CheckInHistoryScreen')).toBeTruthy();
  });
});
