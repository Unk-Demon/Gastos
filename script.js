class Gasto{
    constructor(id, cantidad, categoria, descripcion){
        this.id = id;
        this.cantidad = cantidad;
        this.categoria = categoria;
        this.descripcion = descripcion;
    }
}

class ControlGastos{
    constructor(){
        this.gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    }

    agregarGastos(cantidad, categoria, descripcion){
        let nuevoId = 1;
        if(this.gastos.length > 0){
            const ids = this.gastos.map(g=>g.id);
            nuevoId = Math.max(...ids) + 1;
        }
        const gasto = new Gasto(nuevoId, cantidad, categoria, descripcion);

        this.gastos.push(gasto);

        localStorage.setItem("gastos", JSON.stringify(this.gastos));

        return gasto;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(g => g.id !== id);

        localStorage.setItem("gastos", JSON.stringify(this.gastos));
    }

    obtenerTotal(){
        let total = 0;
        this.gastos.forEach(g => total += g.cantidad);

        /*for(let gasto of this.gastos){
            total += gasto.cantidad;
        }*/
        return total;
    }

    actualizarGasto(index, cantidad, categoria, descripcion){
        this.gastos[index - 1].cantidad = parseFloat(cantidad.value);
        this.gastos[index - 1].categoria = categoria.value;
        this.gastos[index - 1].descripcion = descripcion.value;

        localStorage.setItem("gastos", JSON.stringify(this.gastos));

        //calcularTotal();

        location.reload();
    }
}

const control = new ControlGastos();
const formulario = document.getElementById("formulario");
const lista = document.getElementById("listaGastos");
const confirmBtn = document.getElementById("confirm");

document.addEventListener("DOMContentLoaded", ()=>{
    for(let gasto of control.gastos){
        actualizarIU(gasto);
    }
    calcularTotal();
});

formulario.addEventListener("submit", (event)=>{
    event.preventDefault();

    const index = document.getElementById("index");
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value;

    const gasto = control.agregarGastos(cantidad, categoria, descripcion);

    actualizarIU(gasto);

});

function actualizarIU(gasto){
    const li = document.createElement("li");
    li.innerHTML = `${gasto.categoria}, ${gasto.cantidad}, ${gasto.descripcion}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.classList.add("btn");
    deleteBtn.classList.add("btn-danger");
    deleteBtn.classList.add("btn-sm");

    deleteBtn.onclick = function(){
        control.eliminarGasto(gasto.id);
        lista.removeChild(li);
        calcularTotal();
    }

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.classList.add("btn");
    editBtn.classList.add("btn-warning");
    editBtn.classList.add("btn-sm");

    editBtn.onclick = function(){
        index.innerHTML = gasto.id;
        cantidad.value = parseFloat(gasto.cantidad);
        categoria.value = gasto.categoria;
        descripcion.value = gasto.descripcion;

        confirmBtn.style = "display: inline";
    }

    confirmBtn.onclick = function(){

        control.actualizarGasto(index.innerHTML, cantidad, categoria, descripcion);

        //calcularTotal();
    }

    li.appendChild(deleteBtn)
    li.appendChild(editBtn);
    lista.appendChild(li);

    calcularTotal();
}

function calcularTotal(){
    const total = document.getElementById("total");

    total.innerHTML = "Total = $" + control.obtenerTotal();
}

function eliminarTodo(){
    localStorage.removeItem("gastos");

    location.reload();
}