import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, borderRadius, spacing } from '../styles/theme';

const Timer = forwardRef(({ onTimeUpdate }, ref) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [half, setHalf] = useState(1);
  const [stoppageTime1, setStoppageTime1] = useState(0);
  const [stoppageTime2, setStoppageTime2] = useState(0);
  const intervalRef = useRef(null);

  const inStoppage1 = half === 1 && seconds >= 45 * 60;
  const inStoppage2 = half === 2 && seconds >= 90 * 60;
  const showStoppageBox = inStoppage1 || inStoppage2;

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
    if (onTimeUpdate) onTimeUpdate(seconds);
  }, [seconds]);

  const formatTime = (totalSeconds) => {
    if (inStoppage1) {
      const extra = Math.floor((totalSeconds - 45 * 60) / 60);
      return `45+${extra}`;
    }
    if (inStoppage2) {
      const extra = Math.floor((totalSeconds - 90 * 60) / 60);
      return `90+${extra}`;
    }
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => setIsRunning(prev => !prev);

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setHalf(1);
    setStoppageTime1(0);
    setStoppageTime2(0);
  };

  const handleNextHalf = () => {
    setIsRunning(false);
    setSeconds(45 * 60);
    setHalf(2);
  };

  const adjustStoppage = (delta) => {
    if (inStoppage1) {
      setStoppageTime1(prev => Math.max(0, Math.min(15, prev + delta)));
    } else if (inStoppage2) {
      setStoppageTime2(prev => Math.max(0, Math.min(15, prev + delta)));
    }
  };

  const currentStoppage = inStoppage1 ? stoppageTime1 : stoppageTime2;
  const canGoToSecondHalf = half === 1 && !isRunning && seconds >= (45 + stoppageTime1) * 60;

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

      {/* Timer row: time + stoppage box */}
      <View style={styles.timerRow}>
        <Text style={[styles.timerText, showStoppageBox && styles.timerTextCompact]}>
          {formatTime(seconds)}
        </Text>

        {showStoppageBox && (
          <View style={styles.stoppageBox}>
            <Text style={styles.stoppageLabel}>T. Añadido</Text>
            <View style={styles.stoppageControls}>
              <TouchableOpacity
                style={styles.stoppageBtn}
                onPress={() => adjustStoppage(-1)}
                activeOpacity={0.7}
              >
                <Text style={styles.stoppageBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stoppageValueBox}>
                <Text style={styles.stoppageValue}>{currentStoppage}'</Text>
              </View>
              <TouchableOpacity
                style={styles.stoppageBtn}
                onPress={() => adjustStoppage(1)}
                activeOpacity={0.7}
              >
                <Text style={styles.stoppageBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
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
            <Text style={styles.playIcon}>{isRunning ? '❚❚' : '▶'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {canGoToSecondHalf ? (
          <TouchableOpacity style={[styles.button, styles.nextHalfButton]} onPress={handleNextHalf}>
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
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '200',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: 4,
  },
  timerTextCompact: {
    fontSize: 52,
    letterSpacing: 2,
  },
  stoppageBox: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  stoppageLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stoppageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stoppageBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stoppageBtnText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  stoppageValueBox: {
    minWidth: 36,
    alignItems: 'center',
  },
  stoppageValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.accent,
    fontVariant: ['tabular-nums'],
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
