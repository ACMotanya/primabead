var session_no = "1ZOT4DGMB1OFTRD9RGDERD13O";

////////////////////////////////////////
/// LOGIN INTO THE STORE AND VERIFY  ///
////////////////////////////////////////
function login()
{
  var password;

  if ( localStorage.getItem('session_no') && typeof(localStorage.getItem('session_no')) === "string" && localStorage.getItem('session_no').length === 25 ) {   
    windowHash("shop");
    redirect("store");
  }

  var $loading = $('#loadingDiv').hide();

  $(document).ajaxStart(function () {
    $loading.show();
  }).ajaxStop(function () {
    $loading.hide();
  });

  $("#content").hide();
  $("#login-form").on("submit", function(e) {
     var goHead;
     e.preventDefault();
     username = $('#login-form-username').val();
     password = $('#login-form-password').val();
     var openOrderLines;
     var invoiceLines;

     $.ajax({
      type: "GET",
      url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
      data: {request_id: "APICLOGIN", username: username, password: password, loc_no: 800},
      async: false,
      success: function(response) {
        if (response.replace(/\s+/g,'').length === 25) {
          goHead = "go";
          $.get("https://www.laurajanelle.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "", function(answer){
            if (answer === "0") {
              $.get("https://www.laurajanelle.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "&sessid=" + response + "");
              session_no = response.replace(/\s+/g,'');
              localStorage.setItem('session_no', session_no);
            } else if (answer.length === 25 ) {
              localStorage.setItem('session_no', answer);
            }
            localStorage.setItem('username', username);
          }).done(function() {
            windowHash("shop");
            redirect("store");
          });
        } else {
          alert("Login credentials are incorrect, try again.");
          goHead = "stop";
        }
      }
    });
  });
}



//////////////////////////
// Filter Function      //
//////////////////////////
function filterFunction2(a,b,c,d,e,f,g,h)
{
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: a,
      level1: b,
      level2: c,
      level3: d,
      level4: e,
      level5: f,
      session_no: g,
      loc_no: h
    },
    success: function(response) {
      $('#display-products').empty();
      itemRender("display-products", response);
    }
  });
}

function itemRender(div,response)
{
  lines = response.split("\n");
  lines.shift();
  if ( lines.length <= 1) {

    document.getElementById(div).innerHTML += '<h1>There are no results</h1>';
  } else {
    var html = [];
    var linesPlus = [];
    for (i=0; i<lines.length - 1; i++) {
      linesPlus.push(lines[i].split("|"));
    }

    for (i=0; i<linesPlus.length; i++) {
      var flds = linesPlus[i];
      
      stringOfDetails = flds[0].trim() + '+' + flds[8].trim() + '+' + flds[9].trim() + '+' + flds[10].trim();
      prod  = '<li><div class="product"><figure class="product-image-area"><a href="#product-details+' + stringOfDetails + '" title="' + flds[1] + '" class="product-image"><img src="https://www.laurajanelle.com/ljjpgimages/' + flds[0].trim()  + '-sm.jpg" alt="' + flds[1] + '"></a>';
      prod += '<a href="#" class="product-quickview"><i class="fa fa-share-square-o"></i><span>Quick View</span></a></figure><div class="product-details-area"><h2 class="product-name"><a href="#product-details+' + stringOfDetails + '" title="' + flds[1] + '">' + flds[1] + '</a></h2>';
      prod += '<div class="product-price-box"><span class="product-price">$' + flds[4] + '</span></div><div class="product-actions"><a href="#" class="addtocart" title="Add to Cart" onclick="stock_no=\'' + flds[0].trim() + '\'; detailString=\'#detail-view+' + stringOfDetails + '\'; addItemDetailView(); shopPage(); showAlert(); event.preventDefault();"><i class="fa fa-shopping-cart"></i><span>Add to Cart</span></a></div></div></div></li>';

      html.push(prod);
    }
    document.getElementById(div).innerHTML += html.join('');
  }
}


