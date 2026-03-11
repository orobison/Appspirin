import React from 'react';
import { render } from '@testing-library/react-native';
import WalkThroughScreen from './WalkThroughScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'WalkThrough', name: 'WalkThrough' as const, params: undefined };

describe('WalkThroughScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <WalkThroughScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('WalkThroughScreen')).toBeTruthy();
  });
});
