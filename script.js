var audio = new Audio('assets/sentmessage.mp3');
require ('dotenv').config();
const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

var addressString = "<div class='mapview'><iframe src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5411.448529658408!2d-88.228491!3d40.111323!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880cd0eb0df454b5%3A0xe7ba4e7c081a6483!2z6IGU5ZCI56S85aCC!5e1!3m2!1sen-US!2sus!4v1676164166623!5m2!1szh-CN!2sus' class='map'></iframe></div><label class='add'><address><br>Urbana, Illinois, United States 61801</address>";
const openai = require("openai");
openai.apiKey = process.env.OPENAI_API_KEY;

function SendChatGPT(text) {
    //sendTextMessage(text);
    var predefined_text="You are an ai chatbot.Please provide answers to the queries";
    var sQuestion = predefined_text+text;//txtMsg.value;
    //sendTextMessage(sQuestion);
    if (sQuestion == "") {
        alert("Type in your question!");
        txtMsg.focus();
        return;
    }
    //sendTextMessage("1");
    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", "https://api.openai.com/v1/completions");
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)
    //sendTextMessage("2");
    oHttp.onreadystatechange = function () {
        if (oHttp.readyState === 4) {
            //sendTextMessage("oHttp.readyState === 4");
            //console.log(oHttp.status);
            var oJson = {}
            //sendTextMessage("2.5" );
            //if (txtOutput.value != "") txtOutput.value += "\n";

            try {
                oJson = JSON.parse(oHttp.responseText);
                //sendTextMessage("oJson=: " + oJson);
            } catch (ex) {
                //txtOutput.value += "Error: " + ex.message
                sendTextMessage("Error: " + ex.message);
            }

            if (oJson.error && oJson.error.message) {
                //txtOutput.value += "Error: " + oJson.error.message;
                sendTextMessage("Error:" + oJson.error.message);
            } else if (oJson.choices && oJson.choices[0].text) {
                var s = oJson.choices[0].text;
                var selLang="en-US";
                /*if (selLang.value != "en-US") {
                    var a = s.split("?\n");
                    if (a.length == 2) {
                        s = a[1];
                    }
                }*/

                if (s == "") s = "No response";
                //sendTextMessage("2.5 in the loop");
                sendTextMessage(s);
                //txtOutput.value += "Chat GPT: " + s;
                TextToSpeech(s);
            }            
        }//sendTextMessage("oHttp.readyState === 4 not true");
        //sendTextMessage("oHttp.readyState === ");
        //sendTextMessage(oHttp.readyState);

    };
    //sendTextMessage("3");
    var sModel = "text-davinci-003"//selModel.value;// "text-davinci-003";
    var iMaxTokens = 1024;
    var sUserId = "1";
    var dTemperature = 0.5;    
    //sendTextMessage("4");
    var data = {
        model: sModel,
        prompt: sQuestion,
        max_tokens: iMaxTokens,
        user: sUserId,
        temperature:  dTemperature,
        frequency_penalty: 0.0, //Number between -2.0 and 2.0  Positive value decrease the model's likelihood to repeat the same line verbatim.
        presence_penalty: 0.0,  //Number between -2.0 and 2.0. Positive values increase the model's likelihood to talk about new topics.
        stop: ["#", ";"] //Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
    }
    //sendTextMessage("5");
    oHttp.send(JSON.stringify(data));
    //sendTextMessage("6");
    /*if (txtOutput.value != "") txtOutput.value += "\n";
    txtOutput.value += "Me: " + sQuestion;
    txtMsg.value = "";*/
    //sendTextMessage("7");
}

function startFunction() {
    setLastSeen();
    waitAndResponce("intro");
}

function setLastSeen() {
    var date = new Date();
    var lastSeen = document.getElementById("lastseen");
    lastSeen.innerText = "last seen today at " + date.getHours() + ":" + date.getMinutes()
}


function closeFullDP() {
    var x = document.getElementById("fullScreenDP");
    if (x.style.display === 'flex') {
        x.style.display = 'none';
    } else {
        x.style.display = 'flex';
    }
}

function openFullScreenDP() {
    var x = document.getElementById("fullScreenDP");
    if (x.style.display === 'flex') {
        x.style.display = 'none';
    } else {
        x.style.display = 'flex';
    }
}


function isEnter(event) {
    if (event.keyCode == 13) {
        sendMsg();
    }
}