//////////////////////////////
// Get Detail View for Item //
//////////////////////////////    /#detail-view+11956+20+100+30
function detailView(callback, callback2) {
  jQuery("#productGalleryThumbs").empty();
  jQuery("a.detailadd").remove();

  var picsGallery = "";
  var picArray = ["", "-pk", "-rl"];
  var dets;
  var secondColumn;
  var detailString;
  var color;
  var type;
  var metal;
  var rate = true;
  var secondImage;
  var hash = window.location.hash.split("+");
  var stock_no = hash[1];
 // var productRating = [];


 // switch around the if later for faster rendering?
  if (hash[3] !== "" && hash.length === 5) {
    detailString = window.location.hash;
    color = hash[2];
    type  = hash[3];
    metal = hash[4];
    localStorage.setItem(stock_no, detailString);
  } else if (localStorage.getItem(stock_no) !== null && localStorage.getItem(stock_no) != "undefined" && localStorage.getItem(stock_no).length >= 15) { //  add back if undefined ever comes up again
    dets  = localStorage.getItem(stock_no).split("+");
    color = dets[2];
    type  = dets[3];
    metal = dets[4];
  }

  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {request_id: "APISTKDTL", stock_no: stock_no, session_no: "1ZOT4DGMB1OFTRD9RGDERD13O" },
    success: function (response) {
      lines = response.split("\n");
      fields = lines[1].split("|");

      /* Fill in the pictures for the product */
   //  $("div.product-img-wrapper").html('<img id="product-zoom" src="https://www.laurajanelle.com/ljjpgimages/' + fields[0] + '-lg.jpg" data-zoom-image="https://www.laurajanelle.com/ljjpgimages/' + fields[0] + '-lg.jpg" alt="'+ fields[1] +'">');
      $("#product-zoom").attr({
        src: "https://www.laurajanelle.com/ljjpgimages/" + fields[0] + "-lg.jpg",
        "data-zoom-image": "https://www.laurajanelle.com/ljjpgimages/" + fields[0] + "-lg.jpg",
        alt: fields[1]
      });
  
      picArray.forEach(function(element) {
          picsGallery += '<div class="product-img-wrapper"><a href="#" data-image="../img/demos/shop/products/single/product1.jpg" data-zoom-image="../img/demos/shop/products/single/product1.jpg" class="product-gallery-item"><img src="../img/demos/shop/products/single/thumbs/product1.jpg" alt="product"></a></div>';
      });
 
      $(".itemName").text(fields[1]);
      // add in custom ratings
      if (rate) {
        $("div.rating").width(Math.floor(Math.random() * 101)+'%');
        $("span.count").text("2");
      } else {
        $(".product-ratings").remove();
        $(".review-link-in").remove();
      }
      
			if (fields[8] && fields[8].length !== 0) {
        $(".product-short-desc p").html(fields[8]);
      } else {
        $(".product-short-desc p").html(fields[1]);
      }	

      $("span.product-price").text('$'+fields[4]);

      if (fields[5] && fields[5] > 0) {
        $("p.availability").html('<span class="font-weight-semibold">Availability:</span> In Stock</p></div>');
      } else {
        $("p.availability").html('<span class="font-weight-semibold">Availability:</span> Out of Stock</p></div>');
      }

      $(".product-detail-qty").after('<a href="#" class="addtocart detailadd" title="Add to Cart" onclick="stock_no=\'' + fields[0].trim() + '\'; addItemDetailView(); return false;"><i class="fa fa-shopping-cart"></i><span>Add to Cart</span></a>');
      
      addInfo =  '<tr><td class="table-label">Description</td><td>' + fields[1] + '</td></tr>';
      addInfo += '<tr><td class="table-label">Dimensions</td><td>' + fields[6] + '</td></tr>';
      addInfo += '<tr><td class="table-label">Color</td><td>' + whatColor(color) + '</td></tr>';
      addInfo += '<tr><td class="table-label">Type</td><td>' + whatType(type) + '</td></tr>';
      addInfo += '<tr><td class="table-label">Look</td><td>' + whatLook(fields[2]) + '</td></tr>';
      addInfo += '<tr><td class="table-label">Metal Color</td><td>' + whatMetal(metal) + '</td></tr>';

      //$("#images").html(pic);
      $("#productGalleryThumbs").html(picsGallery);
      $("table.product-table tbody").html(addInfo);
      $('.owl-carousel').owlCarousel('destroy');
      $('.owl-carousel').owlCarousel('refresh');
    },
    complete: function () {
      if (callback && typeof (callback) === "function") {
        callback(stock_no);
      }
      if (callback2 && typeof (callback2) === "function") {
        callback2(stock_no);
      }
    }
  });
}



