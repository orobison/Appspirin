import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanStackParamList } from '../../navigation/types';
import { withErrorBoundary } from '../../utils/errorBoundary';

type Props = NativeStackScreenProps<PlanStackParamList, 'PlanHub'>;

function PlanHubScreen(_props: Props) {
  return (
    <View style={styles.container}>
      <Text>PlanHubScreen</Text>
    </View>
  );
}

export default withErrorBoundary(PlanHubScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
