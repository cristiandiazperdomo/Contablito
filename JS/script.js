'use strict'

let allProductsArray = [];

let total = 0;
let purchase = 0;
let sale = 0;

const URL_GET = "https://sleepy-wave-43629.herokuapp.com/product"

const getProductData = async (event) => {
	event.preventDefault()

	let productName = document.sendProductData.productName.value;
	let typeTransaction = document.sendProductData.typeTransaction.value;
	let inputTypeIVA = document.sendProductData.inputTypeIVA.value;
	let inputProductPrice = document.sendProductData.inputProductPrice.value;

	allProductsArray.push({
		productName,
		typeTransaction,
		inputTypeIVA,
		inputProductPrice
	})

	await fetch(URL_GET, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			productName,
			typeTransaction,
			inputTypeIVA,
			inputProductPrice
		})
	})

	//localStorage.setItem('data', JSON.stringify(allProductsArray))

	readProductList()
}
let valores = []

const readProductList = () => {

	purchase = 0;
	sale = 0;

	let trData = document.querySelectorAll('.trData'); //Actualizar Lista

	for (let i = 0; i < trData.length; i++) {
		trData[i].remove()
	}

	for (let i = 0; i < allProductsArray.length; i++) {

		let [name, transaction, iva, price] = [allProductsArray[i].productName, allProductsArray[i].typeTransaction, allProductsArray[i].inputTypeIVA, allProductsArray[i].inputProductPrice]


		showAllProducts(name, transaction, iva, price)
	}
}

const showAllProducts = (name, transaction, iva, price) => {

	// CANTIDAD DE TR PARA ELIMINAR PROXIMAMENTE.

	const amountOfTr = document.querySelectorAll('tr')

	//CALCULAR IVA.

	const ivaInc = Number(price) + (price * (iva / 100));

	// AGREGAR VARIOS TD CON LA INFORMACION.

	let product_info = [name, transaction, price, iva, ivaInc, ""];

	let tr = document.createElement('tr');

	tr.classList.add("trData");

	for (let i = 0; i < product_info.length; i++) {
		let td = document.createElement('td');

		let td_data = document.createTextNode(`${product_info[i]}`);
		td.appendChild(td_data);

		if (i > 4) {
			td.classList.add("fab");
			td.classList.add("fa-bitbucket");

			td.onclick = () => {
				deleteProduct(amountOfTr.length - 1)
			}
		}

		tr.appendChild(td);

	}
	let tbody = document.getElementById('tbody');

	tbody.appendChild(tr)

	//ACTUALIZAR PRECIO.

	if (transaction === "Compra") {
		purchase += Number(ivaInc);
	} else {
		sale += Number(ivaInc);
	}
	document.querySelector(".totalPricePurchase").innerHTML = purchase;
	document.querySelector(".totalPriceSale").innerHTML = sale;
}



const deleteProduct = async (index) => {
	allProductsArray.splice(index, 1)
	await fetch(`${URL_GET}/${index}`, {
		method: "DELETE"
	})

	//localStorage.setItem('data', JSON.stringify(allProductsArray))

	readProductList()

}

document.getElementById('submitButton').addEventListener('click', () => {
	getProductData(event)
});

//CARGAR ELEMENTOS SI EXISTEN.
//allProductsArray = JSON.parse(localStorage.getItem('data'))

document.addEventListener('DOMContentLoaded', async () => {

	allProductsArray = await (await fetch(URL_GET)).json()

	if (!allProductsArray) {
		allProductsArray = [];
	}

	readProductList()

})