import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={[{ paddingTop: insets.top }, styles.container]}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerAvatar} />
        <View style={styles.headerText}>
          <View style={styles.headerTitle} />
          <View style={styles.headerSubtitle} />
        </View>
      </View>

      {/* Content Cards */}
      <View style={styles.content}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar} />
              <View style={styles.cardTitle} />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.textLine} />
              <View style={[styles.textLine, styles.textLineShort]} />
              <View style={[styles.textLine, styles.textLineMedium]} />
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.button} />
              <View style={styles.button} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  headerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333333',
  },
  headerText: {
    marginLeft: 15,
    flex: 1,
  },
  headerTitle: {
    height: 24,
    width: '70%',
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 8,
  },
  headerSubtitle: {
    height: 16,
    width: '50%',
    backgroundColor: '#333333',
    borderRadius: 4,
  },
  content: {
    padding: 10,
  },
  card: {
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444444',
  },
  cardTitle: {
    height: 20,
    width: '60%',
    backgroundColor: '#444444',
    borderRadius: 4,
    marginLeft: 12,
  },
  cardContent: {
    marginBottom: 16,
  },
  textLine: {
    height: 14,
    backgroundColor: '#444444',
    borderRadius: 4,
    marginBottom: 8,
  },
  textLineShort: {
    width: '40%',
  },
  textLineMedium: {
    width: '70%',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 36,
    width: '45%',
    backgroundColor: '#444444',
    borderRadius: 8,
  },
});
