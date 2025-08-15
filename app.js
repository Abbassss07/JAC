const holidayUrl = 'holidays.json'; // local file in same repo
let holidays = new Set();

fetch(holidayUrl)
  .then(res => res.json())
  .then(events => {
    events.forEach(ev => {
      let start = new Date(ev.start);
      let end = new Date(ev.end);
      while (start <= end) {
        holidays.add(start.toISOString().slice(0, 10));
        start.setDate(start.getDate() + 1);
      }
    });
  });

const subjectsDiv = document.getElementById('subjects');
const addButton = document.getElementById('addSub');
const output = document.getElementById('output');

addSubjectRow();

addButton.addEventListener('click', () => {
  addSubjectRow();
});

function addSubjectRow() {
  const div = document.createElement('div');
  div.className = 'row';
  div.innerHTML = `
    <input type="text" placeholder="Subject name" class="sub" />
    Attended Classes: <input type="number" class="att" min="0" value="0" style="width: 60px;" />
    <button class="delSub">Remove</button>
  `;
  subjectsDiv.appendChild(div);

  div.querySelector('.delSub').addEventListener('click', () => {
    div.remove();
  });
}

document.getElementById('calc').addEventListener('click', () => {
  const endMonthInput = document.getElementById('endMonth').value;
  if (!endMonthInput) {
    output.textContent = 'Please select last month with classes.';
    return;
  }

  const end = new Date(endMonthInput + '-01');
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);

  const start = new Date('2025-04-01');

  let classDays = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    let dateStr = d.toISOString().slice(0, 10);
    if (d.getDay() !== 0 && !holidays.has(dateStr)) { // Exclude Sundays & holidays
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
    const needed = Math.max(0, Math.ceil(0.75 * totalClasses - attended));
    results.push(`${sub}: Total Classes = ${totalClasses}, Attended = ${attended}, Need at least ${needed} more`);
  });

  output.textContent = results.join('\n');
});
