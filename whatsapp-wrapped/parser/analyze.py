# Statistics
# User-based statistics
# 1-> message count per user
# 2-> word count per user
# 6-> top 3 emojis per person

# Group-based statistics
# 3-> most active sender between 12am-4am
# 4-> user whose messages receive the least numver of direct reply
# 5-> most frequent sender after a long time
# 10-> user with fastest average reply time
# 12-> user who sends most number of long messages
# 13-> user who uses most number of emojis
# 14-> user with most CAPS sentences
# 15-> user with most number of long words

# Time-based statistics
# 7-> busiest day with most number of messages
# 11-> chaotic day with maximum number of direct replies
# 8-> longest gap with zero messages
# 9-> median minutes before someone replies to each person

# Word-based statistics
# 16-> most common words
# 17-> peak active hour

# Import useful libraries
import random
import emoji
import datetime
import json
import os

# File path for "chat.txt" and "data.json"
file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
input_file_path = os.path.join(file_dir, "chat.txt")
output_file_path = os.path.join(file_dir, "data.json")

userData={}
dayData={}
wordData={}
silenceTime=1800
maxTimeGap=0
messageCount=0
prevMessageTime=None
prevMessageDate=None
prevMessageUser=None
replyTime=[]
activiy=[0,0,0,0,0,0]

# Counts the total number of messages sent by the user
def userMessageCount(messageUser):
    userData[messageUser][0]+=1

# Counts the total number of words sent by the user
def userWordCount(messageUser, message):
    words=message[:-1].split()
    for word in words:
        if any(char.isalpha() for char in word):
            userData[messageUser][1]+=1

# Night Owl :- The user who sends most number of messages in the time interval 12 AM - 4 AM
# Counts the number of messages sent by the user in the time interval 12 AM - 4 AM
def nightOwl(messageUser, messageTime):
    if int(messageTime.split(":")[0])<4:
        userData[messageUser][2]+=1

# Reply :- The message sent by a user other than the previous user
# Quick Reply :- The reply that is sent within 600 seconds
# Direct Reply :- The reply to some previously send message. This includes all quick replies and 50% of not quick replies.
# Counts the number of direct replies received by the previous user, and also counts the number of direct replies sent by the current user
def directReplyCount(prevMessageUser, messageUser, timeDifference):
    if prevMessageUser!=None and prevMessageUser!=messageUser:
        if timeDifference<600:
            userData[prevMessageUser][3]+=1
            userData[messageUser][17]+=1
            return True
        chance=random.randint(0,1)
        if chance==1:
            userData[prevMessageUser][3]+=1
            userData[messageUser][17]+=1
            return True
    return False

# Breaking Silence :- Sending a message after silenceTime threshold
# Counts the number of times the user breaks silence        
def userSilenceBreak(messageUser, timeDifference):
    global silenceTime
    if timeDifference>silenceTime:
        userData[messageUser][4]+=1

# Stores a frequency dictionary of emojis used by the user
def userEmojiCount(messageUser, message):
    for char in message:
        if emoji.is_emoji(char):
            if char.encode('unicode-escape').decode('ASCII') in userData[messageUser][5]:
                userData[messageUser][5][char.encode('unicode-escape').decode('ASCII')]+=1
            else:
                userData[messageUser][5][char.encode('unicode-escape').decode('ASCII')]=1

# Counts the number of messages sent on given date
def dayMessageCount(messageDate):
    if messageDate in dayData:
        dayData[messageDate][0]+=1
    else:
        dayData[messageDate]=[1,0]

# Updates the maximum time for which the group chat was inactive
def longestSilence(timeDifference):
    global maxTimeGap
    maxTimeGap=max(maxTimeGap, timeDifference)

# Updates the list of reply times
def updateReplyTime(timeDifference, isReply):
    if isReply:
        replyTime.append(timeDifference)

# Updates the total reply time of the user
def userReplyTime(messageUser, timeDifference, isReply):
    if isReply:
        userData[messageUser][6]+=timeDifference

