import React from 'react';
import { render } from '@testing-library/react-native';
import PathSelectionScreen from './PathSelectionScreen';

const mockNavigation = { navigate: jest.fn() } as any;
const mockRoute = { key: 'PathSelection', name: 'PathSelection' as const, params: undefined };

describe('PathSelectionScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <PathSelectionScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('PathSelectionScreen')).toBeTruthy();
  });
});
