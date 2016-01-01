
/*function main(){
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
			window.location.reload();
		}
		else{
			alert("no");
		}

		//$("body").append(layoutMake.makeDiv(item));
	});
};

main();
*/
var Controller = function(){

}

Controller.prototype.buildContent = function() {
	// body...
};


var myController = function(){
	this.target = $("#mainBody"); 
};

 


extend(Controller,myController);

myController.prototype.buildContent = function() {
	this.clearScr();
	this.append(this.makeContent()+this.miscellenousWrite())
	this.makeConditions();
};
myController.prototype.reload = function() {
	return this.buildContent();
}

myController.prototype.miscellenousWrite =function(){
	return "";
}



myController.prototype.makeConditions = function() {

};

myController.prototype.makeContent = function() {
	return "Controller";
};

myController.prototype.clearScr = function() {
	this.target.empty();

};


myController.prototype.append = function(data) {
	this.target.append(data);

};


var controllerFactory = function(makeContent,makeConditions){
	

	var controller = function(){
		myController.call(this);
	};
	


	extend(myController,controller);
	controller.prototype.makeContent = makeContent;
	
	if(makeConditions){
		controller.prototype.makeConditions = makeConditions;
	}
	
	return controller;
};



var adminController = controllerFactory(function(){
	var layout = new layoutMaker();
	var store = new Store();
	layout.addLayoutOnProduct = function(item){
		return "<button  class='deleteProduct' value='"+item.name+"'>x</button><button  value='"+item.name+"' class='changeProduct'><i class='fa fa-pencil-square-o'></i></button>"
	}
	this.ChangeClicked = 0;

	return layout.getAdminAddForm()+layout.getProducts(store);

},function(){
	
	var layout = new layoutMaker();
	var store = new Store();
	var control = this;
	
	var editFormHandler = function(){
			
		var itemName = $(this).val();
		var mainDiv= $(this).parent();

		var nName = $("#name").val();
		var nPrice = $("#price").val();
		var nQuantity = $("#quantity").val();
		var imgUrl = $("#url").val();
		

		var Nitem = new Item(nName,nPrice,nQuantity,imgUrl);
		
		if(Nitem.validate() ){
			store.changeItem(itemName, Nitem.get() );
			control.reload();
			control.ChangedItemName = undefined;
			control.ChangeClicked = 0;

		}
		else{
			alert("invalid data!")
		}

		//alert(nName+nPrice+imgUrl+nQuantity)

	}; 

	if(control.ChangedItemName){
		
		mainDiv = $("#"+control.ChangedItemName);
		mainDiv.html(layout.getEditForm(control.ChangedItemName ) );
		control.ChangedItemName = undefined;
		control.ChangeClicked = control.ChangeClicked+1;
		mainDiv.on("click",".editProduct",editFormHandler);




	}



	$(".deleteProduct").on("click",function(){
		var itemName = $(this).val();
		var item = store.getItemByID(itemName);
		item.quantity = 0;
		store.changeItem(itemName,item);
		control.reload();
	});

	$(".changeProduct").on("click",function(){
		var mainDiv=$(this).parent();
		control.ChangeClicked = control.ChangeClicked+1;

		


		if(control.ChangeClicked > 1)
		{
			control.ChangedItemName = $(this).val();
			control.ChangeClicked = 0;
			control.reload();

			return;
		}	
		mainDiv.html(layout.getEditForm($(this).val() ) );


		mainDiv.on("click",".editProduct",editFormHandler);

		/*$(".editProduct").click=function(){
			var itemName = $(this).val();
			var mainDiv=$(this).parent();

			var nName = mainDiv.find(".name");		
			var nPrice = mainDiv.find(".price");		
			var imgUrl = mainDiv.find(".url");		
			var quantity = mainDiv.find(".quantity");
			alert(nName+nPrice+imgUrl+quantity)

			if(parseInt(quantity) === 0)
			{
				return;
			}

		};*/
		//var Nitem = 


	});


	$("#showMenu").on("click",function(){
		var attr = "none";
		//var color = "blue";
		//var back = "white";



		if($("#addItemForm").css("display")==="none")
		{
			//color = "white";
			//back = "blue";
			attr = "block";
		}
		$("#addItemForm").css("display",attr)
		//$(this).css("color",color).css("background-color",back);

	});
	$("#addStock").click(function(){
		var item = new Item($("#aName").val(),$("#aPrice").val(),$("#aQuantity").val(),$("#aImg").val());
		if(item.validate()){	
			store.addItem(item);
			this.append(layout.makeDiv(item))
		}
		else{
			alert("invalid data");
		}
	});



});




