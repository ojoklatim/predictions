'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Match {
  id: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  stage: string;
  status: 'live' | 'upcoming' | 'finished';
  homeScore?: number;
  awayScore?: number;
  time?: string; // e.g. "67'", "18:00", "FT"
  entries: number;
  predictionSplit: { homeWin: number; draw: number; awayWin: number }; // percentages
}

export interface Prediction {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  matchId: string;
  predictedHome: number;
  predictedAway: number;
  points?: number;
  status: 'pending' | 'scored' | 'disputed' | 'void';
  submittedAt: string;
  disputeReason?: string;
  adminNote?: string;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  joinedAt: string;
  totalPredictions: number;
  points: number;
  exactScores: number;
  tier: 'Gold' | 'Silver' | 'Bronze';
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  matchId?: string;
  matchName?: string;
  amount: number;
  date: string;
  method: string;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Refunded';
  ipAddress?: string;
  reasonForFlag?: string;
}

export interface Prize {
  id: string;
  name: string;
  icon: string;
  description: string;
  tierRequired: string;
  quantity: number;
}

export interface Settings {
  tournamentName: string;
  tournamentYear: number;
  startDate: string;
  endDate: string;
  totalTeams: number;
  stages: string[];
  exactScorePoints: number;
  correctResultPoints: number;
  wrongPredictionPoints: number;
  bonusFinalistPoints: number;
  bonusChampionPoints: number;
  allowAfterStart: boolean;
  entryFee: number;
  paymentMethods: string[];
  prizeSplit: { winner: number; top3: number; top10: number; platform: number };
  minWithdrawal: number;
  autoDistribute: boolean;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  matches: Match[];
  predictions: Prediction[];
  users: User[];
  payments: Payment[];
  settings: Settings;
  login: (email: string) => boolean;
  register: (name: string, email: string) => void;
  addMatch: (match: Omit<Match, 'id' | 'entries' | 'predictionSplit'>) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  submitPrediction: (matchId: string, homeScore: number, awayScore: number) => void;
  resolveDispute: (predictionId: string, resolution: 'uphold' | 'dismiss' | 'void', note: string) => void;
  raiseDispute: (predictionId: string, reason: string) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
  updatePaymentStatus: (paymentId: string, status: Payment['status'], reason?: string) => void;
  updateSettings: (category: string, updates: Partial<Settings>) => void;
  stats: {
    totalUsers: number;
    totalPredictions: number;
    revenue: number;
    liveMatches: number;
  };
  prizes: Prize[];
  addPrize: (prize: Omit<Prize, 'id'>) => void;
  deletePrize: (id: string) => void;
}

