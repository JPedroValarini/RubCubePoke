import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#6c757d',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 12,
    color: '#333',
  },
  evolvedTag: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  evolvedText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#343a40',
  },
  value: {
    fontSize: 16,
    color: '#6c757d',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    margin: 4,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  abilityBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    margin: 4,
  },
  abilityText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ffc107',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default styles;
