import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  WineItem,
  MacroCategory,
  InventoryState,
} from './types';
import {
  BASE_WINES,
  ALL_BASE_REGIONS,
  getRegionLabel,
  getGroupLabel,
  normalizeWineName,
} from './data/wines';
import {
  Search,
  X,
  Plus,
  Minus,
  Edit2,
  Pencil,
  Share2,
  Copy,
  Mail,
  Undo2,
  ExternalLink,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import {
  googleSignIn,
  initAuth,
  logout,
  getAccessToken,
} from './services/googleAuth';
import {
  searchDriveSheets,
  createWineInventorySpreadsheet,
  DriveFile,
} from './services/googleDrive';
import { User } from 'firebase/auth';

const STORAGE_KEY = 'inv-vini-v2';

const DEFAULT_STATE: InventoryState = {
  c: {},
  add: [],
  del: [],
  ren: {},
  nid: 1,
  to: '',
  who: '',
  only: true,
};

type Lang = 'it' | 'en';

const I18N = {
  it: {
    appTitle: 'Inventario vini',
    countedOf: 'di',
    counted: 'contati',
    searchPlaceholder: 'Cerca vino',
    uncountedOnly: 'Solo da contare',
    allCategories: 'Tutti',
    allRegions: 'Tutte le regioni',
    sparkling: 'Bollicine',
    whites: 'Bianchi',
    roses: 'Rosati',
    reds: 'Rossi',
    dessert: 'Dolci',
    noWinesFound: 'Nessun vino trovato',
    edit: 'Modifica',
    done: 'Fine',
    wine: 'Vino',
    sendEmail: 'Invia email',
    drive: 'Drive',
    tapToRenameOrRemove: 'Tocca un vino per rinominarlo o rimuoverlo.',
    resetCounter: 'Azzera conteggio',
    tapToConfirm: 'Tocca per confermare',
    restoreRemoved: 'Ripristina rimossi',
    addWine: 'Aggiungi vino',
    editWine: 'Modifica vino',
    wineName: 'Nome del vino',
    category: 'Categoria',
    region: 'Regione',
    group: 'Gruppo',
    quantityOptional: 'Quantità (facoltativa)',
    save: 'Salva',
    cancel: 'Annulla',
    removeWine: 'Rimuovi vino',
    tapAgainToRemove: 'Tocca ancora per rimuovere',
    sendInventory: 'Invia inventario',
    recipient: 'Destinatario',
    countedBy: 'Contato da',
    includeCountedOnly: 'Includi solo i vini contati',
    remainingUncounted: ' - i restanti saranno segnati "non contato"',
    openEmail: 'Apri email',
    saveToDrive: 'Salva su Google Fogli (Drive)',
    share: 'Condividi',
    copy: 'Copia',
    close: 'Chiudi',
    toastWineAdded: 'Vino aggiunto',
    toastWineUpdated: 'Vino aggiornato',
    toastWineRemoved: 'Vino rimosso',
    toastWinesRestored: 'Vini ripristinati',
    toastCounterReset: 'Conteggio azzerato',
    toastNothingToReset: 'Niente da azzerare',
    toastEnterName: 'Scrivi il nome del vino',
    toastCopied: 'Copiato negli appunti',
    toastCopyUnavailable: 'Copia non disponibile',
    toastSignedIn: 'Accesso Google eseguito',
    toastSignedOut: 'Disconnesso',
    toastDriveSaved: 'Salvato su Google Drive',
    toastDriveError: 'Errore nel salvataggio su Drive',
    driveTitle: 'Integrazione Google Drive',
    driveDesc: 'Collega il tuo account Google per accedere al foglio Wine Liquor Order o salvare l\'inventario su Drive.',
    signInGoogle: 'Accedi con Google',
    signOut: 'Disconnetti',
    exportToSheets: 'Esporta conteggi su Google Fogli',
    exporting: 'Esportazione in corso...',
    spreadsheetCreated: 'Foglio creato con successo!',
    open: 'Apri',
    sheetsInDrive: 'Fogli di calcolo nel tuo Drive',
    refresh: 'Aggiorna',
    loadingFiles: 'Caricamento file...',
    noDriveFiles: 'Nessun foglio "Wine" trovato in Drive.',
    confirmExportTitle: 'Esportare su Google Drive?',
    confirmExportDesc: (count: number) => `Verrà creato un nuovo foglio Google Fogli con i conteggi di ${count} vini.`,
    confirm: 'Conferma',
    uncountedStatus: 'non contato',
  },
  en: {
    appTitle: 'Wine Inventory',
    countedOf: 'of',
    counted: 'counted',
    searchPlaceholder: 'Search wine',
    uncountedOnly: 'Uncounted only',
    allCategories: 'All',
    allRegions: 'All regions',
    sparkling: 'Sparkling',
    whites: 'Whites',
    roses: 'Rosés',
    reds: 'Reds',
    dessert: 'Dessert',
    noWinesFound: 'No wines found',
    edit: 'Edit',
    done: 'Done',
    wine: 'Wine',
    sendEmail: 'Send Email',
    drive: 'Drive',
    tapToRenameOrRemove: 'Tap a wine to rename or remove it.',
    resetCounter: 'Reset counter',
    tapToConfirm: 'Tap to confirm',
    restoreRemoved: 'Restore removed',
    addWine: 'Add Wine',
    editWine: 'Edit Wine',
    wineName: 'Wine Name',
    category: 'Category',
    region: 'Region',
    group: 'Group',
    quantityOptional: 'Quantity (optional)',
    save: 'Save',
    cancel: 'Cancel',
    removeWine: 'Remove wine',
    tapAgainToRemove: 'Tap again to remove',
    sendInventory: 'Send Inventory',
    recipient: 'Recipient',
    countedBy: 'Counted by',
    includeCountedOnly: 'Include counted wines only',
    remainingUncounted: ' - remaining will be marked "uncounted"',
    openEmail: 'Open Email',
    saveToDrive: 'Save to Google Sheets (Drive)',
    share: 'Share',
    copy: 'Copy',
    close: 'Close',
    toastWineAdded: 'Wine added',
    toastWineUpdated: 'Wine updated',
    toastWineRemoved: 'Wine removed',
    toastWinesRestored: 'Wines restored',
    toastCounterReset: 'Counter reset',
    toastNothingToReset: 'Nothing to reset',
    toastEnterName: 'Please enter wine name',
    toastCopied: 'Copied to clipboard',
    toastCopyUnavailable: 'Copy not available',
    toastSignedIn: 'Signed in with Google',
    toastSignedOut: 'Signed out',
    toastDriveSaved: 'Saved to Google Drive',
    toastDriveError: 'Error saving to Google Drive',
    driveTitle: 'Google Drive Integration',
    driveDesc: 'Connect your Google account to access your Wine Liquor Order spreadsheet or save inventory counts directly to Google Drive.',
    signInGoogle: 'Sign in with Google',
    signOut: 'Sign out',
    exportToSheets: 'Export Counts to Google Sheets',
    exporting: 'Exporting...',
    spreadsheetCreated: 'Spreadsheet created!',
    open: 'Open',
    sheetsInDrive: 'Spreadsheets in your Drive',
    refresh: 'Refresh',
    loadingFiles: 'Loading files...',
    noDriveFiles: 'No spreadsheets matching "Wine" found in Drive.',
    confirmExportTitle: 'Export to Google Drive?',
    confirmExportDesc: (count: number) => `This will create a new Google Spreadsheet containing your inventory counts for ${count} wines.`,
    confirm: 'Confirm',
    uncountedStatus: 'uncounted',
  },
};

// Filter sequence: Rossi, Bianchi, Bollicine, Rosati, Dolci
const MACRO_SEQUENCE: MacroCategory[] = ['Rossi', 'Bianchi', 'Bollicine', 'Rosati', 'Dolci'];

function loadSavedState(): InventoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const cleanAdd = (parsed.add || []).map((a: WineItem) => ({
        ...a,
        n: normalizeWineName(a.n),
      }));
      const cleanRen: Record<string, string> = {};
      if (parsed.ren) {
        Object.entries(parsed.ren).forEach(([k, v]) => {
          cleanRen[k] = normalizeWineName(String(v));
        });
      }
      return {
        ...DEFAULT_STATE,
        ...parsed,
        c: parsed.c || {},
        add: cleanAdd,
        del: parsed.del || [],
        ren: cleanRen,
      };
    }
  } catch (err) {
    console.error('Failed to load local storage:', err);
  }
  return DEFAULT_STATE;
}

