import { DaySchedule, ItineraryItem, BudgetBreakdown, Trip } from '../types';

export function recalculateDaySchedule(schedule: DaySchedule): DaySchedule {
  let currentTimeMinutes = 9 * 60 + 30; // Starts at 09:30 AM
  let totalExpenseJpy = 0;
  const updatedItems: ItineraryItem[] = [];

  schedule.items.forEach((item, index) => {
    const startHour = Math.floor(currentTimeMinutes / 60);
    const startMin = currentTimeMinutes % 60;
    const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;

    const endMinutes = currentTimeMinutes + item.stayMinutes;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    // Calculate expense for this spot
    totalExpenseJpy += (item.place.entranceFeeJpy || 0) + (item.place.estimatedMealCostJpy || 0) + (item.transportCostJpy || 0);

    // Warning check
    let warning: string | null = null;
    let warningType: 'closure' | 'transit' | 'density' | undefined = undefined;

    // Check closed days
    if (schedule.dayOfWeek && item.place.closedDays?.some(d => d.includes(schedule.dayOfWeek))) {
      warning = `${schedule.dayOfWeek}요일 정기 휴관일과 겹칩니다`;
      warningType = 'closure';
    } else if (item.travelMinutes > 40) {
      warning = `${item.transitLineName || '이동'} ${item.travelMinutes}분 소요 환승 대기 주의`;
      warningType = 'transit';
    }

    updatedItems.push({
      ...item,
      order: index + 1,
      startTime,
      endTime,
      warning,
      warningType,
    });

    // Next spot starts after travel time
    currentTimeMinutes = endMinutes + (item.travelMinutes || 20);
  });

  const totalActivityMinutes = currentTimeMinutes - (9 * 60 + 30);
  let status: '여유' | '보통' | '과밀' = '보통';
  if (totalActivityMinutes > 8 * 60) {
    status = '과밀';
  } else if (totalActivityMinutes < 5 * 60) {
    status = '여유';
  }

  // Generate day-level warnings
  const warnings: DaySchedule['warnings'] = [];
  const closureConflict = updatedItems.find(i => i.warningType === 'closure');
  if (closureConflict) {
    warnings.push({
      id: `warn-closure-${schedule.dayIndex}`,
      type: 'closure',
      title: `${schedule.dayOfWeek}요일 휴무일과 겹칩니다`,
      description: `${closureConflict.place.name}이(가) 매주 ${schedule.dayOfWeek}요일 정기 휴관입니다. 다른 방문지로 대체를 권장합니다.`,
      actionLabel: '휴관',
    });
  }

  const transitConflict = updatedItems.find(i => i.warningType === 'transit');
  if (transitConflict) {
    warnings.push({
      id: `warn-transit-${schedule.dayIndex}`,
      type: 'transit',
      title: '다음 장소까지 이동 시간이 부족합니다',
      description: `구간 이동 및 환승에 약 ${transitConflict.travelMinutes}분이 소요되어 다음 일정이 지연될 수 있습니다.`,
    });
  }

  if (status === '과밀') {
    warnings.push({
      id: `warn-density-${schedule.dayIndex}`,
      type: 'density',
      title: '오늘 일정이 조금 빡빡해요',
      description: '후반부 피로도가 높습니다. 장소 하나를 여유로운 다른 일차로 옮겨보시는 건 어떨까요?',
      actionLabel: '분산 추천',
    });
  }

  return {
    ...schedule,
    status,
    totalActivityMinutes,
    totalExpenseJpy,
    items: updatedItems,
    warnings,
  };
}

export function recalculateAllBudget(trip: Trip, schedules: DaySchedule[]): BudgetBreakdown {
  const travelerCount = Math.max(1, trip.travelerCount);
  const exchangeRate = trip.exchangeRate || 9.0; // 1 JPY = 9 KRW

  let totalFoodJpy = 0;
  let totalEntranceJpy = 0;
  let totalTransportJpy = 0;

  schedules.forEach(day => {
    day.items.forEach(item => {
      totalFoodJpy += (item.place.estimatedMealCostJpy || 0) * travelerCount;
      totalEntranceJpy += (item.place.entranceFeeJpy || 0) * travelerCount;
      totalTransportJpy += (item.transportCostJpy || 0) * travelerCount;
    });
  });

  // Base flight & accommodation costs
  const flightKrw = 210000 * travelerCount; // e.g. ₩420,000 for 2
  const accommodationKrw = 650000; // Hotel for 4 nights
  const accommodationJpy = Math.round(accommodationKrw / exchangeRate);

  const foodKrw = Math.round(totalFoodJpy * exchangeRate) || 310000;
  const foodJpy = Math.round(foodKrw / exchangeRate);

  const transportKrw = Math.round(totalTransportJpy * exchangeRate) || 130000;
  const transportJpy = Math.round(transportKrw / exchangeRate);

  const entranceKrw = Math.round(totalEntranceJpy * exchangeRate) || 110000;
  const entranceJpy = Math.round(entranceKrw / exchangeRate);

  const totalKrw = accommodationKrw + flightKrw + foodKrw + transportKrw + entranceKrw;
  const totalJpy = Math.round(totalKrw / exchangeRate);

  const totalBudgetKrw = trip.budgetKrw || 1800000;
  const remainingKrw = Math.max(0, totalBudgetKrw - totalKrw);
  const overBudgetKrw = Math.max(0, totalKrw - totalBudgetKrw);
  const budgetUsagePercent = Math.min(150, parseFloat(((totalKrw / totalBudgetKrw) * 100).toFixed(1)));

  return {
    tripId: trip.id,
    accommodationKrw,
    accommodationJpy,
    flightKrw,
    flightJpy: 0,
    foodKrw,
    foodJpy,
    transportKrw,
    transportJpy,
    entranceKrw,
    entranceJpy,
    otherKrw: 0,
    otherJpy: 0,
    totalKrw,
    totalJpy,
    remainingKrw,
    overBudgetKrw,
    budgetUsagePercent,
    exchangeRateDate: trip.exchangeRateDate || '2026-09-01',
    exchangeRate,
  };
}
