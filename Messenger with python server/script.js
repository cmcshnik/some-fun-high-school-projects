onload = () => {
    let cont = document.getElementById("cont");
    let upload_button = document.getElementById("upload");
    let add_button = document.getElementById("add");
    let numbers = [];
    let req = {
        "action": "get_notes"
    };


    function createDiv(text, id){
        let main = document.createElement("div");
        let parent = document.createElement("div");
        let text_div = document.createElement("div");
        let time = document.createElement("div");

        parent.classList.add("parent");
        text_div.classList.add("text");
        time.classList.add("time");

        let date = new Date();
        let minutes = date.getMinutes();
        let hours = date.getHours();
        
        time.innerHTML = `${hours}:${minutes}`;
        text_div.innerHTML = text;
        parent.appendChild(text_div)
        parent.appendChild(time)
        main.appendChild(parent);
        return main;
    }


 

    function setup() {
        upload_button.onclick = function(){
            let first_id = numbers[0];
            req = {
                "action": "get_notes",
                "first_id": first_id
            };


            fetch("/foo/", { method: "POST", body: JSON.stringify(req) })
            .then(response => {return response.text()})
            .then(answer => { 
                answer = JSON.parse(answer);
                main_data = answer;
                for (let i = answer.length - 1; i >= 0; i--){
                    numbers.unshift(answer[i][0]);
                    if (answer[i][0] == 0) continue;
                    cont.prepend(createDiv(answer[i][1]));
                }

                if (numbers[0] == 1){
                    let temp_upload_button = document.getElementById("upload");
                    temp_upload_button.style.opacity = 0;
                }
            });
        }


        add_button.onclick = function(){
            let message = document.querySelector("input").value;
            req = {
                "action": "post_note",
                "message": message
            };


            fetch("/foo/", { method: "POST", body: JSON.stringify(req) });
        }


        function getUpdates(){
            let maxx = numbers.length == 0 ? 0 : numbers[numbers.length - 1];
            req = {
                "action": "get_updates",
                "number_of_max_message": maxx
            };


            fetch("/foo/", { method: "POST", body: JSON.stringify(req) })
            .then(response => {return response.text()})
            .then(answer => {
                try {
                    answer = JSON.parse(answer);
                    for (const message of answer) {
                        cont.appendChild(createDiv(message[1]));
                        numbers.push(message[0]);
                    }
                } catch {}
            });
        }
        setInterval(() => getUpdates(numbers), 300); 
    }


    const requestMessages = () => 
        fetch("/foo/", { method: "POST", body: JSON.stringify(req) })
        .then(response => {return response.text()})
        .then(answer => { 
            answer = JSON.parse(answer);
            main_data = answer;
            for (let i = 0; i < answer.length; i++){
                numbers.push(answer[i][0]);
                if (answer[i][0] == 0) continue;
                cont.appendChild(createDiv(answer[i][1]));
            }

            if (numbers[numbers.length - 1] > 5){
                let temp_upload_button = document.getElementById("upload");
                temp_upload_button.style.opacity = 1;
            }

            return true;
        }).catch(() => {
            console.log("Retrying");
            setTimeout(() => requestMessages(), 1000);

            return false;
        }).then(ok => {
            if (ok) { setup(); }
        });

    requestMessages();
}
