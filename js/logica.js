async function obtenerTabla(tabla) {
	try {
		const response = await fetch("../datos.json");
		const db = await response.json();
		return db[tabla];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function obtenerProducto(id) {
	try {
		const productos = await obtenerTabla("productos");
		const producto = productos.find((producto) => producto.id === id);
		return producto;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

obtenerTabla("productos").then((productos) => {
	if (!localStorage.getItem("productos"))
		localStorage.setItem("productos", JSON.stringify(productos));
});

//FUNCIONES

const renderizarTienda = (objetoProductos) => {
	contenedorTienda.innerHTML = "";

	for (const producto of objetoProductos) {
		const divProducto = document.createElement("div");
		const imgProducto = document.createElement("img");
		const nombreProducto = document.createElement("h2");
		const precioProducto = document.createElement("h3");
		const botonComprar = document.createElement("button");

		divProducto.className = "card";
		imgProducto.className = "card-img-top";
		nombreProducto.className = "nombre-producto";
		precioProducto.className = "card-precio";
		botonComprar.className = "btn btn-dark";

		imgProducto.src = producto.img;
		nombreProducto.append(producto.modelo);
		precioProducto.append(`$ ${producto.precio}`);
		botonComprar.append("Comprar");
		botonComprar.id = producto.id;

		botonComprar.onclick = () => {
			const productoComprado = objetoProductos.find(
				(producto) => producto.id === botonComprar.id
			);
			let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
			carrito.push({
				id: productoComprado.id,
			});
			localStorage.setItem("carrito", JSON.stringify(carrito));
			Toastify({
				text: "producto agregado",
				className:"info",
				style:{
					background:"black",
					color:"white"
				}
			}).showToast();
		};

		divProducto.append(
			imgProducto,
			nombreProducto,
			precioProducto,
			botonComprar
		);

		contenedorTienda.append(divProducto);

		const option = document.createElement("option");
		option.value = producto.id;
		option.text = producto.modelo;
		selectEliminar.append(option);
	}
};

let mostrandoCarrito = false;

const mostrarCarrito = async () => {
	const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

	contenedorCarrito.innerHTML = "";
	console.log(carrito);

	contenedorTienda.classList.add("hidden");
	contenedorCarrito.classList.remove("hidden");

	if (carrito.length == 0) {
		contenedorCarrito.innerHTML +=
			"<h2 class='white'>No hay productos en el carrito</h2>";
		return;
	}
	let total = 0;
	for (let i = 0; i < carrito.length; i++) {
		const producto = carrito[i];
		console.log(producto);
		const productoDatos = await obtenerProducto(producto.id);
		total += productoDatos.precio;

		const divProducto = document.createElement("div");
		const imgProducto = document.createElement("img");
		const divNombrePrecio = document.createElement("div");
		const nombreProducto = document.createElement("h2");
		const precioProducto = document.createElement("h3");
		const botonEliminar = document.createElement("button");

		divProducto.className = "carrito-item";
		imgProducto.className = "carrito-item-imagen";
		divNombrePrecio.className = "carrito-item-nombre-precio";
		nombreProducto.className = "nombre-producto";
		precioProducto.className = "card-precio";
		botonEliminar.className = "btn btn-dark";

		imgProducto.src = productoDatos.img;
		nombreProducto.append(productoDatos.modelo);
		precioProducto.append(`$ ${productoDatos.precio}`);
		divNombrePrecio.append(nombreProducto, precioProducto);
		botonEliminar.append("Eliminar");
		botonEliminar.id = producto.id + "eliminar";

		botonEliminar.onclick = function () {
			console.log("Eliminar");
			eliminarProductoCarrito(i);
			mostrarCarrito();
		};

		divProducto.append(imgProducto, divNombrePrecio, botonEliminar);

		contenedorCarrito.append(divProducto);
	}
	const totalH2 = document.createElement("h2");
	totalH2.append(`Total: $ ${total}`);
	totalH2.classList.add("white");
	contenedorCarrito.append(totalH2);
};

const eliminarProductoCarrito = (indice) => {
	const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
	console.log(carrito, indice);
	carrito.splice(indice, 1);
	localStorage.setItem("carrito", JSON.stringify(carrito));
};

const eliminarProducto = (productoId) => {
	selectEliminar.innerHTML = "";
	const productos = JSON.parse(localStorage.getItem("productos"));
	productosNuevo = productos.filter((producto) => producto.id !== productoId);
	localStorage.setItem("productos", JSON.stringify(productosNuevo));

	renderizarTienda(JSON.parse(localStorage.getItem("productos")));
};

const login = async () => {
	const usuarios = await obtenerTabla("usuarios");
	const usuarioLogueado = usuarios.find(
		(usuario) => usuario.nombre === inputUsuario.value
	);

	if(inputUsuario.value === ""){
		Swal.fire({
			title: 'no ingresaste el usuario correcto',
			text:'por favor ingrese un usuario',
			icon: 'info',
			background:'black',
			color:'white',
			timer:'4000',

		})
	}else{
		Swal.fire({
			title:'usuario inexistente',
			text:'ingrese nuevamente',
			icon:'error',
			confirmButtonColor:'black',
			color:'black',
			timer:'5000',
		})
	}
};

const loginCorrecto = (usuario) => {
	errorLogin.classList.add("hidden");
	renderizarTienda(JSON.parse(localStorage.getItem("productos")));
	contenedorTienda.classList.remove("hidden");
	contenedorLogin.classList.add("hidden");
	localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

	if (usuario.tipo === "admin") {
		contenedorAdmin.classList.remove("hidden");
		botonCarrito.classList.add("hidden");
	} else {
		contenedorAdmin.classList.add("hidden");
		botonCarrito.classList.remove("hidden");
	}
	botonLogout.classList.remove("hidden");
};

const logout = () => {
	localStorage.removeItem("usuarioLogueado");
	contenedorAdmin.classList.add("hidden");
	contenedorLogin.classList.remove("hidden");
	contenedorCarrito.classList.add("hidden");
	contenedorTienda.classList.add("hidden");
	botonCarrito.classList.add("hidden");
	botonLogout.classList.add("hidden");
};

btnLogin.onclick = login;

btnEliminar.onclick = () => eliminarProducto(selectEliminar.value);

botonCarrito.onclick = () => {
	mostrandoCarrito = !mostrandoCarrito;

	if (!mostrandoCarrito) {
		contenedorTienda.classList.remove("hidden");
		contenedorCarrito.classList.add("hidden");
		return;
	}

	mostrarCarrito();
};
botonCarrito.classList.add("hidden");

botonLogout.onclick = logout;
botonLogout.classList.add("hidden");

if (localStorage.getItem("usuarioLogueado")) {
	loginCorrecto(JSON.parse(localStorage.getItem("usuarioLogueado")));
}
