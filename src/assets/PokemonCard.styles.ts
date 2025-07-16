import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteItem: {
    backgroundColor: '#fff3cd',
  },
  evolvableItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  evolvedItem: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pokemonImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#343a40',
    fontWeight: '500',
  },
  originalName: {
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#6c757d',
    textDecorationLine: 'line-through',
  },
  currentName: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#343a40',
    fontWeight: '500',
  },
  evolutionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  evolvedText: {
    fontSize: 12,
    color: '#2e7d32',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2, // ⬅️ Garante que fique acima da tag
    minWidth: 80,
  },

  evolveButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
  },
  favoriteButton: {
    padding: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  evolvedTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  evolvedTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  evolutionStatus: {
    marginTop: 4,
  },

  typePill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },


  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },

});

export default styles;