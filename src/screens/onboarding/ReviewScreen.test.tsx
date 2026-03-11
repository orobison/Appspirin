import React from 'react';
import { render } from '@testing-library/react-native';
import ReviewScreen from './ReviewScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'Review', name: 'Review' as const, params: {} };

describe('ReviewScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <ReviewScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('ReviewScreen')).toBeTruthy();
  });
});
