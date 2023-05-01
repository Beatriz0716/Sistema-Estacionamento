
    const $ = q => document.querySelector(q);

    // conversão do tempo //
    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        //var sec = Math.floor((mil % 60000) / 1000);
        return `${min}`;
    };

    // gerar tabela //
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
            <td>${car.cor}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td id="acoes">
            <button class="delete">Selecionar</button>
            </td>
        `;

        $("#garage").appendChild(row);
    };

    function checkOut(info) {

        // calculo do valor //
        let period = new Date() - new Date(info[3].dataset.time);
        period = convertPeriod(period);

        let preco = 0;
        let valor = 5;
        let valorAdd = 3;

        if(period >= 60){
            preco = valor + valorAdd
        }else{
            preco = valor
        }

        // abrir pop-up //
        const button = document.getElementById("gerar")
        const modal = document.querySelector("dialog")
        const closeModal = document.getElementById("closeModal")
        const excluir = document.getElementById("delete")

        button.onclick = function (){
            modal.showModal()

            document.querySelector("ol").innerHTML =`
                <li>Veiculo: ${info[0].textContent}</li>
                <li>Placa: ${info[1].textContent}</li>
                <li>Cor: ${info[2].textContent}</li>
                <li>Permanencia: ${period}min</li>
                <li>Valor: ${preco}</li>
            `;
        }

        // fechar pop-up //
        closeModal.onclick = function(){
            modal.close();
            
        }

        excluir.onclick = function(){
            const msg = confirm("Deseja excluir esse registro?");

            if(msg == true){
                const garage = getGarage().filter(c => c.licence !== licence);
                localStorage.garage = JSON.stringify(garage);
        
                renderGarage();
                modal.close();
            }else{
                modal.close();
            }

        }
    };

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("#send").addEventListener("click", e => {
        const name = $("#name").value;
        const licence = $("#licence").value;
        const cor = $("#cor").value;
        
        // conferindo se campos estão preemchidos //
        if(!name || !licence || !cor){
            alert("Os campos são obrigatórios.");
            return;
        }   
 
        // amarzemando no localStorage //
        const card = { name, licence, cor, time: new Date() };

        const garage = getGarage();
        garage.push(card);

        localStorage.garage = JSON.stringify(garage);

        // esvaziar campos depois que registrados //
        addCarToGarage(card);
        $("#name").value = "";
        $("#licence").value = "";
        $("#cor").value = "";
    });

    // excluir registro da tebela //
    $("#garage").addEventListener("click", (e) => {
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
