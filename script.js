let nameData = [];

    // Load saved data from localStorage
    window.onload = function() {
      const savedData = localStorage.getItem('nameData');
      if (savedData) {
        nameData = JSON.parse(savedData).map(entry => ({
          name: entry.name,
          date: entry.date ? new Date(entry.date) : null
        }));
        sortAndRender();
      }
    }

    function saveToLocalStorage() {
      localStorage.setItem('nameData', JSON.stringify(nameData));
    }

    function addName() {
      const input = document.getElementById('newNameInput');
      const name = input.value.trim();
      if (!name) return;

      nameData.push({ name, date: null });
      input.value = '';
      saveToLocalStorage();
      sortAndRender();
    }

    function markDate(index) {
      nameData[index].date = new Date();
      saveToLocalStorage();
      sortAndRender();
    }
    
    function removeName(index) {
      nameData.splice(index, 1);
      saveToLocalStorage();
      sortAndRender();
    }
    
    function sortAndRender() {
      nameData.sort((a, b) => {
        if (!a.date) return -1;
        if (!b.date) return 1;
        return new Date(a.date) - new Date(b.date);
      });
      renderList();
      renderCalendar();
    }

function renderList() {
  const container = document.getElementById('nameList');
  container.innerHTML = '';

  nameData.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'name-entry';

    const nameText = document.createElement('span');
    nameText.textContent = `${entry.name} ${entry.date ? '- ' + new Date(entry.date).toLocaleString() : ''}`;
    
    const markBtn = document.createElement('button');
    markBtn.textContent = 'Mark';
    markBtn.onclick = () => markDate(index);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeName(index);

    div.appendChild(nameText);
    div.appendChild(markBtn);
    div.appendChild(removeBtn);

    container.appendChild(div);
  });
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('calendarTitle');
  grid.innerHTML = '';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Update title
  const monthName = now.toLocaleString('default', { month: 'long' });
  title.textContent = `📅 ${monthName} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();
  const startDay = firstDay.getDay(); // 0 (Sun) to 6 (Sat)

  // Create blank cells for alignment
  for (let i = 0; i < startDay; i++) {
    grid.appendChild(document.createElement('div'));
  }

  // Get events for this month
  const eventsByDay = {};
  nameData.forEach(entry => {
    if (!entry.date) return;
    const d = new Date(entry.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(entry.name);
    }
  });

  // Create calendar days
  for (let day = 1; day <= numDays; day++) {
    const div = document.createElement('div');
    div.className = 'calendar-day';

    if (day === now.getDate()) {
      div.classList.add('today');
    }

    const dayNum = document.createElement('div');
    dayNum.className = 'day-number';
    dayNum.textContent = day;
    div.appendChild(dayNum);

    if (eventsByDay[day]) {
      eventsByDay[day].forEach(name => {
        const event = document.createElement('div');
        event.className = 'event';
        event.textContent = name;
        div.appendChild(event);
      });
    }

    grid.appendChild(div);
  }
}
