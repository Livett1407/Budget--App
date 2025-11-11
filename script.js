const form = document.getElementById('entryForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const entriesList = document.getElementById('entriesList');

const incomeTotalEl = document.getElementById('incomeTotal');
const expenseTotalEl = document.getElementById('expenseTotal');
const balanceTotalEl = document.getElementById('balanceTotal');

let entries = JSON.parse(localStorage.getItem('budgetEntries')) || [];

function formatCurrency(num) {
  return Number(num).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function save() {
  localStorage.setItem('budgetEntries', JSON.stringify(entries));
}

function calculateAndRender() {
  entriesList.innerHTML = '';
  let income = 0;
  let expense = 0;

  entries.forEach((e, index) => {
    const li = document.createElement('li');
    li.classList.add(e.type);
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = e.desc;

    const amt = document.createElement('div');
    amt.className = 'amt';
    amt.textContent = (e.type === 'income' ? '+ ' : '- ') + formatCurrency(e.amount);

    li.appendChild(meta);
    li.appendChild(amt);

    // Klick: Eintrag löschen (Bestätigung)
    li.addEventListener('click', () => {
      if (confirm('Eintrag löschen?')) {
        entries.splice(index, 1);
        save();
        calculateAndRender();
      }
    });

    entriesList.appendChild(li);

    if (e.type === 'income') income += Number(e.amount);
    else expense += Number(e.amount);
  });

  incomeTotalEl.textContent = formatCurrency(income);
  expenseTotalEl.textContent = formatCurrency(expense);
  const balance = income - expense;
  balanceTotalEl.textContent = formatCurrency(balance);
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;
  if (!desc || isNaN(amount)) return;

  entries.push({ desc, amount: Math.abs(amount), type });
  save();
  calculateAndRender();

  form.reset();
  descInput.focus();
});

// initial render
calculateAndRender();
