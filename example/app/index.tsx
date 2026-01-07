import { StyleSheet, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { useReflekt, ReflektSDK, Survey } from '@reflekt/react-native';
import { useState, useCallback } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const { isReady } = useReflekt();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);

  const handleReloadSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const sdk = ReflektSDK.getInstance();
      const available = await sdk.reloadAvailableSurveys();
      setSurveys(available);
      Alert.alert('Surveys Loaded', `Found ${available.length} available survey(s)`);
    } catch (error) {
      Alert.alert('Error', 'Failed to load surveys. Check console for details.');
      console.error('Failed to load surveys:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Reflekt SDK Demo</ThemedText>
        <ThemedText style={styles.subtitle}>
          Test and develop the Reflekt Survey SDK
        </ThemedText>
      </ThemedView>

      {/* SDK Status Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">SDK Status</ThemedText>
        <View style={styles.statusRow}>
          <ThemedText>Ready:</ThemedText>
          <View style={[styles.statusIndicator, isReady ? styles.statusReady : styles.statusNotReady]} />
          <ThemedText>{isReady ? 'Yes' : 'No'}</ThemedText>
        </View>
      </ThemedView>

      {/* Actions Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Actions</ThemedText>
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={handleReloadSurveys}
          disabled={loading || !isReady}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Loading...' : 'Reload Surveys'}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.helpText}>
          This will fetch available surveys from the API
        </ThemedText>
      </ThemedView>

      {/* Available Surveys Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Available Surveys ({surveys.length})</ThemedText>
        
        {surveys.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No surveys available. Tap &quot;Reload Surveys&quot; or configure your API key in _layout.tsx
          </ThemedText>
        ) : (
          surveys.map((survey) => (
            <View key={survey._id} style={styles.surveyCard}>
              <ThemedText type="defaultSemiBold">{survey.title}</ThemedText>
              {survey.description && (
                <ThemedText style={styles.surveyDescription}>{survey.description}</ThemedText>
              )}
              <ThemedText style={styles.surveyMeta}>
                {survey.questions.length} question(s) • Status: {survey.status}
              </ThemedText>
            </View>
          ))
        )}
      </ThemedView>

      {/* Instructions Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Getting Started</ThemedText>
        <View style={styles.instructionStep}>
          <ThemedText type="defaultSemiBold">1. Configure API Key</ThemedText>
          <ThemedText>
            Open app/_layout.tsx and replace YOUR_API_KEY with your actual API key
          </ThemedText>
        </View>
        <View style={styles.instructionStep}>
          <ThemedText type="defaultSemiBold">2. Set Respondent ID</ThemedText>
          <ThemedText>
            Replace the respondentId with your user&apos;s unique identifier
          </ThemedText>
        </View>
        <View style={styles.instructionStep}>
          <ThemedText type="defaultSemiBold">3. Create Surveys</ThemedText>
          <ThemedText>
            Create surveys in your Reflekt dashboard and set them to &quot;active&quot;
          </ThemedText>
        </View>
        <View style={styles.instructionStep}>
          <ThemedText type="defaultSemiBold">4. Enable Auto-Show (optional)</ThemedText>
          <ThemedText>
            Set autoShow: true in the config to automatically display surveys
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusReady: {
    backgroundColor: '#4CAF50',
  },
  statusNotReady: {
    backgroundColor: '#F44336',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  helpText: {
    fontSize: 13,
    opacity: 0.6,
  },
  emptyText: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  surveyCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 16,
    borderRadius: 10,
    gap: 4,
  },
  surveyDescription: {
    opacity: 0.8,
  },
  surveyMeta: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  instructionStep: {
    gap: 4,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#6366F1',
  },
});
