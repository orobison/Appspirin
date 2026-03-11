import React from 'react';
import { render } from '@testing-library/react-native';
import CrisisLineSettingsScreen from './CrisisLineSettingsScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = {
  key: 'CrisisLineSettings',
  name: 'CrisisLineSettings' as const,
  params: undefined,
};

describe('CrisisLineSettingsScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <CrisisLineSettingsScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('CrisisLineSettingsScreen')).toBeTruthy();
  });
});
