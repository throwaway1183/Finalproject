console.log("JS LOADED");
const toggleBtn = document.getElementById('toggleBtn');
const personToggle = document.getElementById('personToggle');
const sidebar = document.querySelector('.sidebar');
const personbar = document.querySelector('.personbar');


let currentIndex = -1;
let totalSlides = 18;
let isAnimating = false;

const content = document.querySelector('.content');
const navItems = document.querySelectorAll('.nav-item');
const wipe = document.querySelector(".wipe");
const wipeTwo = document.querySelector('.wipe.two');

const profilesContainer = document.getElementById("profileContainer");

let data = []; // global variable to hold data

async function loadData() {
  const response = await fetch("../data.json");
  return await response.json();
}

let slides = []; // empty initially


async function init() {
  const cdata = await loadData();
  data = cdata; // assign to global variable
  
  // build slides after data is ready
  const maxIndex = data.activity.indexOf(Math.max(...data.activity));
  const timeRanges = [
    ["12:00 AM", "4:00 AM"],
    ["4:00 AM", "8:00 AM"],
    ["8:00 AM", "12:00 PM"],
    ["12:00 PM", "4:00 PM"],
    ["4:00 PM", "8:00 PM"],
    ["8:00 PM", "12:00 AM"]
  ];
  const [lt, rt] = timeRanges[maxIndex];   
  slides = [
    //user stats
    `<h1>Total Messages</h1><p>12,847 messages sent</p>`,                   
    `<h1>Total Words</h1><p>98,231 words typed</p>`,                        
    `<h1>Most Used Emoji</h1><p>😂 (1,204 times)</p>`,                      
    //group stats
    `<h1>Night Owl</h1><p>${cdata.nightOwl[0][0]} : most active after midnight 🌙</p>`,        
    `<h1>Ghost</h1><p>${cdata.ghost[0][0]} : ghosted 👻</p>`,                    
    `<h1>Conversation Starter</h1><p>${cdata.silenceBreaker[0][0]} : starts the most chats 💬</p>`, 
    `<h1>Hype Person</h1><p>${cdata.fastReplier[0][0]} : always reacting 🔥</p>`,               
    `<h1>The CAPS User</h1><p>${cdata.CAPSer[0][0]} : LOVES SHOUTING 😤</p>`,               
    `<h1>Long Worder</h1><p>${cdata.longWorder[0][0]} : longest average word length 📚</p>`,   
    `<h1>Long Messenger</h1><p>${cdata.longMessager[0][0]} : longest messages ✍️</p>`,           
    `<h1>Emoji Man</h1><p>${cdata.emojiUser[0][0]} : most emojis used 😂🔥💀</p>`,
    `<h1>Most Common Word</h1><p>"${cdata.top5Words[0][0][0]}" (used ${cdata.top5Words[0][0][1]} times)</p>`,                           
    //time stats
    `<h1>Busiest Day</h1><p>${cdata.top3BusyDay[0][0]} : ${cdata.top3BusyDay[0][1]} messages 📈</p>`,              
    `<h1>Longest Silence</h1><p>${Math.floor(cdata.longestSilence / 3600)} hours 😶</p>`,                    
    `<h1>Most Chaotic Day</h1><p>${cdata.top3ChaoticDay[0][0]} : nonstop chaos 💥</p>`,           
    `<h1>Average Response Time</h1><p>${Math.floor(cdata.medianReplyTime / 60)} minutes : ${cdata.medianReplyTime % 60} seconds ⏱️</p>`,                       
    `<h1>Peak Activity</h1><p>${lt} - ${rt} 🌆</p>` 
  ];
}

init();

// Add click event listeners to navigation items
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const index = Number(item.getAttribute('data-index'));
    loadSlideFancy(index);
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  })
});

let title = document.getElementById("top-title");
  title.addEventListener('click', () => {
    window.location.reload();
  });
let curvid = 0;
let numvid = 4;

//helper function to decode unicode emoji strings
function decodeEmoji(unicodeStr) {
  return unicodeStr.replace(/\\U([0-9a-fA-F]{8})/g, (_, code) =>
    String.fromCodePoint(parseInt(code, 16))
  );
}

//chart variables and config
const canvas = document.getElementById('myCanvas');
const ctx = document.getElementById('myCanvas').getContext('2d');
Chart.defaults.font.family = ' system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
Chart.defaults.font.size = 20;
Chart.defaults.font.weight = '800';
Chart.defaults.color = 'white';
const wrapper = document.querySelector('.chart-wrapper');
let currentChart = null;

//Total messages sent per user chart logic
function renderTotalMessagesChart() {
  canvas.classList.remove('hidden');

  const labels = data.userName;
  
  const datasets = [{
    label: 'Total Messages',
    data: data.messageCount,   
    backgroundColor: 'rgb(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 3
  }];

  if (currentChart) {
    currentChart.destroy();
  }

  //create new chart instance
  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets 
    },
    options: {
      responsive: true,
      plugins: {
        title: {
        display: true,
        text: 'Total Messages Sent Per User', 
        font: { size: 44, weight: 'bold' },
        }, 
        subtitle: {
        display: true,
        text: 'Hover to view message count', 
        font: { size: 20, weight: 'bold' },
        },
        legend: {
          labels: { color: 'white', font : {size: 18, weight: '500'} }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const count = context.raw;
              return `Messages: ${count}`;
            }
          }
        }
      }
    }
  });
}

