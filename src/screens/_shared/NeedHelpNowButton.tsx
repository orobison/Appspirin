import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { callDefault988 } from '../../services/crisisCall';
import { zIndex } from '../../theme/tokens';

/**
 * Persistent floating crisis button rendered outside NavigationContainer.
 * Calls 988 by default; no confirmation gate per spec.
 * Positioned absolute so it overlays all screens including onboarding.
 */
export default function NeedHelpNowButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={callDefault988}
      accessibilityRole="button"
      accessibilityLabel="Need help now — call 988"
      accessibilityHint="Immediately calls the 988 Suicide and Crisis Lifeline"
    >
      <Text style={styles.label}>Need help now?</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    zIndex: zIndex.crisisButton,
    elevation: zIndex.crisisButton,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
