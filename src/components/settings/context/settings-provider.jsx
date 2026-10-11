import { isEqual } from 'es-toolkit';
import { useLocalStorage } from 'minimal-shared/hooks';
import { useCallback, useMemo, useState } from 'react';

import { SETTINGS_STORAGE_KEY } from '../settings-config';

import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function SettingsProvider({
  children,
  defaultSettings: baseSettings,
  storageKey = SETTINGS_STORAGE_KEY,
}) {
  const mergedDefaultSettings = useMemo(() => {
    const configPrimary = baseSettings?.primaryColor || 'default';

    return {
      ...(baseSettings || {}),
      primaryColor: configPrimary,
    };
  }, [baseSettings]);

  const { state, setState, resetState, setField } = useLocalStorage(
    storageKey,
    mergedDefaultSettings
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, mergedDefaultSettings);

  const onReset = useCallback(() => {
    resetState(mergedDefaultSettings);
  }, [mergedDefaultSettings, resetState]);

  const memoizedValue = useMemo(
    () => ({
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      state,
      setState,
      setField,
    }),
    [canReset, onReset, openDrawer, onCloseDrawer, onToggleDrawer, state, setField, setState]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
