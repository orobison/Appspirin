import React from 'react';
import { render } from '@testing-library/react-native';
import ScanScreen from './ScanScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'Scan', name: 'Scan' as const, params: undefined };

describe('ScanScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <ScanScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('ScanScreen')).toBeTruthy();
  });
});
