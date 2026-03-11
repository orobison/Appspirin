import React from 'react';
import { render } from '@testing-library/react-native';
import PlanHubScreen from './PlanHubScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'PlanHub', name: 'PlanHub' as const, params: undefined };

describe('PlanHubScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <PlanHubScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('PlanHubScreen')).toBeTruthy();
  });
});
