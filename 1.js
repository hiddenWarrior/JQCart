var Item = function(name,price,quantity){
	this.name = name;
	this.price = price;
	this.quantity = quantity;
};
Item.prototype.get = function(item){
	return {name:this.name,price:this.price,quantity:this.quantity};	
};
Item.prototype.getName =  function(){
	return this.name;
};
Item.prototype.validate = function(){
	var item = this.get();
	var isName = item.name.length > 0;
	var isPrice = !isNaN(parseFloat(item.price));
	var isQuantity= !isNaN(parseFloat(item.quantity));
	return ( isName && isPrice && isQuantity );

};





var Store = function(){
	if(localStorage.items === undefined){
		localStorage.setItem("items","{}");
	}
};

Store.prototype.addItem = function(item){
	var items =JSON.parse(localStorage.items);
	//console.log(items);
	items[item.getName()] = item.get();
	localStorage.setItem("items", JSON.stringify(items) ) ;
};

Store.prototype.getItems = function(item){
	return JSON.parse(localStorage.items);	
};




var layoutMaker = function(){

}


layoutMaker.prototype.makeDivOutOfObject=function(item){
	var div = "<div>"+item["name"]+","+item["quantity"]+","+item["price"]+"<input type='Button' id='edit' value='Edit'/><input type='Button' id='delete' value='X' /></div>"//.replace("%name",i.name).replace("%quantity",i.quantity).replace("%price",i.price);
	return div;


}



layoutMaker.prototype.makeDiv=function(item){
	var i = item.get();
	console.log(i.name);
	/*
		<div class="product">
	<img src=""/>
	Product
	Price
	Stock
	<input type="Button" id='edit' value="Edit"/>
	<input type="Button" id='delete' value="X" />
</div>
	*/

	var div = "<div class='product'><label>"+i["name"]+"</label><label>"+i["quantity"]+"</label><label>"+i["price"]+"</label><input type='Button' id='edit' value='Edit'/><input type='Button' id='delete' value='X' /></div>"//.replace("%name",i.name).replace("%quantity",i.quantity).replace("%price",i.price);
	return div;
}






var adminLayout = function(store){
	var items = store.getItems();

	var layoutMake = new layoutMaker();

	for(var i in items){
		$("#mainBody").append(layoutMake.makeDivOutOfObject(items[i]));
	}

}

//store();



function main(){
	layoutMake = new layoutMaker();
	

	var store = new Store();

	adminLayout(store);

	$("#showMenu").on("click",function(){
		var attr = "none"
		if($("#addItemForm").css("display")==="none")
		{
			attr = "block"
		}
		$("#addItemForm").css("display",attr);
	})
	
	$("#addStock").click(function(){
	

		var item = new Item($("#aName").val(),$("#aPrice").val(),$("#aQuantity").val());
		if(item.validate()){	
			store.addItem(item);
		}
		else{
			alert("no");
		}

		//$("body").append(layoutMake.makeDiv(item));
	});
};

main();

/*$(
	function main(){

		//Cookies.set('name', 'value');
		//console.log(Cookies.get());
		localStorage.setItem("lastname", "Smith");

		
	}
	

);*/