# Chaotic Day :- The date with maximum number of direct replies
# Updates the total number of direct replies for the given date
def chaoticDay(messageDate ,isReply):
    #no need of checking presence of message date
    if isReply:
        if messageDate in dayData:
            dayData[messageDate][1]+=1
        else:
            dayData[messageDate]=[1,1]

# Long Message :- The message consisting of atleast 10 words
# Updates the total count of long messages sent by the user
def userLongMessage(messageUser, message):
     if len(message.split())>=10:
         userData[messageUser][7]+=1

# Updates the total number of emojis sent by the user
def emojiCount(messageUser, message):
    for char in message:
        if emoji.is_emoji(char):
            userData[messageUser][8]+=1

# CAPS Sentence :- The message consisting of only uppercase alphabets
# Updates the total number of CAPS sentences sent by the user
def userCAPSMessage(messageUser, message):
    if message.isupper():
        userData[messageUser][9]+=1

# Long Word :- The words consisting of atleast 10 characters
# Updates the total number of long words sent by the user
def userLongWords(messageUser, message):
    words=message[:-1].split()
    for word in words:
        if len(word)>=10:
            userData[messageUser][10]+=1

# Updates the frequency dictionary of words
def wordCount(message, messageTime):
    words=message[:-1].split()
    for text in words:
        word=text.lower()
        if word.isalpha():
            if word in wordData:
                wordData[word][0]+=1
                wordData[word][1+int(int(messageTime.split(":")[0])/4)]+=1
            else:
                wordData[word]=[1,0,0,0,0,0,0]
                wordData[word][int(int(messageTime.split(":")[0])/4)]+=1

# Updates the total number of messages sent by the user in time intervals (00:00, 03:59), (04:00, 07:59), (08:00, 11:59), (12:00, 15:59), (16:00, 19:59) and (20:00, 23:59)
def userPeakActivity(messageUser, messageTime):
    userData[messageUser][11+int(int(messageTime.split(":")[0])/4)]+=1

# Updates the total number of all messages sent in time intervals (00:00, 03:59), (04:00, 07:59), (08:00, 11:59), (12:00, 15:59), (16:00, 19:59) and (20:00, 23:59)
def dayPeakActivity(messageTime):
    activiy[int(int(messageTime.split(":")[0])/4)]+=1

with open(input_file_path, 'r', encoding='utf-8') as file:
    for line in file:
        brokenLine1=line.strip().partition(",")
        brokenLine2=brokenLine1[2].partition("-")
        brokenLine3=brokenLine2[2].partition(":")
        
        # Obtaining the message informations and content
        messageDate=brokenLine1[0].strip()
        messageTime=brokenLine2[0].strip()      
        messageUser=brokenLine3[0].strip()
        message=brokenLine3[2].strip()

        # Time gap between this message and the last sent message
        timeDifference=0 if prevMessageTime==None else int((datetime.datetime.strptime(messageDate+" "+messageTime, "%d/%m/%y %H:%M")-datetime.datetime.strptime(prevMessageDate+" "+prevMessageTime, "%d/%m/%y %H:%M")).total_seconds())
        # Initialising new user in userData
        if messageUser not in userData:
            userData[messageUser]=[0]*18
            userData[messageUser][5]={}

        # Function calls to compute statistics 
        userMessageCount(messageUser)
        userWordCount(messageUser, message)
        nightOwl(messageUser, messageTime)
        isReply=directReplyCount(prevMessageUser, messageUser, timeDifference)
        userSilenceBreak(messageUser, timeDifference)
        userEmojiCount(messageUser, message)
        dayMessageCount(messageDate)
        longestSilence(timeDifference)
        updateReplyTime(timeDifference, isReply)
        userReplyTime(messageUser, timeDifference, isReply)
        chaoticDay(messageDate ,isReply)
        userLongMessage(messageUser, message)
        emojiCount(messageUser, message)
        userCAPSMessage(messageUser, message)
        userLongWords(messageUser, message)
        wordCount(message, messageTime)
        userPeakActivity(messageUser, messageTime)
        dayPeakActivity(messageTime)

        # Updating "prev" variables
        messageCount+=1
        prevMessageTime=messageTime
        prevMessageDate=messageDate
        prevMessageUser=messageUser