function sendMsg() {
    var input = document.getElementById("inputMSG");
    var ti = input.value;
    if (input.value == "") {
        return;
    }
    var date = new Date();
    var myLI = document.createElement("li");
    var myDiv = document.createElement("div");
    var greendiv = document.createElement("div");
    var dateLabel = document.createElement("label");
    dateLabel.innerText = date.getHours() + ":" + date.getMinutes();
    myDiv.setAttribute("class", "sent");
    greendiv.setAttribute("class", "green");
    dateLabel.setAttribute("class", "dateLabel");
    greendiv.innerText = input.value;
    myDiv.appendChild(greendiv);
    myLI.appendChild(myDiv);
    greendiv.appendChild(dateLabel);
    document.getElementById("listUL").appendChild(myLI);
    var s = document.getElementById("chatting");
    s.scrollTop = s.scrollHeight;
    setTimeout(function () { waitAndResponce(ti) }, 1500);
    input.value = "";
    playSound();
}

function waitAndResponce(inputText) {
    var lastSeen = document.getElementById("lastseen");
    lastSeen.innerText = "typing...";
    let toUseChatGPT=0;
    switch (inputText.toLowerCase().trim()) {
        case "intro":
            setTimeout(() => {
                sendTextMessage("Hello there 👋🏻,<br><br>My name is <span class='bold'><a class='alink'>HAL 9000</a>.</span><br><br>I am an AI created by<span class='bold'>Adit, Ravi and Sreemanth</span><br>");
            }, 2000);
            break;
        case "new":
            sendTextMessage(addressString);
            break;
        case "chatgpt":
            let toUseChatGPT=1;
            sendTextMessage("Now chatgpt is connected.");
            break;
        default:
            if (true){
                //sendTextMessage("Hey I couldn't catch you...😢<br>Send 'help' to know more about usage.");
                let prompt = inputText;//"What is the weather like today?"
                
                //sendTextMessage(inputText);
                SendChatGPT(inputText);
                /*
                var model = "text-davinci-003";
                var temperature = 0.5;
                openai.completions.create(
                {
                    prompt: `${prompt}`,
                    model: `${model}`,
                    temperature: temperature,
                    max_tokens: 1024,
                    top_p: 1,
                },
                (error, response) => {
                    if (error) {
                    console.log(error)
                    } else {
                    console.log(response.choices[0].text)
                    }
                }
                );
                sendTextMessage("hi4");
                sendTextMessage(response);*/
            }else{
                setTimeout(() => {
                    sendTextMessage("Hey I couldn't catch you...😢<br>Send 'help' to know more about usage.");
                }, 2000);
            }   
            break;
    }



}

function clearChat() {
    document.getElementById("listUL").innerHTML = "";
    waitAndResponce('intro');
}



function sendTextMessage(textToSend) {
    setTimeout(setLastSeen, 1000);
    var date = new Date();
    var myLI = document.createElement("li");
    var myDiv = document.createElement("div");
    var greendiv = document.createElement("div");
    var dateLabel = document.createElement("label");
    dateLabel.setAttribute("id", "sentlabel");
    dateLabel.id = "sentlabel";
    dateLabel.innerText = date.getHours() + ":" + date.getMinutes();
    myDiv.setAttribute("class", "received");
    greendiv.setAttribute("class", "grey");
    greendiv.innerHTML = textToSend;
    myDiv.appendChild(greendiv);
    myLI.appendChild(myDiv);
    greendiv.appendChild(dateLabel);
    document.getElementById("listUL").appendChild(myLI);
    var s = document.getElementById("chatting");
    s.scrollTop = s.scrollHeight;
    playSound();
}


function sendResponse() {
    setTimeout(setLastSeen, 1000);
    var date = new Date();
    var myLI = document.createElement("li");
    var myDiv = document.createElement("div");
    var greendiv = document.createElement("div");
    var dateLabel = document.createElement("label");
    dateLabel.innerText = date.getHours() + ":" + date.getMinutes();
    myDiv.setAttribute("class", "received");
    greendiv.setAttribute("class", "grey");
    dateLabel.setAttribute("class", "dateLabel");
    greendiv.innerText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ";
    myDiv.appendChild(greendiv);
    myLI.appendChild(myDiv);
    greendiv.appendChild(dateLabel);
    document.getElementById("listUL").appendChild(myLI);
    var s = document.getElementById("chatting");
    s.scrollTop = s.scrollHeight;
    playSound();
}

function playSound() {
    audio.play();
}
