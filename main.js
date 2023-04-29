
    const $ = q => document.querySelector(q);

    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        //var sec = Math.floor((mil % 60000) / 1000);
        return `${min}`;
    };

    function renderGarage () {
        const garage = getGarage();
        $("#garage").innerHTML = "";
        garage.forEach(c => addCarToGarage(c))
    };

    function addCarToGarage (car) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.licence}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td id="acoes">
            <button id="encerrar" onClick="encerrar()">Encerrar</a>
            <button class="delete">cancelar</button>
            </td>
        `;

        $("#garage").appendChild(row);
    };

    // function encerrar(){
    //     const button = document.getElementById("encerrar")
    //     const modal = document.querySelector("dialog")
    //     const closeModal = document.getElementById("closeModal")

    //     button.onclick = function (){
    //         modal.showModal()
    //     }

    //     closeModal.onclick = function(){
    //         modal.close()
    //     }
    // }

    function checkOut(info) {
        let period = new Date() - new Date(info[2].dataset.time);
        period = convertPeriod(period);


        let preco = 0;
        let valor = 5;
        let valorAdd = 3;

        if(period >= 60){
            preco = valor + valorAdd
        }else{
            preco = valor
        }

        console.log(period)

        const licence = info[1].textContent;
        const msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu ${period} minutos estacionado. \n\nValor: ${preco} \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garage = getGarage().filter(c => c.licence !== licence);
        localStorage.garage = JSON.stringify(garage);
        
        renderGarage();
    };

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("#send").addEventListener("click", e => {
        const name = $("#name").value;
        const licence = $("#licence").value;

        if(!name || !licence){
            alert("Os campos são obrigatórios.");
            return;
        }   

        const card = { name, licence, time: new Date() };

        const garage = getGarage();
        garage.push(card);

        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(card);
        $("#name").value = "";
        $("#licence").value = "";
    });

    $("#garage").addEventListener("click", (e) => {
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
