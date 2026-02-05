import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { borderRadius } from '../styles/theme';

const teamLogos = {
  barcelona: require('../../assets/teams/barcelona.png'),
  madrid: require('../../assets/teams/madrid.png'),
};

const TeamBadge = ({ team, size = 50 }) => {
  const logo = teamLogos[team.id];
  const teamColor = team.color || '#1A1F36';
  const badgeRadius = size > 40 ? borderRadius.lg : borderRadius.md;

  if (logo) {
    return (
      <View style={[styles.container, { width: size, height: size, borderRadius: badgeRadius }]}>
        <Image
          source={logo}
          style={[styles.image, { width: size - 8, height: size - 8 }]}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (team.logoUrl) {
    return (
      <View style={[styles.container, { width: size, height: size, borderRadius: badgeRadius }]}>
        <Image
          source={{ uri: team.logoUrl }}
          style={[styles.image, { width: size - 8, height: size - 8 }]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: badgeRadius, backgroundColor: teamColor }]}>
      <Text style={[
        styles.initials,
        { fontSize: size * 0.36 },
        teamColor === '#FFFFFF' && { color: '#1A1F36' },
      ]}>
        {team.name.substring(0, 2).toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    borderRadius: 4,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});

export default TeamBadge;
