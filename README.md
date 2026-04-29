# WhatsApp Group Wrapped


This project consists of three components:
1. Chat generation (chat.py) (Python)
2. Statistics parsing (analyze.py) (Python)
3. Browser slideshow (index.html/styles.css/app.js) (HTML/CSS/JS)


## Directory structure
- whatsapp-wrapped/
	- generator/
		- chat.py
	- parser/
		- analyze.py
	- web/
		- app.js
		- index.html
		- style.css
		- a.mp4
		- a1.mp4
		- a2.mp4
		- a3.mp4
		- a4.mp4
		- images/
			- whatsapp_logo.png
	- chat.txt
	- data.json
	- vocabulary.txt


## How to Run the Project

### Step 1: Generate Chat

Run the chat generator providing the path of the vocabulary file as a command line input:

	python3 ./generator/chat.py ./vocabulary.txt

This generates chat.txt which contains the group chat.

### Step 2: Analyze Chat

Run the statistics parser providing the path of the chat.txt file as a command line input:

	python3 ./parser/analyze.py ./chat.txt

This generates data.json which contains well-structured information.

### Step 3: View the slideshow

Start a local server using the command:
	
	python3 -m http.server

Open index.html in your browser using the python server.


## Output format

### chat.txt Schema

DD/MM/YY, HH:MM - Sender_Name: Message text

### data.json Schema

{
  "userName": [],
  "messageCount": [],
  "wordCount": [],
  "userActivity": [],
  "last5Messages": [],
  "top3Emojis": [],
  "nightOwl": [],
  "ghost": [],
  "silenceBreaker": [],
  "fastReplier": [],
  "longMessager": [],
  "emojiUser": [],
  "CAPSer": [],
  "longWorder": [],
  "top3BusyDay": [],
  "top3ChaoticDay": [],
  "longestSilence": int,
  "medianReplyTime": int,
  "top5Words": [],
  "activity": []
}


## Statistics Description

### Per-User Data

- userName: List of all users  
- messageCount: Total messages per user  
- wordCount: Total words per user  
- userActivity: Messages in time slots [00:00–03:59, 04:00–07:59, 08:00–11:59, 12:00–15:59, 16:00–19:59, 20:00–23:59]  
- top3Emojis: Top 3 emojis per user  

### Group statistics

- nightOwl: messages between 12 AM – 4 AM  
- ghost: least replies received  
- silenceBreaker: messages after long silence  
- fastReplier: average reply time  
- longMessager: long messages count  
- emojiUser: emoji usage  
- CAPSer: uppercase messages  
- longWorder: long words count  

### Time-Based Statistics

- top3BusyDay: highest message days  
- top3ChaoticDay: most replies days  
- longestSilence: max gap (hours)  
- medianReplyTime: median reply time (minutes)  

### Word & Activity Statistics

- top5Words: most frequent words  
- activity: total messages per time slot  


## Remarks

- All statistics are computed from chat.txt  
- Frontend reads only data.json with no direct Python JS communication