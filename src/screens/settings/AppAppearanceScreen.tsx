import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/types';
import { withErrorBoundary } from '../../utils/errorBoundary';

type Props = DrawerScreenProps<DrawerParamList, 'AppAppearance'>;

function AppAppearanceScreen(_props: Props) {
  return (
    <View style={styles.container}>
      <Text>AppAppearanceScreen</Text>
    </View>
  );
}

export default withErrorBoundary(AppAppearanceScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
