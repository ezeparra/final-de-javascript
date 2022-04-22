
if (!localStorage.getItem('productos')) localStorage.setItem('productos', JSON.stringify(productos));

//FUNCIONES

const renderizarTienda = (objetoProductos) => {

  contenedorTienda.innerHTML = '';

  for (const producto of objetoProductos) {

    const divProducto = document.createElement('div');
    const imgProducto = document.createElement('img');
    const nombreProducto = document.createElement('h2');
    const precioProducto = document.createElement('h3');
    const botonComprar = document.createElement('button');

    divProducto.className = 'card';
    imgProducto.className = 'card-img-top';
    nombreProducto.className = 'nombre-producto';
    precioProducto.className = 'card-precio';
    botonComprar.className = 'btn btn-dark';

    imgProducto.src = producto.img;
    nombreProducto.append(producto.modelo);
    precioProducto.append(`$ ${producto.precio}`);
    botonComprar.append('Comprar');
    botonComprar.id = producto.id;

    botonComprar.onclick = () => {
      const productoComprado = productos.find(producto => producto.id === botonComprar.id);
      carrito.push({ nombre: productoComprado.modelo, precio: productoComprado.precio })
      localStorage.setItem("carrito", JSON.stringify(carrito))
    }
   
    divProducto.append(imgProducto, nombreProducto, precioProducto, botonComprar);
    
    contenedorTienda.append(divProducto);


    const option = document.createElement('option');
    option.value = producto.id;
    option.text = producto.modelo;
    selectEliminar.append(option)

  }

}


const mostrarCarrito = () => {
  
  const carrito = JSON.parse(localStorage.getItem("carrito"))

  for (const producto of carrito) {
    const nombreProducto = `<h4>Producto : ${producto.nombre}</h4>`
    const precioProducto = `<h4>Precio : ${producto.precio}</h4>`
    contenedorCarrito.innerHTML += nombreProducto
    contenedorCarrito.innerHTML += precioProducto
  }

  const total = carrito.reduce((accumulador, producto) => accumulador + producto.precio, 0);
  contenedorCarrito.append(`Total Compra :  ${total}`);
  contenedorTienda.className += ' hidden';
  contenedorCarrito.classList.remove("hidden")
}


const eliminarProducto = (productoId) => {
  selectEliminar.innerHTML = '';
  const productos = JSON.parse(localStorage.getItem("productos"))
  productosNuevo = productos.filter(producto => producto.id !== productoId);
  localStorage.setItem('productos', JSON.stringify(productosNuevo))

  renderizarTienda(JSON.parse(localStorage.getItem('productos')))


}

const login = () => {

  const usuarioLogueado = usuarios.find(usuario => usuario.nombre === inputUsuario.value)

  if (!usuarioLogueado) {

    errorLogin.append('El usuario ingresado no existe');

  } else {

    if (usuarioLogueado.clave === inputClave.value) {
      
      loginCorrecto(usuarioLogueado);

    } else {
      errorLogin.innerHTML = ""
      errorLogin.append('La clave ingresada es incorrecta');

    }

  }

}

const loginCorrecto = (usuario) => {
  
  errorLogin.classList.add('hidden')
  renderizarTienda(JSON.parse(localStorage.getItem('productos')))
  contenedorTienda.classList.remove("hidden");
  contenedorLogin.classList.add('hidden');
  localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

  if (usuario.tipo === 'admin') {

    contenedorAdmin.classList.remove("hidden");
    botonCarrito.classList.add('hidden');

  } else {

    contenedorAdmin.classList.add("hidden");
    botonCarrito.classList.remove('hidden');

  }

}




btnLogin.onclick = login;

btnEliminar.onclick = () => eliminarProducto(selectEliminar.value);

botonCarrito.onclick = mostrarCarrito;

if(localStorage.getItem('usuarioLogueado')) loginCorrecto(JSON.parse(localStorage.getItem('usuarioLogueado')))