////////////////////////////////////////
/// SUBROUTINE- Add item to the cart ///
////////////////////////////////////////
function addItemGeneric(session_no, stock_no, qty)
{
  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTADD&session_no="+ session_no +"&stock_no="+ stock_no +"&qty="+qty+"");
}
//////////////////////////////////////////////
// Add item to the cart for the detail page //
//////////////////////////////////////////////
function addItemDetailView()
{
  var detailViewQty;
  if (document.getElementById("product-vqty")) {
    detailViewQty = document.getElementById("product-vqty").value;
  } else {
    detailViewQty = "1";
  }

  // Save color and type in the 
  if (!localStorage.getItem(stock_no) || localStorage.getItem(stock_no) === "undefined" || localStorage.getItem(stock_no) === null ) {
    localStorage.setItem(stock_no, detailString);
  }

  addItemGeneric(session_no, stock_no, detailViewQty);

  if ( window.location.hash !== "#products" ) {
    window.location.hash = "cart";
    console.log("hello I ran");
  }
  return false;
}



/////////////////////////////////////////
// SUBROUTINE - REMOVE ITEMS FROM CART //
/////////////////////////////////////////
function removeItemGeneric(session_no, line_no)
{
  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTREM&session_no="+ session_no +"&line_no="+ line_no +"");
}
//////////////////////////////////
  // REMOVE ITEMS FROM CART //
//////////////////////////////////
function removeItem(clicked_id)
{
  line_no = clicked_id;
  removeItemGeneric(session_no, line_no);
  shopPage();
  return false;
}



//////////////////////////////
// Get back the cart header //
//////////////////////////////
function cartHeader(callback)
{
  jQuery.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APICARTH",
      session_no: session_no
    },
    success: function(response) {
      cartheader = response.split("\n");
      if (cartheader.length >=3 ){
        cartHeaderFields = cartheader[1].split("|");
        document.getElementById("top-cart-trigger").innerHTML += '<span>' + cartHeaderFields[24].trim() + '</span>';

        if ( window.location.hash === "#cart" || window.location.hash === "#checkout") {
          $(".cart-product-name.subtotal").html( '<span class="amount">' + cartHeaderFields[19].trim() + '</span>' );
          $(".cart-product-name.total").html( '<span class="amount color lead"><strong>' + cartHeaderFields[22].trim() + '</strong></span>');
        }
      }
    },
    complete: function () {
      if (callback && typeof(callback) === "function") {
        callback();
      }
    }
  });
  return false;
}



////////////////////
// Get Line items //
////////////////////
function cartList()
{
  jQuery.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APICARTL",
      session_no: session_no
    },
    success: function(response) {
      cartitems = response.split("\n");

      jQuery("#minicart").empty();
      html2 = [];
      html = [];

      if ( window.location.hash === "#cart") {
        $(".cart_item.products").empty();

        cartHelper();
        $("#cartItemTable").prepend(html.join(''));
        $("#updateCartButton").show();

      } else if ( window.location.hash === "#checkout" ){
        jQuery("#checkout-cartItemTable").empty();
        cartHelper();
      } else {
        cartHelper();
      }
    }
  });
  return false;
}

