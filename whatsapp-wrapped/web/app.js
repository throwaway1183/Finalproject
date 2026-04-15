console.log("JS LOADED");
const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('closed');
});


let currentIndex = -1;
let totalSlides = 18;
let isAnimating = false;

const content = document.querySelector('.content');
const navItems = document.querySelectorAll('.nav-item');
const wipe = document.querySelector(".wipe");
const wipeTwo = document.querySelector('.wipe.two');

let data = []; // global variable to hold data

async function loadData() {
  const response = await fetch("./data.json");
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

//emoji graph
const container = document.getElementById('emojiGraphContainer');

function decodeEmoji(unicodeStr) {
  const hex = unicodeStr.replace("\\U", "");
  return String.fromCodePoint(parseInt(hex, 16));
}

function renderEmojiGraph(){
  container.innerHTML = "<h1>Top 3 Emojis Per User</h1>"; 
  let firstBlock = document.createElement("div");
  firstBlock.style.display = "flex";
  firstBlock.style.flexDirection = "column";
  let secondBlock = document.createElement("div");
  secondBlock.style.display = "flex";
  secondBlock.style.flexDirection = "column";
  const users = data.userName;
  const emojiData = data.top3Emojis;
  users.forEach((user, i) => {
    const personDiv = document.createElement("div");
    personDiv.className = "person-block";

    const name = document.createElement("div");
    name.className = "person-name";
    name.textContent = user;
    personDiv.appendChild(name);
    const max = emojiData[i][0][1];
    const row = document.createElement("div");
    row.className = "bar-row";
    let cnt = 0;
     emojiData[i].forEach(
       ([emoji, count]) => {
         const bar = document.createElement("div");
         bar.className = "bar" + cnt;
         cnt++;
         bar.textContent = count + " " + decodeEmoji(emoji);
         bar.style.width = `${(count / max) * 200}px`;
         row.appendChild(bar);
      }
    );
    personDiv.appendChild(row);
    if(i < 5){
    firstBlock.appendChild(personDiv);
    } else{
      secondBlock.appendChild(personDiv);
    }
  });
  let thirdBlock = document.createElement("div");
  thirdBlock.style.display = "flex";
  thirdBlock.appendChild(firstBlock);
  thirdBlock.appendChild(secondBlock);
  firstBlock.style.padding = "10px 50px";
  secondBlock.style.padding = "10px 50px";
  container.appendChild(thirdBlock);
}

let curvid = 0;
let numvid = 4;


//slide loader logic
function showSlide(index){
  console.log("showSlide:", index);
  if(index === currentIndex) return;
  let prev = curvid;
  curvid = (curvid % numvid) + 1;
  let prevVid = document.getElementById("bgVideo" + prev);
  let nextVid = document.getElementById("bgVideo" + curvid);
  nextVid.playbackRate = 1.3;
  nextVid.loop = false;
  nextVid.play();
  nextVid.style.opacity = 1;
  nextVid.style.zIndex = -1;
  prevVid.style.opacity = 0;
  prevVid.style.zIndex = -2;
  if (prevVid.readyState >= 1) {
    prevVid.currentTime = 0;
  }
  prevVid.pause();

  if(index === 2){
    content.innerHTML = "";                 
    container.classList.remove("hidden");  
    renderEmojiGraph();
  } else {
    container.classList.add("hidden");      
    content.innerHTML = slides[index];      
  }
  currentIndex = index;
}



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
  if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
      loadSlideFancy((currentIndex + 1) % totalSlides);
    }
  }
)