export default function App() {
  const [lang, setLang] = useState<Lang>('it');
  const t = I18N[lang];

  const [state, setState] = useState<InventoryState>(loadSavedState);
  const [selectedMacro, setSelectedMacro] = useState<MacroCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [uncountedOnly, setUncountedOnly] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Google Workspace / Drive state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isDriveSheetOpen, setIsDriveSheetOpen] = useState<boolean>(false);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isSearchingDrive, setIsSearchingDrive] = useState<boolean>(false);
  const [isExportingToDrive, setIsExportingToDrive] = useState<boolean>(false);
  const [driveExportSuccessUrl, setDriveExportSuccessUrl] = useState<string | null>(null);
  const [confirmDriveExportOpen, setConfirmDriveExportOpen] = useState<boolean>(false);

  // Keep set: stores IDs of wines touched during this session so they don't vanish under "uncountedOnly"
  const keepSet = useRef<Set<string>>(new Set());

  // Screen wake lock reference
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sheet dialog states
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isSendSheetOpen, setIsSendSheetOpen] = useState(false);
  const [editingWineId, setEditingWineId] = useState<string | null>(null);

  // Reset counter confirmation state
  const [resetArm, setResetArm] = useState(false);
  const resetArmTimeout = useRef<NodeJS.Timeout | null>(null);

  // Remove wine confirmation state
  const [removeArm, setRemoveArm] = useState(false);

  // Scroll collapse state for Large Title
  const [isScrolled, setIsScrolled] = useState(false);

  // Flashed wine ID for animation after add
  const [flashedWineId, setFlashedWineId] = useState<string | null>(null);

  // Form states for Add Wine sheet
  const [addName, setAddName] = useState('');
  const [addMacro, setAddMacro] = useState<MacroCategory>('Rossi');
  const [addRegion, setAddRegion] = useState<string>('');
  const [addGroup, setAddGroup] = useState<string>('');
  const [addQty, setAddQty] = useState<string>('');

  // Form state for Edit Wine sheet
  const [editName, setEditName] = useState('');

  // Form state for Send sheet
  const [sendTo, setSendTo] = useState('');
  const [sendWho, setSendWho] = useState('');
  const [sendOnlyDone, setSendOnlyDone] = useState(true);

  // Long-press repeat references
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const repeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ref map to jump to next input on Enter
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  }, []);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Save state with 250ms debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveStateDebounced = useCallback((newState: InventoryState) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        console.error('Storage save error:', e);
      }
    }, 250);
  }, []);

  const updateState = useCallback(
    (updater: (prev: InventoryState) => InventoryState) => {
      setState((prev) => {
        const next = updater(prev);
        saveStateDebounced(next);
        return next;
      });
    },
    [saveStateDebounced]
  );

  // Request Wake Lock
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      }
    } catch {
      // Ignore wake lock denial
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [requestWakeLock]);

  // Handle page scroll for Large Title collapse
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Category labels based on current language
  const categoryLabels = useMemo(
    () => ({
      Bollicine: t.sparkling,
      Bianchi: t.whites,
      Rosati: t.roses,
      Rossi: t.reds,
      Dolci: t.dessert,
    }),
    [t]
  );

  // compose() implementation strictly following Section 5.2
  const composedWines = useMemo(() => {
    const out: WineItem[] = BASE_WINES.filter((b) => !state.del.includes(b.id)).map(
      (b) => (state.ren[b.id] ? { ...b, n: state.ren[b.id] } : b)
    );

    state.add.forEach((a) => {
      const findLastIndex = (fn: (item: WineItem) => boolean) => {
        let last = -1;
        out.forEach((o, idx) => {
          if (fn(o)) last = idx;
        });
        return last;
      };

      let k = findLastIndex((o) => o.m === a.m && o.r === a.r && o.g === a.g);
      if (k < 0) k = findLastIndex((o) => o.m === a.m && o.r === a.r);
      if (k < 0 && a.m === 'Rosati') k = findLastIndex((o) => o.m === 'Bianchi' && o.r === a.r);
      if (k < 0) k = findLastIndex((o) => o.m === a.m);
      out.splice(k < 0 ? out.length : k + 1, 0, a);
    });

    return out;
  }, [state.del, state.ren, state.add]);

  // Overall stats (counted vs total) calculated over all current wines
  const totalWinesCount = composedWines.length;
  const countedWinesCount = useMemo(() => {
    return composedWines.filter((w) => state.c[w.id] != null).length;
  }, [composedWines, state.c]);

  // Available regions for current macro category
  const availableRegions = useMemo(() => {
    const list = composedWines
      .filter((w) => (selectedMacro === 'all' || w.m === selectedMacro) && w.r)
      .map((w) => w.r);
    return [...new Set(list)];
  }, [composedWines, selectedMacro]);

  // If selected region is no longer available in current macro category, reset to 'all'
  useEffect(() => {
    if (selectedRegion !== 'all' && !availableRegions.includes(selectedRegion)) {
      setSelectedRegion('all');
    }
  }, [availableRegions, selectedRegion]);

  // Clear keep set when filters change
  const handleMacroChange = (m: MacroCategory | 'all') => {
    setSelectedMacro(m);
    keepSet.current.clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegionChange = (r: string) => {
    setSelectedRegion(r);
    keepSet.current.clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    keepSet.current.clear();
  };

  const handleUncountedToggle = () => {
    setUncountedOnly((prev) => !prev);
    keepSet.current.clear();
  };

  // Filter wines according to Section 5.3
  const filteredWines = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return composedWines.filter((w) => {
      const matchMacro = selectedMacro === 'all' || w.m === selectedMacro;
      const matchRegion = selectedRegion === 'all' || w.r === selectedRegion;
      const matchSearch = !term || w.n.toLowerCase().includes(term);
      const isCounted = state.c[w.id] != null;
      const matchUncounted = !uncountedOnly || !isCounted || keepSet.current.has(w.id);
      return matchMacro && matchRegion && matchSearch && matchUncounted;
    });
  }, [composedWines, selectedMacro, selectedRegion, searchTerm, uncountedOnly, state.c]);

  // Group filtered wines into sections based on changes in (m, r, g)
  interface WineSection {
    key: string;
    macro: MacroCategory;
    region: string;
    group: string;
    title: string;
    subhead: string;
    items: WineItem[];
  }

  const sections: WineSection[] = useMemo(() => {
    const res: WineSection[] = [];
    let currentKey = '';
    let currentSection: WineSection | null = null;

    filteredWines.forEach((w) => {
      const k = `${w.m}~${w.r}~${w.g}`;
      if (k !== currentKey) {
        currentKey = k;
        const parts = [
          categoryLabels[w.m],
          w.r ? (lang === 'en' ? getRegionLabel(w.r) : w.r) : '',
          w.g ? (lang === 'en' ? getGroupLabel(w.g) : w.g) : '',
        ].filter(Boolean);

        const title = parts[parts.length - 1];
        const subhead = parts.slice(0, parts.length - 1).join(', ');

        currentSection = {
          key: k,
          macro: w.m,
          region: w.r,
          group: w.g,
          title,
          subhead,
          items: [],
        };
        res.push(currentSection);
      }
      currentSection?.items.push(w);
    });

    return res;
  }, [filteredWines, categoryLabels, lang]);

  // Step quantity handler
  const stepQuantity = useCallback(
    (id: string, delta: number) => {
      updateState((prev) => {
        const cur = prev.c[id];
        let nextVal: number;
        if (cur == null) {
          nextVal = delta > 0 ? 1 : 0;
        } else {
          nextVal = Math.max(0, Math.min(999, cur + delta));
        }
        return {
          ...prev,
          c: { ...prev.c, [id]: nextVal },
        };
      });

      keepSet.current.add(id);

      if (navigator.vibrate) {
        try {
          navigator.vibrate(8);
        } catch {}
      }
      requestWakeLock();
    },
    [updateState, requestWakeLock]
  );

  // Press & hold repeat handlers
  const stopRepeat = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  }, []);

  const handlePointerDown = (id: string, delta: number, e: React.PointerEvent) => {
    e.preventDefault();
    stepQuantity(id, delta);
    stopRepeat();
    holdTimerRef.current = setTimeout(() => {
      repeatIntervalRef.current = setInterval(() => {
        stepQuantity(id, delta);
      }, 90);
    }, 450);
  };

  // Direct manual input handler
  const handleInputChange = (id: string, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    keepSet.current.add(id);
    updateState((prev) => {
      const newC = { ...prev.c };
      if (cleaned === '') {
        delete newC[id];
      } else {
        newC[id] = Math.min(999, parseInt(cleaned, 10));
      }
      return {
        ...prev,
        c: newC,
      };
    });
  };

  // Enter moves to next input
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextWine = filteredWines[currentIndex + 1];
      if (nextWine) {
        const el = inputRefs.current.get(nextWine.id);
        if (el) {
          el.focus();
          el.select();
        }
      } else {
        (e.target as HTMLInputElement).blur();
      }
    }
  };

  // Reset counter (double-tap confirmation)
  const handleResetCounterClick = () => {
    if (countedWinesCount === 0) {
      showToast(t.toastNothingToReset);
      return;
    }

    if (!resetArm) {
      setResetArm(true);
      if (resetArmTimeout.current) clearTimeout(resetArmTimeout.current);
      resetArmTimeout.current = setTimeout(() => {
        setResetArm(false);
      }, 3000);
      return;
    }

    if (resetArmTimeout.current) clearTimeout(resetArmTimeout.current);
    setResetArm(false);
    updateState((prev) => ({
      ...prev,
      c: {},
    }));
    keepSet.current.clear();
    showToast(t.toastCounterReset);
  };

  // Restore removed base wines
  const handleRestoreRemoved = () => {
    updateState((prev) => ({
      ...prev,
      del: [],
    }));
    showToast(t.toastWinesRestored);
  };

  // Open Add Wine sheet
  const handleOpenAdd = () => {
    const initMacro = selectedMacro === 'all' ? 'Rossi' : selectedMacro;
    setAddMacro(initMacro);
    setAddRegion(selectedRegion !== 'all' ? selectedRegion : '');
    setAddGroup('');
    setAddName('');
    setAddQty('');
    setIsAddSheetOpen(true);
  };

  // Save Add Wine
  const handleSaveAdd = () => {
    const trimmed = addName.trim();
    if (!trimmed) {
      showToast(t.toastEnterName);
      return;
    }

    const newId = 'n' + state.nid;
    const newItem: WineItem = {
      id: newId,
      m: addMacro,
      r: ['Bollicine', 'Dolci'].includes(addMacro) ? '' : addRegion,
      g: addGroup,
      n: normalizeWineName(trimmed),
    };

    const qtyClean = addQty.replace(/\D/g, '');

    updateState((prev) => {
      const nextState: InventoryState = {
        ...prev,
        add: [...prev.add, newItem],
        nid: prev.nid + 1,
      };
      if (qtyClean !== '') {
        nextState.c = {
          ...prev.c,
          [newId]: Math.min(999, parseInt(qtyClean, 10)),
        };
      }
      return nextState;
    });

    keepSet.current.add(newId);
    setSearchTerm('');
    setSelectedMacro(newItem.m);
    setSelectedRegion(newItem.r || 'all');
    setIsAddSheetOpen(false);

    setFlashedWineId(newId);
    showToast(t.toastWineAdded);

    setTimeout(() => {
      const el = document.getElementById(`wine-row-${newId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => setFlashedWineId(null), 1800);
    }, 150);
  };

  // Open Edit Wine sheet
  const handleOpenEditWine = (item: WineItem) => {
    setEditingWineId(item.id);
    setEditName(item.n);
    setRemoveArm(false);
    setIsEditSheetOpen(true);
  };

  // Save Edit Wine
  const handleSaveEditWine = () => {
    if (!editingWineId) return;
    const trimmed = editName.trim();
    if (!trimmed) {
      showToast(t.toastEnterName);
      return;
    }

    const normalizedName = normalizeWineName(trimmed);
    updateState((prev) => {
      const isUserAdded = prev.add.some((a) => a.id === editingWineId);
      if (isUserAdded) {
        return {
          ...prev,
          add: prev.add.map((a) =>
            a.id === editingWineId ? { ...a, n: normalizedName } : a
          ),
        };
      } else {
        return {
          ...prev,
          ren: {
            ...prev.ren,
            [editingWineId]: normalizedName,
          },
        };
      }
    });

    setIsEditSheetOpen(false);
    showToast(t.toastWineUpdated);
  };

  // Remove wine
  const handleRemoveWine = () => {
    if (!editingWineId) return;
    if (!removeArm) {
      setRemoveArm(true);
      return;
    }

    updateState((prev) => {
      const isUserAdded = prev.add.some((a) => a.id === editingWineId);
      const nextC = { ...prev.c };
      delete nextC[editingWineId];

      if (isUserAdded) {
        return {
          ...prev,
          add: prev.add.filter((a) => a.id !== editingWineId),
          c: nextC,
        };
      } else {
        const nextRen = { ...prev.ren };
        delete nextRen[editingWineId];
        return {
          ...prev,
          del: [...prev.del, editingWineId],
          ren: nextRen,
          c: nextC,
        };
      }
    });

    setIsEditSheetOpen(false);
    showToast(t.toastWineRemoved);
  };

  // Open Send sheet
  const handleOpenSend = () => {
    setSendTo(state.to || '');
    setSendWho(state.who || '');
    setSendOnlyDone(state.only !== undefined ? state.only : true);
    setIsSendSheetOpen(true);
  };

  // Build export texts
  const buildExportData = useCallback(() => {
    const today = new Date().toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const categoryTotals: Record<string, number> = {};
    composedWines.forEach((w) => {
      const val = state.c[w.id];
      if (val != null) {
        const label = categoryLabels[w.m];
        categoryTotals[label] = (categoryTotals[label] || 0) + val;
      }
    });

    const totalsStr =
      Object.entries(categoryTotals)
        .map(([m, count]) => `${m} ${count}`)
        .join(', ') || (lang === 'it' ? 'nessuno' : 'none');

    let textBody = `${t.appTitle} - ${today}\n`;
    if (sendWho.trim()) {
      textBody += `${t.countedBy}: ${sendWho.trim()}\n`;
    }
    textBody += `${lang === 'it' ? 'Totali' : 'Totals'}: ${totalsStr}\n`;

    let csvBody = `${t.category};${t.region};${t.group};${t.wine};${lang === 'it' ? 'Quantita' : 'Quantity'}\n`;
    let prevBlockKey = '';

    composedWines.forEach((w) => {
      const val = state.c[w.id];
      if (sendOnlyDone && val == null) return;

      const blockKey = `${w.m}~${w.r}~${w.g}`;
      if (blockKey !== prevBlockKey) {
        prevBlockKey = blockKey;
        const blockHeaderParts = [
          categoryLabels[w.m],
          w.r ? (lang === 'en' ? getRegionLabel(w.r) : w.r) : '',
          w.g ? (lang === 'en' ? getGroupLabel(w.g) : w.g) : '',
        ]
          .filter(Boolean)
          .join(' / ')
          .toUpperCase();
        textBody += `\n${blockHeaderParts}\n`;
      }

      textBody += `${w.n}: ${val == null ? t.uncountedStatus : val}\n`;

      csvBody += `${categoryLabels[w.m]};${w.r ? (lang === 'en' ? getRegionLabel(w.r) : w.r) : ''};${
        w.g ? (lang === 'en' ? getGroupLabel(w.g) : w.g) : ''
      };${w.n.replace(/;/g, ',')};${val == null ? '' : val}\n`;
    });

    const uncountedCount = totalWinesCount - countedWinesCount;
    if (uncountedCount > 0 && !sendOnlyDone) {
      textBody += `\n${lang === 'it' ? 'Non contati' : 'Uncounted'}: ${uncountedCount}\n`;
    }

    return { textBody, csvBody, dateStr: today };
  }, [composedWines, state.c, sendWho, sendOnlyDone, totalWinesCount, countedWinesCount, categoryLabels, lang, t]);

  // Copy to clipboard
  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t.toastCopied);
    } catch {
      showToast(t.toastCopyUnavailable);
    }
  };

  // Open Email
  const handleSendEmail = () => {
    updateState((prev) => ({
      ...prev,
      to: sendTo.trim(),
      who: sendWho.trim(),
      only: sendOnlyDone,
    }));

    const { textBody, dateStr } = buildExportData();
    let bodyToSend = textBody;

    // Check if encoded size is over 6500 characters
    if (encodeURIComponent(bodyToSend).length > 6500) {
      copyTextToClipboard(bodyToSend);
      bodyToSend =
        (lang === 'it'
          ? 'Inventario copiato negli appunti: incollalo qui.\n\n'
          : 'Inventory copied to clipboard: paste it here.\n\n') +
        textBody.split('\n').slice(0, 3).join('\n');
    }

    const mailto = `mailto:${encodeURIComponent(sendTo.trim())}?subject=${encodeURIComponent(
      `${t.appTitle} ${dateStr}`
    )}&body=${encodeURIComponent(bodyToSend)}`;

    window.location.href = mailto;
  };

  // Share via Web Share API
  const handleShare = async () => {
    updateState((prev) => ({
      ...prev,
      to: sendTo.trim(),
      who: sendWho.trim(),
      only: sendOnlyDone,
    }));

    const { textBody, csvBody, dateStr } = buildExportData();
    try {
      const csvFile = new File(['\ufeff' + csvBody], 'inventario-vini.csv', {
        type: 'text/csv',
      });
      if (navigator.canShare && navigator.canShare({ files: [csvFile] })) {
        await navigator.share({
          files: [csvFile],
          title: `${t.appTitle} ${dateStr}`,
          text: textBody,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${t.appTitle} ${dateStr}`,
          text: textBody,
        });
      } else {
        throw new Error('Share not supported');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      copyTextToClipboard(textBody);
    }
  };

  // Google Sign-in Handler
  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setCurrentUser(res.user);
        showToast(t.toastSignedIn);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Sign in cancelled');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    showToast(t.toastSignedOut);
  };

  // Open Google Drive Modal and search
  const handleOpenDriveModal = async () => {
    setIsDriveSheetOpen(true);
    setDriveExportSuccessUrl(null);
    if (!currentUser) return;

    setIsSearchingDrive(true);
    try {
      const token = await getAccessToken();
      if (token) {
        const files = await searchDriveSheets(token, 'Wine');
        setDriveFiles(files);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingDrive(false);
    }
  };

  // Export directly to Google Sheets with mandatory confirmation
  const handleExportToGoogleDriveConfirmed = async () => {
    setConfirmDriveExportOpen(false);
    setIsExportingToDrive(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        showToast('Please sign in with Google first');
        return;
      }

      const today = new Date().toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const title = `Wine Liquor Order - ${today}`;

      // Build rows for sheet
      const rows: (string | number)[][] = [
        ['Category', 'Region', 'Group', 'Wine Name', 'Counted Quantity', 'Status', 'Date', 'Counted By'],
      ];

      composedWines.forEach((w) => {
        const val = state.c[w.id];
        if (sendOnlyDone && val == null) return;
        rows.push([
          categoryLabels[w.m],
          w.r ? (lang === 'en' ? getRegionLabel(w.r) : w.r) : '',
          w.g ? (lang === 'en' ? getGroupLabel(w.g) : w.g) : '',
          w.n,
          val == null ? '' : val,
          val == null ? 'Uncounted' : 'Counted',
          today,
          sendWho.trim() || 'Staff',
        ]);
      });

      const result = await createWineInventorySpreadsheet(token, title, rows);
      setDriveExportSuccessUrl(result.spreadsheetUrl);
      showToast(t.toastDriveSaved);

      // Refresh drive files list
      const updatedFiles = await searchDriveSheets(token, 'Wine');
      setDriveFiles(updatedFiles);
    } catch (err: any) {
      console.error(err);
      showToast(t.toastDriveError);
    } finally {
      setIsExportingToDrive(false);
    }
  };

  // Groups available for Add Wine dialog
  const addAvailableGroups = useMemo(() => {
    if (!addRegion) return [];
    const list = composedWines
      .filter((w) => w.m === addMacro && w.r === addRegion && w.g)
      .map((w) => w.g);
    return [...new Set(list)];
  }, [composedWines, addMacro, addRegion]);

  return (
    <div className="min-h-screen flex justify-center bg-[var(--bg)] text-[var(--label)] pb-36 select-none sm:select-text">
      <div className="w-full max-w-[480px] flex flex-col min-h-screen relative">
        {/* Sticky Header with Large Title collapsing on scroll (Section 3.4) */}
        <header
          className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur-[20px] saturate-[180%] border-b border-[var(--separator)] transition-all duration-200"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="px-4 pt-3 pb-2.5">
            {/* Top Bar with dynamic title presentation */}
            <div className="flex items-baseline justify-between">
              {isScrolled ? (
                <div className="flex items-center justify-between w-full h-[32px]">
                  <h1 className="text-[17px] font-semibold leading-[22px] tracking-tight mx-auto transition-opacity duration-200 text-[var(--label)]">
                    {t.appTitle}
                  </h1>
                  <div className="flex items-center gap-1.5 absolute right-4">
                    <button
                      type="button"
                      onClick={() => setLang((l) => (l === 'en' ? 'it' : 'en'))}
                      aria-label="Toggle language"
                      className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[var(--fill)] text-[var(--blue)] active:scale-95 cursor-pointer"
                    >
                      {lang.toUpperCase()}
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenDriveModal}
                      title="Google Drive"
                      className="p-1 rounded-full text-[var(--label-2)] hover:text-[var(--blue)] cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-[34px] font-bold leading-[41px] tracking-[-0.4px] text-[var(--label)]">
                      {t.appTitle}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLang((l) => (l === 'en' ? 'it' : 'en'))}
                      aria-label="Toggle language"
                      className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[var(--fill)] text-[var(--blue)] active:scale-95 cursor-pointer"
                    >
                      {lang.toUpperCase()}
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenDriveModal}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--fill)] text-[12px] font-semibold text-[var(--blue)] active:scale-95 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      {t.drive}
                    </button>
                    <span className="text-[15px] leading-[20px] tabular-nums text-[var(--label-2)] font-normal">
                      {countedWinesCount} {t.countedOf} {totalWinesCount} {t.counted}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Compact Progress info when scrolled */}
            {isScrolled && (
              <div className="flex justify-between items-center text-[13px] leading-[18px] text-[var(--label-2)] mt-0.5">
                <span>Progress</span>
                <span className="tabular-nums font-medium">
                  {countedWinesCount} / {totalWinesCount}
                </span>
              </div>
            )}

            {/* 3px Progress Bar (Section 3.4) */}
            <div className="w-full h-[3px] bg-[var(--fill)] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[var(--green)] rounded-full transition-all duration-200 ease-out"
                style={{
                  width: `${
                    totalWinesCount ? (countedWinesCount / totalWinesCount) * 100 : 0
                  }%`,
                }}
              />
            </div>

            {/* iOS Search Bar (Section 3.4: 36px height, 10px radius, --fill background) */}
            <div className="mt-3 flex items-center h-[36px] px-2.5 rounded-[10px] bg-[var(--fill)] gap-2">
              <Search className="w-4 h-4 text-[var(--label-2)] shrink-0" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                enterKeyHint="search"
                autoComplete="off"
                className="w-full bg-transparent text-[17px] leading-[22px] text-[var(--label)] placeholder:text-[var(--label-3)] outline-none border-none p-0"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label="Clear search"
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--label-3)] text-[var(--bg)] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Segmented Control for Macro Categories (Order: All, Rossi, Bianchi, Bollicine, Rosati, Dolci) */}
            <div className="mt-3 flex p-[2px] bg-[var(--fill)] rounded-[9px] overflow-x-auto no-scrollbar scroll-smooth">
              <button
                type="button"
                onClick={() => handleMacroChange('all')}
                className={`flex-1 min-w-[58px] h-[32px] text-[13px] leading-[18px] font-semibold rounded-[7px] transition-all duration-150 whitespace-nowrap px-2 cursor-pointer ${
                  selectedMacro === 'all'
                    ? 'bg-[var(--card)] text-[var(--label)] shadow-xs'
                    : 'text-[var(--label-2)]'
                }`}
              >
                {t.allCategories}
              </button>
              {MACRO_SEQUENCE.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMacroChange(m)}
                  className={`flex-1 min-w-[68px] h-[32px] text-[13px] leading-[18px] font-semibold rounded-[7px] transition-all duration-150 whitespace-nowrap px-2 cursor-pointer ${
                    selectedMacro === m
                      ? 'bg-[var(--card)] text-[var(--label)] shadow-xs'
                      : 'text-[var(--label-2)]'
                  }`}
                >
                  {categoryLabels[m]}
                </button>
              ))}
            </div>

            {/* Region Filter Chips (Section 3.4: visible if >= 2 regions, 32px height, 16px radius) */}
            {availableRegions.length >= 2 && (
              <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => handleRegionChange('all')}
                  className={`h-[32px] px-3.5 rounded-[16px] text-[13px] font-semibold shrink-0 transition-colors cursor-pointer ${
                    selectedRegion === 'all'
                      ? 'bg-[var(--blue)]/15 text-[var(--blue)]'
                      : 'bg-[var(--fill)] text-[var(--label)]'
                  }`}
                >
                  {t.allRegions}
                </button>
                {availableRegions.map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => handleRegionChange(reg)}
                    className={`h-[32px] px-3.5 rounded-[16px] text-[13px] font-semibold shrink-0 transition-colors cursor-pointer ${
                      selectedRegion === reg
                        ? 'bg-[var(--blue)]/15 text-[var(--blue)]'
                        : 'bg-[var(--fill)] text-[var(--label)]'
                    }`}
                  >
                    {lang === 'en' ? getRegionLabel(reg) : reg}
                  </button>
                ))}
              </div>
            )}

            {/* "Uncounted only" Switch Row (Section 3.4: 44px height row with UISwitch on right) */}
            <div className="mt-2.5 flex items-center justify-between h-[44px] px-1">
              <span className="text-[17px] font-normal leading-[22px] text-[var(--label)]">
                {t.uncountedOnly}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={uncountedOnly}
                onClick={handleUncountedToggle}
                className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${
                  uncountedOnly ? 'bg-[var(--green)]' : 'bg-[var(--fill)]'
                }`}
              >
                <div
                  className={`w-[27px] h-[27px] rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    uncountedOnly ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Edit Mode Notice Bar */}
            {isEditMode && (
              <div className="mt-2 pt-2 border-t border-[var(--separator)] flex flex-wrap items-center justify-between gap-2 text-[13px] text-[var(--label-2)] animate-fadeIn">
                <span className="w-full text-left font-normal">
                  {t.tapToRenameOrRemove}
                </span>
                <button
                  type="button"
                  onClick={handleResetCounterClick}
                  className={`h-7 px-3 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
                    resetArm
                      ? 'bg-[var(--red)] text-white'
                      : 'bg-[var(--fill)] text-[var(--red)]'
                  }`}
                >
                  {resetArm ? t.tapToConfirm : t.resetCounter}
                </button>
                {state.del.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRestoreRemoved}
                    className="h-7 px-3 rounded-full bg-[var(--fill)] text-[var(--blue)] text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    {t.restoreRemoved} ({state.del.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Wine List Area (Section 3.3: Inset Grouped, 32px between sections, 8px title to card) */}
        <main className="px-4 pt-4 flex-1">
          {sections.length === 0 ? (
            <div className="text-center py-20 text-[var(--label-2)] text-[17px]">
              {t.noWinesFound}
            </div>
          ) : (
            <div className="space-y-[32px]">
              {sections.map((section) => (
                <section key={section.key}>
                  {/* Section Title & Path (Section 3.2: Title 3 20/25 600, Subhead 15/20 400) */}
                  <div className="px-1 mb-[8px]">
                    <h2 className="text-[20px] font-semibold leading-[25px] text-[var(--label)] tracking-tight">
                      {section.title}
                    </h2>
                    {section.subhead && (
                      <p className="text-[15px] leading-[20px] text-[var(--label-2)] font-normal mt-0.5">
                        {section.subhead}
                      </p>
                    )}
                  </div>

                  {/* Inset Grouped Card (Section 3.3: border-radius 12px, 0.5px hairlines) */}
                  <div className="bg-[var(--card)] rounded-[12px] overflow-hidden border border-[var(--separator)]/30 shadow-xs">
                    {section.items.map((item, itemIdx) => {
                      const countVal = state.c[item.id];
                      const isCounted = countVal != null;
                      const globalIndex = filteredWines.findIndex((w) => w.id === item.id);
                      const isFlashed = flashedWineId === item.id;

                      return (
                        <div
                          key={item.id}
                          id={`wine-row-${item.id}`}
                          onClick={() => {
                            if (isEditMode) {
                              handleOpenEditWine(item);
                            }
                          }}
                          className={`relative flex items-center min-h-[72px] py-3 px-4 gap-3 transition-colors ${
                            isEditMode ? 'cursor-pointer hover:bg-[var(--fill)]' : ''
                          } ${isFlashed ? 'wine-flash' : ''}`}
                        >
                          {/* Indented hairline divider (Section 3.3: 0.5px with left: 16px) */}
                          {itemIdx > 0 && (
                            <div className="absolute top-0 left-4 right-0 h-[0.5px] bg-[var(--separator)]" />
                          )}

                          {/* Counted green indicator dot (Section 3.4: 8px green dot on left) */}
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 transition-opacity duration-200 ${
                              isCounted ? 'bg-[var(--green)] opacity-100' : 'opacity-0'
                            }`}
                          />

                          {/* Wine Name (Section 3.2: Headline 17/22 600, max 3 lines, overflow-wrap: anywhere) */}
                          <div className="flex-1 min-w-0 pr-1">
                            <span className="text-[17px] font-semibold leading-[22px] text-[var(--label)] break-words line-clamp-3">
                              {item.n}
                            </span>
                          </div>

                          {/* Stepper or Edit Icon (Section 3.4) */}
                          {isEditMode ? (
                            <div className="text-[var(--blue)] px-2">
                              <Edit2 className="w-5 h-5" />
                            </div>
                          ) : (
                            <div
                              className="flex items-center gap-1 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Minus Button: 48px circle, --fill, --blue glyph */}
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onPointerDown={(e) => handlePointerDown(item.id, -1, e)}
                                onPointerUp={stopRepeat}
                                onPointerLeave={stopRepeat}
                                onPointerCancel={stopRepeat}
                                onContextMenu={(e) => e.preventDefault()}
                                className="w-12 h-12 rounded-full bg-[var(--fill)] text-[var(--blue)] flex items-center justify-center text-[26px] font-semibold active:scale-[0.94] transition-transform duration-100 cursor-pointer"
                              >
                                <Minus className="w-6 h-6 stroke-[2.5]" />
                              </button>

                              {/* Numeric Input: 56px wide, editable, Counter 28/32 600 tabular-nums */}
                              <input
                                ref={(el) => {
                                  if (el) inputRefs.current.set(item.id, el);
                                  else inputRefs.current.delete(item.id);
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={3}
                                aria-label="Quantity"
                                placeholder="–"
                                value={countVal == null ? '' : countVal}
                                onFocus={(e) => {
                                  setTimeout(() => e.target.select(), 10);
                                }}
                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                onKeyDown={(e) => handleInputKeyDown(e, globalIndex)}
                                className={`w-14 h-12 text-center text-[28px] leading-[32px] font-semibold tabular-nums border-none outline-none bg-transparent ${
                                  isCounted ? 'text-[var(--label)]' : 'placeholder:text-[var(--label-3)]'
                                }`}
                              />

                              {/* Plus Button: 48px circle, --blue, white glyph */}
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onPointerDown={(e) => handlePointerDown(item.id, 1, e)}
                                onPointerUp={stopRepeat}
                                onPointerLeave={stopRepeat}
                                onPointerCancel={stopRepeat}
                                onContextMenu={(e) => e.preventDefault()}
                                className="w-12 h-12 rounded-full bg-[var(--blue)] text-white flex items-center justify-center text-[26px] font-semibold active:scale-[0.94] transition-transform duration-100 shadow-xs cursor-pointer"
                              >
                                <Plus className="w-6 h-6 stroke-[2.5]" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        {/* Floating Bottom Bar */}
        <footer
          className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)]/80 backdrop-blur-[20px] saturate-[180%] border-t border-[var(--separator)] flex justify-center"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 12px))', paddingTop: '10px' }}
        >
          <div className="w-full max-w-[480px] px-4 flex items-center gap-2.5">
            {/* Edit / Done Toggle Icon Button */}
            <button
              type="button"
              onClick={() => setIsEditMode((prev) => !prev)}
              aria-label={isEditMode ? t.done : t.edit}
              title={isEditMode ? t.done : t.edit}
              className={`w-[50px] h-[50px] shrink-0 rounded-[14px] flex items-center justify-center transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-[var(--blue)] text-white shadow-xs'
                  : 'bg-[var(--fill)] text-[var(--blue)] active:scale-[0.94]'
              }`}
            >
              {isEditMode ? (
                <Check className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <Pencil className="w-5 h-5" />
              )}
            </button>

            {/* + Wine Button */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="h-[50px] px-4 rounded-[14px] bg-[var(--fill)] text-[var(--blue)] font-semibold text-[17px] flex items-center gap-1 active:scale-[0.97] transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              {t.wine}
            </button>

            {/* Send Email Button */}
            <button
              type="button"
              onClick={handleOpenSend}
              className="flex-1 h-[50px] rounded-[14px] bg-[var(--blue)] text-white font-semibold text-[17px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-md cursor-pointer"
            >
              <Mail className="w-5 h-5" />
              {t.sendEmail}
            </button>
          </div>
        </footer>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[var(--label)] text-[var(--bg)] px-5 py-2.5 rounded-full text-[15px] font-semibold shadow-xl transition-opacity duration-200 pointer-events-none"
          >
            {toastMessage}
          </div>
        )}

        {/* Google Drive & Sheets Modal */}
        {isDriveSheetOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end"
            onClick={() => setIsDriveSheetOpen(false)}
          >
            <div
              className="bg-[var(--card)] w-full max-w-[480px] mx-auto rounded-t-[20px] max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-sheet"
              style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[36px] h-[5px] rounded-full bg-[var(--separator)] mx-auto mb-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-[#0F9D58]" />
                  <h3 className="text-[17px] font-semibold leading-[22px] text-[var(--label)]">
                    {t.driveTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDriveSheetOpen(false)}
                  className="p-1 rounded-full text-[var(--label-2)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!currentUser ? (
                <div className="bg-[var(--card-2)] rounded-[12px] p-5 text-center space-y-3">
                  <p className="text-[15px] leading-[20px] text-[var(--label-2)]">
                    {t.driveDesc}
                  </p>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isAuthLoading}
                    className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white text-gray-700 font-semibold text-[15px] border border-gray-300 shadow-sm active:scale-95 transition-all w-full cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    {isAuthLoading ? 'Connecting...' : t.signInGoogle}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* User profile card */}
                  <div className="bg-[var(--card-2)] rounded-[12px] p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--blue)] text-white flex items-center justify-center font-bold">
                          {currentUser.displayName?.[0] || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="text-[15px] font-semibold text-[var(--label)]">
                          {currentUser.displayName || 'Google User'}
                        </div>
                        <div className="text-[12px] text-[var(--label-2)] truncate max-w-[190px]">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleSignOut}
                      className="text-[13px] text-[var(--red)] font-semibold px-2 py-1 cursor-pointer"
                    >
                      {t.signOut}
                    </button>
                  </div>

                  {/* Export action */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDriveExportOpen(true)}
                      disabled={isExportingToDrive}
                      className="w-full h-12 rounded-[12px] bg-[#0F9D58] hover:bg-[#0b8043] text-white font-semibold text-[16px] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      {isExportingToDrive ? t.exporting : t.exportToSheets}
                    </button>

                    {driveExportSuccessUrl && (
                      <div className="p-3 bg-[var(--green)]/15 border border-[var(--green)]/30 rounded-[10px] flex items-center justify-between text-[14px]">
                        <span className="text-[var(--green)] font-medium flex items-center gap-1.5">
                          <Check className="w-4 h-4" /> {t.spreadsheetCreated}
                        </span>
                        <a
                          href={driveExportSuccessUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--blue)] font-semibold flex items-center gap-1"
                        >
                          {t.open} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Drive files section */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-semibold text-[var(--label)]">
                        {t.sheetsInDrive}
                      </span>
                      <button
                        type="button"
                        onClick={handleOpenDriveModal}
                        className="text-[13px] text-[var(--blue)] font-medium cursor-pointer"
                      >
                        {t.refresh}
                      </button>
                    </div>

                    {isSearchingDrive ? (
                      <p className="text-[13px] text-[var(--label-2)] text-center py-4">
                        {t.loadingFiles}
                      </p>
                    ) : driveFiles.length === 0 ? (
                      <p className="text-[13px] text-[var(--label-2)] text-center py-4 bg-[var(--card-2)] rounded-[10px]">
                        {t.noDriveFiles}
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {driveFiles.map((file) => (
                          <div
                            key={file.id}
                            className="p-2.5 bg-[var(--card-2)] rounded-[10px] flex items-center justify-between text-[14px]"
                          >
                            <span className="font-medium text-[var(--label)] truncate pr-2">
                              {file.name}
                            </span>
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--blue)] text-[13px] shrink-0 font-medium flex items-center gap-1"
                              >
                                {t.open} <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Confirmation Dialog for Destructive / Mutating Workspace Operation (Mandatory per Skill) */}
        {confirmDriveExportOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setConfirmDriveExportOpen(false)}
          >
            <div
              className="bg-[var(--card)] w-full max-w-[360px] rounded-[18px] p-5 shadow-2xl text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-[var(--green)]/15 text-[var(--green)] mx-auto flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[var(--label)]">
                  {t.confirmExportTitle}
                </h4>
                <p className="text-[14px] text-[var(--label-2)] mt-1.5">
                  {t.confirmExportDesc(countedWinesCount)}
                </p>
              </div>
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDriveExportOpen(false)}
                  className="flex-1 h-11 rounded-[10px] bg-[var(--fill)] text-[var(--label)] font-semibold text-[15px] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleExportToGoogleDriveConfirmed}
                  className="flex-1 h-11 rounded-[10px] bg-[#0F9D58] text-white font-semibold text-[15px] cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Wine Sheet (Section 3.4: Sheet dal basso, raggio 20, grabber 36x5, Headline centrato) */}
        {isAddSheetOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end"
            onClick={() => setIsAddSheetOpen(false)}
          >
            <div
              className="bg-[var(--card)] w-full max-w-[480px] mx-auto rounded-t-[20px] max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-sheet"
              style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Grabber 36x5 */}
              <div className="w-[36px] h-[5px] rounded-full bg-[var(--separator)] mx-auto mb-2" />

              <h3 className="text-[17px] font-semibold leading-[22px] text-center text-[var(--label)]">
                {t.addWine}
              </h3>

              {/* Inset Form Group */}
              <div className="bg-[var(--card-2)] rounded-[12px] p-3 space-y-3 border border-[var(--separator)]/20">
                <div>
                  <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                    {t.wineName}
                  </label>
                  <input
                    type="text"
                    value={addName}
                    autoFocus
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. Barolo Riserva"
                    className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                    {t.category}
                  </label>
                  <select
                    value={addMacro}
                    onChange={(e) => {
                      const nextMacro = e.target.value as MacroCategory;
                      setAddMacro(nextMacro);
                      if (['Bollicine', 'Dolci'].includes(nextMacro)) {
                        setAddRegion('');
                        setAddGroup('');
                      }
                    }}
                    className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                  >
                    <option value="Rossi">{categoryLabels.Rossi}</option>
                    <option value="Bianchi">{categoryLabels.Bianchi}</option>
                    <option value="Bollicine">{categoryLabels.Bollicine}</option>
                    <option value="Rosati">{categoryLabels.Rosati}</option>
                    <option value="Dolci">{categoryLabels.Dolci}</option>
                  </select>
                </div>

                {!['Bollicine', 'Dolci'].includes(addMacro) && (
                  <div>
                    <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                      {t.region}
                    </label>
                    <select
                      value={addRegion}
                      onChange={(e) => {
                        setAddRegion(e.target.value);
                        setAddGroup('');
                      }}
                      className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                    >
                      <option value="">{lang === 'it' ? 'Nessuna' : 'None'}</option>
                      {ALL_BASE_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {lang === 'en' ? getRegionLabel(r) : r}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {addRegion && addAvailableGroups.length > 0 && (
                  <div>
                    <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                      {t.group}
                    </label>
                    <select
                      value={addGroup}
                      onChange={(e) => setAddGroup(e.target.value)}
                      className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                    >
                      <option value="">{lang === 'it' ? 'Nessuno' : 'None'}</option>
                      {addAvailableGroups.map((g) => (
                        <option key={g} value={g}>
                          {lang === 'en' ? getGroupLabel(g) : g}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                    {t.quantityOptional}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                    placeholder="–"
                    className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSheetOpen(false)}
                  className="flex-1 h-12 rounded-[12px] bg-[var(--fill)] text-[var(--label)] font-semibold text-[16px] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAdd}
                  className="flex-1 h-12 rounded-[12px] bg-[var(--blue)] text-white font-semibold text-[16px] cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Wine Sheet */}
        {isEditSheetOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end"
            onClick={() => setIsEditSheetOpen(false)}
          >
            <div
              className="bg-[var(--card)] w-full max-w-[480px] mx-auto rounded-t-[20px] max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-sheet"
              style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[36px] h-[5px] rounded-full bg-[var(--separator)] mx-auto mb-2" />

              <h3 className="text-[17px] font-semibold leading-[22px] text-center text-[var(--label)]">
                {t.editWine}
              </h3>

              <div className="bg-[var(--card-2)] rounded-[12px] p-3 space-y-3 border border-[var(--separator)]/20">
                <div>
                  <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                    {t.wineName}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    autoFocus
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(false)}
                  className="flex-1 h-12 rounded-[12px] bg-[var(--fill)] text-[var(--label)] font-semibold text-[16px] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditWine}
                  className="flex-1 h-12 rounded-[12px] bg-[var(--blue)] text-white font-semibold text-[16px] cursor-pointer"
                >
                  {t.save}
                </button>
              </div>

              {/* Destructive Action (Double-tap confirmation) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRemoveWine}
                  className={`w-full h-12 rounded-[12px] font-semibold text-[16px] transition-colors border cursor-pointer ${
                    removeArm
                      ? 'bg-[var(--red)] text-white border-[var(--red)]'
                      : 'bg-transparent text-[var(--red)] border-[var(--red)]/40'
                  }`}
                >
                  {removeArm ? t.tapAgainToRemove : t.removeWine}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Inventory Sheet */}
        {isSendSheetOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end"
            onClick={() => setIsSendSheetOpen(false)}
          >
            <div
              className="bg-[var(--card)] w-full max-w-[480px] mx-auto rounded-t-[20px] max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-sheet"
              style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[36px] h-[5px] rounded-full bg-[var(--separator)] mx-auto mb-2" />

              <h3 className="text-[17px] font-semibold leading-[22px] text-center text-[var(--label)]">
                {t.sendInventory}
              </h3>

              <div className="bg-[var(--card-2)] rounded-[12px] p-3 space-y-3 border border-[var(--separator)]/20">
                <div>
                  <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                    {t.recipient}
                  </label>
                  <input
                    type="email"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder="manager@example.com"
                    autoComplete="email"
                    className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[var(--label-2)] mb-1">
                    {t.countedBy}
                  </label>
                  <input
                    type="text"
                    value={sendWho}
                    onChange={(e) => setSendWho(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full h-11 px-3 rounded-[9px] bg-[var(--card)] border border-[var(--separator)] text-[16px] text-[var(--label)] outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[15px] font-normal text-[var(--label)]">
                    {t.includeCountedOnly}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={sendOnlyDone}
                    onClick={() => setSendOnlyDone((prev) => !prev)}
                    className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-200 cursor-pointer flex items-center ${
                      sendOnlyDone ? 'bg-[var(--green)]' : 'bg-[var(--fill)]'
                    }`}
                  >
                    <div
                      className={`w-[27px] h-[27px] rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                        sendOnlyDone ? 'translate-x-[20px]' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-[13px] text-[var(--label-2)] pt-1 font-normal">
                  {countedWinesCount} {lang === 'it' ? 'vini contati su' : 'wines counted of'} {totalWinesCount}
                  {countedWinesCount < totalWinesCount && !sendOnlyDone
                    ? t.remainingUncounted
                    : ''}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="w-full h-12 rounded-[12px] bg-[var(--blue)] text-white font-semibold text-[16px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
                  {t.openEmail}
                </button>

                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSendSheetOpen(false);
                      setConfirmDriveExportOpen(true);
                    }}
                    className="w-full h-12 rounded-[12px] bg-[#0F9D58] text-white font-semibold text-[16px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    {t.saveToDrive}
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 h-12 rounded-[12px] bg-[var(--fill)] text-[var(--label)] font-semibold text-[16px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[var(--blue)]" />
                    {t.share}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const { textBody } = buildExportData();
                      copyTextToClipboard(textBody);
                    }}
                    className="flex-1 h-12 rounded-[12px] bg-[var(--fill)] text-[var(--label)] font-semibold text-[16px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-[var(--blue)]" />
                    {t.copy}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSendSheetOpen(false)}
                    className="flex-1 h-12 rounded-[12px] bg-[var(--fill)] text-[var(--label)] font-semibold text-[16px] cursor-pointer"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
