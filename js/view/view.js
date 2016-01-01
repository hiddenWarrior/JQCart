var layoutMaker = function(){

};


layoutMaker.prototype.getEditForm =function(value){
	var store = new Store();
	var item = store.getItemByID(value);
	var div = '<label>url:<input id="url" type="text" value="%url" placeholder="img url" /></label><label>name:<input type="text" value="%name"  id="name" placeholder="name" /></label><label>price:<input type="text"  value="%price" id="price" placeholder="price" /></label><label>quantity:<input type="text"  value="%quan"  placeholder="quantity" id="quantity" /></label><label><button class="editProduct" value="%d">change</button></label>'.replace("%d",value).replace("%name",item.name).replace("%quan",item.quantity).replace("%price",item.price).replace("%url",item.imgSrc);
	return div; 
}


layoutMaker.prototype.getAdminAddForm =function(){
	var div = '<div id="addContainer"><button id="showMenu">+</button><form id="addItemForm"><label>img<input id="aImg" type="text"/></label><label>name<input id="aName" type="text"/></label><label>price<input id="aPrice" type="text"/></label><label>quantity<input id="aQuantity" type="text"/></label><label><input type="submit" id="addStock" value="add"></input></label></form>'+'</div>';
	return div; 
}

layoutMaker.prototype.addLayoutOnProduct = function(item){
	return "";
}



layoutMaker.prototype.getProducts = function(store){

	var items = store.getItems();

	var output = "";
	for(var i in items){
		output += this.makeDivOutOfObject(items[i]);
	}
	return output;

};



layoutMaker.prototype.makeDivOutOfObject=function(item){
	var div = "<div class='product' id = '"+item.name+"' ><img src='"+item.imgSrc+"'/><label>name:"+item["name"]+"</label><label>price:"+item["price"]+"</label><label>quantity:"+item["quantity"]+"</label>"+this.addLayoutOnProduct(item)+"<input type='hidden' value="+item.name+"/>"+"</div>";//+"<label><input type='Button' id='edit' value='Edit'/><input type='Button' id='delete' value='X' /></div>"//.replace("%name",i.name).replace("%quantity",i.quantity).replace("%price",i.price);
	return div;


};


layoutMaker.prototype.makeCart = function(num){

	var div='<div class="cart_info"><i class="cart fa fa-shopping-cart fa-1x"></i><div>%d</div></div>'.replace('%d',num+"");
	return div;	
}



layoutMaker.prototype.makeDiv=function(item){
	var i = item.get();
	return this.makeDivOutOfObject(i);

	
}