//Total words sent per user chart logic
function renderTotalWordsChart() {
  canvas.classList.remove('hidden');

  const labels = data.userName;
  
  const datasets = [{
    label: 'Total Messages',
    data: data.wordCount,   
    backgroundColor: 'rgb(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 3
  }];

  if (currentChart) {
    currentChart.destroy();
  }

  //create new chart instance
  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets 
    },
    options: {
      responsive: true,
      plugins: {
        title: {
        display: true,
        text: 'Total Words Sent Per User', 
        font: { size: 44, weight: 'bold' },
        }, 
        subtitle: {
        display: true,
        text: 'Hover to view word count', 
        font: { size: 20, weight: 'bold' },
        },
        legend: {
          labels: { color: 'white', font : {size: 18, weight: '500'} }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const count = context.raw;
              return `Words: ${count}`;
            }
          }
        }
      }
    }
  });
}

//top 3 emojis per person chart logic
function renderEmojiChart() {
  canvas.classList.remove('hidden');

  const labels = data.userName;
  
  // Top 1, Top 2, Top 3
  const datasets = [0, 1, 2].map(rank => ({
    label: `Top ${rank + 1}`,
    data: data.top3Emojis.map(user => user[rank][1]),
    backgroundColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)'
    ][rank]
    , borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1
  }));
  if (currentChart) {
    currentChart.destroy();
  }

  //create new chart instance
  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets 
    },
    options: {
      responsive: true,
      plugins: {
        title: {
        display: true,
        text: 'Top 3 Emojis Per User', 
        font: { size: 44, weight: 'bold' },
        }, 
        subtitle: {
        display: true,
        text: 'Hover to view emojis and counts', 
        font: { size: 20, weight: 'bold' },
        },
        legend: {
          labels: { color: 'white', font : {size: 18, weight: '500'} }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const userIndex = context.dataIndex;
              const rank = context.datasetIndex;

              const emoji = decodeEmoji(
                data.top3Emojis[userIndex][rank][0]
              );

              const count = context.raw;

              return `${emoji} : ${count}`;
            }
          }
        }
      }
    }
  });
}

const userTogTitle = document.getElementById("user-toggle-title");

//slide loader logic with video background transition
function showSlide(index){
  console.log("showSlide:", index);
  if(index === currentIndex) return;
  let prev = curvid;
  curvid = (curvid % numvid) + 1;
  let prevVid = document.getElementById("bgVideo" + prev);
  let nextVid = document.getElementById("bgVideo" + curvid);
  nextVid.playbackRate = 1.3;
  nextVid.loop = false;
  canvas.style.zIndex = -3;
  nextVid.play();
  nextVid.style.opacity = 1;
  nextVid.style.zIndex = -1;
  prevVid.style.opacity = 0;
  prevVid.style.zIndex = -2;
  userTogTitle.style.display = "none";
  if (prevVid.readyState >= 1) {
    prevVid.currentTime = 0;
  }
  prevVid.pause();

  content.classList.remove("hidden");
  profilesContainer.classList.add("hidden");
  profilesContainer.innerHTML = "";
  sidebar.style.height = "100vh";
  personbar.style.height = "100vh";
  if (index === 0) {
    personbar.classList.add("closed");
    content.innerHTML = "";
    content.style.flex = "0 0 0%";
    wrapper.style.flex = "1";
    wrapper.style.display = 'block';
    wrapper.style.zIndex = 0;
    renderTotalMessagesChart();
  } else if (index === 1) {
    personbar.classList.add("closed");
    content.innerHTML = "";
    content.style.flex = "0 0 0%";
    wrapper.style.flex = "1";
    wrapper.style.display = 'block';
    wrapper.style.zIndex = 0;
    renderTotalWordsChart();
  } else if (index === 2) {
    personbar.classList.add("closed");
    profilesContainer.classList.remove("hidden");
    content.innerHTML = "";
    content.style.flex = "0 0 0%";
    wrapper.style.flex = "1";
    wrapper.style.display = 'block';
    wrapper.style.zIndex = 0;
    renderEmojiChart();
  } else if(index === 17){
    userTogTitle.style.display = "block";
    wrapper.style.flex = "0 0 0%";
    wrapper.style.display = 'none';
    wrapper.style.zIndex = -3;
    sidebar.style.height = "300vh";
    personbar.style.height = "300vh";
    content.classList.add("hidden");
    renderProfiles();
  }
  else {
    personbar.classList.add("closed");
    wrapper.style.flex = "0 0 0%";
    content.style.flex = "1";
    wrapper.style.display = 'none';
    wrapper.style.zIndex = -3;
    content.innerHTML = slides[index];
    
  } 
  currentIndex = index;
}


