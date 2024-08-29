function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function filterByMonth(data, year, month) {
  return data.filter((item) => {
    const [recordYear, recordMonth] = item.date.split('-');
    return parseInt(recordYear) === year && parseInt(recordMonth) === month;
  });
}

function generateDaysArray(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = day.toString().padStart(2, '0');
    days.push(`${year}-${month.toString().padStart(2, '0')}-${formattedDay}`);
  }

  return days;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });

  return `${day}, ${month}`;
}

function fullfilment(goal, amount) {
  const fullfilment = Math.round((amount / goal) * 100);
  if (fullfilment > 100) return `100%`;
  return `${fullfilment}%`;
}

function aggregateData(data, days, goal) {
  const aggregated = {};

  days.forEach((day) => {
    aggregated[day] = {
      totalAmount: 0,
      servings: 0,
      dailyNorma: goal,
    };
  });

  data.forEach((item) => {
    const { date, amount } = item;

    if (aggregated[date]) {
      aggregated[date].totalAmount += amount;
      aggregated[date].servings += 1;
    }
  });

  return Object.keys(aggregated).map((date) => ({
    date: formatDate(date),
    totalAmount: aggregated[date].totalAmount,
    servings: aggregated[date].servings,
    dailyNorma: aggregated[date].dailyNorma,
    fullfilment: fullfilment(goal, aggregated[date].totalAmount),
  }));
}

export function createMonthData(data, year, month, goal) {
  const filteredData = filterByMonth(data, Number(year), Number(month));
  const days = generateDaysArray(Number(year), Number(month));
  const result = aggregateData(filteredData, days, goal);
  return result;
}