/////////////////////////////////////////////
// SUBROUTINE - CONSTRUCTING THE CART LIST //
/////////////////////////////////////////////
function cartHelper()
{
  if ( cartitems.length > 2 ) {
    for (i=1; i<cartitems.length - 1; i++) {
      data = cartitems[i].split("|");
      miniitem = '<div class="top-cart-item clearfix"><div class="top-cart-item-image"><a href="#"><img src="https://www.laurajanelle.com/ljjpgimages/' + data[2].replace(/\s+/g,'') + '-sm.jpg" alt="' + data[3] + '" /></a></div>';
      miniitem += '<div class="top-cart-item-desc"><a href="#">' + data[3] + '</a><span class="top-cart-item-price">$' + data[7].substring(0, data[7].length - 3) + '</span><span class="top-cart-item-quantity">x ' + data[6].replace(/\s+/g,'') + '</span></div></div>';
      html2.push(miniitem);

      if ( window.location.hash === "#cart" ) {
        item = '<tr class="cart_item products"><td class="cart-product-remove"><a href="#cart" class="remove" onclick="removeItem(this.id); return false;" id="' + data[1].replace(/\s+/g,'') + '" title="Remove this item"><i class="icon-trash2"></i></a></td>';
        item += '<td class="cart-product-thumbnail"><a href="#detail-view+' + data[2].replace(/\s+/g,'') + '"><img width="64" height="64" src="https://www.laurajanelle.com/ljjpgimages/' + data[2].replace(/\s+/g,'') + '-sm.jpg" alt="' + data[3] + '"></a></td>';
        item += '<td class="cart-product-name"><a href="#detail-view+' + data[2].replace(/\s+/g,'') + '">' + data[3] + '</a></td>';
        item += '<td class="cart-product-price"><span class="amount">$' + data[7].substring(0, data[7].length - 3) + '</span></td>';
        item += '<td class="cart-product-quantity"><div class="quantity clearfix">';
        item += '<input type="button" value="-" class="minus btn-number" data-type="minus" data-field="quant['+i+']" onclick="changeQuantity(this);">';
        item += '<input type="text" name="quant['+i+']" min="1" value="' + data[6].replace(/\s+/g,'') + '" class="qty form-control input-number" id="' + data[2].replace(/\s+/g,'') + '" />';
        item += '<input type="button" value="+" class="plus btn-number" data-type="plus" data-field="quant['+i+']" onclick="changeQuantity(this);"></div></td>';
        item += '<td class="cart-product-subtotal"><span class="amount">$' + data[8].substring(0, data[8].length - 4) + '</span></td></tr>';
        html.push(item);
        $("#updateCartButton").show();
      } else if ( window.location.hash === "#checkout" ) {
        item1 =  '<tr class="cart_item"><td class="cart-product-thumbnail"><a href=#detail-view+' + data[2].replace(/\s+/g,'') + '"><img width="64" height="64" src="https://www.laurajanelle.com/ljjpgimages/' + data[2].replace(/\s+/g,'') + '-sm.jpg" alt="' + data[3] + '"></a></td>';
        item1 += '<td class="cart-product-name"><a href="#detail-view+' + data[2].replace(/\s+/g,'') + '">' + data[3] + '</a></td>';
        item1 += '<td class="cart-product-quantity"><div class="quantity clearfix">' + data[6].replace(/\s+/g,'') + '</div></td>';
        item1 += '<td class="cart-product-subtotal"><span class="amount">$' + data[8].substring(0, data[8].length - 4) + '</span></td></tr>';
        $("#checkout-cartItemTable").append(item1);
      }
    }
  } else {
    item = '<tr class="cart_item products"><td class="cart-product-remove"><h1> Cart is empty</h1></td></tr>';
    html.push(item);
  }
  $("#minicart").append(html2.join(''));
}

/////////////////////////////////////
  // SUBROUTINE TO FIND COLOR //
