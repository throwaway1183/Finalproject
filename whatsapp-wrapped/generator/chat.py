#importing useful modules
import random
import datetime
import os

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#list for "vocabulary.txt" and "chat.txt"
file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
vocab_file_path=os.path.join(file_dir, "vocabulary.txt")
output_file_path = os.path.join(file_dir, "chat.txt")
out = open(output_file_path, "w", encoding="utf-8")
words=[]
with open(vocab_file_path, 'r', encoding='utf-8') as file:
    for line in file:
        words.extend(line.strip().split(","))

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#list of users in the group
noUsers=10
users=["User1","User2","User3","User4","User5","User6","User7","User8","User9","User10"]
userNames=["Prachit","Bipul","Aaryan","Kshitij","Balaji","Chakri","Ujjwal","Bharat","Himanshu","Safwan"]
personalities=["very large no of messages","prefers longer sentences","night owl","starts conversation after long silence","short sentences and high reply streak","normal group member","slow typer","normal group member","prefers CAPS sentences","unpredictable/randomised group member"]

# time contols of the group chat
chatStartDate=datetime.date(2026,3,22)
maxPermittedDayGap=5
permittedTimeGap=[(1,600),(601,1800),(1801,7200)]
maxPermittedMessages=100
maxPermittedWords=[15,23,7,7,5,10,10,10,10,13]

# activity lists for 00-04,04-08,08-12,12-16,16-20,20-24,long silence
act=[
    [1,1,3,3,3,3,3,9,10],
    [1,3,3,5,5,6,7,8,9,10],
    [1,1,1,2,6,6,8,10],
    [1,1,1,1,2,2,3,4,4,6,7,8,9,9,10],
    [1,1,1,2,2,4,5,7,7,7,8,8,10],
    [1,2,3,3,3,4,5,5,6,8,9,10],
    [1,1,2,4,4,4,4,4,4,5,9,10,10]
]
longSilence=False
# reply streaks in format (min,max)
reply=[(2,7),(1,3),(2,3),(2,4),(4,9),(1,3),(2,4),(1,5),(2,5),(1,4)]

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# chat.py to generate group chat
noDays=120
prevPostDate=chatStartDate
prevUser=-1
for k in range(noDays):
    prevPostTime=datetime.datetime.combine(prevPostDate,datetime.time(random.randint(0,23),random.randint(0,59),random.randint(0,59)))
    noMessages=random.randint(1,maxPermittedMessages)
    for l in range(noMessages):
        userPosting=random.choice(act[int(prevPostTime.hour/4)])-1
        if longSilence:
            userPosting=random.choice(act[int(prevPostTime.hour/4)]+act[6])-1
        while userPosting==prevUser:
            userPosting=random.choice(act[int(prevPostTime.hour/4)])-1
            if longSilence:
                userPosting=random.choice(act[int(prevPostTime.hour/4)]+act[6])-1
        noSentences=random.randint(reply[userPosting][0],reply[userPosting][1])
        for i in range(noSentences):
            out.write(prevPostTime.strftime("%d/%m/%y, %H:%M- ") + userNames[userPosting] + ": ")
            noWord=random.randint(1,maxPermittedWords[userPosting])
            toCAPS=(random.randint(1,100)%50)==0
            # user9 prefers CAPS sentences
            if userPosting==8:
                toCAPS=(random.randint(1,100)%10)==0
            for j in range(noWord-1):
                id=random.randint(0,len(words)-1)
                if toCAPS:
                    out.write(words[int(id)].upper() + " ")
                else:
                    out.write(words[int(id)] + " ")
            out.write(words[int(random.randint(0,len(words)-1))] + ".\n")
            tmp=random.choice([0,0,0,0,0,0,1,1,1,2])
            # user7 is a slow typer
            if userPosting==6:
                tmp=random.choice([0,0,0,1,1,1,1,1,2,2])
            timeDifference=random.randint(permittedTimeGap[tmp][0],permittedTimeGap[tmp][1])
            if timeDifference>=2400:
                longSilence=True
            else:
                longSilence=False
            prevPostTime=prevPostTime+datetime.timedelta(seconds=timeDifference)
            prevPostDate=prevPostTime.date()
        prevUser=userPosting
    dayDifference=random.randint(1,maxPermittedDayGap)
    prevPostDate=prevPostDate+datetime.timedelta(days=dayDifference)
out.close()