var customerController = controllerFactory(function(){
	var layout = new layoutMaker();
	var store = new Store();
	var cart = new CartHandler(layout);
	this.onlyOnce = true;

	var cust = new Customer();



	layout.addLayoutOnProduct = function(item){
		var cond = ""
		var string = "buy";
		var DivClass = 'selectBuy'  
		if(cust.getItemByID(item.name)){
			//cond = "disabled";
			string = "unbought";
			DivClass = "unbought"
		}
		var TotalPrice = parseInt(item.quantity)*parseInt(item.price);
		var TotalPriceDiv = "";//"<label> totalPrice:"+TotalPrice+"</label>";
		return TotalPriceDiv+"<label><button class='"+DivClass+"' "+cond+" value='"+item.name+"'>"+string+"</button></label>";//this.makeDivOutOfObject(item)
	}

	
	return layout.getProducts(store);
}, function(){
	var control = this;
	var store = new Store();
	var customer = new Customer();
	that = this;
	var i = 0; 
	if(this.onlyOnce){
		$("body").on("click",".unbought",function(){
			var itemName = $(this).val();
			customer.deleteItem(itemName);
			console.log("unbought Done"+i)
			i++;
			that.reload();
		});
		that.onlyOnce = false;
	}

	$(".selectBuy").click(function(){
		var store = new Store();
		var id = $(this).val();
		item = store.getItemByID(id);
		
		if(item){
			item["quantity"] = 1;
			new CartHandler().add(1);
			customer.addSimpleItem(item);
			control.reload();//reload
		}
	
	});

}); 


var checkoutController = controllerFactory(function(){
	var layout = new layoutMaker();
	
	var cust = new Customer();
	var div = "<div class='customerreciept'><div>Total Price:"+cust.getitemsTotalPrice()+"$</div><button id='checkoutCust'>checkout</button></div>";
	layout.addLayoutOnProduct = function(item){

		var TotalPrice = parseInt(item.quantity)*parseInt(item.price);
		var TotalPriceDiv = "<label> totalPrice:"+TotalPrice+"</label>";


		return TotalPriceDiv+"<div class='plusMinusButton'><button style='float:left;' value='"+item.name+"' class='incProductButton'>+</button><button style='float:right;' class='decProductButton' value='"+item.name+"' >-</button></div>"
	}

	return layout.getProducts(cust)+div;
},function(){
	var control = this;
	var store = new Store();
	var cust = new Customer();

	cust.onChangeQuantity = function(item,dq){
		new CartHandler().add(dq);
		
	}


	$('.incProductButton').on('click',function(){

		var itemName = $(this).val();
		var item = cust.getItemByID(itemName);
		cust.changeQuantity(itemName,1);

		control.reload();
	});
	
	$('.decProductButton').on('click',function(){
		var itemName = $(this).val();
		var item = cust.getItemByID(itemName);
		
		cust.changeQuantity(itemName,-1);


		control.reload();
	});
	


	$("#checkoutCust").click(function(){
		var store = new Store();
		var cust = new Customer();
		var stock = cust.getItems();
		cust.clear();
		new CartHandler().reset();
		for(product in stock){
			store.changeQuantity(product,-1*stock[product].quantity);
		}




		control.reload();
	})
}); 


var CartHandler = function(){
	this.cart = new CartCounter();
	this.layout = new layoutMaker();
	this.getDiv = function(){
		return this.layout.makeCart(this.cart.getNumber());
	};
	this.add = function(num){
		this.cart.changeNumber(num);
	}
	this.reset  =function(){
		this.cart.reset();
	}
};


var returnCart = function(){

	return new CartHandler().getDiv();


}

customerController.prototype.miscellenousWrite = returnCart;
checkoutController.prototype.miscellenousWrite = returnCart;


var MainController = function(){
	this.controllerList = {"admin":new adminController(),"customer":new customerController(),"checkout":new checkoutController()}
	
	this.startController = function(variable){
		this.controllerList[variable].buildContent();
	};

	this.startController("admin");
};




var urlMatcher = function(){
	var control = new MainController(); 
	$("#panel button").click(function(){
		var controllerName = $(this).attr("value");
		control.startController(controllerName);
	});
}




var main = function(){
/*	store = new Store();
	customer = new Customer();
*/
	urlMatcher();

};

main();