const defaultSettings: Settings = {
  tournamentName: 'World Cup 2026',
  tournamentYear: 2026,
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  totalTeams: 32,
  stages: ['Group Stage', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Final'],
  exactScorePoints: 3,
  correctResultPoints: 1,
  wrongPredictionPoints: 0,
  bonusFinalistPoints: 5,
  bonusChampionPoints: 10,
  allowAfterStart: false,
  entryFee: 1.00,
  paymentMethods: ['Card', 'PayPal', 'Mobile Money'],
  prizeSplit: { winner: 50, top3: 20, top10: 10, platform: 20 },
  minWithdrawal: 10.00,
  autoDistribute: true,
};

const initialMatches: Match[] = [
  { id: 'm1', homeTeam: 'Brazil', homeFlag: '🇧🇷', awayTeam: 'Argentina', awayFlag: '🇦🇷', stage: 'Group A', status: 'live', homeScore: 2, awayScore: 1, time: "67'", entries: 1243, predictionSplit: { homeWin: 58, draw: 22, awayWin: 20 } },
  { id: 'm2', homeTeam: 'France', homeFlag: '🇫🇷', awayTeam: 'England', awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stage: 'Group B', status: 'live', homeScore: 1, awayScore: 1, time: "45'", entries: 876, predictionSplit: { homeWin: 45, draw: 30, awayWin: 25 } },
  { id: 'm3', homeTeam: 'Germany', homeFlag: '🇩🇪', awayTeam: 'Spain', awayFlag: '🇪🇸', stage: 'Group C', status: 'upcoming', time: '18:00', entries: 1611, predictionSplit: { homeWin: 38, draw: 24, awayWin: 38 } },
  { id: 'm4', homeTeam: 'Portugal', homeFlag: '🇵🇹', awayTeam: 'Morocco', awayFlag: '🇲🇦', stage: 'R16', status: 'upcoming', time: '21:00', entries: 712, predictionSplit: { homeWin: 60, draw: 25, awayWin: 15 } },
  { id: 'm5', homeTeam: 'Spain', homeFlag: '🇪🇸', awayTeam: 'Germany', awayFlag: '🇩🇪', stage: 'Group C', status: 'finished', homeScore: 3, awayScore: 2, time: 'FT', entries: 2104, predictionSplit: { homeWin: 40, draw: 20, awayWin: 40 } },
  { id: 'm6', homeTeam: 'USA', homeFlag: '🇺🇸', awayTeam: 'Mexico', awayFlag: '🇲🇽', stage: 'Group A', status: 'upcoming', time: 'Tomorrow', entries: 1542, predictionSplit: { homeWin: 50, draw: 20, awayWin: 30 } },
  { id: 'm7', homeTeam: 'Italy', homeFlag: '🇮🇹', awayTeam: 'Croatia', awayFlag: '🇭🇷', stage: 'Group D', status: 'finished', homeScore: 0, awayScore: 1, time: 'FT', entries: 1890, predictionSplit: { homeWin: 45, draw: 35, awayWin: 20 } },
  { id: 'm8', homeTeam: 'Netherlands', homeFlag: '🇳🇱', awayTeam: 'Senegal', awayFlag: '🇸🇳', stage: 'Group B', status: 'upcoming', time: 'In 2 days', entries: 980, predictionSplit: { homeWin: 65, draw: 20, awayWin: 15 } }
];

const initialUsers: User[] = [
  { id: 'u1', name: 'Carlos Mendez', initials: 'CM', email: 'carlos.m@example.com', joinedAt: '14 Jun 2026', totalPredictions: 18, points: 47, exactScores: 9, tier: 'Gold', status: 'Active' },
  { id: 'u2', name: 'Sophie Laurent', initials: 'SL', email: 'sophie.l@example.com', joinedAt: '15 Jun 2026', totalPredictions: 18, points: 43, exactScores: 7, tier: 'Gold', status: 'Active' },
  { id: 'u3', name: 'James Osei', initials: 'JO', email: 'james.o@example.com', joinedAt: '16 Jun 2026', totalPredictions: 17, points: 39, exactScores: 6, tier: 'Silver', status: 'Active' },
  { id: 'u4', name: 'Yuki Tanaka', initials: 'YT', email: 'yuki.t@example.com', joinedAt: '17 Jun 2026', totalPredictions: 16, points: 36, exactScores: 6, tier: 'Silver', status: 'Active' },
  { id: 'u5', name: 'Amara Diallo', initials: 'AD', email: 'amara.d@example.com', joinedAt: '18 Jun 2026', totalPredictions: 17, points: 34, exactScores: 5, tier: 'Silver', status: 'Active' },
  { id: 'u6', name: 'Liam Davies', initials: 'LD', email: 'liam.d@example.com', joinedAt: '19 Jun 2026', totalPredictions: 15, points: 28, exactScores: 4, tier: 'Bronze', status: 'Active' },
  { id: 'u7', name: 'Elena Petrova', initials: 'EP', email: 'elena.p@example.com', joinedAt: '20 Jun 2026', totalPredictions: 12, points: 19, exactScores: 2, tier: 'Bronze', status: 'Inactive' },
  { id: 'u8', name: 'John Doe', initials: 'JD', email: 'john.doe@example.com', joinedAt: '21 Jun 2026', totalPredictions: 14, points: 12, exactScores: 1, tier: 'Bronze', status: 'Suspended' }
];

const initialPredictions: Prediction[] = [
  { id: 'p1', userId: 'u1', userName: 'Carlos Mendez', userAvatar: 'CM', matchId: 'm1', predictedHome: 2, predictedAway: 1, status: 'pending', submittedAt: '2026-06-09T11:30:00Z' },
  { id: 'p2', userId: 'u2', userName: 'Sophie Laurent', userAvatar: 'SL', matchId: 'm1', predictedHome: 1, predictedAway: 1, status: 'pending', submittedAt: '2026-06-09T11:45:00Z' },
  { id: 'p3', userId: 'u3', userName: 'James Osei', userAvatar: 'JO', matchId: 'm1', predictedHome: 0, predictedAway: 2, status: 'pending', submittedAt: '2026-06-09T12:00:00Z' },
  { id: 'p4', userId: 'u1', userName: 'Carlos Mendez', userAvatar: 'CM', matchId: 'm5', predictedHome: 3, predictedAway: 2, points: 3, status: 'scored', submittedAt: '2026-06-08T15:30:00Z' },
  { id: 'p5', userId: 'u2', userName: 'Sophie Laurent', userAvatar: 'SL', matchId: 'm5', predictedHome: 1, predictedAway: 0, points: 1, status: 'scored', submittedAt: '2026-06-08T16:00:00Z' },
  { id: 'p6', userId: 'u3', userName: 'James Osei', userAvatar: 'JO', matchId: 'm5', predictedHome: 2, predictedAway: 2, points: 0, status: 'scored', submittedAt: '2026-06-08T16:15:00Z' },
  { id: 'p7', userId: 'u8', userName: 'John Doe', userAvatar: 'JD', matchId: 'm5', predictedHome: 0, predictedAway: 4, points: 0, status: 'disputed', submittedAt: '2026-06-08T14:00:00Z', disputeReason: 'Points were not awarded. I predicted 3-2 but it shows 0-4.' }
];

const initialPayments: Payment[] = [
  { id: 'TX1001', userId: 'u2', userName: 'Sophie Laurent', userAvatar: 'SL', matchId: 'm3', matchName: 'Germany vs Spain', amount: 1.00, date: '09 Jun 2026, 12:25', method: 'Card', status: 'Completed' },
  { id: 'TX1002', userId: 'u1', userName: 'Carlos Mendez', userAvatar: 'CM', matchId: 'm1', matchName: 'Brazil vs Argentina', amount: 1.00, date: '09 Jun 2026, 12:22', method: 'PayPal', status: 'Completed' },
  { id: 'TX1003', userId: 'u4', userName: 'Yuki Tanaka', userAvatar: 'YT', amount: 1.00, date: '09 Jun 2026, 11:55', method: 'Card', status: 'Completed' },
  { id: 'TX1004', userId: 'u8', userName: 'John Doe', userAvatar: 'JD', amount: 1.00, date: '09 Jun 2026, 11:27', method: 'Mobile Money', status: 'Flagged', ipAddress: '198.51.100.42', reasonForFlag: 'Multiple accounts created from same IP' },
  { id: 'TX1005', userId: 'u3', userName: 'James Osei', userAvatar: 'JO', amount: 1.00, date: '09 Jun 2026, 10:15', method: 'PayPal', status: 'Completed' },
  { id: 'TX1006', userId: 'u6', userName: 'Liam Davies', userAvatar: 'LD', amount: 1.00, date: '09 Jun 2026, 09:40', method: 'Card', status: 'Pending' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [predictions, setPredictions] = useState<Prediction[]>(initialPredictions);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [prizes, setPrizes] = useState<Prize[]>([]);

  // Load from local storage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('pred_user');
    const savedMatches = localStorage.getItem('pred_matches');
    const savedPredictions = localStorage.getItem('pred_predictions');
    const savedUsers = localStorage.getItem('pred_users');
    const savedPayments = localStorage.getItem('pred_payments');
    const savedSettings = localStorage.getItem('pred_settings');
    const savedPrizes = localStorage.getItem('pred_prizes');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedMatches) setMatches(JSON.parse(savedMatches));
    if (savedPredictions) setPredictions(JSON.parse(savedPredictions));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedPrizes) {
      setPrizes(JSON.parse(savedPrizes));
    } else {
      const initialPrizesList: Prize[] = [
        { id: 'prz1', name: 'Official World Cup Match Ball', icon: '⚽', description: 'High-quality official matches leather football.', tierRequired: 'Gold', quantity: 10 },
        { id: 'prz2', name: 'Championship Fan T-Shirt', icon: '👕', description: 'Breathable customized cotton merchandise.', tierRequired: 'Silver', quantity: 50 },
        { id: 'prz3', name: 'Digital Sports Stopwatch', icon: '⏱️', description: 'Professional coaching stopwatch tracker.', tierRequired: 'Bronze', quantity: 100 }
      ];
      setPrizes(initialPrizesList);
      saveToLocalStorage('pred_prizes', initialPrizesList);
    }
  }, []);

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = (email: string): boolean => {
    if (email === 'admin@predictionsystem.com') {
      const adminUser: User = {
        id: 'admin',
        name: 'Admin',
        initials: 'AD',
        email: email,
        joinedAt: '01 Jun 2026',
        totalPredictions: 0,
        points: 0,
        exactScores: 0,
        tier: 'Gold',
        status: 'Active',
      };
      setCurrentUser(adminUser);
      saveToLocalStorage('pred_user', adminUser);
      return true;
    }
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.status === 'Suspended') {
        alert('Your account is suspended.');
        return false;
      }
      setCurrentUser(found);
      saveToLocalStorage('pred_user', found);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';
    const newUser: User = {
      id: 'u_' + Date.now(),
      name,
      initials,
      email,
      joinedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalPredictions: 0,
      points: 0,
      exactScores: 0,
      tier: 'Bronze',
      status: 'Active',
    };

    const newPayment: Payment = {
      id: 'TX' + Math.floor(1000 + Math.random() * 9000),
      userId: newUser.id,
      userName: name,
      userAvatar: initials,
      amount: settings.entryFee,
      date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      method: 'Card',
      status: 'Completed'
    };

    const updatedUsers = [...users, newUser];
    const updatedPayments = [newPayment, ...payments];

    setUsers(updatedUsers);
    setPayments(updatedPayments);
    setCurrentUser(newUser);

    saveToLocalStorage('pred_users', updatedUsers);
    saveToLocalStorage('pred_payments', updatedPayments);
    saveToLocalStorage('pred_user', newUser);
  };

  const addMatch = (matchData: Omit<Match, 'id' | 'entries' | 'predictionSplit'>) => {
    const newMatch: Match = {
      ...matchData,
      id: 'm_' + Date.now(),
      entries: 0,
      predictionSplit: { homeWin: 33, draw: 34, awayWin: 33 }
    };
    const updated = [...matches, newMatch];
    setMatches(updated);
    saveToLocalStorage('pred_matches', updated);
  };

  // Update match and calculate scoring automatically if match is set to finished
  const updateMatch = (id: string, updates: Partial<Match>) => {
    const updatedMatches = matches.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates };
        if (updates.status === 'finished' && updated.homeScore !== undefined && updated.awayScore !== undefined) {
          // Trigger scoring logic
          scorePredictionsForMatch(id, updated.homeScore, updated.awayScore);
        }
        return updated;
      }
      return m;
    });
    setMatches(updatedMatches);
    saveToLocalStorage('pred_matches', updatedMatches);
  };

  const scorePredictionsForMatch = (matchId: string, actualHome: number, actualAway: number) => {
    let usersMap = new Map(users.map(u => [u.id, { ...u, points: 0, exactScores: 0, totalPredictions: 0 }]));

    // First recount all scored predictions points to avoid double-scoring issues
    const updatedPredictions = predictions.map(p => {
      let currentPrediction = p;
      if (p.matchId === matchId && p.status === 'pending') {
        const isExact = p.predictedHome === actualHome && p.predictedAway === actualAway;
        const predResult = Math.sign(p.predictedHome - p.predictedAway);
        const actualResult = Math.sign(actualHome - actualAway);
        const isCorrectResult = predResult === actualResult;

        let points = settings.wrongPredictionPoints;
        if (isExact) {
          points = settings.exactScorePoints;
        } else if (isCorrectResult) {
          points = settings.correctResultPoints;
        }

        currentPrediction = {
          ...p,
          points,
          status: 'scored' as const
        };
      }
      return currentPrediction;
    });

    // Recalculate users stats based on all predictions
    updatedPredictions.forEach(p => {
      const u = usersMap.get(p.userId);
      if (u) {
        u.totalPredictions += 1;
        if (p.status === 'scored' && p.points !== undefined) {
          u.points += p.points;
          if (p.points === settings.exactScorePoints) {
            u.exactScores += 1;
          }
        }
      }
    });

    const recalculatedUsers = users.map(originalUser => {
      const calculated = usersMap.get(originalUser.id);
      if (calculated) {
        // Recalculate tier based on points
        let tier: User['tier'] = 'Bronze';
        if (calculated.points >= 40) tier = 'Gold';
        else if (calculated.points >= 25) tier = 'Silver';

        return {
          ...originalUser,
          totalPredictions: calculated.totalPredictions,
          points: calculated.points,
          exactScores: calculated.exactScores,
          tier
        };
      }
      return originalUser;
    });

    // Update current user if they are logged in as a player
    if (currentUser && currentUser.id !== 'admin') {
      const updatedMe = recalculatedUsers.find(u => u.id === currentUser.id);
      if (updatedMe) {
        setCurrentUser(updatedMe);
        saveToLocalStorage('pred_user', updatedMe);
      }
    }

    setPredictions(updatedPredictions);
    setUsers(recalculatedUsers);

    saveToLocalStorage('pred_predictions', updatedPredictions);
    saveToLocalStorage('pred_users', recalculatedUsers);
  };

  const submitPrediction = (matchId: string, homeScore: number, awayScore: number) => {
    if (!currentUser) return;

    // Check if prediction already exists for this match/user
    const existingIndex = predictions.findIndex(p => p.userId === currentUser.id && p.matchId === matchId);

    let updatedPredictions = [...predictions];

    if (existingIndex > -1) {
      updatedPredictions[existingIndex] = {
        ...updatedPredictions[existingIndex],
        predictedHome: homeScore,
        predictedAway: awayScore,
        submittedAt: new Date().toISOString()
      };
    } else {
      const newPred: Prediction = {
        id: 'p_' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.initials,
        matchId,
        predictedHome: homeScore,
        predictedAway: awayScore,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      updatedPredictions.push(newPred);

      // Increase match prediction count and update split
      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          const newEntries = m.entries + 1;
          // recalculate dummy split
          const homeWin = Math.min(100, Math.max(0, m.predictionSplit.homeWin + (homeScore > awayScore ? 2 : -1)));
          const awayWin = Math.min(100 - homeWin, Math.max(0, m.predictionSplit.awayWin + (awayScore > homeScore ? 2 : -1)));
          const draw = 100 - homeWin - awayWin;
          return {
            ...m,
            entries: newEntries,
            predictionSplit: { homeWin, draw, awayWin }
          };
        }
        return m;
      }));
    }

    // Update total predictions count for user
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        const total = updatedPredictions.filter(p => p.userId === currentUser.id).length;
        const updatedUser = { ...u, totalPredictions: total };
        setCurrentUser(updatedUser);
        saveToLocalStorage('pred_user', updatedUser);
        return updatedUser;
      }
      return u;
    });

    setPredictions(updatedPredictions);
    setUsers(updatedUsers);

    saveToLocalStorage('pred_predictions', updatedPredictions);
    saveToLocalStorage('pred_users', updatedUsers);
  };

  const resolveDispute = (predictionId: string, resolution: 'uphold' | 'dismiss' | 'void', note: string) => {
    const updated = predictions.map(p => {
      if (p.id === predictionId) {
        let points = p.points;
        let status: Prediction['status'] = 'scored';
        if (resolution === 'uphold') {
          points = settings.exactScorePoints; // Force award full points
          status = 'scored';
        } else if (resolution === 'dismiss') {
          status = 'scored';
        } else if (resolution === 'void') {
          points = 0;
          status = 'void';
        }
        return { ...p, points, status, adminNote: note };
      }
      return p;
    });
    setPredictions(updated);
    saveToLocalStorage('pred_predictions', updated);

    // Recalculate users
    let usersMap = new Map(users.map(u => [u.id, { ...u, points: 0, exactScores: 0 }]));
    updated.forEach(p => {
      const u = usersMap.get(p.userId);
      if (u && p.status === 'scored' && p.points !== undefined) {
        u.points += p.points;
        if (p.points === settings.exactScorePoints) {
          u.exactScores += 1;
        }
      }
    });

    const recalculatedUsers = users.map(originalUser => {
      const calculated = usersMap.get(originalUser.id);
      if (calculated) {
        let tier: User['tier'] = 'Bronze';
        if (calculated.points >= 40) tier = 'Gold';
        else if (calculated.points >= 25) tier = 'Silver';

        return { ...originalUser, points: calculated.points, exactScores: calculated.exactScores, tier };
      }
      return originalUser;
    });

    setUsers(recalculatedUsers);
    saveToLocalStorage('pred_users', recalculatedUsers);
  };

  const raiseDispute = (predictionId: string, reason: string) => {
    const updated = predictions.map(p => {
      if (p.id === predictionId) {
        return { ...p, status: 'disputed' as const, disputeReason: reason };
      }
      return p;
    });
    setPredictions(updated);
    saveToLocalStorage('pred_predictions', updated);
  };

  const updateUserStatus = (userId: string, status: User['status']) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status };
      }
      return u;
    });
    setUsers(updated);
    saveToLocalStorage('pred_users', updated);
  };

  const updatePaymentStatus = (paymentId: string, status: Payment['status'], reason?: string) => {
    const updated = payments.map(p => {
      if (p.id === paymentId) {
        return { ...p, status, reasonForFlag: reason || p.reasonForFlag };
      }
      return p;
    });
    setPayments(updated);
    saveToLocalStorage('pred_payments', updated);
  };

  const updateSettings = (category: string, updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    saveToLocalStorage('pred_settings', newSettings);
  };

  const totalUsers = users.length;
  const totalPredictions = predictions.length;
  const revenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const liveMatches = matches.filter(m => m.status === 'live').length;

  const addPrize = (prizeData: Omit<Prize, 'id'>) => {
    const newPrize: Prize = {
      ...prizeData,
      id: 'prz_' + Date.now()
    };
    const updated = [...prizes, newPrize];
    setPrizes(updated);
    saveToLocalStorage('pred_prizes', updated);
  };

  const deletePrize = (id: string) => {
    const updated = prizes.filter(p => p.id !== id);
    setPrizes(updated);
    saveToLocalStorage('pred_prizes', updated);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        matches,
        predictions,
        users,
        payments,
        settings,
        login,
        register,
        addMatch,
        updateMatch,
        submitPrediction,
        resolveDispute,
        raiseDispute,
        updateUserStatus,
        updatePaymentStatus,
        updateSettings,
        prizes,
        addPrize,
        deletePrize,
        stats: {
          totalUsers,
          totalPredictions,
          revenue,
          liveMatches,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
