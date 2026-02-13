import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, borderRadius, spacing } from '../styles/theme';

const Timer = forwardRef(({ onTimeUpdate }, ref) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [half, setHalf] = useState(1);
  const intervalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getTime: () => seconds,
    getMinutes: () => Math.floor(seconds / 60),
    isRunning: () => isRunning,
    getHalf: () => half,
  }));

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(seconds);
    }
  }, [seconds]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setHalf(1);
  };

  const handleNextHalf = () => {
    if (half === 1) {
      setIsRunning(false);
      setSeconds(45 * 60);
      setHalf(2);
    }
  };

  return (
    <View style={styles.container}>
      {/* Half indicator */}
      <View style={styles.halfRow}>
        <View style={[styles.halfBadge, half === 1 && styles.halfBadgeActive]}>
          <Text style={[styles.halfText, half === 1 && styles.halfTextActive]}>1T</Text>
        </View>
        <View style={styles.halfDivider} />
        <View style={[styles.halfBadge, half === 2 && styles.halfBadgeActive]}>
          <Text style={[styles.halfText, half === 2 && styles.halfTextActive]}>2T</Text>
        </View>
      </View>

      {/* Timer display */}
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>

      {/* Controls */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={styles.resetIcon}>↺</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.playButton, isRunning && styles.pauseButton]}
          onPress={handlePlayPause}
        >
          <LinearGradient
            colors={isRunning ? ['#FFD600', '#FFAB00'] : ['#00E676', '#00C853']}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playIcon}>
              {isRunning ? '❚❚' : '▶'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {half === 1 && !isRunning && seconds > 0 ? (
          <TouchableOpacity
            style={[styles.button, styles.nextHalfButton]}
            onPress={handleNextHalf}
          >
            <Text style={styles.nextHalfText}>2T →</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.button, { backgroundColor: 'transparent' }]} />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  halfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  halfBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  halfBadgeActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  halfText: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  halfTextActive: {
    color: colors.primary,
  },
  halfDivider: {
    width: 20,
    height: 1,
    backgroundColor: colors.border,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '200',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    ...shadows.glow,
  },
  pauseButton: {
    ...shadows.accentGlow,
  },
  playButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  resetButton: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetIcon: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  nextHalfButton: {
    backgroundColor: colors.infoGlow,
    borderWidth: 1,
    borderColor: colors.info,
  },
  nextHalfText: {
    fontSize: 12,
    color: colors.info,
    fontWeight: '700',
  },
});

export default Timer;