//slide loader with wipe animation
function loadSlideFancy(index) {
  if(index === currentIndex){
    return;
  }
  if(isAnimating){
    return;
  }
  isAnimating = true;
  if(currentIndex != -1){
    wipe.style.transition = "right 0.5s ease;";
    wipeTwo.style.transition = "left 0.5s ease;";
    showSlide(index);
      setTimeout(() => {
      isAnimating = false;
    }, 2000);
}else{
    wipe.classList.add("active");
    wipeTwo.classList.add("active");
    wipe.style.transition = "right 1s ease;";
    wipeTwo.style.transition = "left 1s ease;";
    setTimeout(() => {
      showSlide(index);
    }, 1500);

    setTimeout(() => {
      wipe.classList.remove("active");
      wipeTwo.classList.remove("active");
    }, 2000);

    setTimeout(() => {
      wipe.classList.remove("active");
      wipeTwo.classList.remove("active");
      isAnimating = false;
    }, 3000);
  } 
  navItems.forEach(i => i.classList.remove('active'));
  navItems[index].classList.add('active');
}


document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !personbar.contains(event.target) && !toggleBtn.contains(event.target) && !personToggle.contains(event.target)) {
      loadSlideFancy((currentIndex + 1) % totalSlides);
    }
  }
)

//resize chart on sidebar toggle 
let i = 0;
toggleBtn.addEventListener("click", () => {
  i+= 1;
  sidebar.classList.toggle("closed");
  if(sidebar.classList.contains("closed")){
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.classList.remove('chart-shifted');
    wrapper.classList.add('chart-center');
  } else {
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.classList.remove('chart-center');
    wrapper.classList.add('chart-shifted');
  }

  wrapper.offsetHeight; 
  if (currentChart) {
    currentChart.destroy();
    currentChart = new Chart(ctx, currentChart.config);
  }
  
});

//toggle person sidebar
personToggle.addEventListener("click", () => {
  if(currentIndex === 17){
    personbar.classList.toggle("closed");
  }
  else{
    personbar.classList.add("closed");
  }
});

let selectedUsers = new Set();
for(let i = 0; i < 10; i++){
  selectedUsers.add(i);
}

const userItems = document.querySelectorAll('.user-item');
userItems.forEach(item => {
  item.addEventListener('click', () => {
    const index = Number(item.getAttribute('data-index'));
    if(index == -2){
      if(item.classList.contains("active")){
        for(let i = 0; i < 10; i++){
          selectedUsers.delete(i);
        }
        userItems.forEach(it => {it.classList.remove("active")});
      }else{
        for(let i = 0; i < 10; i++){
          selectedUsers.add(i);
        }
        userItems.forEach(it => {it.classList.add("active")});
      }
    } else if(selectedUsers.has(index)){
      selectedUsers.delete(index);
      item.classList.remove('active');
    } else {
      selectedUsers.add(index);
      item.classList.add('active');
    }

    renderProfiles();
  })
});

function renderProfiles() {
  profilesContainer.classList.remove("hidden");
  profilesContainer.innerHTML = "";
      
  selectedUsers.forEach(i => {
    const name = data.userName[i];
    const messages = data.messageCount[i];
    const words = data.wordCount[i];
    const emojis = data.top3Emojis[i];
    let response = 0;
    data.fastReplier.forEach(user => {
      if(user[0] === name){
        response = user[1];
      }
    });
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
      <h3 class="profile-name">${name}</h3>
      <div class="stat">Messages: ${messages}</div>
      <div class="stat">Words: ${words}</div>
      <div class="stat">Avg Response: ${Math.round(response/60)} min</div>
      <div class="stat">Conversations Started: ${data.silenceBreaker[i][1]}</div>
      <div class="stat">
        Top Emojis: 
        ${emojis.map(e => `<span style="font-size:24px">${decodeEmoji(e[0])}</span> ${e[1]}`).join(' | ')}
      </div>
      <canvas id="timeChart-${i}"></canvas>
      
    `;
    profilesContainer.appendChild(card);
    renderTimeChart(i);
  });

  function renderTimeChart(i) {
    const ctx = document.getElementById(`timeChart-${i}`);

    const labels = [
      "12-4AM", "4-8AM", "8-12PM",
      "12-4PM", "4-8PM", "8-12AM"
    ];

    const values = data.userActivity[i];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Messages",
          data: values,
          backgroundColor: "rgb(255, 255, 255)",
          borderColor: "rgb(255, 19, 86)",
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Time of Day Activity"
          },
          legend: {
            display:false,
            labels: { color: 'white', font : {size: 18, weight: '500'} }
          }
        },
        scales: {
          y: {
            border: {color: "white"},
            beginAtZero: true,
            ticks: {font : {size: 10}}
          },
          x: {
            border: {color: "white"},
            ticks: {font : {size: 10}}
          }
        }
      }
    });
    ctx.style.border = "0.5px solid #f0f0f0";
  }
}