for value in userData.values():
    tmpEmojiDict=dict(sorted(value[5].items(), key=lambda i: -i[1]))
    value[5]=tmpEmojiDict

# Preparing final_dict as per the below keyList for exporting as json 
final_dict={}
keyList=["userName","messageCount","wordCount","top3Emojis","nightOwl","ghost","silenceBreaker","fastReplier","longMessager","emojiUser","CAPSer","longWorder","top3BusyDay","top3ChaoticDay","longestSilence","medianReplyTime","top5Words","activity"]

for key in keyList:
    final_dict[key]=[]
# Adding user data to final_dict
for key, value in userData.items():
    final_dict["userName"].append(key)
    final_dict["messageCount"].append(value[0])
    final_dict["wordCount"].append(value[1])
    tmpEmojiList=[]
    emojiCnt=0
    for i, j in value[5].items():
        if emojiCnt>=3:
            break
        tmpEmojiList.append((str(i),j))
        emojiCnt+=1
    final_dict["top3Emojis"].append(tmpEmojiList)

# Adding user group statistics to final_dict
tmpRanking=[[] for i in range(8)]
cnt=0
for value in userData.values():
    tmpRanking[0].append([-value[2],cnt])
    tmpRanking[1].append([value[3],cnt])
    tmpRanking[2].append([-value[4],cnt])
    if value[17]!=0:
        tmpRanking[3].append([value[6]/value[17],cnt])
    else:
        tmpRanking[3].append([value[6],cnt])
    tmpRanking[4].append([-value[7],cnt])
    tmpRanking[5].append([-value[8],cnt])
    tmpRanking[6].append([-value[9],cnt])
    tmpRanking[7].append([-value[10],cnt])
    cnt+=1
for i in tmpRanking:
    i.sort()

final_dict["nightOwl"]=[[final_dict["userName"][j], -i] for i,j in tmpRanking[0]]
final_dict["ghost"]=[[final_dict["userName"][j], i] for i,j in tmpRanking[1]]
final_dict["silenceBreaker"]=[[final_dict["userName"][j], -i] for i,j in tmpRanking[2]]
final_dict["fastReplier"]=[[final_dict["userName"][j], i] for i,j in tmpRanking[3]]
final_dict["longMessager"]=[[final_dict["userName"][j], -i] for i,j in tmpRanking[4]]
final_dict["emojiUser"]=[[final_dict["userName"][j], -i] for i,j in tmpRanking[5]]
final_dict["CAPSer"]=[[final_dict["userName"][j], -i] for i,j in tmpRanking[6]]
final_dict["longWorder"]=[[final_dict["userName"][j], -i] for i,j in tmpRanking[7]]

# Adding day data to final_dict
tmpRanking=[[] for i in range(2)]
for key, value in dayData.items():
    tmpRanking[0].append([value[0],key])
    tmpRanking[1].append([value[1],key])
for i in tmpRanking:
    i.sort(reverse=True)

final_dict["top3BusyDay"]=[[j,i] for i,j in tmpRanking[0][:3]]
final_dict["top3ChaoticDay"]=[[j,i] for i,j in tmpRanking[1][:3]]

# Adding word data to final_dict
replyTime.sort()
tmpRanking=[[] for i in range(7)]
for key, value in wordData.items():
    tmpRanking[0].append([value[0],key])
    tmpRanking[1].append([value[1],key])
    tmpRanking[2].append([value[2],key])
    tmpRanking[3].append([value[3],key])
    tmpRanking[4].append([value[4],key])
    tmpRanking[5].append([value[5],key])
    tmpRanking[6].append([value[6],key])
for i in tmpRanking:
    i.sort(reverse=True)

final_dict["longestSilence"]=maxTimeGap
final_dict["medianReplyTime"]=replyTime[int(len(replyTime)/2)]
final_dict["top5Words"]=[[[j,i] for i,j in tmpRanking[k][:5]] for k in range(7)]
final_dict["activity"]=activiy

# Exporting final_dict as json
with open(output_file_path, "w", encoding="utf-8") as f:
   json.dump(final_dict, f)