import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { withErrorBoundary } from '../../utils/errorBoundary';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuickSetup'>;

function QuickSetupScreen(_props: Props) {
  return (
    <View style={styles.container}>
      <Text>QuickSetupScreen</Text>
    </View>
  );
}

export default withErrorBoundary(QuickSetupScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
