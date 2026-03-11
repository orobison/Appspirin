import React from 'react';
import { render } from '@testing-library/react-native';
import AboutPrivacyScreen from './AboutPrivacyScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'AboutPrivacy', name: 'AboutPrivacy' as const, params: undefined };

describe('AboutPrivacyScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <AboutPrivacyScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('AboutPrivacyScreen')).toBeTruthy();
  });
});
