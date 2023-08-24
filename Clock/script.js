onload = () => {
    const canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');


    canvas.width = 800;
    canvas.height = 800;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function drawFrame(t) {
        let cos = Math.cos(t/1000);
        let sin = Math.sin(t/1000);
        ctx.setTransform();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.setTransform(cos, sin, -sin, cos, canvas.width/2, canvas.height/2);

        ctx.fillStyle = 'black';
        for (let i = 0; i < 10; i += 1){
            ctx.fillRect(0, -10, 30, 20 - 2*i);
            ctx.transform(1, 0, 0, 1, 30, 1);
        }



        cos = Math.cos(t/12000);
        sin = Math.sin(t/12000);
        ctx.setTransform(cos, sin, -sin, cos, canvas.width/2, canvas.height/2);
        ctx.fillStyle = 'black';
        for (let i = 0; i < 10; i += 1){
            ctx.fillRect(0, -10, 27, 18 - 2*i);
            ctx.transform(1, 0, 0, 1, 27, 1);
        }


        ctx.setTransform();
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 350, 0, 2 * Math.PI);
        ctx.strokeStyle = 'grey'; 
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.setTransform();
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000'; 
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.stroke();


        for (let i = 0; i < 60; i += 5){
            let cos = Math.cos(6 * i * (Math.PI / 180));
            let sin = Math.sin(6 * i * (Math.PI / 180));
            ctx.setTransform(cos, sin, -sin, cos, canvas.width/2, canvas.height/2);
            ctx.fillStyle = 'black';
            ctx.fillRect(310, -10, 30, 18);
        }

        for (let i = 0; i < 60; i += 1){
            let cos = Math.cos(6 * i * (Math.PI / 180));
            let sin = Math.sin(6 * i * (Math.PI / 180));
            ctx.setTransform(cos, sin, -sin, cos, canvas.width/2, canvas.height/2);
            ctx.fillStyle = 'black';
            ctx.fillRect(325, -4, 15, 5);
        }

        requestAnimationFrame(drawFrame);
    }
    requestAnimationFrame(drawFrame);

    canvas.style.transform = "rotate(270deg)";
    document.body.appendChild(canvas);

}