/////////////////////////////////////
function whatColor(colorCode)
{
  switch (colorCode) {
    case "1": color = "Silver";
      break;
    case "2": color = "Gold";
      break;
    case "3": color = "Black";
      break;
    case "4": color = "Blue";
      break;   
    case "5": color = "Brown";
      break;   
    case "6": color = "Clear";
      break;    
    case "7": color = "Green";
      break;    
    case "8": color = "Grey";
      break;   
    case "9": color = "Opal";
      break;
    case "10": color = "Orange";
      break;
    case "11": color = "Pink";
      break;
    case "12": color = "Purple";
      break;
    case "13": color = "Rainbow";
      break;
    case "14": color = "Red";
      break;
    case "15": color = "Tan";
      break;
    case "16": color = "Teal";
      break;
    case "17": color = "Turquoise";
      break;
    case "18": color = "White";
      break;
    case "19": color = "Yellow";
      break;
    case "20": color = "Mulitcolored";
      break;
    default:
    color = "N/A";
  }
  return color;
}
/////////////////////////////////////
   // SUBROUTINE TO FIND TYPE //
/////////////////////////////////////
function whatType(typeCode)
{
  switch (typeCode) {
    case "100": type = "Necklace";
    break;
    case "200": type = "Bracelet";
    break;
    case "300": type = "Earrings";
    break;
    case "400": type = "Lanyard";
    break;
    case "500": type = "Snap";
    break;
    case "600": type = "Tassel";
    break;
    case "700": type = "Set";
    break;
    case "800": type = "Program";
    break;
    case "850": type = "Display";
    break;
    case "900": type = "Oil";
    break;
    case "950": type = "Accessory";
    break;
    case "1000": type = "Scarf";
    break;
    case "1100": type = "Pendant";
    break;
    case "1200": type = "Purse";
    break;
    case "1300": type = "Wristlet";
    break;
    case "1400": type = "Brooch";
    break;
    case "1500": type = "Ring";
    break;
    case "1600": type = "Versatile";
    break;
    default:
    type = "N/A";
  }
  return type;
}
/////////////////////////////////////
   // SUBROUTINE TO FIND LOOK //
/////////////////////////////////////
function whatLook(lookCode)
{
  switch (lookCode) {
    case "SLK": look = "SLEEK";
    break;
    case "ENC": look = "enCHARMing";
    break;
    case "GLB": look = "RGLB";
    break;
    case "IDT": look = "iDentify";
    break;
    case "ZEN": look = "AURA";
    break;
    case "SRK": look = "Salt Rock";
    break;
    case "MAN": look = "MANTRA";
    break;
    case "TRS": look = "Natural Treasures";
    break;
    case "TEM": look = "TEAM SPIRIT!";
    break;
    default:
    look = "N/A";
  }
  return look;
}
/////////////////////////////////////
 // SUBROUTINE TO FIND METAL TYPE //
/////////////////////////////////////
function whatMetal(metalCode)
{
  switch (metalCode) {
    case "10": metal = "Gold";
    break;
    case "20": metal = "Silver";
    break;
    case "30": metal = "Antique Gold";
    break;
    case "40": metal = "Gunmetal";
    break;
    default:
    metal = "N/A";
  }
  return metal;
}

/////////////////////////////////////////////
//  Hash loads Ajax. Let's Make this go faster.. //
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////


function shopPage()
{
 // cartHeader();
 // cartList();
}

function checkoutPage()
{
  employeeDiscount();
  session_no = localStorage.getItem('session_no');
  cartList();
  cartHeader(minimumTotal); // cartHeader(); cartHeader(minimumTotal);

  $('#shipping-form-companyname').focus();
  if (hideCC === true ) {
    shippingAddresses = [];
    $("#creditcard").hide();
    $("#minimumTotalWarning, #shipping-address").empty();
    shipToAddress();
  }
  document.getElementById("creditcard").src="https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICC&session_no=" + session_no + "";

  $("#myButton").click(function() {
    var hasErrors = $('#shipping-form').validator('validate').has('.has-error').length;
    if (hasErrors) {
      alert('Shipping address form has errors.');
    } else {
      hideCC = false;
      saveAddresses();
      creditCard(1);
      $( "#creditcard" ).slideDown( "slow" );
      $("#myButton").hide();
    }
  });
}

