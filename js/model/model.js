
var Item = function(name,price,quantity,imgSrc){
	this.name = name;
	this.price = price;
	this.quantity = quantity;
	this.imgSrc = imgSrc;
};
Item.prototype.get = function(item){
	return {name:this.name,price:this.price,quantity:this.quantity,imgSrc:this.imgSrc};	
};
Item.prototype.getName =  function(){
	return this.name;
};

Item.prototype.getID =  function(){
	return this.getName();
};

Item.prototype.validate = function(){
	var item = this.get();
	var isName = item.name.length > 0;
	var isPrice = (!isNaN(parseFloat(item.price)))&&parseFloat(item.price) > 0;
	var isQuantity= (!isNaN(parseFloat(item.quantity)))&&parseFloat(item.quantity) > 0;
	return ( isName && isPrice && isQuantity );

};



var StorageHandler = function(storeName){
	this.storeName = storeName;
	if(localStorage[storeName] === undefined){
		this.clear();
	}

}

StorageHandler.prototype.getStorage = function(){
	return localStorage[this.storeName];
}
StorageHandler.prototype.setStorage = function(stores){
	localStorage[this.storeName] = stores;
}

StorageHandler.prototype.clear = function(stores){
		 this.setStorage("");
};



var Counter = function(storeName,start){
	StorageHandler.call(this, storeName );
	if(this.getStorage() === "" ){
		this.setStorage(start+"");
	}
}
extend(StorageHandler,Counter);

Counter.prototype.getNumber = function(num){
	return parseFloat(this.getStorage());

};


Counter.prototype.changeNumber = function(num){
	var origNum =this.getNumber();
	this.setStorage(""+ (origNum+ num ) );

};

Counter.prototype.reset = function(){
	this.changeNumber( -1*this.getNumber());
}


Counter.prototype.increment = function(){
	this.changeNumber(1);
};

Counter.prototype.decrement = function(){
	this.changeNumber(-1);
};


var CartCounter = function(){
	Counter.call(this,"cart", 0 );
}

extend(Counter,CartCounter);


var IDCounter = function(){
	
	this.getCount = function(){
	var num = this.count.getNumber();
	this.count.increment();
	return num;
	}

}






//var IdCounter = new Counter("ItemId",0);






var ProductOwner = function(storeName){
	
	StorageHandler.call(this, storeName );
	/*if(this.getStorage() === "")
	{
		this.clear();
	}*/

}  

extend(StorageHandler,ProductOwner);

ProductOwner.prototype.clear = function(){
	this.setStorage("{}");

}
ProductOwner.prototype.addSimpleItem = function(item){
	var items =this.getItems();
	items[item.name] = item;
	this.setStorage( JSON.stringify(items) ) ;

};



ProductOwner.prototype.addItem = function(item){
	this.addSimpleItem(item.get());
};


ProductOwner.prototype.changeItem = function(itemName,Nitem){
	
	var Oitem = this.getItemByID(itemName);
	this.changeSimpleItem(Nitem,Oitem);
	
};






ProductOwner.prototype.changeSimpleItem = function(Nitem,Oitem){
	
	this.deleteSimpleItem(Oitem);
	if(parseInt(Nitem.quantity) > 0){
		this.addSimpleItem(Nitem);
	}
	this.whenChangeItem(Nitem,Oitem);

};




ProductOwner.prototype.whenChangeItem = function(Nitem,Oitem){

};





ProductOwner.prototype.deleteSimpleItem = function(item){
	var items =this.getItems();
	items[item.name] = undefined;
	this.setStorage( JSON.stringify(items) ) ;

};

/*ProductOwner.prototype.changeQuantity = function(itemName,q){
	item=this.getItemByID(itemName);
	if(this.changeQuantityCondition(itemName, q ) )
	{

	}
};*/





ProductOwner.prototype.getItems = function(){
	return JSON.parse( this.getStorage() );	
};

ProductOwner.prototype.getItemByID = function(ID){
	return this.getItems()[ID];	
};

ProductOwner.prototype.getitemsTotalPrice = function(){
	
	var items = this.getItems();
	var totalPrice = 0;
	for(var i in items)
	{
		totalPrice += items[i].price * items[i].quantity;
	}

	return totalPrice;

}

ProductOwner.prototype.checkQuantity = function(ID,q){
	
	

	var items = this.getItems();
	var item = items[ID];
	if(!item)
	{
		return true;
	}
	return (parseInt(item.quantity) >= q);
	
}




ProductOwner.prototype.changeQuantity = function(ID,dq){
	var item=this.getItemByID(ID);
	itemName = ID;
	var newQuantity = parseInt(item.quantity)+dq;
	if(this.changeQuantityCondition(itemName, newQuantity ) )
	{
		item.quantity = newQuantity; 
		if(newQuantity <= 0)
		{
			this.deleteSimpleItem(item);
		}
		else
		{
			this.addSimpleItem(item);
		}
		this.onChangeQuantity(item,dq);

	}
	
};

ProductOwner.prototype.deleteItem = function(ID){

	var item=this.getItemByID(ID);
	if(item.quantity){
		var itemName = ID;
		var Quantity = -1*parseInt(item.quantity);
		this.changeQuantity(ID,Quantity);
	}
};




ProductOwner.prototype.onChangeQuantity = function(item,dq){

}



ProductOwner.prototype.changeQuantityCondition =function(itemName, newQuantity ){
	return true;
}






//myController.call(this)



var Store = function(){
	ProductOwner.call(this,"items")	
	if(!localStorage.notFirstTime){
		localStorage.notFirstTime = "2142";
		//var Item = function(name,price,quantity,imgSrc){

		var item1 = new Item("forest",100,122,"1.jpg");
		var item2 = new Item("Card1",200,22,"2.jpg");
		var item3 = new Item("Card2",300,12241,"3.jpg");
		this.addItem(item1);
		this.addItem(item2);
		this.addItem(item3);
	}

};
extend(ProductOwner,Store);

Store.prototype.whenChangeItem = function(Nitem,Oitem){
	var c = new Customer();
	var itemC=c.getItemByID(Oitem.name);
	if(itemC){
		qc = parseInt(itemC.quantity);
		qSN = parseInt(Nitem.quantity);
		Nitem.quantity = qc;

		c.changeSimpleItem(Nitem,itemC);
		
		if(qSN != parseInt(Oitem.quantity) && (qSN-qc < 0) ){
			c.changeQuantity(Nitem.name,qSN-qc);
			//new CartCounter().changeNumber(qSN-qc);

		}



	}

}





var Customer = function(){
	ProductOwner.call(this,"cItems")	

};

extend(ProductOwner,Customer);

Customer.prototype.changeQuantityCondition = function(itemName, newQuantity ){
	var s = new Store();
	return s.checkQuantity(itemName, newQuantity );
};


Customer.prototype.onChangeQuantity = function(item,dq){
	new CartCounter().changeNumber(dq);

};


/*Store.prototype.addItem = function(item){
	var items =JSON.parse(localStorage.items);
	//console.log(items);
	items[item.getName()] = item.get();
	localStorage.setItem("items", JSON.stringify(items) ) ;
};

Store.prototype.getItems = function(){
	return JSON.parse(localStorage.items);	
};*/

