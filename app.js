document.getElementById('calc').addEventListener('click', () => {
  const start = new Date('2025-05-19');  // Fixed academic start date
  const end = new Date('2025-12-31');    // Fixed academic end date

  // Generate all class days between start and end, exclude Sundays and holidays
  let classDays = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    let dateStr = d.toISOString().slice(0, 10);
    if (d.getDay() !== 0 && !holidays.has(dateStr)) { // Sunday=0
      classDays.push(dateStr);
    }
  }

  const totalClasses = classDays.length;

  const rows = document.querySelectorAll('.row');
  if (rows.length === 0) {
    output.textContent = 'Please add at least one subject.';
    return;
  }

  let results = [];

  rows.forEach(row => {
    const sub = row.querySelector('.sub').value.trim() || "Unnamed Subject";
    const attended = parseInt(row.querySelector('.att').value, 10);
    if (isNaN(attended) || attended < 0) {
      results.push(`${sub}: Invalid attended classes.`);
      return;
    }
    const needed = Math.ceil(0.75 * totalClasses - attended);
    results.push(`${sub}: Total Classes = ${totalClasses}, Attended = ${attended}, Need to attend at least ${needed > 0 ? needed : 0} more`);
  });

  output.textContent = results.join('\n');
});