/////////////////////////////////////////////
//Store Router and Procedures. 
/////////////////////////////////////////////
function whichPage()
{
  var hashy = window.location.hash.split("+");
  var locale = hashy[0];
  $('div.store-page').hide();
  switch (locale) {
    case '#products' :
      $('#products').show();
      break;

    case '#product-details' :
      $('#product-details').show();
      window.scrollTo(0, 0);
      detailView(); //detailView(getQuestions, getReviews);
      /*
      $('#questionField').keypress(function(e){
        if(e.which == 13 && ($('#questionField').val() !== "")) {//Enter key pressed
          $('#questionModal').click();//Trigger search button click event
          populateQuestionModal();
        }
      });
      */
      break;

    case '#cart' :
      window.scrollTo(0, 0);
      $('#cart').show();
      shopPage();
      break;


    case '#checkout' :
      window.scrollTo(0, 0);
      $('#checkout').show();
      checkoutPage();
      break;
    case '#profile' :
      window.scrollTo(0, 0);
      $('#profile').show();
      username = localStorage.getItem('username').toUpperCase();
      accountDetails();
      $("#myButtonProfile").click(function() {
        var hasErrors = $('#shipping-form-profile').validator('validate').has('.has-error').length;
        if (hasErrors) {
          alert('Shipping address form has errors.');
        } else {
          saveAddressProfile();
          $("#shipping-form-profile").find("input[type=text], textarea, input[type=number], input[type=email]").val("");
        }
      });
      break;
    case '#invoices' :
      window.scrollTo(0, 0);
      $('#invoices').show();
      $("#details-title, #details-table, #line-item-title, #line-item-table").hide();
      orderHistory();
      $('#searchForInvoices').click(function(){
        var invoiceSearchNumber = $('#invoiceNumber').val();
        searchInvoices(invoiceSearchNumber);
      });
      $('#invoiceNumber').keypress(function(e){
        if(e.which == 13){//Enter key pressed
          $('#searchForInvoices').click();//Trigger search button click event
        }
      });
      break;
    case '#orders' :
      window.scrollTo(0, 0);
      $('#orders').show();
      $("#orders-details-title, #orders-details-table, #orders-line-item-title, #orders-line-item-table").hide();
      openOrders();
      orderHistory();
      $('#searchForOrders').click(function(){
        var orderSearchNumber = $('#orderNumber').val();
        searchOrders(orderSearchNumber);
      });
      $('#orderNumber').keypress(function(e){
        if(e.which == 13){//Enter key pressed
          $('#searchForOrders').click();//Trigger search button click event
        }
      });
      break;
    case '#faq' :
      window.scrollTo(0, 0);
      $('#faq').show();
      break;
    case '#search' :
      window.scrollTo(0, 0);
      $('#search').show();
      break;
    default :
      window.scrollTo(0, 0);
      $('#products').show();
    //  shopPage();
  }
}



///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//////////////////////// HELPER FUNCTIONS / SUBROUTINES ///////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////
          // redirect with hash add ins  //
/////////////////////////////////////////////////////
function redirect(pathname)
{
  pathArray = window.location.pathname.split( '/' );
  pathArray[pathArray.length - 2] = pathname;
  window.location.pathname = pathArray.join('/');
}

function windowHash(name)
{
  window.location.hash = name;
  return false;
}


/////////////////////////////////////////////////////
// Get Session Number and Authorize Access to Page //
/////////////////////////////////////////////////////
function sessionNumber()
{
  session_no = localStorage.getItem('session_no');
  if (typeof(session_no) === "undefined" || session_no.length !== 25) {
    pathArray = window.location.pathname.split( '/' );
    pathArray[pathArray.length - 2] = "retailerlogin";
    window.location.pathname = pathArray.join('/');
    alert("Please log in first.");
  }
}


bootstrap_alert = function () {};
bootstrap_alert.warning = function (message, alert, timeout) {
    $('<div id="floating_alert" class="alert alert-' + alert + ' fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' + message + '&nbsp;&nbsp;</div>').appendTo('body');


    setTimeout(function () {
        $(".alert").alert('close');
    }, timeout);

};

function showAlert() {
    bootstrap_alert.warning('Item has been added to your cart.', 'success', 4000);
    // available: success, info, warning, danger

}