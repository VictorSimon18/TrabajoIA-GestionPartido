import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows, borderRadius, spacing } from '../styles/theme';

const Timer = forwardRef(({ onTimeUpdate }, ref) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [half, setHalf] = useState(1); // 1 = Primera parte, 2 = Segunda parte
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
        setSeconds(prev => {
          const newValue = prev + 1;
          if (onTimeUpdate) {
            onTimeUpdate(newValue);
          }
          return newValue;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

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
      setSeconds(45 * 60); // 45 minutos para empezar segunda parte
      setHalf(2);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.halfIndicator}>
        <Text style={styles.halfText}>
          {half === 1 ? '1ª Parte' : '2ª Parte'}
        </Text>
      </View>

      <Text style={styles.timerText}>{formatTime(seconds)}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isRunning ? styles.pauseButton : styles.playButton]}
          onPress={handlePlayPause}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>

        {half === 1 && !isRunning && seconds > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.nextHalfButton]}
            onPress={handleNextHalf}
          >
            <Text style={styles.buttonText}>2ª →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  halfIndicator: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginBottom: spacing.sm,
  },
  halfText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  playButton: {
    backgroundColor: colors.success,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  resetButton: {
    backgroundColor: colors.danger,
  },
  nextHalfButton: {
    backgroundColor: colors.info,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default Timer;
