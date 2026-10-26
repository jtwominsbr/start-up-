import React, { useState, useEffect, useMemo } from 'react';
import {
  ScreenType,
  Trip,
  UserProfile,
  Place,
  DaySchedule,
  BudgetBreakdown,
  ItineraryItem,
} from './types';
import {
  mockUser,
  mockTokyoTrip,
  initialPlaces,
  initialDaySchedules,
} from './data/initialData';
import { recalculateDaySchedule, recalculateAllBudget } from './utils/calculation';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { TripSetupScreen } from './components/screens/TripSetupScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { ItineraryScreen } from './components/screens/ItineraryScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { ReadOnlyShareScreen } from './components/screens/ReadOnlyShareScreen';
import { PaymentModal } from './components/modals/PaymentModal';
import { ShareModal } from './components/modals/ShareModal';
import { TransitComparisonModal } from './components/modals/TransitComparisonModal';
import { DayPickerModal } from './components/modals/DayPickerModal';
import { AuthModal } from './components/modals/AuthModal';

export default function App() {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isReadOnlyMode, setIsReadOnlyMode] = useState<boolean>(false);

  // Core App States with localStorage Persistence
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tpl_user');
    return saved ? JSON.parse(saved) : mockUser;
  });

  const [trip, setTrip] = useState<Trip>(() => {
    const saved = localStorage.getItem('tpl_trip');
    return saved ? JSON.parse(saved) : mockTokyoTrip;
  });

  const [places] = useState<Place[]>(initialPlaces);

  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem('tpl_schedules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialDaySchedules.map((s) => recalculateDaySchedule(s));
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [transitModalInfo, setTransitModalInfo] = useState<{
    isOpen: boolean;
    fromName: string;
    toName: string;
  }>({
    isOpen: false,
    fromName: '',
    toName: '',
  });
  const [dayPickerPlace, setDayPickerPlace] = useState<Place | null>(null);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tpl_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tpl_trip', JSON.stringify(trip));
  }, [trip]);

  useEffect(() => {
    localStorage.setItem('tpl_schedules', JSON.stringify(daySchedules));
  }, [daySchedules]);

  // Recalculate full budget whenever trip or schedules change
  const currentBudget: BudgetBreakdown = useMemo(() => {
    return recalculateAllBudget(trip, daySchedules);
  }, [trip, daySchedules]);

  // Trip Updates
  const handleUpdateTrip = (updated: Partial<Trip>) => {
    setTrip((prev) => ({ ...prev, ...updated }));
  };

  // Itinerary Item Actions
  const handleAddPlaceToDay = (place: Place, dayIndex: number) => {
    setDaySchedules((prev) => {
      return prev.map((schedule) => {
        if (schedule.dayIndex !== dayIndex) return schedule;

        const newItem: ItineraryItem = {
          id: `item-${Date.now()}`,
          tripId: trip.id,
          date: schedule.date,
          dayIndex,
          placeId: place.id,
          order: schedule.items.length + 1,
          startTime: '10:00',
          endTime: '11:30',
          stayMinutes: place.estimatedStayMinutes || 60,
          transportMode: '대중교통',
          travelMinutes: 20,
          distanceMeters: 2500,
          transportCostJpy: 180,
          transitType: 'transit',
          transitLineName: '도쿄 메트로',
          status: 'planned',
          warning: null,
          place,
        };

        const updatedItems = [...schedule.items, newItem];
        return recalculateDaySchedule({
          ...schedule,
          items: updatedItems,
        });
      });
    });
    showToast(`${dayIndex}일차 일정에 "${place.name}"이(가) 추가되었습니다!`);
  };

  const handleReorderItem = (
    dayIndex: number,
    itemId: string,
    direction: 'up' | 'down'
  ) => {
    setDaySchedules((prev) => {
      return prev.map((schedule) => {
        if (schedule.dayIndex !== dayIndex) return schedule;

        const items = [...schedule.items];
        const index = items.findIndex((i) => i.id === itemId);
        if (index === -1) return schedule;

        if (direction === 'up' && index > 0) {
          const temp = items[index];
          items[index] = items[index - 1];
          items[index - 1] = temp;
        } else if (direction === 'down' && index < items.length - 1) {
          const temp = items[index];
          items[index] = items[index + 1];
          items[index + 1] = temp;
        }

        return recalculateDaySchedule({
          ...schedule,
          items,
        });
      });
    });
    showToast('방문 순서가 변경되어 시간이 재계산되었습니다.');
  };

  const handleDeleteItem = (dayIndex: number, itemId: string) => {
    setDaySchedules((prev) => {
      return prev.map((schedule) => {
        if (schedule.dayIndex !== dayIndex) return schedule;
        const items = schedule.items.filter((i) => i.id !== itemId);
        return recalculateDaySchedule({
          ...schedule,
          items,
        });
      });
    });
    showToast('일정에서 삭제되었습니다.');
  };

  const handleAdjustStayTime = (
    dayIndex: number,
    itemId: string,
    deltaMinutes: number
  ) => {
    setDaySchedules((prev) => {
      return prev.map((schedule) => {
        if (schedule.dayIndex !== dayIndex) return schedule;
        const items = schedule.items.map((item) => {
          if (item.id !== itemId) return item;
          const nextMinutes = Math.max(30, item.stayMinutes + deltaMinutes);
          return { ...item, stayMinutes: nextMinutes };
        });
        return recalculateDaySchedule({
          ...schedule,
          items,
        });
      });
    });
  };

  const handleReoptimizeDay = (dayIndex: number) => {
    setDaySchedules((prev) => {
      return prev.map((schedule) => {
        if (schedule.dayIndex !== dayIndex) return schedule;
        // Sort items logically to minimize distance
        const sorted = [...schedule.items].reverse();
        return recalculateDaySchedule({
          ...schedule,
          items: sorted,
        });
      });
    });
  };

  // Payment confirmation
  const handlePaymentSuccess = () => {
    setTrip((prev) => ({
      ...prev,
      isSmartPassPaid: true,
      paymentId: `TPL-PASS-${Date.now().toString().slice(-6)}`,
    }));
    showToast('스마트 패스가 즉시 활성화되었습니다! 모든 프리미엄 기능을 이용하세요.');
  };

  // Auth confirmation
  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    showToast(`${newUser.name}님으로 로그인되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-[#e9eef6] text-[#0b1c30] flex justify-center font-sans antialiased selection:bg-[#71f8e4] selection:text-[#00201c]">
      {/* Mobile container: perfectly responsive from 320px to 428px, centered on larger displays */}
      <div className="w-full max-w-md bg-[#f8f9ff] min-h-screen shadow-2xl relative flex flex-col overflow-x-hidden border-x border-[#c5c6ce]/20">
        {/* Read-only companion view overlay or main app */}
        {isReadOnlyMode ? (
          <ReadOnlyShareScreen
            trip={trip}
            daySchedules={daySchedules}
            onExitReadOnly={() => setIsReadOnlyMode(false)}
            onShowToast={showToast}
          />
        ) : (
          <>
            {/* Sticky Header */}
            <Header
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              user={user}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />

            {/* Screen Content */}
            <main className="flex-1 mt-16">
              {currentScreen === 'home' && (
                <HomeScreen
                  onNavigate={(s) => setCurrentScreen(s)}
                  currentTrip={trip}
                  onSelectDestination={(dest) => {
                    handleUpdateTrip({ destination: dest });
                  }}
                />
              )}

              {currentScreen === 'plan-setup' && (
                <TripSetupScreen
                  currentTrip={trip}
                  onUpdateTrip={handleUpdateTrip}
                  onNavigate={(s) => setCurrentScreen(s)}
                  onShowToast={showToast}
                />
              )}

              {currentScreen === 'explore' && (
                <ExploreScreen
                  places={places}
                  daySchedules={daySchedules}
                  onOpenDayPicker={(place) => setDayPickerPlace(place)}
                  onOpenTransitComparison={(from, to) => {
                    setTransitModalInfo({
                      isOpen: true,
                      fromName: from,
                      toName: to,
                    });
                  }}
                  onShowToast={showToast}
                />
              )}

              {currentScreen === 'itinerary' && (
                <ItineraryScreen
                  trip={trip}
                  daySchedules={daySchedules}
                  selectedDayIndex={selectedDayIndex}
                  onSelectDayIndex={setSelectedDayIndex}
                  onUpdateDaySchedule={(updated) => {
                    setDaySchedules((prev) =>
                      prev.map((s) => (s.dayIndex === updated.dayIndex ? updated : s))
                    );
                  }}
                  onNavigate={(s) => setCurrentScreen(s)}
                  onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  onOpenTransitComparison={(from, to) => {
                    setTransitModalInfo({
                      isOpen: true,
                      fromName: from,
                      toName: to,
                    });
                  }}
                  onShowToast={showToast}
                  onReorderItem={handleReorderItem}
                  onDeleteItem={handleDeleteItem}
                  onAdjustStayTime={handleAdjustStayTime}
                  onReoptimizeDay={handleReoptimizeDay}
                />
              )}

              {currentScreen === 'budget' && (
                <BudgetScreen
                  trip={trip}
                  budget={currentBudget}
                  onNavigate={(s) => setCurrentScreen(s)}
                  onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  onShowToast={showToast}
                />
              )}
            </main>

            {/* Bottom Navigation */}
            {currentScreen !== 'plan-setup' && (
              <BottomNav
                currentScreen={currentScreen}
                onNavigate={(s) => setCurrentScreen(s)}
              />
            )}
          </>
        )}

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-[#000412]/90 backdrop-blur-md text-white text-[13px] font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-white/10 max-w-sm text-center pointer-events-auto">
              <span className="material-symbols-outlined text-[#71f8e4] text-[18px]">
                info
              </span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Modals */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          trip={trip}
          onPaymentSuccess={handlePaymentSuccess}
        />

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          trip={trip}
          onShowToast={showToast}
          onOpenReadOnlyView={() => setIsReadOnlyMode(true)}
        />

        <TransitComparisonModal
          isOpen={transitModalInfo.isOpen}
          onClose={() =>
            setTransitModalInfo((prev) => ({ ...prev, isOpen: false }))
          }
          fromName={transitModalInfo.fromName}
          toName={transitModalInfo.toName}
        />

        <DayPickerModal
          isOpen={!!dayPickerPlace}
          onClose={() => setDayPickerPlace(null)}
          place={dayPickerPlace}
          daySchedules={daySchedules}
          onAddPlaceToDay={handleAddPlaceToDay}
          onNavigateToItinerary={(dayIdx) => {
            setSelectedDayIndex(dayIdx);
            setCurrentScreen('itinerary');
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={user}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
}
